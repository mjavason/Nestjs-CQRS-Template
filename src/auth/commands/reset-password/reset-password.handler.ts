import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/services/auth.service';
import { ResetPasswordCommand } from './reset-password.command';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(private readonly authService: AuthService) {}

  async execute(command: ResetPasswordCommand) {
    return await this.authService.resetPassword(command.body);
  }
}
