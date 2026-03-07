'use client';

import { useState, useMemo } from 'react';
import { KanbanBase } from '@/components';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '@/modules/tasks/types';

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: '#3B82F6' },
  { id: 'in-progress', title: 'In Progress', color: '#F59E0B' },
  { id: 'done', title: 'Done', color: '#22C55E' },
  { id: 'blocked', title: 'Blocked', color: '#EF4444' },
];

export function TaskBoard({ tasks, onTaskClick }: TaskBoardProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Sync when tasks prop changes
  const tasksKey = tasks.map((t) => t.id).join(',');
  const [prevKey, setPrevKey] = useState(tasksKey);
  if (tasksKey !== prevKey) {
    setLocalTasks(tasks);
    setPrevKey(tasksKey);
  }

  const columns = useMemo(
    () =>
      COLUMNS.map((col) => ({
        ...col,
        items: localTasks.filter((t) => t.status === col.id),
      })),
    [localTasks]
  );

  function handleDragEnd(itemId: string, _fromColumnId: string, toColumnId: string) {
    setLocalTasks((prev) =>
      prev.map((t) =>
        t.id === itemId ? { ...t, status: toColumnId as TaskStatus } : t
      )
    );
  }

  return (
    <KanbanBase<Task>
      columns={columns}
      renderCard={(task) => <TaskCard task={task} onClick={onTaskClick} />}
      onDragEnd={handleDragEnd}
      emptyColumnMessage="No tasks"
    />
  );
}
