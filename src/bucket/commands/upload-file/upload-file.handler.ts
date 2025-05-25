import { Command } from '@nestjs/cqrs';

export class UploadFileCommand extends Command<any> {
  constructor(
    public readonly filePath: string,
    public readonly userId: string,
  ) {
    super();
  }
}
