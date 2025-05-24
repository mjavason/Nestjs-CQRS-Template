import { Injectable } from '@nestjs/common';
import { ITodo } from 'src/todo/todo.interface';

@Injectable()
export class TodoRepository {
  private todos: ITodo[] = [];

  findAll(userId: string): ITodo[] {
    console.log(userId);
    return this.todos;
  }

  findById(id: string): ITodo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  create(todo: ITodo): void {
    this.todos.push(todo);
  }

  update(id: string, updatedITodo: Partial<ITodo>): ITodo | undefined {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return undefined;
    }
    this.todos[todoIndex] = { ...this.todos[todoIndex], ...updatedITodo };
    return this.todos[todoIndex];
  }

  delete(id: string): boolean {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return false;
    }
    this.todos.splice(todoIndex, 1);
    return true;
  }
}
