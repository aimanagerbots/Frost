'use client';

import { AccentCard, StatusBadge } from '@/components';
import type { PackagingEquipment } from '../../types';

const ACCENT = '#84CC16';

const STATUS_ACCENT: Record<string, string> = {
  operational: '#22C55E',
  'needs-maintenance': '#FBBF24',
  down: '#EF4444',
  'in-maintenance': '#38BDF8',
};

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
  return { color: ACCENT, label: `Due in ${daysUntil}d` };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function PackagingEquipmentCard({ item }: { item: PackagingEquipment }) {
  const urgency = maintenanceUrgency(item.nextMaintenanceDue);

  return (
    <AccentCard accentColor={STATUS_ACCENT[item.status] ?? '#64748B'} className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-medium text-text-bright">{item.name}</h4>
          <p className="text-[10px] text-text-muted">{item.packagingLineName}</p>
        </div>
        <StatusBadge
          variant={STATUS_VARIANT[item.status] ?? 'default'}
          label={item.status.replace(/-/g, ' ')}
          size="sm"
          dot
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Last Maintained</p>
          <p className="text-text-default">{formatDate(item.lastMaintained)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Next Due</p>
          <p style={{ color: urgency.color }}>{urgency.label}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Hours Since Service</p>
          <p className="text-text-default">{item.hoursSinceLastMaintenance}h</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Lifetime Hours</p>
          <p className="text-text-default">{item.lifetimeHours.toLocaleString()}h</p>
        </div>
      </div>

      {/* Notes */}
      {item.notes && (
        <p className="text-[10px] italic text-text-muted">{item.notes}</p>
      )}
    </AccentCard>
  );
}
