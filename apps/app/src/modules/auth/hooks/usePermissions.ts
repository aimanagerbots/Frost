'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAuthStore } from '@/modules/auth/store';
import { supabase } from '@/lib/supabase';
import { ALL_MODULE_SLUGS } from '@/components/AppShell/nav-data';
import type { ResolvedPermissions } from '@/modules/auth/types';

export function usePermissions() {
  const isDemoMode = useAuthStore((s) => s.isDemoMode);
  const user = useAuthStore((s) => s.user);

  const query = useQuery({
    queryKey: ['permissions', 'me', user?.id],
    queryFn: async (): Promise<ResolvedPermissions> => {
      if (!supabase || !user) return { allowed_modules: Array.from(ALL_MODULE_SLUGS) };

      // Admin gets everything
      if (user.role === 'admin') {
        return { allowed_modules: Array.from(ALL_MODULE_SLUGS) };
      }

      // For non-admin, resolve from Supabase directly
      const { data: roleDefaults } = await supabase
        .from('role_module_defaults')
        .select('module_slug')
        .eq('role', user.role);

      const roleSlugs = (roleDefaults ?? []).map((r: { module_slug: string }) => r.module_slug);

      // Get user's profile for departments
      const { data: profile } = await supabase
        .from('profiles')
        .select('departments')
        .eq('id', user.id)
        .single();

      const departments: string[] = profile?.departments ?? [];

      // Get department modules for all user departments
      let deptSlugs: string[] = [];
      if (departments.length > 0) {
        const { data: deptModules } = await supabase
          .from('department_modules')
          .select('module_slug')
          .in('department', departments);

        deptSlugs = (deptModules ?? []).map((d: { module_slug: string }) => d.module_slug);
      }

      // Per-user overrides
      const { data: overrides } = await supabase
        .from('user_module_overrides')
        .select('module_slug, granted')
        .eq('user_id', user.id);

      const allowed = new Set([...roleSlugs, ...deptSlugs]);
      for (const o of overrides ?? []) {
        if (o.granted) allowed.add(o.module_slug);
        else allowed.delete(o.module_slug);
      }

      return { allowed_modules: Array.from(allowed) };
    },
    enabled: !isDemoMode && !!user,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const allowedModules = useMemo(() => {
    if (isDemoMode) return ALL_MODULE_SLUGS;
    if (!user || query.isError || (!query.data && !query.isLoading)) return ALL_MODULE_SLUGS;
    if (!query.data) return new Set<string>();
    return new Set(query.data.allowed_modules);
  }, [isDemoMode, user, query.data, query.isError, query.isLoading]);

  return {
    allowedModules,
    isLoading: !isDemoMode && query.isLoading,
    canAccess: (slug: string) => allowedModules instanceof Set ? allowedModules.has(slug) : true,
  };
}
