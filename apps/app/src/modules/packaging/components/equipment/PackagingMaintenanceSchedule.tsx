'use client';

import { Calendar } from 'lucide-react';
import { AccentCard } from '@/components';
import type { PackagingEquipment } from '../../types';

const ACCENT = '#84CC16';

function daysUntil(nextDue: string): number {
  return Math.ceil((new Date(nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
}

function urgencyColor(days: number): string {
  if (days < 0) return '#EF4444';
  if (days <= 7) return '#FBBF24';
  return ACCENT;
}

function urgencyLabel(days: number): string {
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Due today';
  return `${days}d`;
}

const STATUS_DOT: Record<string, string> = {
  operational: '#22C55E',
  'needs-maintenance': '#FBBF24',
  down: '#EF4444',
  'in-maintenance': '#38BDF8',
};

interface PackagingMaintenanceScheduleProps {
  equipment: PackagingEquipment[];
}

export function PackagingMaintenanceSchedule({ equipment }: PackagingMaintenanceScheduleProps) {
  // Only show overdue or due within 14 days, sorted soonest first
  const upcoming = [...equipment]
    .filter((e) => daysUntil(e.nextMaintenanceDue) <= 14)
    .sort(
      (a, b) =>
        new Date(a.nextMaintenanceDue).getTime() - new Date(b.nextMaintenanceDue).getTime()
    );

  return (
    <AccentCard accentColor={ACCENT} className="p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-text-muted" />
        <h3 className="text-sm font-semibold text-text-bright">Maintenance Schedule</h3>
        {upcoming.length > 0 && (
          <span
            className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}
          >
            {upcoming.length}
          </span>
        )}
      </div>

      {upcoming.length === 0 ? (
        <p className="text-xs text-text-muted italic">No maintenance due in the next 14 days.</p>
      ) : (
        <div className="space-y-2">
          {upcoming.map((item) => {
            const days = daysUntil(item.nextMaintenanceDue);
            const color = urgencyColor(days);
            const dotColor = STATUS_DOT[item.status] ?? '#64748B';

            return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-elevated px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-text-bright truncate">{item.name}</p>
                    <p className="text-[10px] text-text-muted">{item.packagingLineName}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <p className="text-xs font-semibold" style={{ color }}>
                    {urgencyLabel(days)}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {new Date(item.nextMaintenanceDue).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AccentCard>
  );
}
