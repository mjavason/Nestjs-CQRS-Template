import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MailService } from 'src/mail/services/mail.service';
import { SendSimpleMailCommand } from './send-mail.command';

@CommandHandler(SendSimpleMailCommand)
export class SendSimpleMailHandler
  implements ICommandHandler<SendSimpleMailCommand>
{
  constructor(private readonly mailService: MailService) {}

  async execute(command: SendSimpleMailCommand) {
    return this.mailService.sendSimpleMail(command.payload);
  }
}
