'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { KanbanBase } from '@/components';
import { TaskCard } from './TaskCard';
import { useTaskBoardStore } from '@/modules/tasks/store';
import type { Task, TaskStatus } from '@/modules/tasks/types';

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

function EditableColumnTitle({
  title,
  onRename,
}: {
  title: string;
  onRename: (newTitle: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function commit() {
    const trimmed = value.trim();
    if (trimmed && trimmed !== title) onRename(trimmed);
    else setValue(title);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setValue(title); setEditing(false); }
        }}
        className="w-full rounded bg-elevated px-1 text-sm font-medium text-text-bright outline-none ring-1 ring-accent-primary"
        style={{ minWidth: 0 }}
      />
    );
  }

  return (
    <span
      className="cursor-pointer text-sm font-medium text-text-bright hover:text-text-bright/80"
      onDoubleClick={() => setEditing(true)}
      title="Double-click to rename"
    >
      {title}
    </span>
  );
}

function AddColumnButton({ onAdd }: { onAdd: (title: string) => void }) {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  function commit() {
    const trimmed = value.trim();
    if (trimmed) onAdd(trimmed);
    setValue('');
    setAdding(false);
  }

  if (adding) {
    return (
      <div className="flex w-48 shrink-0 flex-col gap-2 rounded-xl border border-default bg-card p-3">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') { setValue(''); setAdding(false); }
          }}
          placeholder="Column name"
          className="rounded bg-elevated px-2 py-1 text-sm text-text-bright outline-none ring-1 ring-accent-primary placeholder:text-text-muted"
        />
        <div className="flex gap-2">
          <button
            onClick={commit}
            className="flex-1 rounded-md bg-accent-primary/20 px-2 py-1 text-xs font-medium text-accent-primary hover:bg-accent-primary/30"
          >
            Add
          </button>
          <button
            onClick={() => { setValue(''); setAdding(false); }}
            className="rounded-md px-2 py-1 text-xs text-text-muted hover:text-text-default"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setAdding(true)}
      className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-xl border border-dashed border-default text-text-muted transition-colors hover:border-accent-primary/50 hover:text-accent-primary"
      title="Add column"
    >
      <Plus className="h-4 w-4" />
    </button>
  );
}

export function TaskBoard({ tasks, onTaskClick }: TaskBoardProps) {
  const { columns, addColumn, renameColumn, removeColumn } = useTaskBoardStore();
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  const tasksKey = tasks.map((t) => t.id).join(',');
  const [prevKey, setPrevKey] = useState(tasksKey);
  if (tasksKey !== prevKey) {
    setLocalTasks(tasks);
    setPrevKey(tasksKey);
  }

  const boardColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        items: localTasks.filter((t) => t.status === col.id),
      })),
    [localTasks, columns]
  );

  function handleDragEnd(itemId: string, _fromColumnId: string, toColumnId: string) {
    setLocalTasks((prev) =>
      prev.map((t) =>
        t.id === itemId ? { ...t, status: toColumnId as TaskStatus } : t
      )
    );
  }

  return (
    <div className="flex items-start gap-4">
      <div className="min-w-0 flex-1">
        <KanbanBase<Task>
          columns={boardColumns}
          renderCard={(task) => <TaskCard task={task} onClick={onTaskClick} />}
          onDragEnd={handleDragEnd}
          emptyColumnMessage="No tasks"
          fullWidth
          renderColumnTitle={(colId, title) => (
            <EditableColumnTitle
              title={title}
              onRename={(newTitle) => renameColumn(colId, newTitle)}
            />
          )}
          columnHeaderExtra={(colId) => {
            const isProtected = ['todo', 'in-progress', 'done', 'blocked'].includes(colId);
            if (isProtected) return null;
            return (
              <button
                onClick={() => removeColumn(colId)}
                className="rounded p-0.5 text-text-muted hover:text-red-400"
                title="Remove column"
              >
                <X className="h-3 w-3" />
              </button>
            );
          }}
        />
      </div>
      <AddColumnButton onAdd={addColumn} />
    </div>
  );
}
