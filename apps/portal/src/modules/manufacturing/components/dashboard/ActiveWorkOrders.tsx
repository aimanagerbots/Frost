'use client';

import { StatusBadge } from '@/components';
import { useWorkOrders } from '../../hooks';
import { useManufacturingStore } from '../../store';

const ACCENT = '#10B981';

const TYPE_COLORS: Record<string, string> = {
  flower: '#22C55E',
  preroll: '#84CC16',
  vaporizer: '#06B6D4',
  concentrate: '#F59E0B',
  edible: '#EC4899',
  beverage: '#8B5CF6',
};

export function ActiveWorkOrders() {
  const { data: orders } = useWorkOrders({ status: 'in-progress' });
  const { setView, selectWorkOrder } = useManufacturingStore();

  const active = orders?.slice(0, 6) ?? [];

  function handleClick(id: string) {
    selectWorkOrder(id);
    setView('work-orders');
  }

  return (
    <div className="rounded-xl border border-default bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-text-bright">Active Work Orders</h3>
      {active.length === 0 ? (
        <p className="py-4 text-center text-xs text-text-muted">No active work orders</p>
      ) : (
        <div className="space-y-2">
          {active.map((wo) => (
            <button
              key={wo.id}
              onClick={() => handleClick(wo.id)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-elevated"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-text-bright">{wo.title}</span>
                  <span
                    className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: `${TYPE_COLORS[wo.type] ?? '#666'}20`,
                      color: TYPE_COLORS[wo.type] ?? '#666',
                    }}
                  >
                    {wo.pipelineType}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                  <span>{wo.workers.join(', ')}</span>
                  <span>&#183;</span>
                  <span>ETA {new Date(wo.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <div className="flex w-24 flex-col items-end gap-1">
                <StatusBadge variant="info" label={`${wo.progress}%`} size="sm" />
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${wo.progress}%`, backgroundColor: ACCENT }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
