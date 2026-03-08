/**
 * DUAL-MODE HOOK PATTERN
 * =====================
 * This hook supports both demo mode (mock data) and real mode (API calls).
 *
 * How it works:
 * 1. Check  from the auth store
 * 2. If demo mode → return mock data from @/mocks/crm (existing behavior)
 * 3. If real mode → fetch from the Frost API via apiFetch()
 *
 * To replicate this pattern for other hooks:
 * 1. Import { useAuthStore } and { apiFetch }
 * 2. In queryFn, check isDemoMode
 * 3. Demo branch: call existing mock function (e.g., getAccounts, getInteractions)
 * 4. Real branch: call apiFetch with the matching API endpoint
 * 5. Include session?.access_token as the auth token for real API calls
 *
 * Example for useInteractions:
 *   queryFn: async () => {
 *     if (isDemoMode) return getInteractions(accountId);
 *     return apiFetch('/api/crm/interactions', {
 *       token: session?.access_token,
 *     });
 *   }
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccounts } from '@/mocks/crm';
import type { Account } from '@/modules/crm/types';
import { useAuthStore } from '@/modules/auth/store';
import { apiFetch } from '@/lib/api';

interface AccountFilters {
  status?: string;
  region?: string;
  search?: string;
}

export function useAccounts(filters?: AccountFilters) {
  const { isDemoMode, session } = useAuthStore();

  return useQuery({
    queryKey: ['crm', 'accounts', filters],
    queryFn: async () => {
      if (isDemoMode) {
        return getAccounts(filters);
      }

      // Build query string from filters
      const params = new URLSearchParams();
      if (filters?.status) params.set('pipeline_status', filters.status);
      if (filters?.search) params.set('search', filters.search);
      const qs = params.toString();
      const path = '/api/crm/accounts' + (qs ? '?' + qs : '');

      return apiFetch<Account[]>(path, {
        token: session?.access_token,
      });
    },
  });
}
