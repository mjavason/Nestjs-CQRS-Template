import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { BroadcastMailHandler } from './commands/broadcast-mail/broadcast-mail.handler';
import { CreateMailSubscriptionHandler } from './commands/create-subscription/create-subscription.handler';
import { RemoveMailSubscriptionHandler } from './commands/remove-subscription/remove-subscription.handler';
import { SendSimpleMailHandler } from './commands/send-mail/send-mail.handler';
import { MailController } from './controllers/mail.controller';
import { MailSubscriptionController } from './controllers/subscription.controller';
import {
  MailSubscription,
  mailSubscriptionSchema,
} from './entities/subscription.schema';
import { FindAllMailSubscriptionsHandler } from './queries/find-all-subscriptions/find-all-subscriptions.handler';
import { FindOneMailSubscriptionHandler } from './queries/find-one-subscription/find-one-subscription.handler';
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
    BroadcastMailHandler,
    FindAllMailSubscriptionsHandler,
    FindOneMailSubscriptionHandler,
    RemoveMailSubscriptionHandler,
  ],
  exports: [MailService],
})
export class MailModule {}
