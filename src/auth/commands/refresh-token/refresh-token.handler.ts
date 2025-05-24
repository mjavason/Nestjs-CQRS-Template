import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/services/auth.service';
import { RefreshTokenCommand } from './refresh-token.command';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(private readonly authService: AuthService) {}

  async execute(command: RefreshTokenCommand) {
    const data = await this.authService.refreshToken(
      command.expiredAccessToken,
      command.refreshToken,
    );
    return { data };
  }
}
