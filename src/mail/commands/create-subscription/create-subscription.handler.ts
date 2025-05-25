import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailSubscriptionRepository } from 'src/mail/repositories/subscription.repository';
import { CreateMailSubscriptionCommand } from './create-subscription.command';

@CommandHandler(CreateMailSubscriptionCommand)
export class CreateMailSubscriptionHandler
  implements ICommandHandler<CreateMailSubscriptionCommand>
{
  constructor(
    private readonly mailSubscriptionService: MailSubscriptionRepository,
  ) {}

  async execute(command: CreateMailSubscriptionCommand) {
    await this.mailSubscriptionService.create(command.payload);
  }
}
