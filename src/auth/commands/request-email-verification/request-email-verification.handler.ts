import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/services/auth.service';
import { RequestEmailVerificationCommand } from './request-email-verification.command';

@CommandHandler(RequestEmailVerificationCommand)
export class RequestEmailVerificationHandler
  implements ICommandHandler<RequestEmailVerificationCommand>
{
  constructor(private readonly authService: AuthService) {}

  async execute(command: RequestEmailVerificationCommand) {
    await this.authService.requestMailVerification(command.email);
  }
}
