import { Query } from '@nestjs/cqrs';
import { Todo } from '../models/todo.model';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TodoRepository } from '../repositories/todo.repository';

export class GetTodosQuery extends Query<Todo[]> {
  constructor(public readonly userId: string) {
    super();
  }
}

@QueryHandler(GetTodosQuery)
export class GetTodosHandler implements IQueryHandler<GetTodosQuery> {
  constructor(private repository: TodoRepository) {}

  async execute(query: GetTodosQuery): Promise<Todo[]> {
    return this.repository.findAll(query.userId);
  }
}
