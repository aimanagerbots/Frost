'use client';

import { useState } from 'react';
import { CalendarClock, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalDelivery } from '@/modules/portal/shared/types';

interface DeliveriesRescheduleProps {
  delivery: PortalDelivery;
  onReschedule: (
    deliveryId: string,
    newDate: string,
    newWindow: string
  ) => void;
  className?: string;
}

const WINDOW_OPTIONS = [
  { value: '8:00 AM - 12:00 PM', label: 'Morning (8 AM - 12 PM)' },
  { value: '12:00 PM - 5:00 PM', label: 'Afternoon (12 PM - 5 PM)' },
  { value: '5:00 PM - 9:00 PM', label: 'Evening (5 PM - 9 PM)' },
];

export function DeliveriesReschedule({
  delivery,
  onReschedule,
  className,
}: DeliveriesRescheduleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newWindow, setNewWindow] = useState(WINDOW_OPTIONS[0].value);

  function handleSubmit() {
    if (!newDate) return;
    onReschedule(delivery.id, newDate, newWindow);
    setIsExpanded(false);
    setNewDate('');
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-border-default bg-card overflow-hidden',
        className
      )}
    >
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-elevated"
      >
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-accent-primary" />
          <span className="text-sm font-medium text-text-bright">
            Reschedule {delivery.orderNumber}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-text-muted" />
        ) : (
          <ChevronDown className="h-4 w-4 text-text-muted" />
        )}
      </button>

      {/* Collapsible form */}
      {isExpanded && (
        <div className="space-y-4 border-t border-border-default p-4">
          {/* Date input */}
          <div className="space-y-1.5">
            <label
              htmlFor={`reschedule-date-${delivery.id}`}
              className="text-xs font-medium text-text-muted"
            >
              New Date
            </label>
            <input
              id={`reschedule-date-${delivery.id}`}
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min="2026-03-09"
              className={cn(
                'w-full rounded-lg border border-border-default bg-elevated px-3 py-2 text-sm text-text-default',
                'focus:outline-none focus:ring-1 focus:ring-accent-primary/50'
              )}
            />
          </div>

          {/* Window dropdown */}
          <div className="space-y-1.5">
            <label
              htmlFor={`reschedule-window-${delivery.id}`}
              className="text-xs font-medium text-text-muted"
            >
              Delivery Window
            </label>
            <select
              id={`reschedule-window-${delivery.id}`}
              value={newWindow}
              onChange={(e) => setNewWindow(e.target.value)}
              className={cn(
                'w-full rounded-lg border border-border-default bg-elevated px-3 py-2 text-sm text-text-default',
                'focus:outline-none focus:ring-1 focus:ring-accent-primary/50'
              )}
            >
              {WINDOW_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!newDate}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              newDate
                ? 'bg-accent-primary/15 text-accent-primary hover:bg-accent-primary/25'
                : 'bg-elevated text-text-muted/30 cursor-not-allowed'
            )}
          >
            <CalendarClock className="h-4 w-4" />
            Reschedule Delivery
          </button>
        </div>
      )}
    </div>
  );
}
