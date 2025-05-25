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
    const { expiredAccessToken, refreshToken: token } = command;
    const failureMessage = 'Invalid or expired token. Please log in';

    try {
      const oldRefresh = await this.tokenRepository.findOne({ token });
      if (!oldRefresh) throw new ForbiddenException(failureMessage);

      // one month
      if (isExpired(oldRefresh?.createdAt, A_MONTH_IN_MINUTES)) {
        await oldRefresh.deleteOne();
        throw new ForbiddenException(failureMessage);
      }

      const decoded = await this.jwtService.decode(expiredAccessToken, {
        complete: true,
      });
      if (!decoded?.payload?.sub) throw new ForbiddenException(failureMessage);
      if (decoded?.payload?.sub != oldRefresh.user)
        throw new ForbiddenException(failureMessage);

      const newRefreshToken = await this.authService.generateRefreshToken(
        decoded?.payload?.sub,
      );
      const newAccessToken = await this.jwtService.signAsync({
        sub: decoded.payload.sub,
      });

      return {
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      };
    } catch (error: unknown) {
      Logger.log(error);
      throw new ForbiddenException(failureMessage);
    }
  }
}
