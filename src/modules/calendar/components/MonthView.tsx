'use client';

import { cn } from '@/lib/utils';
import { EventCard } from './EventCard';
import type { CalendarEvent, CalendarDay } from '../types';

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_VISIBLE_EVENTS = 3;

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

function getMonthGrid(year: number, month: number, events: CalendarEvent[]): CalendarDay[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay(); // 0=Sun
  const totalDays = lastDay.getDate();

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Build a lookup of events by date string
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const existing = eventsByDate.get(ev.date) ?? [];
    existing.push(ev);
    eventsByDate.set(ev.date, existing);
  }

  const cells: CalendarDay[] = [];

  // Previous month fill
  const prevMonthLast = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    const day = prevMonthLast - i;
    const d = new Date(year, month - 1, day);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    cells.push({
      date: d,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
      events: eventsByDate.get(dateStr) ?? [],
    });
  }

  // Current month
  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, month, day);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    cells.push({
      date: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      events: eventsByDate.get(dateStr) ?? [],
    });
  }

  // Next month fill to complete last row
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(year, month + 1, day);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      cells.push({
        date: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        events: eventsByDate.get(dateStr) ?? [],
      });
    }
  }

  // Chunk into rows of 7
  const rows: CalendarDay[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return rows;
}

export function MonthView({ currentDate, events, onSelectDate, onSelectEvent }: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const grid = getMonthGrid(year, month, events);

  return (
    <div className="rounded-xl border border-default bg-card overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-default">
        {DAY_HEADERS.map((day) => (
          <div
            key={day}
            className="px-2 py-2 text-center text-xs font-medium text-text-muted uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid rows */}
      {grid.map((row, ri) => (
        <div key={ri} className="grid grid-cols-7 border-b border-default last:border-b-0">
          {row.map((cell, ci) => {
            const overflow = cell.events.length - MAX_VISIBLE_EVENTS;
            return (
              <button
                key={ci}
                onClick={() => onSelectDate(cell.date)}
                className={cn(
                  'relative flex min-h-[100px] flex-col border-r border-default p-1.5 text-left transition-colors hover:bg-elevated last:border-r-0',
                  !cell.isCurrentMonth && 'bg-base/50'
                )}
              >
                {/* Date number */}
                <span
                  className={cn(
                    'mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs',
                    cell.isToday
                      ? 'bg-[#3B82F6] font-bold text-white'
                      : cell.isCurrentMonth
                        ? 'text-text-default'
                        : 'text-text-muted/50'
                  )}
                >
                  {cell.date.getDate()}
                </span>

                {/* Events */}
                <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                  {cell.events.slice(0, MAX_VISIBLE_EVENTS).map((ev) => (
                    <EventCard
                      key={ev.id}
                      event={ev}
                      compact
                      onClick={(e) => {
                        // Stop propagation so the cell click doesn't fire
                        onSelectEvent(e);
                      }}
                    />
                  ))}
                  {overflow > 0 && (
                    <span className="mt-0.5 text-[10px] font-medium text-text-muted px-1">
                      +{overflow} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
