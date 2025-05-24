import { Command } from '@nestjs/cqrs';

export class LoginCommand extends Command<any> {
  constructor(public readonly userId: string) {
    super();
  }
}
