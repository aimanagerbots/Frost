'use client';

import { User, Factory, Bot, Video, Calendar } from 'lucide-react';
import { StatusBadge } from '@/components';
import { cn } from '@/lib/utils';
import type { Task, TaskPriority, TaskSource } from '@/modules/tasks/types';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

const PRIORITY_VARIANT: Record<TaskPriority, 'danger' | 'warning' | 'info' | 'muted'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'muted',
};

const SOURCE_ICON: Record<TaskSource, typeof User> = {
  manual: User,
  'work-order': Factory,
  agent: Bot,
  meeting: Video,
};

function getDueDateDisplay(dueDate?: string): { text: string; className: string } | null {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffDays = Math.round((dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, className: 'text-danger' };
  if (diffDays === 0) return { text: 'Due today', className: 'text-warning' };
  if (diffDays === 1) return { text: 'Due tomorrow', className: 'text-muted' };
  return { text: `Due in ${diffDays}d`, className: 'text-muted' };
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const SourceIcon = SOURCE_ICON[task.source];
  const dueDisplay = getDueDateDisplay(task.dueDate);

  return (
    <div
      className="cursor-pointer rounded-lg border border-default bg-card p-3 transition-colors hover:bg-card-hover"
      onClick={() => onClick(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(task); }}
    >
      <p className="text-sm font-medium text-bright line-clamp-2 leading-snug">{task.title}</p>

      <div className="mt-2 flex items-center gap-2">
        <StatusBadge variant={PRIORITY_VARIANT[task.priority]} label={task.priority} size="sm" />
        {task.module && (
          <span className="rounded-full bg-elevated px-1.5 py-0.5 text-[10px] text-muted">
            {task.module}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <SourceIcon className="h-3 w-3 text-muted" />
          <span className="text-[11px] text-muted">{task.assignee.split(' ')[0]}</span>
        </div>
        {dueDisplay && (
          <div className={cn('flex items-center gap-1 text-[11px]', dueDisplay.className)}>
            <Calendar className="h-3 w-3" />
            <span>{dueDisplay.text}</span>
          </div>
        )}
      </div>
    </div>
  );
}
