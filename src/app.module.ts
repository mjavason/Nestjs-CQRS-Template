import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTodoHandler } from './commands/create-todo.command';
import { GetTodosHandler } from './queries/get-todos.query';
import { TodoRepository } from './repositories/todo.repository';

@Module({
  imports: [CqrsModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, CreateTodoHandler, GetTodosHandler, TodoRepository],
})
export class AppModule {}
