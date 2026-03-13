'use client';

import { useState, useMemo } from 'react';
import { KanbanBase, LoadingSkeleton } from '@/components';
import { usePackagingOrders } from '../../hooks';
import { usePackagingStore } from '../../store';
import { PackagingWorkOrderCard } from './PackagingWorkOrderCard';
import { PackagingDrawer } from '../PackagingDrawer';
import type { PackagingOrder } from '../../types';

const ACCENT = '#84CC16';

const BOARD_COLUMNS = [
  { id: 'queued', title: 'Queued', color: '#FBBF24', statuses: ['queued'] },
  { id: 'in-progress', title: 'In Progress', color: ACCENT, statuses: ['in-progress'] },
  { id: 'completed', title: 'Complete', color: '#22C55E', statuses: ['completed'] },
  { id: 'blocked-material', title: 'Blocked', color: '#EF4444', statuses: ['blocked-material'] },
] as const;

const CATEGORY_OPTIONS = ['flower', 'preroll', 'vaporizer', 'concentrate'] as const;
const PRIORITY_OPTIONS = ['critical', 'high', 'medium', 'low'] as const;

export function PackagingWorkOrderBoard() {
  const { data: orders, isLoading } = usePackagingOrders();
  const { selectedOrderId, selectOrder } = usePackagingStore();
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [localOrders, setLocalOrders] = useState<PackagingOrder[] | null>(null);

  // Reset local orders when server data changes
  const ordersKey = (orders ?? []).map((o) => o.id).join(',');
  const [prevKey, setPrevKey] = useState(ordersKey);
  if (ordersKey !== prevKey) {
    setLocalOrders(null);
    setPrevKey(ordersKey);
  }

  const filtered = useMemo(() => {
    const source = localOrders ?? orders ?? [];
    let result = [...source];
    if (filterCategory) result = result.filter((o) => o.category === filterCategory);
    if (filterPriority) result = result.filter((o) => o.priority === filterPriority);
    return result;
  }, [localOrders, orders, filterCategory, filterPriority]);

  const boardColumns = useMemo(
    () =>
      BOARD_COLUMNS.map((col) => ({
        id: col.id,
        title: col.title,
        color: col.color,
        items: filtered.filter((o) => (col.statuses as readonly string[]).includes(o.status)),
      })),
    [filtered]
  );

  function handleDragEnd(itemId: string, _fromCol: string, toCol: string) {
    const source = localOrders ?? orders ?? [];
    setLocalOrders(
      source.map((o) =>
        o.id === itemId ? { ...o, status: toCol as PackagingOrder['status'] } : o
      )
    );
  }

  const selectedOrder = useMemo(
    () => (orders ?? []).find((o) => o.id === selectedOrderId) ?? null,
    [orders, selectedOrderId]
  );

  if (isLoading) return <LoadingSkeleton variant="card" count={6} />;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-xl bg-card px-3 py-1.5 text-xs text-text-default"
        >
          <option value="">All Categories</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="rounded-xl bg-card px-3 py-1.5 text-xs text-text-default"
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Kanban */}
      <KanbanBase<PackagingOrder>
        columns={boardColumns}
        renderCard={(order) => (
          <div
            onClick={() => selectOrder(order.id)}
            className="cursor-pointer"
          >
            <PackagingWorkOrderCard order={order} />
          </div>
        )}
        onDragEnd={handleDragEnd}
        emptyColumnMessage="No packaging orders"
        fullWidth
      />

      {/* Drawer */}
      <PackagingDrawer
        order={selectedOrder}
        open={!!selectedOrderId}
        onClose={() => selectOrder(null)}
      />
    </div>
  );
}
