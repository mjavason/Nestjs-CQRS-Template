import { Command } from '@nestjs/cqrs';
import { NewPasswordDto } from 'src/auth/dtos/register.dto';

export class ResetPasswordCommand extends Command<void> {
  constructor(public readonly body: NewPasswordDto) {
    super();
  }
}
