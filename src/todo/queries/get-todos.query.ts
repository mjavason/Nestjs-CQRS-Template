import { Query } from '@nestjs/cqrs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TodoRepository } from '../repositories/todo.repository';
import { ITodo } from 'src/domain/todo/todo.interface';

export class GetTodosQuery extends Query<ITodo[]> {
  constructor(public readonly userId: string) {
    super();
  }
}

@QueryHandler(GetTodosQuery)
export class GetTodosHandler implements IQueryHandler<GetTodosQuery> {
  constructor(private repository: TodoRepository) {}

  async execute(query: GetTodosQuery): Promise<ITodo[]> {
    return this.repository.findAll(query.userId);
  }
}
