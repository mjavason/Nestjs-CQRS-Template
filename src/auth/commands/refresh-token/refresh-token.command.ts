import { Command } from '@nestjs/cqrs';

export class RefreshTokenCommand extends Command<any> {
  constructor(
    public readonly expiredAccessToken: string,
    public readonly refreshToken: string,
  ) {
    super();
  }
}
