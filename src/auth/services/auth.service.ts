import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { VerifyTokenDto } from 'src/auth/dtos/token.dto';
import { IDecodedToken } from 'src/auth/interfaces/auth.interface';
import { TOKEN_TYPE } from 'src/auth/interfaces/token.interface';
import { API_PREFIX, BASE_URL } from 'src/common/configs/constants';
import { isExpired } from 'src/common/utils/date.util';
import { codeGenerator } from 'src/common/utils/random_token.util';
import { MailService } from 'src/mail/services/mail.service';
import { IUserDocument } from 'src/user/interfaces/user.interface';
import { UserRepository } from 'src/user/repositories/user.repository';
import { NewPasswordDto, RegisterDTO } from '../dtos/register.dto';
import { TokenRepository } from '../repositories/token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async register(body: RegisterDTO) {
    const data = await this.userRepository.create(body);
    const verificationToken = await this.jwtService.signAsync({ sub: data.id });

    const mailSent = await this.mailService.sendMailVerificationEmail(
      data.email,
      `${data.fullName}`,
      `${BASE_URL}/${API_PREFIX}/auth/verify-email?token=${verificationToken}`,
    );
    if (!mailSent) {
      await data.deleteOne();
      throw new InternalServerErrorException(
        'Registration failed: Unable to send verification mail',
      );
    }

    const accessToken = await this.jwtService.signAsync({ sub: data.id });
    const refreshToken = await this.generateRefreshToken(data.id);

    return {
      message:
        "Registration successful. We've sent you an account verification email",
      data: { user: data, accessToken, refreshToken },
    };
  }

  // Don't touch
  async login(user: IUserDocument) {
    const payload: IDecodedToken = { sub: user.id };
    return await this.jwtService.signAsync(payload);
  }

  async resetPassword(body: NewPasswordDto) {
    const user = await this.userRepository.findOne({ email: body.email });
    if (!user) throw new BadRequestException('Invalid token');

    const storedToken = await this.tokenRepository.findOne({
      user: user.id,
      token: body.token,
      type: TOKEN_TYPE.PASSWORD_RESET,
    });
    if (!storedToken) throw new BadRequestException('Invalid token');

    if (isExpired(storedToken?.createdAt)) {
      await storedToken.deleteOne();
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    await this.userRepository.update(user.id, { password: hashedPassword });
    await storedToken.deleteOne();
  }

  async verifyToken(query: VerifyTokenDto) {
    const user = await this.userRepository.findOne({ email: query.email });
    if (!user) throw new BadRequestException('Invalid token');

    const storedToken = await this.tokenRepository.findOne({
      user: user.id,
      token: query.token,
    });
    if (!storedToken) throw new BadRequestException('Invalid token');

    if (isExpired(storedToken?.createdAt)) {
      await storedToken.deleteOne();
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  // Don't touch
  async generateRefreshToken(userId: string) {
    const refreshToken = codeGenerator(9);

    // Delete previous existing tokens, then create new one
    const prevRefreshToken = await this.tokenRepository.findOne({
      user: userId,
      type: TOKEN_TYPE.REFRESH_TOKEN,
    });
    if (prevRefreshToken) await prevRefreshToken.deleteOne();
    await this.tokenRepository.create({
      user: userId,
      token: refreshToken,
      type: TOKEN_TYPE.REFRESH_TOKEN,
    });

    return refreshToken;
  }
}
