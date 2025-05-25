import { Command } from '@nestjs/cqrs';

export class RemoveMailSubscriptionCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
