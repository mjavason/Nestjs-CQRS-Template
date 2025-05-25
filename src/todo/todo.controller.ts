import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateTodoCommand } from './commands/create-todo/create-todo.command';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { GetTodosQuery } from './queries/get-todos.query';

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
