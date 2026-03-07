'use client';

import { cn } from '@/lib/utils';
import { Clock, Users } from 'lucide-react';
import type { CalendarEvent } from '../types';

const HOUR_START = 6;
const HOUR_END = 22;
const HOUR_HEIGHT = 64; // px per hour row

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseTime(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h + m / 60;
}

export function DayView({ currentDate, events, onSelectEvent }: DayViewProps) {
  const dateStr = toDateStr(currentDate);
  const dayEvents = events.filter((e) => e.date === dateStr);
  const allDayEvents = dayEvents.filter((e) => e.allDay);
  const timedEvents = dayEvents.filter((e) => !e.allDay && e.startTime);
  const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

  return (
    <div className="rounded-xl border border-default bg-card overflow-hidden">
      {/* All-day section */}
      {allDayEvents.length > 0 && (
        <div className="border-b border-default p-3">
          <span className="mb-2 block text-[10px] uppercase tracking-wide text-text-muted">All Day</span>
          <div className="flex flex-wrap gap-2">
            {allDayEvents.map((ev) => (
              <button
                key={ev.id}
                onClick={() => onSelectEvent(ev)}
                className="rounded-lg px-3 py-1.5 text-left text-sm font-medium text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: ev.color }}
              >
                {ev.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hourly timeline */}
      <div className="max-h-[640px] overflow-y-auto">
        <div className="relative">
          {/* Hour rows */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid border-b border-default/50"
              style={{ gridTemplateColumns: '64px 1fr', height: `${HOUR_HEIGHT}px` }}
            >
              <div className="flex items-start justify-end border-r border-default pr-2 pt-1">
                <span className="text-[11px] text-text-muted">
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </span>
              </div>
              <div />
            </div>
          ))}

          {/* Positioned events */}
          <div
            className="pointer-events-none absolute inset-0 grid"
            style={{ gridTemplateColumns: '64px 1fr' }}
          >
            <div />
            <div className="relative">
              {timedEvents.map((ev) => {
                const start = parseTime(ev.startTime!);
                const end = ev.endTime ? parseTime(ev.endTime) : start + 1;
                const top = (start - HOUR_START) * HOUR_HEIGHT;
                const height = Math.max((end - start) * HOUR_HEIGHT, 32);

                return (
                  <button
                    key={ev.id}
                    onClick={() => onSelectEvent(ev)}
                    className={cn(
                      'pointer-events-auto absolute left-1 right-4 overflow-hidden rounded-lg border border-white/10 p-2.5 text-left transition-opacity hover:opacity-80'
                    )}
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      backgroundColor: `${ev.color}CC`,
                    }}
                  >
                    <span className="block text-sm font-semibold text-white">{ev.title}</span>
                    <div className="mt-0.5 flex items-center gap-3">
                      {ev.startTime && (
                        <span className="flex items-center gap-1 text-xs text-white/70">
                          <Clock className="h-3 w-3" />
                          {ev.startTime}
                          {ev.endTime && <> &ndash; {ev.endTime}</>}
                        </span>
                      )}
                      {ev.attendees && ev.attendees.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-white/70">
                          <Users className="h-3 w-3" />
                          {ev.attendees.length}
                        </span>
                      )}
                    </div>
                    {height > 60 && ev.description && (
                      <p className="mt-1 text-xs text-white/60 line-clamp-2">{ev.description}</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
