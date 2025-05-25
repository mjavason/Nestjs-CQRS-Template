import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BucketController } from './bucket.controller';
import { UploadFileHandler } from './commands/upload-file/upload-file.command';
import { UploadMultipleFilesHandler } from './commands/upload-multiple/upload-multiple.handler';
import { Bucket, bucketSchema } from './entities/bucket.schema';
import { BucketRepository } from './repositories/bucket.repository';
import { BucketService } from './services/bucket.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bucket.name, schema: bucketSchema }]),
  ],
  controllers: [BucketController],
  providers: [
    BucketService,
    BucketRepository,
    UploadFileHandler,
    UploadMultipleFilesHandler,
  ],
  exports: [BucketService],
})
export class BucketModule {}
