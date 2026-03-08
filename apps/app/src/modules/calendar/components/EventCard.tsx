'use client';

import { Clock } from 'lucide-react';
import { AccentCard, StatusBadge } from '@/components';
import type { CalendarEvent, EventType } from '../types';

const TYPE_VARIANT: Record<EventType, 'info' | 'success' | 'warning' | 'danger' | 'muted'> = {
  delivery: 'info',
  harvest: 'success',
  meeting: 'info',
  production: 'success',
  'vendor-day': 'warning',
  'task-due': 'muted',
};

interface EventCardProps {
  event: CalendarEvent;
  compact?: boolean;
  onClick?: (event: CalendarEvent) => void;
}

export function EventCard({ event, compact = false, onClick }: EventCardProps) {
  const handleClick = () => onClick?.(event);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(event);
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="flex w-full items-center gap-1.5 rounded px-1 py-0.5 text-left text-[11px] leading-tight text-text-default transition-colors hover:bg-accent-hover"
      >
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: event.color }}
        />
        <span className="truncate">{event.title}</span>
      </button>
    );
  }

  return (
    <AccentCard accentColor={event.color} onClick={handleClick} className="p-3">
      <span className="text-sm font-medium text-text-bright">{event.title}</span>
      <div className="mt-1 flex items-center gap-2">
        {event.startTime && (
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Clock className="h-3 w-3" />
            {event.startTime}
            {event.endTime && <> &ndash; {event.endTime}</>}
          </span>
        )}
        <StatusBadge
          variant={TYPE_VARIANT[event.type]}
          label={event.type.replace('-', ' ')}
          size="sm"
        />
      </div>
    </AccentCard>
  );
}
