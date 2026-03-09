'use client';

import { useState, useMemo } from 'react';
import { CalendarDays, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SupportVendorDayProps {
  className?: string;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TIME_SLOTS = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
] as const;

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function SupportVendorDay({ className }: SupportVendorDayProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // March 2026 calendar
  const year = 2026;
  const month = 2; // 0-indexed

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: Array<{ date: Date } | null> = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ date: new Date(year, month, d) });
    }

    return days;
  }, []);

  const monthName = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  function handleRequestVisit() {
    if (!selectedDate || !selectedTime) return;
    setIsConfirmed(true);
  }

  function handleReset() {
    setIsConfirmed(false);
    setSelectedDate(null);
    setSelectedTime(null);
  }

  if (isConfirmed) {
    return (
      <div className={cn('space-y-4', className)}>
        <h2 className="font-display text-sm font-semibold text-text-bright">
          Schedule a Vendor Day
        </h2>
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border-default bg-card p-8">
          <CheckCircle className="h-10 w-10 text-green-500" />
          <p className="text-sm font-medium text-text-bright">
            Visit request sent!
          </p>
          <p className="text-xs text-text-muted">
            {selectedDate} at {selectedTime}
          </p>
          <p className="text-xs text-text-muted">
            Your sales rep will confirm the visit within 24 hours.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 rounded-lg bg-accent-primary/15 px-4 py-2 text-xs font-medium text-accent-primary transition-colors hover:bg-accent-primary/25"
          >
            Schedule Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="font-display text-sm font-semibold text-text-bright">
        Schedule a Vendor Day
      </h2>

      <div className="rounded-xl border border-border-default bg-card p-5">
        {/* Month header */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <CalendarDays className="h-4 w-4 text-accent-primary" />
          <span className="text-sm font-semibold text-text-bright">
            {monthName}
          </span>
        </div>

        {/* Weekday headers */}
        <div className="mb-2 grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-1 text-[10px] font-medium text-text-muted"
            >
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
            const isSelected = selectedDate === dateKey;
            const isToday = dateKey === '2026-03-09';
            const dayOfWeek = entry.date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isPast = entry.date.getDate() < 9;

            return (
              <button
                key={dateKey}
                type="button"
                disabled={isWeekend || isPast}
                onClick={() => setSelectedDate(dateKey)}
                className={cn(
                  'flex aspect-square items-center justify-center rounded-lg text-xs transition-colors',
                  isSelected
                    ? 'bg-accent-primary/20 text-accent-primary ring-1 ring-accent-primary/40'
                    : isWeekend || isPast
                      ? 'text-text-muted/30 cursor-not-allowed'
                      : 'text-text-muted hover:bg-elevated hover:text-text-default',
                  isToday && !isSelected && 'ring-1 ring-accent-primary/30 font-bold'
                )}
              >
                {entry.date.getDate()}
              </button>
            );
          })}
        </div>

        {/* Time slots */}
        {selectedDate && (
          <div className="mt-4 border-t border-border-default pt-4">
            <div className="mb-2 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-text-muted" />
              <span className="text-xs font-medium text-text-muted">
                Select a time
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={cn(
                    'rounded-lg px-2 py-2 text-xs font-medium transition-colors',
                    selectedTime === slot
                      ? 'bg-accent-primary/20 text-accent-primary ring-1 ring-accent-primary/40'
                      : 'bg-elevated text-text-muted hover:text-text-default'
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Request button */}
        <button
          type="button"
          onClick={handleRequestVisit}
          disabled={!selectedDate || !selectedTime}
          className={cn(
            'mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5',
            'text-sm font-medium transition-colors',
            selectedDate && selectedTime
              ? 'bg-accent-primary text-white hover:bg-accent-primary/90'
              : 'bg-elevated text-text-muted cursor-not-allowed'
          )}
        >
          <CalendarDays className="h-4 w-4" />
          Request Visit
        </button>
      </div>
    </div>
  );
}
