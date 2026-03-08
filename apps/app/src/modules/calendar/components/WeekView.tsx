'use client';

import { cn } from '@/lib/utils';
import type { CalendarEvent } from '../types';

const HOUR_START = 6;
const HOUR_END = 22;
const HOUR_HEIGHT = 56; // px per hour row
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

function getWeekDates(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay()); // Sunday
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseTime(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h + m / 60;
}

function isToday(d: Date): boolean {
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export function WeekView({ currentDate, events, onSelectEvent }: WeekViewProps) {
  const weekDates = getWeekDates(currentDate);
  const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

  // Bucket events by date
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const list = eventsByDate.get(ev.date) ?? [];
    list.push(ev);
    eventsByDate.set(ev.date, list);
  }

  // Separate all-day and timed events per day
  const allDayByDate = new Map<string, CalendarEvent[]>();
  const timedByDate = new Map<string, CalendarEvent[]>();
  for (const d of weekDates) {
    const ds = toDateStr(d);
    const dayEvents = eventsByDate.get(ds) ?? [];
    allDayByDate.set(ds, dayEvents.filter((e) => e.allDay));
    timedByDate.set(ds, dayEvents.filter((e) => !e.allDay && e.startTime));
  }

  return (
    <div className="rounded-xl border border-default bg-card overflow-hidden">
      {/* Header row */}
      <div className="grid border-b border-default" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
        <div className="border-r border-default" />
        {weekDates.map((d, i) => (
          <div
            key={i}
            className={cn(
              'flex flex-col items-center py-2 border-r border-default last:border-r-0',
              isToday(d) && 'bg-[#5BB8E6]/10'
            )}
          >
            <span className="text-[10px] uppercase text-text-muted">{DAY_NAMES[d.getDay()]}</span>
            <span
              className={cn(
                'mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                isToday(d) ? 'bg-[#5BB8E6] text-white' : 'text-text-default'
              )}
            >
              {d.getDate()}
            </span>
          </div>
        ))}
      </div>

      {/* All-day row */}
      <div
        className="grid min-h-[32px] border-b border-default"
        style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}
      >
        <div className="flex items-center justify-end border-r border-default pr-2">
          <span className="text-[10px] text-text-muted">ALL DAY</span>
        </div>
        {weekDates.map((d, i) => {
          const ds = toDateStr(d);
          const allDay = allDayByDate.get(ds) ?? [];
          return (
            <div key={i} className="flex flex-col gap-0.5 border-r border-default p-1 last:border-r-0">
              {allDay.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => onSelectEvent(ev)}
                  className="truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: ev.color }}
                >
                  {ev.title}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {/* Time grid (scrollable) */}
      <div className="max-h-[600px] overflow-y-auto">
        <div className="relative" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
          {/* Hour rows */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid border-b border-default/50"
              style={{ gridTemplateColumns: '56px repeat(7, 1fr)', height: `${HOUR_HEIGHT}px` }}
            >
              <div className="flex items-start justify-end border-r border-default pr-2 pt-0.5">
                <span className="text-[10px] text-text-muted">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </span>
              </div>
              {weekDates.map((_, ci) => (
                <div key={ci} className="border-r border-default/30 last:border-r-0" />
              ))}
            </div>
          ))}

          {/* Positioned events overlay */}
          <div
            className="pointer-events-none absolute inset-0 grid"
            style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}
          >
            {/* Skip gutter */}
            <div />
            {weekDates.map((d, di) => {
              const ds = toDateStr(d);
              const timed = timedByDate.get(ds) ?? [];
              return (
                <div key={di} className="relative">
                  {timed.map((ev) => {
                    const start = parseTime(ev.startTime!);
                    const end = ev.endTime ? parseTime(ev.endTime) : start + 1;
                    const top = (start - HOUR_START) * HOUR_HEIGHT;
                    const height = Math.max((end - start) * HOUR_HEIGHT, 20);
                    return (
                      <button
                        key={ev.id}
                        onClick={() => onSelectEvent(ev)}
                        className="pointer-events-auto absolute left-0.5 right-1 overflow-hidden rounded border border-white/10 px-1.5 py-0.5 text-left transition-opacity hover:opacity-80"
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          backgroundColor: `${ev.color}CC`,
                        }}
                      >
                        <span className="block truncate text-[11px] font-medium text-white">
                          {ev.title}
                        </span>
                        {height > 30 && (
                          <span className="block text-[10px] text-white/70">
                            {ev.startTime} &ndash; {ev.endTime}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
