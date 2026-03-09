'use client';

import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalDelivery } from '@/modules/portal/shared/types';

interface DeliveriesCalendarProps {
  deliveries: PortalDelivery[];
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const STATUS_DOT_COLOR: Record<PortalDelivery['status'], string> = {
  scheduled: 'bg-blue-500',
  'in-transit': 'bg-amber-500',
  delivered: 'bg-green-500',
  rescheduled: 'bg-purple-500',
};

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function DeliveriesCalendar({
  deliveries,
  onDateSelect,
  selectedDate,
}: DeliveriesCalendarProps) {
  // Current month: March 2026
  const year = 2026;
  const month = 2; // 0-indexed, March

  const deliveriesByDate = useMemo(() => {
    const map = new Map<string, PortalDelivery[]>();
    for (const d of deliveries) {
      const key = d.scheduledDate.slice(0, 10);
      const existing = map.get(key);
      if (existing) {
        existing.push(d);
      } else {
        map.set(key, [d]);
      }
    }
    return map;
  }, [deliveries]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: Array<{ date: Date; isCurrentMonth: boolean } | null> = [];

    // Leading empty slots
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }

    return days;
  }, []);

  const monthName = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-text-bright">
        Delivery Calendar
      </h2>

      <div className="rounded-xl border border-border-default bg-card p-5">
        {/* Month header */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            disabled
            className="rounded-lg p-1.5 text-text-muted/30 cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-text-bright">
            {monthName}
          </span>
          <button
            type="button"
            disabled
            className="rounded-lg p-1.5 text-text-muted/30 cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="mb-2 grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-1 text-[10px] font-medium text-text-muted">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((entry, index) => {
            if (!entry) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateKey = toDateKey(entry.date);
            const dayDeliveries = deliveriesByDate.get(dateKey) ?? [];
            const isSelected = selectedDate === dateKey;
            const hasDeliveries = dayDeliveries.length > 0;
            const isToday = dateKey === '2026-03-09';

            // Collect unique statuses for dots
            const uniqueStatuses = [
              ...new Set(dayDeliveries.map((d) => d.status)),
            ];

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => onDateSelect(dateKey)}
                className={cn(
                  'relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-colors',
                  isSelected
                    ? 'bg-accent-primary/20 text-accent-primary ring-1 ring-accent-primary/40'
                    : hasDeliveries
                      ? 'hover:bg-elevated text-text-default'
                      : 'text-text-muted hover:bg-elevated/50',
                  isToday && !isSelected && 'ring-1 ring-accent-primary/30'
                )}
              >
                <span className={cn('text-xs', isToday && 'font-bold')}>
                  {entry.date.getDate()}
                </span>

                {/* Status dots */}
                {uniqueStatuses.length > 0 && (
                  <div className="mt-0.5 flex items-center gap-0.5">
                    {uniqueStatuses.slice(0, 3).map((status) => (
                      <span
                        key={status}
                        className={cn(
                          'h-1 w-1 rounded-full',
                          STATUS_DOT_COLOR[status]
                        )}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border-default pt-3">
          {(
            [
              ['scheduled', 'Scheduled', 'bg-blue-500'],
              ['in-transit', 'In Transit', 'bg-amber-500'],
              ['delivered', 'Delivered', 'bg-green-500'],
              ['rescheduled', 'Rescheduled', 'bg-purple-500'],
            ] as const
          ).map(([, label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={cn('h-1.5 w-1.5 rounded-full', color)} />
              <span className="text-[10px] text-text-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
