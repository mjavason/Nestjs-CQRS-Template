import { Command } from '@nestjs/cqrs';
import { VerifyTokenDto } from 'src/auth/dtos/token.dto';

export class VerifyTokenCommand extends Command<void> {
  constructor(public readonly query: VerifyTokenDto) {
    super();
  }
}
