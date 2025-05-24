import { Command } from '@nestjs/cqrs';

export class LogoutCommand extends Command<any> {
  constructor(public readonly userId: string) {
    super();
  }
}
