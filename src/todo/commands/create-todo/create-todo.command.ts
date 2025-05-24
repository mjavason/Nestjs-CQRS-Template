import { Command } from '@nestjs/cqrs';

export class CreateTodoCommand extends Command<void> {
  constructor(
    public readonly userId: string,
    public readonly title: string,
    public readonly description: string,
  ) {
    super();
  }
}
