import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MailSubscriptionRepository } from 'src/mail/repositories/subscription.repository';
import { FindAllMailSubscriptionsQuery } from './find-all-subscription.query';

@QueryHandler(FindAllMailSubscriptionsQuery)
export class FindAllMailSubscriptionsHandler
  implements IQueryHandler<FindAllMailSubscriptionsQuery>
{
  constructor(private readonly repository: MailSubscriptionRepository) {}

  async execute(query: FindAllMailSubscriptionsQuery) {
    return await this.repository.findAll(query.filter);
  }
}
