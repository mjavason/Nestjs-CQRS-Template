import { Command } from '@nestjs/cqrs';

export class CreateTodoCommand extends Command<{
  actionId: string; // This type represents the command execution result
}> {
  constructor(
    public readonly userId: string,
    public readonly title: string,
    public readonly description: string,
  ) {
    super();
  }
}
