import { GenericRepository } from 'src/common/providers/generic.repository';
import { IMailSubscriptionDocument } from './subscription.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MailSubscription } from './subscription.schema';
import { Model } from 'mongoose';

@Injectable()
export class MailSubscriptionService extends GenericRepository<IMailSubscriptionDocument> {
  constructor(
    @InjectModel(MailSubscription.name)
    private mailSubscriptionModel: Model<IMailSubscriptionDocument>,
  ) {
    super(mailSubscriptionModel);
  }
}
