'use client';

import { cn } from '@/lib/utils';
import type { CultivationTask, TaskPriority } from '../../types';

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  urgent: '#EF4444',
  high: '#5BB8E6',
  medium: '#5BB8E6',
  low: '#5BB8E6',
};

const CATEGORY_COLORS: Record<string, string> = {
  feeding: '#5BB8E6',
  ipm: '#5BB8E6',
  defoliation: '#5BB8E6',
  training: '#5BB8E6',
  transplant: '#5BB8E6',
  flush: '#5BB8E6',
  'harvest-prep': '#EF4444',
  environmental: '#5BB8E6',
  cleaning: '#5BB8E6',
  inspection: '#5BB8E6',
};

interface TaskCardProps {
  task: CultivationTask;
}

export function TaskCard({ task }: TaskCardProps) {
  const priorityColor = PRIORITY_COLORS[task.priority];
  const categoryColor = CATEGORY_COLORS[task.category] || '#5BB8E6';

  return (
    <div className="rounded-lg border border-default bg-card p-3 transition-shadow hover:shadow-md">
      {/* Title + Priority */}
      <div className="flex items-start gap-2">
        <div
          className="mt-1 h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: priorityColor }}
        />
        <p className="text-sm font-medium text-text-bright leading-snug">{task.title}</p>
      </div>

      {/* Meta row */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {/* Category tag */}
        <span
          className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
          style={{ backgroundColor: `${categoryColor}15`, color: categoryColor }}
        >
          {task.category}
        </span>

        {/* Assignee */}
        {task.assignee && (
          <div className="flex items-center gap-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-elevated text-[10px] font-bold text-text-muted">
              {task.assignee.charAt(0)}
            </div>
            <span className="text-[11px] text-text-muted">{task.assignee}</span>
          </div>
        )}

        {/* Due date */}
        {task.dueDate && (
          <span className={cn(
            'text-[10px]',
            task.dueDate <= new Date().toISOString().slice(0, 10) ? 'text-danger font-semibold' : 'text-text-muted',
          )}>
            {task.dueDate === new Date().toISOString().slice(0, 10) ? 'Today' : task.dueDate}
          </span>
        )}
      </div>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span key={tag} className="rounded bg-base px-1.5 py-0.5 text-[10px] text-text-muted">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
