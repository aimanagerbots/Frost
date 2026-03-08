export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'blocked';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskSource = 'manual' | 'work-order' | 'agent' | 'meeting';

export interface Task {
  [key: string]: unknown;
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeAvatar?: string;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  module?: string;
  moduleRoute?: string;
  linkedAccountId?: string;
  linkedOrderId?: string;
  tags: string[];
  source: TaskSource;
}

export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  module?: string;
  source?: TaskSource;
  search?: string;
}

export interface TaskColumn {
  id: TaskStatus;
  title: string;
  color: string;
  taskIds: string[];
}

export interface TaskBoard {
  columns: TaskColumn[];
}
