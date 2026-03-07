'use client';

import { useState, useMemo } from 'react';
import { KanbanBase, LoadingSkeleton } from '@/components';
import { useWorkOrders } from '../../hooks';
import { useManufacturingStore } from '../../store';
import { WorkOrderCard } from './WorkOrderCard';
import { WorkOrderDetail } from './WorkOrderDetail';
import type { WorkOrder } from '../../types';

type WOStatus = WorkOrder['status'];

const COLUMN_CONFIG: { id: string; title: string; color: string; statuses: WOStatus[] }[] = [
  { id: 'pending', title: 'Pending', color: '#94A3B8', statuses: ['queued', 'blocked'] },
  { id: 'in-progress', title: 'In Progress', color: '#3B82F6', statuses: ['in-progress'] },
  { id: 'complete', title: 'Complete', color: '#22C55E', statuses: ['completed'] },
];

const STATUS_FROM_COLUMN: Record<string, WOStatus> = {
  pending: 'queued',
  'in-progress': 'in-progress',
  complete: 'completed',
};

const TYPE_OPTIONS = ['flower', 'preroll', 'vaporizer', 'concentrate'] as const;
const PRIORITY_OPTIONS = ['critical', 'high', 'medium', 'low'] as const;

export function WorkOrderBoard() {
  const { data: orders, isLoading } = useWorkOrders();
  const { selectWorkOrder } = useManufacturingStore();
  const [localOrders, setLocalOrders] = useState<WorkOrder[] | null>(null);
  const [filterType, setFilterType] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const filtered = useMemo(() => {
    const source = localOrders ?? orders ?? [];
    let result = [...source];
    if (filterType) result = result.filter((o) => o.type === filterType);
    if (filterPriority) result = result.filter((o) => o.priority === filterPriority);
    return result;
  }, [localOrders, orders, filterType, filterPriority]);

  const columns = COLUMN_CONFIG.map((col) => ({
    id: col.id,
    title: col.title,
    color: col.color,
    items: filtered.filter((o) => col.statuses.includes(o.status)),
  }));

  const handleDragEnd = (itemId: string, _fromCol: string, toCol: string) => {
    const source = localOrders ?? orders ?? [];
    const newStatus = STATUS_FROM_COLUMN[toCol];
    if (!newStatus) return;
    setLocalOrders(
      source.map((o) => (o.id === itemId ? { ...o, status: newStatus } : o))
    );
  };

  if (isLoading) return <LoadingSkeleton variant="card" count={6} />;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-default bg-card px-3 py-1.5 text-xs text-text-default"
        >
          <option value="">All Types</option>
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="rounded-lg border border-default bg-card px-3 py-1.5 text-xs text-text-default"
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Kanban */}
      <KanbanBase<WorkOrder>
        columns={columns}
        renderCard={(order) => (
          <div onClick={() => selectWorkOrder(order.id)} className="cursor-pointer">
            <WorkOrderCard order={order} />
          </div>
        )}
        onDragEnd={handleDragEnd}
        emptyColumnMessage="No work orders"
      />

      {/* Detail Drawer */}
      <WorkOrderDetail />
    </div>
  );
}
