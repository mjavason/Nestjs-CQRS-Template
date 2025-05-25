import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
    MongooseModule.forFeature([
      { name: MailSubscription.name, schema: mailSubscriptionSchema },
    ]),
  ],
  controllers: [MailController, MailSubscriptionController],
  providers: [MailService, MailSubscriptionService],
  exports: [MailService],
})
export class MailModule {}
