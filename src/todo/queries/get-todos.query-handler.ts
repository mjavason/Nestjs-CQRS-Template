import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TodoRepository } from '../repositories/todo.repository';
import { GetTodosQuery } from './get-todos.query';
import { ITodo } from '../todo.interface';

@QueryHandler(GetTodosQuery)
export class GetTodosHandler implements IQueryHandler<GetTodosQuery> {
  constructor(private repository: TodoRepository) {}

  async execute(query: GetTodosQuery): Promise<ITodo[]> {
    return this.repository.findAll(query.userId);
  }
}
