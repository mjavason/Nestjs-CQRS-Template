import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailSubscriptionRepository } from 'src/mail/repositories/subscription.repository';
import { MailService } from 'src/mail/services/mail.service';
import { BroadcastMailCommand } from './broadcast-mail.command';

@CommandHandler(BroadcastMailCommand)
export class BroadcastMailHandler
  implements ICommandHandler<BroadcastMailCommand>
{
  constructor(
    private readonly mailSubscriptionRepository: MailSubscriptionRepository,
    private readonly mailService: MailService,
  ) {}

  async execute(command: BroadcastMailCommand) {
    const subscribers =
      await this.mailSubscriptionRepository.findAllNoPagination({});
    for (const subscriber of subscribers) {
      await this.mailService.sendSimpleMail({
        email: subscriber.emailAddress,
        ...command.payload,
      });
    }
    return { message: 'Mail broadcast to all subscribers successfully' };
  }
}
