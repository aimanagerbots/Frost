'use client';

import { Calendar } from 'lucide-react';
import type { Equipment } from '../../types';

function maintenanceColor(nextDue: string): string {
  const now = new Date();
  const due = new Date(nextDue);
  const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil < 0) return '#EF4444';
  if (daysUntil <= 7) return '#FBBF24';
  return '#22C55E';
}

export function MaintenanceSchedule({ equipment }: { equipment: Equipment[] }) {
  const upcoming = [...equipment]
    .sort((a, b) => new Date(a.nextMaintenanceDue).getTime() - new Date(b.nextMaintenanceDue).getTime())
    .slice(0, 8);

  return (
    <div className="rounded-xl border border-default bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-text-muted" />
        <h3 className="text-sm font-semibold text-text-bright">Upcoming Maintenance</h3>
      </div>
      <div className="space-y-2">
        {upcoming.map((item) => {
          const color = maintenanceColor(item.nextMaintenanceDue);
          const daysUntil = Math.ceil(
            (new Date(item.nextMaintenanceDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          return (
            <div key={item.id} className="flex items-center justify-between rounded-lg bg-elevated px-3 py-2">
              <div>
                <p className="text-xs font-medium text-text-bright">{item.name}</p>
                <p className="text-[10px] text-text-muted">{item.productionLineName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs" style={{ color }}>
                  {daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : `${daysUntil}d`}
                </p>
                <p className="text-[10px] text-text-muted">
                  {new Date(item.nextMaintenanceDue).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
