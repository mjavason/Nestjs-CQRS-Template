import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BucketService } from 'src/bucket/services/bucket.service';
import { UploadFileCommand } from './upload-file.handler';

@CommandHandler(UploadFileCommand)
export class UploadFileHandler implements ICommandHandler<UploadFileCommand> {
  constructor(private readonly bucketService: BucketService) {}

  async execute(command: UploadFileCommand) {
    const data = await this.bucketService.uploadToCloudinary(
      command.filePath,
      command.userId,
      command.userId,
    );
    return { data: data.url };
  }
}
