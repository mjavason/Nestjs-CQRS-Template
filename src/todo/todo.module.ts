import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTodoHandler } from './commands/create-todo/create-todo.command-handler';
import { GetTodosHandler } from './queries/get-todos.query-handler';
import { TodoRepository } from './repositories/todo.repository';
import { TodoController } from './todo.controller';

@Module({
  imports: [CqrsModule.forRoot()],
  controllers: [TodoController],
  providers: [CreateTodoHandler, GetTodosHandler, TodoRepository],
})
export class TodoModule {}
