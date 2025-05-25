import { Command } from '@nestjs/cqrs';
import { SendMailParamsDTO } from 'src/mail/dtos/mail.dto';

export class BroadcastMailCommand extends Command<any> {
  constructor(public readonly payload: SendMailParamsDTO) {
    super();
  }
}
