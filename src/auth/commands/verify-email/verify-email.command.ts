import { Command } from '@nestjs/cqrs';

export class VerifyEmailCommand extends Command<any> {
  constructor(public readonly token: string) {
    super();
  }
}
