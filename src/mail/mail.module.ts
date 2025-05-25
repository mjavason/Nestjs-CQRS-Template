import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateMailSubscriptionHandler } from './commands/create-mail-subscription/create-mail-subscription.handler';
import { SendSimpleMailHandler } from './commands/send-mail/send-mail.handler';
import { MailController } from './controllers/mail.controller';
import { MailSubscriptionController } from './controllers/subscription.controller';
import {
  MailSubscription,
  mailSubscriptionSchema,
} from './entities/subscription.schema';
import { MailSubscriptionRepository } from './repositories/subscription.repository';
import { MailService } from './services/mail.service';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: MailSubscription.name, schema: mailSubscriptionSchema },
    ]),
  ],
  controllers: [MailController, MailSubscriptionController],
  providers: [
    MailService,
    MailSubscriptionRepository,
    SendSimpleMailHandler,
    CreateMailSubscriptionHandler,
  ],
  exports: [MailService],
})
export class MailModule {}
