'use client';

import { useQuery } from '@tanstack/react-query';
import { getSalesReps } from '@/mocks/crm';
import type { SalesRep } from '@/modules/crm/types';
import { useAuthStore } from '@/modules/auth/store';
import { apiFetch } from '@/lib/api';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  department: string | null;
}

function profileToSalesRep(p: Profile): SalesRep {
  return {
    id: p.id,
    name: p.full_name,
    email: p.email,
    territory: p.department ?? 'Unassigned',
    avatarUrl: null,
    revenue: 0,
    accountCount: 0,
    activeOpportunities: 0,
  };
}

export function useSalesReps() {
  const { isDemoMode, session } = useAuthStore();

  return useQuery({
    queryKey: ['crm', 'sales-reps'],
    queryFn: async () => {
      if (isDemoMode) return getSalesReps();
      const users = await apiFetch<Profile[]>('/api/auth/users', {
        token: session?.access_token,
      });
      return users
        .filter((u) => ['admin', 'manager', 'sales_rep'].includes(u.role))
        .map(profileToSalesRep);
    },
  });
}
