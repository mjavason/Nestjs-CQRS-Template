import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TOKEN_TYPE } from 'src/auth/interfaces/token.interface';
import { TokenRepository } from 'src/auth/repositories/token.repository';
import { LogoutCommand } from './logout.command';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async execute(command: LogoutCommand) {
    const token = await this.tokenRepository.findOne({
      user: command.userId,
      type: TOKEN_TYPE.REFRESH_TOKEN,
    });

    if (token) await token.deleteOne();
  }
}
