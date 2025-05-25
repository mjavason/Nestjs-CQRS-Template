import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bucket } from 'src/bucket/entities/bucket.schema';
import { IBucketDocument } from 'src/bucket/interfaces/bucket.interface';
import { GenericRepository } from 'src/common/providers/generic.repository';

@Injectable()
export class BucketRepository extends GenericRepository<IBucketDocument> {
  constructor(@InjectModel(Bucket.name) bucketModel: Model<IBucketDocument>) {
    super(bucketModel);
  }
}
