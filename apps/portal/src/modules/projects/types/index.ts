export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed';

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  description?: string;
}

export interface Project {
  [key: string]: unknown;
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  lead: string;
  members: string[];
  startDate: string;
  targetDate: string;
  progress: number;
  milestones: Milestone[];
}

export interface ProjectFilter {
  status?: ProjectStatus;
  search?: string;
}
