import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from 'src/user/repositories/user.repository';
import { GetUserProfileQuery } from './get-user-profile.query';

@QueryHandler(GetUserProfileQuery)
export class GetUserProfileHandler
  implements IQueryHandler<GetUserProfileQuery>
{
  constructor(private readonly repository: UserRepository) {}

  async execute(query: GetUserProfileQuery) {
    return await this.repository.findOne({ _id: query.userId });
  }
}
