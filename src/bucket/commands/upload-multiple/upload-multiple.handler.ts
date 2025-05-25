import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BucketService } from 'src/bucket/services/bucket.service';
import { UploadMultipleFilesCommand } from './upload-multiple.command';

@CommandHandler(UploadMultipleFilesCommand)
export class UploadMultipleFilesHandler
  implements ICommandHandler<UploadMultipleFilesCommand>
{
  constructor(private readonly bucketService: BucketService) {}

  async execute(command: UploadMultipleFilesCommand) {
    const uploaded = await Promise.all(
      command.files.map((file) =>
        this.bucketService.uploadToCloudinary(
          file.path,
          command.userId,
          command.userId,
        ),
      ),
    );
    return uploaded.map((f) => f.url);
  }
}
