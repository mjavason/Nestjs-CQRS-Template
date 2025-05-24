import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/services/auth.service';
import { ForgotPasswordCommand } from './forgot-password.command';
@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler
  implements ICommandHandler<ForgotPasswordCommand>
{
  constructor(private readonly authService: AuthService) {}

  async execute(command: ForgotPasswordCommand) {
    return await this.authService.requestForgotPassword(command.email);
  }
}
