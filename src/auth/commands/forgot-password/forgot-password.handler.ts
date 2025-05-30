import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TOKEN_TYPE } from 'src/auth/interfaces/token.interface';
import { TokenRepository } from 'src/auth/repositories/token.repository';
import { codeGenerator } from 'src/common/utils/random_token.util';
import { MailService } from 'src/mail/services/mail.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import { ForgotPasswordCommand } from './forgot-password.command';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler
  implements ICommandHandler<ForgotPasswordCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async execute(command: ForgotPasswordCommand) {
    const { email } = command;

    const user = await this.userRepository.findOne({ email });
    if (!user) throw new NotFoundException('User with email does not exist');

    const code = codeGenerator(6);
    await this.tokenRepository.create({
      user: user.id,
      type: TOKEN_TYPE.PASSWORD_RESET,
      token: code,
    });

    const mailSent = await this.mailService.sendForgotPasswordMail(
      email,
      user.fullName,
      code,
    );
    if (!mailSent)
      throw new InternalServerErrorException(
        'Unable to send verification email',
      );
  }
}
