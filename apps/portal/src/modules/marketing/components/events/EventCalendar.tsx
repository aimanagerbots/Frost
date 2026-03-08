'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Event, EventType } from '../../types/seo-events';

const EVENT_TYPE_COLORS: Record<EventType, string> = {
  'vendor-day': '#22C55E',
  'trade-show': '#3B82F6',
  'pop-up': '#8B5CF6',
  'internal': '#64748B',
  'webinar': '#06B6D4',
  'industry-event': '#667EEA',
};

const ACCENT = '#EC4899';
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface EventCalendarProps {
  events: Event[];
  onSelectEvent: (id: string) => void;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function parseDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00');
}

export function EventCalendar({ events, onSelectEvent }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = useMemo(() => new Date(), []);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: { date: Date; inMonth: boolean }[] = [];

    // Days from previous month
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), inMonth: false });
    }

    // Days in current month
    for (let d = 1; d <= totalDays; d++) {
      days.push({ date: new Date(year, month, d), inMonth: true });
    }

    // Fill remaining cells to complete the grid (always 42 cells = 6 rows)
    while (days.length < 42) {
      const nextDate = days.length - startOffset - totalDays + 1;
      days.push({ date: new Date(year, month + 1, nextDate), inMonth: false });
    }

    return days;
  }, [currentMonth]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();

    for (const event of events) {
      const startDate = parseDate(event.date);
      const key = `${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(event);

      // Also show on end date if multi-day
      if (event.endDate) {
        const endDate = parseDate(event.endDate);
        const endKey = `${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()}`;
        if (endKey !== key) {
          if (!map.has(endKey)) map.set(endKey, []);
          map.get(endKey)!.push(event);
        }
      }
    }

    return map;
  }, [events]);

  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goPrev = () => setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const goNext = () => setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  return (
    <div className="rounded-xl border border-default bg-card p-4">
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={goPrev}
          className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-elevated hover:text-text-bright"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-sm font-semibold text-text-bright">{monthLabel}</h3>
        <button
          onClick={goNext}
          className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-elevated hover:text-text-bright"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-px mb-px">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-2 text-center text-[11px] font-medium uppercase tracking-wider text-text-muted">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-px">
        {calendarDays.map(({ date, inMonth }, idx) => {
          const isToday = isSameDay(date, today);
          const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          const dayEvents = eventsByDate.get(dateKey) ?? [];

          return (
            <div
              key={idx}
              className={`min-h-[72px] rounded-lg p-1.5 transition-colors ${
                inMonth ? 'bg-elevated' : 'bg-elevated/40'
              } ${isToday ? 'ring-1' : ''}`}
              style={isToday ? { boxShadow: `inset 0 0 0 1px ${ACCENT}` } : undefined}
            >
              <span className={`text-[11px] font-medium ${inMonth ? 'text-text-bright' : 'text-text-muted/50'}`}>
                {date.getDate()}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {dayEvents.slice(0, 3).map((evt) => (
                  <button
                    key={`${evt.id}-${idx}`}
                    onClick={() => onSelectEvent(evt.id)}
                    className="block w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium leading-tight transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: `${EVENT_TYPE_COLORS[evt.type]}20`,
                      color: EVENT_TYPE_COLORS[evt.type],
                    }}
                    title={evt.name}
                  >
                    {evt.name}
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <span className="block text-[10px] text-text-muted">+{dayEvents.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
