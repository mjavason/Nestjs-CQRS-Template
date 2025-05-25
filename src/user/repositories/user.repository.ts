import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from 'src/common/providers/generic.repository';
import { User } from 'src/user/entities/user.schema';
import { IUserDocument } from 'src/user/interfaces/user.interface';

@Injectable()
export class UserRepository extends GenericRepository<IUserDocument> {
  constructor(@InjectModel(User.name) userModel: Model<IUserDocument>) {
    super(userModel);
  }
}
