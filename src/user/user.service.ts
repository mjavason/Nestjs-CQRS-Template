import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { UserRepository } from './repositories/user.repository';
import { API_PREFIX, BASE_URL } from 'src/common/configs/constants';

@Injectable()
export class UserService {
  constructor(
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async updateProfile(id: string, updates: Partial<IUser>) {
    const data = await this.userRepository.update(id, updates);

    if (updates.email || updates.password) {
      const verificationToken = await this.jwtService.signAsync({
        sub: data.id,
      });
      const mailSent = await this.mailService.sendMailVerificationEmail(
        data.email,
        `${data.fullName}`,
        `${BASE_URL}/${API_PREFIX}/auth/verify-email/${verificationToken}`,
      );
      if (!mailSent) {
        throw new InternalServerErrorException(
          'Unknown error occurred: Unable to send verification mail',
        );
      }

      return {
        data,
        message:
          'Update successful, verification mail has been sent to your email address',
      };
    }

    return data;
  }
}
