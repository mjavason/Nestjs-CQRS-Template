import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { SendSimpleMailCommand } from '../commands/send-mail/send-mail.command';
import { SendMailDTO } from '../dtos/mail.dto';

@Controller('mail')
@ApiTags('Mail')
export class MailController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({
    summary: 'Send simple mail to anyone, with base template applied',
  })
  @Auth()
  create(@Body() sendMailDTO: SendMailDTO) {
    return this.commandBus.execute(new SendSimpleMailCommand(sendMailDTO));
  }
}
