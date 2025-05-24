import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTodoCommand } from './commands/create-todo.command';
import { GetTodosQuery } from './queries/get-todos.query';
import { Body, Post } from '@nestjs/common';
import { CreateTodoDto } from './dtos/create-todo.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('todo')
  async createTodo(@Body() createTodoDto: CreateTodoDto): Promise<void> {
    await this.commandBus.execute(
      new CreateTodoCommand(
        '001',
        createTodoDto.title,
        createTodoDto.description,
      ),
    );
  }

  @Get('todos')
  async getTodos(): Promise<any> {
    return this.queryBus.execute(new GetTodosQuery('001'));
  }
}
