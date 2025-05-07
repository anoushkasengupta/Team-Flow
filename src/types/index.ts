export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
  assignee: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface TaskFilters {
  search?: string;
  priority?: Priority;
  status?: Status;
  dueDate?: Date;
} 