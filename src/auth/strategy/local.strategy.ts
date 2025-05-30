import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { API_PREFIX, BASE_URL } from 'src/common/configs/constants';
import { MailService } from 'src/mail/services/mail.service';
import { UserRepository } from 'src/user/repositories/user.repository';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {
    // Specify email as the username field
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    email = email.toLowerCase();
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new BadRequestException('Incorrect email or password');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new BadRequestException('Incorrect email or password');

    if (!user.isEmailVerified) {
      const verificationToken = await this.jwtService.signAsync({
        sub: user.id,
      });
      await this.mailService.sendMailVerificationEmail(
        user.email,
        `${user.fullName}`,
        `${BASE_URL}/${API_PREFIX}/auth/verify-email/${verificationToken}`,
      );
    }

    return user;
  }
}
