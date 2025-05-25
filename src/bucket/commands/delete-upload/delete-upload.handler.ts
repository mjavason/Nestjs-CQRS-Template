import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BucketService } from 'src/bucket/services/bucket.service';
import { DeleteUploadCommand } from './delete-upload.command';

@CommandHandler(DeleteUploadCommand)
export class DeleteUploadHandler
  implements ICommandHandler<DeleteUploadCommand>
{
  constructor(private readonly bucketService: BucketService) {}

  async execute(command: DeleteUploadCommand) {
    return await this.bucketService.deleteFromCloudinary(
      command.url,
      command.userId,
    );
  }
}
