'use client';

import { User, Factory, Bot, Video, Calendar, Tag, Link2 } from 'lucide-react';
import { DrawerPanel, StatusBadge } from '@/components';
import type { Task, TaskPriority, TaskSource } from '@/modules/tasks/types';

interface TaskDrawerProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}

const PRIORITY_VARIANT: Record<TaskPriority, 'danger' | 'warning' | 'info' | 'muted'> = {
  critical: 'danger',
  high: 'warning',
  medium: 'info',
  low: 'muted',
};

const STATUS_VARIANT: Record<string, 'info' | 'warning' | 'success' | 'danger'> = {
  todo: 'info',
  'in-progress': 'warning',
  done: 'success',
  blocked: 'danger',
};

const SOURCE_LABEL: Record<TaskSource, string> = {
  manual: 'Manual',
  'work-order': 'Work Order',
  agent: 'AI Agent',
  meeting: 'Meeting',
};

const SOURCE_ICON: Record<TaskSource, typeof User> = {
  manual: User,
  'work-order': Factory,
  agent: Bot,
  meeting: Video,
};

export function TaskDrawer({ task, open, onClose }: TaskDrawerProps) {
  if (!task) return null;

  const SourceIcon = SOURCE_ICON[task.source];

  return (
    <DrawerPanel open={open} onClose={onClose} title={task.title} width="lg">
      <div className="space-y-5">
        {/* Status & Priority */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            variant={STATUS_VARIANT[task.status] ?? 'muted'}
            label={task.status.replace('-', ' ')}
          />
          <StatusBadge variant={PRIORITY_VARIANT[task.priority]} label={task.priority} />
          <div className="flex items-center gap-1 rounded-full bg-elevated px-2 py-0.5">
            <SourceIcon className="h-3 w-3 text-text-muted" />
            <span className="text-[11px] text-text-muted">{SOURCE_LABEL[task.source]}</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold uppercase text-text-muted tracking-wider">Description</h4>
          <p className="mt-1.5 text-sm text-text-default leading-relaxed">{task.description}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold uppercase text-text-muted tracking-wider">Assignee</h4>
            <div className="mt-1.5 flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-text-muted" />
              <span className="text-sm text-text-default">{task.assignee}</span>
            </div>
          </div>

          {task.dueDate && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-text-muted tracking-wider">Due Date</h4>
              <div className="mt-1.5 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-text-muted" />
                <span className="text-sm text-text-default">
                  {new Date(task.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          )}

          {task.module && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-text-muted tracking-wider">Module</h4>
              <div className="mt-1.5 flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5 text-text-muted" />
                <span className="text-sm text-text-default">{task.module}</span>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold uppercase text-text-muted tracking-wider">Created</h4>
            <p className="mt-1.5 text-sm text-text-default">
              {new Date(task.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase text-text-muted tracking-wider">Tags</h4>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-elevated px-2 py-0.5 text-[11px] text-text-muted"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {task.completedAt && (
          <div className="rounded-lg border border-default bg-elevated p-3">
            <p className="text-xs text-success font-medium">
              Completed on{' '}
              {new Date(task.completedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        )}

        {/* Notes Placeholder */}
        <div>
          <h4 className="text-xs font-semibold uppercase text-text-muted tracking-wider">Notes</h4>
          <div className="mt-1.5 rounded-lg border border-default bg-elevated p-3">
            <p className="text-xs text-text-muted italic">No notes yet. Notes and comments coming soon.</p>
          </div>
        </div>
      </div>
    </DrawerPanel>
  );
}
