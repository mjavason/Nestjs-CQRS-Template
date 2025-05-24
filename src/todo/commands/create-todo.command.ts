import { Command } from '@nestjs/cqrs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TodoRepository } from 'src/todo/repositories/todo.repository';

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

@CommandHandler(CreateTodoCommand)
export class CreateTodoHandler implements ICommandHandler<CreateTodoCommand> {
  constructor(private readonly repository: TodoRepository) {}

  async execute(command: CreateTodoCommand) {
    const { userId, title, description } = command;
    this.repository.create({
      id: Date.now().toString(),
      userId,
      title,
      description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // await this.repository.save(todo);

    return {
      //   actionId: todo.id
      actionId: Date.now().toString(),
    };
  }
}
