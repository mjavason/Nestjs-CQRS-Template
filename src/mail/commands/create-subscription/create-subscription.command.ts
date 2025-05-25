import { Command } from '@nestjs/cqrs';
import { CreateMailSubscriptionDto } from 'src/mail/dtos/create-subscription.dto';

export class CreateMailSubscriptionCommand extends Command<void> {
  constructor(public readonly payload: CreateMailSubscriptionDto) {
    super();
  }
}
