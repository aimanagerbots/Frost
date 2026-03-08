'use client';

import { useState, useMemo } from 'react';
import { KanbanBase } from '@/components';
import { useCultivationTasks } from '../../hooks/useCultivationTasks';
import { useGrowRooms } from '../../hooks/useGrowRooms';
import { TaskCard } from './TaskCard';
import { TaskFilters } from './TaskFilters';
import { LoadingSkeleton } from '@/components';
import type { CultivationTask, TaskPriority, TaskStatus } from '../../types';

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const COLUMN_CONFIG: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: '#5BB8E6' },
  { id: 'in-progress', title: 'In Progress', color: '#5BB8E6' },
  { id: 'done', title: 'Done', color: '#5BB8E6' },
];

export function TasksKanban() {
  const { data: tasks, isLoading: tasksLoading } = useCultivationTasks();
  const { data: rooms } = useGrowRooms();

  const [localTasks, setLocalTasks] = useState<CultivationTask[] | null>(null);
  const [filterRoom, setFilterRoom] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('priority');

  // Apply filters
  const filteredTasks = useMemo(() => {
    const source = localTasks ?? tasks ?? [];
    let result = [...source];
    if (filterRoom) result = result.filter((t) => t.roomId === filterRoom);
    if (filterPriority) result = result.filter((t) => t.priority === filterPriority);

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      return (a.dueDate ?? '').localeCompare(b.dueDate ?? '');
    });

    return result;
  }, [localTasks, tasks, filterRoom, filterPriority, sortBy]);

  // Build kanban columns
  const columns = COLUMN_CONFIG.map((col) => ({
    ...col,
    items: filteredTasks.filter((t) => t.status === col.id),
  }));

  const handleDragEnd = (itemId: string, _fromCol: string, toCol: string) => {
    const source = localTasks ?? tasks ?? [];
    setLocalTasks(
      source.map((t) =>
        t.id === itemId ? { ...t, status: toCol as TaskStatus } : t
      )
    );
  };

  if (tasksLoading) return <LoadingSkeleton variant="card" count={6} />;

  const roomOptions = (rooms ?? []).map((r) => ({ id: r.id, name: r.name }));

  return (
    <div className="space-y-4">
      <TaskFilters
        rooms={roomOptions}
        selectedRoom={filterRoom}
        selectedPriority={filterPriority}
        sortBy={sortBy}
        onRoomChange={setFilterRoom}
        onPriorityChange={setFilterPriority}
        onSortChange={setSortBy}
      />

      <KanbanBase
        columns={columns}
        renderCard={(task: CultivationTask) => <TaskCard task={task} />}
        onDragEnd={handleDragEnd}
        emptyColumnMessage="No tasks"
      />
    </div>
  );
}
