import { useQuery, type QueryKey } from '@tanstack/react-query';
import { useAuthStore } from '@/modules/auth/store';

/**
 * A useQuery wrapper that gates mock data behind demo mode.
 *
 * - Demo mode (isDemoMode=true): runs demoQueryFn (returns mock data)
 * - Real login (isDemoMode=false): returns emptyValue immediately (no network call)
 *
 * When a real API endpoint is wired up later, replace useDemoQuery
 * with a standard useQuery that calls apiFetch.
 */
export function useDemoQuery<T>(options: {
  queryKey: QueryKey;
  demoQueryFn: () => T | Promise<T>;
  emptyValue: T;
  enabled?: boolean;
}) {
  const { isDemoMode } = useAuthStore();

  return useQuery<T>({
    queryKey: [...options.queryKey, isDemoMode],
    queryFn: async () => {
      if (!isDemoMode) return options.emptyValue;
      return options.demoQueryFn();
    },
    enabled: options.enabled,
  });
}
