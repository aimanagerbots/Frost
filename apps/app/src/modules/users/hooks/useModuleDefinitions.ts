'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/modules/auth/store';
import { supabase } from '@/lib/supabase';
import { categories } from '@/components/AppShell/nav-data';
import type { ModuleDefinition } from '@/modules/auth/types';

export function useModuleDefinitions() {
  const isDemoMode = useAuthStore((s) => s.isDemoMode);

  return useQuery({
    queryKey: ['permissions', 'modules', isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return categories.flatMap((cat) =>
          cat.items.map((item) => ({
            slug: item.slug,
            label: item.label,
            nav_group: cat.label,
          })),
        ) satisfies ModuleDefinition[];
      }

      if (!supabase) return [];

      const { data, error } = await supabase
        .from('module_definitions')
        .select('slug, label, nav_group')
        .order('nav_group');

      if (error) throw new Error(error.message);
      return data as ModuleDefinition[];
    },
    staleTime: 10 * 60 * 1000,
  });
}
