import { Body, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Controller, Get } from '@nestjs/common';
import { CreateTodoCommand } from './commands/create-todo/create-todo.command';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { GetTodosQuery } from './queries/get-todos.query';
import {
  ApiTags,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('todo')
@ApiTags('Todo')
@ApiOkResponse({ description: 'Success' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@ApiBadRequestResponse({ description: 'Invalid Parameters' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class TodoController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createTodo(@Body() createTodoDto: CreateTodoDto) {
    return await this.commandBus.execute(
      new CreateTodoCommand(
        '001',
        createTodoDto.title,
        createTodoDto.description,
      ),
    );
  }

  @Get()
  async getTodos(): Promise<any> {
    return this.queryBus.execute(new GetTodosQuery('001'));
  }
}
