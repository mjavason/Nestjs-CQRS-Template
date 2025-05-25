import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MailSubscriptionRepository } from 'src/mail/repositories/subscription.repository';
import { FindOneMailSubscriptionQuery } from './find-one-subscription.query';

@QueryHandler(FindOneMailSubscriptionQuery)
export class FindOneMailSubscriptionHandler
  implements IQueryHandler<FindOneMailSubscriptionQuery>
{
  constructor(private readonly repository: MailSubscriptionRepository) {}

  async execute(query: FindOneMailSubscriptionQuery) {
    return await this.repository.findOne({ _id: query.id });
  }
}
