import { Command } from '@nestjs/cqrs';
import { SendMailDTO } from 'src/mail/dtos/mail.dto';

export class SendSimpleMailCommand extends Command<any> {
  constructor(public readonly payload: SendMailDTO) {
    super();
  }
}
