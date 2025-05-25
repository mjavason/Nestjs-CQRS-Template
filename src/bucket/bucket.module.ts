import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BucketController } from './bucket.controller';
import { BucketRepository } from './bucket.repository';
import { Bucket, bucketSchema } from './bucket.schema';
import { BucketService } from './bucket.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bucket.name, schema: bucketSchema }]),
  ],
  controllers: [BucketController],
  providers: [BucketService, BucketRepository],
  exports: [BucketService],
})
export class BucketModule {}
