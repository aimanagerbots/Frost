'use client';

import { useQuery } from '@tanstack/react-query';
import { getCalendarEvents } from '@/mocks/calendar';

interface CalendarFilters {
  types?: string[];
  modules?: string[];
}

export function useCalendarEvents(filters?: CalendarFilters) {
  return useQuery({
    queryKey: ['calendar', 'events', filters],
    queryFn: () => getCalendarEvents(filters),
  });
}
