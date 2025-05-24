import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTodoHandler } from './commands/create-todo/create-todo.command-handler';
import { GetTodosHandler } from './queries/get-todos.query-handler';
import { TodoRepository } from './repositories/todo.repository';

@Module({
  imports: [CqrsModule.forRoot()],
  controllers: [TodoController],
  providers: [CreateTodoHandler, GetTodosHandler, TodoRepository],
})
export class TodoModule {}
