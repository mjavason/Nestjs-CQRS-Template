import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTodoHandler } from './todo/commands/create-todo.command';
import { GetTodosHandler } from './todo/queries/get-todos.query';
import { TodoRepository } from './todo/repositories/todo.repository';

@Module({
  imports: [CqrsModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, CreateTodoHandler, GetTodosHandler, TodoRepository],
})
export class AppModule {}
