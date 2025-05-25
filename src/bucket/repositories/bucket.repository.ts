import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from 'src/common/providers/generic.repository';
import { Bucket } from '../entities/bucket.schema';
import { IBucketDocument } from '../interfaces/bucket.interface';

@Injectable()
export class BucketRepository extends GenericRepository<IBucketDocument> {
  constructor(@InjectModel(Bucket.name) bucketModel: Model<IBucketDocument>) {
    super(bucketModel);
  }
}
