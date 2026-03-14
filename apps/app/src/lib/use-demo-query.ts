import { useQuery, type QueryKey } from '@tanstack/react-query';

/**
 * A useQuery wrapper for mock data.
 * Always runs demoQueryFn to return mock data.
 * When a real API endpoint is wired up later, replace useDemoQuery
 * with a standard useQuery that calls apiFetch.
 */
export function useDemoQuery<T>(options: {
  queryKey: QueryKey;
  demoQueryFn: () => T | Promise<T>;
  emptyValue: T;
  enabled?: boolean;
}) {
  return useQuery<T>({
    queryKey: options.queryKey,
    queryFn: async () => {
      return options.demoQueryFn();
    },
    enabled: options.enabled,
  });
}
