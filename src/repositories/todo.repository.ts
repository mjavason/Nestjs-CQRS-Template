import { Injectable } from '@nestjs/common';
import { Todo } from '../models/todo.model';

@Injectable()
export class TodoRepository {
  private todos: Todo[] = [];

  findAll(userId: string): Todo[] {
    console.log(userId);
    return this.todos;
  }

  findById(id: string): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  create(todo: Todo): void {
    this.todos.push(todo);
  }

  update(id: string, updatedTodo: Partial<Todo>): Todo | undefined {
    const todoIndex = this.todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return undefined;
    }
    this.todos[todoIndex] = { ...this.todos[todoIndex], ...updatedTodo };
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
