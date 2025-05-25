import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailSubscriptionRepository } from 'src/mail/repositories/subscription.repository';
import { RemoveMailSubscriptionCommand } from './remove-subscription.command';

@CommandHandler(RemoveMailSubscriptionCommand)
export class RemoveMailSubscriptionHandler
  implements ICommandHandler<RemoveMailSubscriptionCommand>
{
  constructor(private readonly repository: MailSubscriptionRepository) {}

  async execute(command: RemoveMailSubscriptionCommand) {
    await this.repository.remove(command.id);
  }
}
