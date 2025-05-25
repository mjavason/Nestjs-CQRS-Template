import { A_MONTH_IN_MINUTES } from 'src/common/configs/constants';
import { AuthService } from 'src/auth/services/auth.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Logger } from '@nestjs/common';
import { isExpired } from 'src/common/utils/date.util';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenCommand } from './refresh-token.command';
import { TokenRepository } from 'src/auth/repositories/token.repository';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async execute(command: RefreshTokenCommand) {
    const { expiredAccessToken, refreshToken } = command;
    const errorMessage = 'Invalid or expired token. Please log in';

    try {
      const storedToken = await this.tokenRepository.findOne({
        token: refreshToken,
      });
      if (!storedToken) throw new ForbiddenException(errorMessage);

      if (isExpired(storedToken.createdAt, A_MONTH_IN_MINUTES)) {
        await storedToken.deleteOne();
        throw new ForbiddenException(errorMessage);
      }

      const decoded = this.jwtService.decode(expiredAccessToken, {
        complete: true,
      });
      const subject = decoded?.payload?.sub;
      if (!subject || subject !== storedToken.user)
        throw new ForbiddenException(errorMessage);

      const [newRefreshToken, newAccessToken] = await Promise.all([
        this.authService.generateRefreshToken(subject),
        this.jwtService.signAsync({ sub: subject }),
      ]);

      return {
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (err) {
      Logger.log(err);
      throw new ForbiddenException(errorMessage);
    }
  }
}
