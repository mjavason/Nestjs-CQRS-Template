import { Command } from '@nestjs/cqrs';

export class DeleteUploadCommand extends Command<any> {
  constructor(
    public readonly url: string,
    public readonly userId: string,
  ) {
    super();
  }
}
