import { Command } from '@nestjs/cqrs';

export class RequestEmailVerificationCommand extends Command<void> {
  constructor(public readonly email: string) {
    super();
  }
}
