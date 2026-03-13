'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { KanbanBase, LoadingSkeleton } from '@/components';
import { useWorkOrders } from '../../hooks';
import { useManufacturingStore, useWorkOrderBoardStore } from '../../store';
import { WorkOrderCard } from './WorkOrderCard';
import { WorkOrderDetail } from './WorkOrderDetail';
import type { WorkOrder } from '../../types';

const TYPE_OPTIONS = ['flower', 'preroll', 'vaporizer', 'concentrate'] as const;
const PRIORITY_OPTIONS = ['critical', 'high', 'medium', 'low'] as const;

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
        className="w-full rounded bg-elevated px-1 text-sm font-medium text-text-bright outline-none ring-1 ring-[#10B981]"
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
          className="rounded bg-elevated px-2 py-1 text-sm text-text-bright outline-none ring-1 ring-[#10B981] placeholder:text-text-muted"
        />
        <div className="flex gap-2">
          <button
            onClick={commit}
            className="flex-1 rounded-md bg-[#10B981]/20 px-2 py-1 text-xs font-medium text-[#10B981] hover:bg-[#10B981]/30"
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
      className="flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-xl border border-dashed border-default text-text-muted transition-colors hover:border-[#10B981]/50 hover:text-[#10B981]"
      title="Add column"
    >
      <Plus className="h-4 w-4" />
    </button>
  );
}

export function WorkOrderBoard() {
  const { data: orders, isLoading } = useWorkOrders();
  const { selectWorkOrder } = useManufacturingStore();
  const { columns, isProtected, addColumn, renameColumn, removeColumn } = useWorkOrderBoardStore();
  const [localOrders, setLocalOrders] = useState<WorkOrder[] | null>(null);
  const [filterType, setFilterType] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const ordersKey = (orders ?? []).map((o) => o.id).join(',');
  const [prevKey, setPrevKey] = useState(ordersKey);
  if (ordersKey !== prevKey) {
    setLocalOrders(null);
    setPrevKey(ordersKey);
  }

  const filtered = useMemo(() => {
    const source = localOrders ?? orders ?? [];
    let result = [...source];
    if (filterType) result = result.filter((o) => o.type === filterType);
    if (filterPriority) result = result.filter((o) => o.priority === filterPriority);
    return result;
  }, [localOrders, orders, filterType, filterPriority]);

  const boardColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        items: filtered.filter((o) => o.status === col.id),
      })),
    [filtered, columns]
  );

  function handleDragEnd(itemId: string, _fromCol: string, toCol: string) {
    const source = localOrders ?? orders ?? [];
    setLocalOrders(
      source.map((o) =>
        o.id === itemId ? { ...o, status: toCol as WorkOrder['status'] } : o
      )
    );
  }

  if (isLoading) return <LoadingSkeleton variant="card" count={6} />;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-xl bg-card px-3 py-1.5 text-xs text-text-default"
        >
          <option value="">All Types</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="rounded-xl bg-card px-3 py-1.5 text-xs text-text-default"
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Kanban */}
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <KanbanBase<WorkOrder>
            columns={boardColumns}
            renderCard={(order) => (
              <div onClick={() => selectWorkOrder(order.id)} className="cursor-pointer">
                <WorkOrderCard order={order} />
              </div>
            )}
            onDragEnd={handleDragEnd}
            emptyColumnMessage="No work orders"
            fullWidth
            renderColumnTitle={(colId, title) => (
              <EditableColumnTitle
                title={title}
                onRename={(newTitle) => renameColumn(colId, newTitle)}
              />
            )}
            columnHeaderExtra={(colId) => {
              if (isProtected(colId)) return null;
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

      {/* Detail Drawer */}
      <WorkOrderDetail />
    </div>
  );
}
