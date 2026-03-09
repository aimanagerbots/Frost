'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/modules/auth/store';
import { apiFetch } from '@/lib/api';
import { navGroups } from '@/components/AppShell/nav-data';
import type { ModuleDefinition } from '@/modules/auth/types';

export function useModuleDefinitions() {
  const isDemoMode = useAuthStore((s) => s.isDemoMode);
  const session = useAuthStore((s) => s.session);

  return useQuery({
    queryKey: ['permissions', 'modules'],
    queryFn: async () => {
      if (isDemoMode) {
        // Derive from nav-data in demo mode
        return navGroups.flatMap((g) =>
          g.items.map((item) => ({
            slug: item.slug,
            label: item.label,
            nav_group: g.title,
          })),
        ) satisfies ModuleDefinition[];
      }
      return apiFetch<ModuleDefinition[]>('/api/permissions/modules', {
        token: session?.access_token,
      });
    },
    staleTime: 10 * 60 * 1000, // 10 minutes — module list rarely changes
  });
}
