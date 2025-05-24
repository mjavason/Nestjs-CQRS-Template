import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/services/auth.service';
import { VerifyTokenCommand } from './verify-token.command';

@CommandHandler(VerifyTokenCommand)
export class VerifyTokenHandler implements ICommandHandler<VerifyTokenCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: VerifyTokenCommand) {
    return await this.authService.verifyToken(command.query);
  }
}
