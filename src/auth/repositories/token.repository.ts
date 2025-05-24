import { Injectable } from '@nestjs/common';
import { ITokenDocument } from 'src/auth/interfaces/token.interface';
import { GenericRepository } from 'src/common/providers/generic.repository';
import { Token } from '../entities/token.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TokenRepository extends GenericRepository<ITokenDocument> {
  constructor(@InjectModel(Token.name) tokenModel: Model<ITokenDocument>) {
    super(tokenModel);
  }
}
