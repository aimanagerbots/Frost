'use client';

import { useState } from 'react';
import { CheckSquare, LayoutGrid, List } from 'lucide-react';
import { SectionHeader, DataTable, StatusBadge, LoadingSkeleton, ErrorState, EmptyState } from '@/components';
import { useTasks } from '@/modules/tasks/hooks/useTasks';
import { TaskBoard } from './TaskBoard';
import { TaskFilters } from './TaskFilters';
import { TaskDrawer } from './TaskDrawer';
import type { Task, TaskFilter, TaskPriority } from '@/modules/tasks/types';
import { ACCENT as TASKS_ACCENT } from '@/design/colors';


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

export function TasksPage() {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [filters, setFilters] = useState<TaskFilter>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { data: tasks, isLoading, error, refetch } = useTasks(filters);

  const todoCount = tasks?.filter((t) => t.status === 'todo').length ?? 0;
  const inProgressCount = tasks?.filter((t) => t.status === 'in-progress').length ?? 0;
  const totalCount = tasks?.length ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="card" count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load tasks"
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  const tableColumns = [
    {
      header: 'Title',
      accessor: 'title' as const,
      sortable: true,
      render: (row: Task) => (
        <span className="text-sm font-medium text-text-bright">{row.title}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      sortable: true,
      render: (row: Task) => (
        <StatusBadge
          variant={STATUS_VARIANT[row.status] ?? 'muted'}
          label={row.status.replace('-', ' ')}
          size="sm"
        />
      ),
    },
    {
      header: 'Priority',
      accessor: 'priority' as const,
      sortable: true,
      render: (row: Task) => (
        <StatusBadge variant={PRIORITY_VARIANT[row.priority]} label={row.priority} size="sm" />
      ),
    },
    {
      header: 'Assignee',
      accessor: 'assignee' as const,
      sortable: true,
    },
    {
      header: 'Due Date',
      accessor: 'dueDate' as const,
      sortable: true,
      render: (row: Task) =>
        row.dueDate
          ? new Date(row.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          : '—',
    },
    {
      header: 'Source',
      accessor: 'source' as const,
      sortable: true,
      hideBelow: 'md' as const,
      render: (row: Task) => (
        <span className="text-xs text-text-muted capitalize">{row.source.replace('-', ' ')}</span>
      ),
    },
    {
      header: 'Module',
      accessor: 'module' as const,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: Task) =>
        row.module ? (
          <span className="rounded-full bg-elevated px-2 py-0.5 text-[10px] text-text-muted">
            {row.module}
          </span>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={CheckSquare}
        title="Tasks"
        subtitle="Personal and team task manager"
        accentColor={TASKS_ACCENT}
        stats={[
          { label: 'Total', value: totalCount },
          { label: 'To Do', value: todoCount },
          { label: 'In Progress', value: inProgressCount },
        ]}
        actions={
          <div className="flex items-center gap-1 rounded-lg border border-default bg-elevated p-0.5">
            <button
              onClick={() => setViewMode('board')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'board'
                  ? 'bg-card text-text-bright'
                  : 'text-text-muted hover:text-text-default'
              }`}
              aria-label="Board view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-card text-text-bright'
                  : 'text-text-muted hover:text-text-default'
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        }
      />

      <TaskFilters filters={filters} onChange={setFilters} />

      {tasks?.length === 0 && (
        <EmptyState icon={CheckSquare} title="No tasks" description="No tasks match your current filters." accentColor={TASKS_ACCENT} />
      )}

      {viewMode === 'board' ? (
        <TaskBoard tasks={tasks ?? []} onTaskClick={setSelectedTask} />
      ) : (
        <DataTable<Task>
          data={tasks ?? []}
          columns={tableColumns}
          searchable
          searchPlaceholder="Search tasks..."
          onRowClick={setSelectedTask}
          pageSize={15}
          emptyState={{
            icon: CheckSquare,
            title: 'No tasks found',
            description: 'Try adjusting your filters.',
            accentColor: TASKS_ACCENT,
          }}
        />
      )}

      <TaskDrawer
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
