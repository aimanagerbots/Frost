'use client';

import { StatusBadge } from '@/components';
import type { Equipment } from '../../types';

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
  operational: 'success',
  'needs-maintenance': 'warning',
  down: 'danger',
  'in-maintenance': 'info',
};

function maintenanceUrgency(nextDue: string): { color: string; label: string } {
  const now = new Date();
  const due = new Date(nextDue);
  const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil < 0) return { color: '#EF4444', label: `Overdue ${Math.abs(daysUntil)}d` };
  if (daysUntil <= 7) return { color: '#FBBF24', label: `Due in ${daysUntil}d` };
  return { color: '#22C55E', label: `Due in ${daysUntil}d` };
}

export function EquipmentCard({ item }: { item: Equipment }) {
  const urgency = maintenanceUrgency(item.nextMaintenanceDue);

  return (
    <div className="rounded-xl border border-default bg-card p-4 space-y-2">
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-medium text-text-bright">{item.name}</h4>
        <StatusBadge
          variant={STATUS_VARIANT[item.status] ?? 'default'}
          label={item.status.replace('-', ' ')}
          size="sm"
          dot
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
        <div>
          <p className="text-[10px] uppercase tracking-wider">Hours Since Service</p>
          <p className="text-text-default">{item.hoursSinceLastMaintenance}h</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider">Lifetime Hours</p>
          <p className="text-text-default">{item.lifetimeHours.toLocaleString()}h</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider">Last Maintained</p>
          <p className="text-text-default">{new Date(item.lastMaintained).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider">Next Due</p>
          <p style={{ color: urgency.color }}>{urgency.label}</p>
        </div>
      </div>

      {item.notes && (
        <p className="text-[10px] italic text-text-muted">{item.notes}</p>
      )}
    </div>
  );
}
