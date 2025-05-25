import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from 'src/common/providers/generic.repository';
import { MailSubscription } from '../entities/subscription.schema';
import { IMailSubscriptionDocument } from '../interfaces/subscription.interface';

@Injectable()
export class MailSubscriptionRepository extends GenericRepository<IMailSubscriptionDocument> {
  constructor(
    @InjectModel(MailSubscription.name)
    mailSubscriptionModel: Model<IMailSubscriptionDocument>,
  ) {
    super(mailSubscriptionModel);
  }
}
