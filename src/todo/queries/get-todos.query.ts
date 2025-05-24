import { Query } from '@nestjs/cqrs';
import { ITodo } from 'src/todo/todo.interface';

export class GetTodosQuery extends Query<ITodo[]> {
  constructor(public readonly userId: string) {
    super();
  }
}
