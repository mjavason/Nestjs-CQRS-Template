import { FilterMailSubscriptionWithPaginationDto } from 'src/mail/dtos/filter-subscription.dto';

export class FindAllMailSubscriptionsQuery {
  constructor(
    public readonly filter: FilterMailSubscriptionWithPaginationDto,
  ) {}
}
