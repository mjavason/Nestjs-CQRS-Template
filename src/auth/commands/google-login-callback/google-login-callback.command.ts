import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/services/auth.service';
import { BASE_URL } from 'src/common/configs/constants';
import { GoogleLoginCallbackCommand } from './google-login-callback.handler';

@CommandHandler(GoogleLoginCallbackCommand)
export class GoogleLoginCallbackHandler
  implements ICommandHandler<GoogleLoginCallbackCommand>
{
  constructor(private readonly authService: AuthService) {}

  async execute(command: GoogleLoginCallbackCommand) {
    const data = await this.authService.socialSignIn(command.user);
    return command.res.redirect(
      `${BASE_URL}/api/v1/auth/show-working?registered=true&accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`,
    );
  }
}
