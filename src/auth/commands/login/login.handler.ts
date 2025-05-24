import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/services/auth.service';
import { UserRepository } from 'src/user/repositories/user.repository';
import { LoginCommand } from './login.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(command: LoginCommand) {
    const user = await this.userRepository.findOne({ _id: command.userId });
    const accessToken = await this.authService.login(user);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    return {
      message: 'Logged in successfully',
      data: { user, accessToken, refreshToken },
    };
  }
}
