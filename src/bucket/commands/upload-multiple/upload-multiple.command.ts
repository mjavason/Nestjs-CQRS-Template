import { Command } from '@nestjs/cqrs';
import { MulterFile } from 'src/common/interfaces/multer.interface';

export class UploadMultipleFilesCommand extends Command<any> {
  constructor(
    public readonly files: MulterFile[],
    public readonly userId: string,
  ) {
    super();
  }
}
