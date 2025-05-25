import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { API_PREFIX, BASE_URL } from 'src/common/configs/constants';
import { MailService } from 'src/mail/mail.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import { RequestEmailVerificationCommand } from './request-email-verification.command';

@CommandHandler(RequestEmailVerificationCommand)
export class RequestEmailVerificationHandler
  implements ICommandHandler<RequestEmailVerificationCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async execute(command: RequestEmailVerificationCommand) {
    const { email } = command;

    const user = await this.userRepository.findOne({ email });
    if (!user)
      throw new BadRequestException(
        'Request sent successfully. Check your mail',
      );

    if (!user.isEmailVerified) {
      const verificationToken = await this.jwtService.signAsync({
        sub: user.id,
      });
      await this.mailService.sendMailVerificationEmail(
        user.email,
        `${user.fullName}`,
        `${BASE_URL}/${API_PREFIX}/auth/verify-email/${verificationToken}`,
      );
    } else {
      throw new BadRequestException('Email already verified');
    }
  }
}
