import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from 'src/auth/entities/token.schema';
import { ITokenDocument } from 'src/auth/interfaces/token.interface';
import { GenericRepository } from 'src/common/providers/generic.repository';

@Injectable()
export class TokenRepository extends GenericRepository<ITokenDocument> {
  constructor(@InjectModel(Token.name) tokenModel: Model<ITokenDocument>) {
    super(tokenModel);
  }
}
