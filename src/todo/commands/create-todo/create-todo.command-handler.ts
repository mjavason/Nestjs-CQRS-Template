import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TodoRepository } from 'src/todo/repositories/todo.repository';
import { CreateTodoCommand } from './create-todo.command';

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
  }
}
