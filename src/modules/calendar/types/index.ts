// Calendar Domain Types

export type EventType = 'delivery' | 'harvest' | 'meeting' | 'production' | 'vendor-day' | 'task-due';
export type CalendarViewMode = 'month' | 'week' | 'day';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  allDay: boolean;
  module: string;
  moduleRoute?: string;
  color: string;
  description?: string;
  attendees?: string[];
}

export interface CalendarFilter {
  types: EventType[];
  modules: string[];
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}
