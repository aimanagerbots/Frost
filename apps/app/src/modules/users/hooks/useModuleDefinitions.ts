'use client';

import { useQuery } from '@tanstack/react-query';
import { categories } from '@/components/AppShell/nav-data';
import type { ModuleDefinition } from '@/modules/auth/types';

export function useModuleDefinitions() {
  return useQuery({
    queryKey: ['permissions', 'modules'],
    queryFn: async () => {
      return categories.flatMap((cat) =>
        cat.items.map((item) => ({
          slug: item.slug,
          label: item.label,
          nav_group: cat.label,
        })),
      ) satisfies ModuleDefinition[];
    },
    staleTime: 10 * 60 * 1000,
  });
}
