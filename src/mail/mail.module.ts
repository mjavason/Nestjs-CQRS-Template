import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { SendSimpleMailHandler } from './commands/send-mail/send-mail.handler';
import { MailController } from './controllers/mail.controller';
import { MailSubscriptionController } from './controllers/subscription.controller';
import {
  MailSubscription,
  mailSubscriptionSchema,
} from './entities/subscription.schema';
import { MailService } from './services/mail.service';
import { MailSubscriptionService } from './services/subscription.service';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: MailSubscription.name, schema: mailSubscriptionSchema },
    ]),
  ],
  controllers: [MailController, MailSubscriptionController],
  providers: [MailService, MailSubscriptionService, SendSimpleMailHandler],
  exports: [MailService],
})
export class MailModule {}
