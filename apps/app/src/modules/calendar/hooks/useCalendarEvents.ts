'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getCalendarEvents } from '@/mocks/calendar';
import type { CalendarEvent } from '@/modules/calendar/types';

interface CalendarFilters {
  types?: string[];
  modules?: string[];
}

export function useCalendarEvents(filters?: CalendarFilters) {
  return useDemoQuery({
    queryKey: ['calendar', 'events', filters],
    demoQueryFn: () => getCalendarEvents(filters),
    emptyValue: [] as CalendarEvent[],
  });
}
