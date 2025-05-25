import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/services/auth.service';
import { BASE_URL } from 'src/common/configs/constants';
import { UserRepository } from 'src/user/repositories/user.repository';
import { GoogleLoginCallbackCommand } from './google-login-callback.command';

@CommandHandler(GoogleLoginCallbackCommand)
export class GoogleLoginCallbackHandler
  implements ICommandHandler<GoogleLoginCallbackCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async execute(command: GoogleLoginCallbackCommand) {
    const { user: socialUser, res } = command;

    const email = socialUser.email.toLowerCase().trim();
    let user = await this.userRepository.findOne({ email });
    if (!user) {
      user = await this.userRepository.create({
        email: socialUser.email,
        signInWithGoogle: true,
        isEmailVerified: true,
        fullName: socialUser.fullName,
        avatarURL: socialUser.avatarURL,
      });
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id });
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    return res.redirect(
      `${BASE_URL}/api/v1/auth/show-working?registered=true&accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }
}
