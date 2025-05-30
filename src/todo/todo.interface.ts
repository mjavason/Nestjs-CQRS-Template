export interface ITodo {
  id: string;
  title: string;
  description?: string;
  userId: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
