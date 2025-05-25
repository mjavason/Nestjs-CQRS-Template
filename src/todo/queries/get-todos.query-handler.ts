import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TodoRepository } from 'src/todo/repositories/todo.repository';
import { ITodo } from 'src/todo/todo.interface';
import { GetTodosQuery } from './get-todos.query';

@QueryHandler(GetTodosQuery)
export class GetTodosHandler implements IQueryHandler<GetTodosQuery> {
  constructor(private repository: TodoRepository) {}

  async execute(query: GetTodosQuery): Promise<ITodo[]> {
    return this.repository.findAll(query.userId);
  }
}
