'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAuthStore } from '@/modules/auth/store';
import { apiFetch } from '@/lib/api';
import { ALL_MODULE_SLUGS } from '@/components/AppShell/nav-data';
import type { ResolvedPermissions } from '@/modules/auth/types';

export function usePermissions() {
  const isDemoMode = useAuthStore((s) => s.isDemoMode);
  const session = useAuthStore((s) => s.session);

  const query = useQuery({
    queryKey: ['permissions', 'me'],
    queryFn: () =>
      apiFetch<ResolvedPermissions>('/api/permissions/me', {
        token: session?.access_token,
      }),
    enabled: !isDemoMode && !!session,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const allowedModules = useMemo(() => {
    if (isDemoMode) return ALL_MODULE_SLUGS;
    // When no API is available (frontend-only scaffold), grant full access
    if (!session || query.isError || (!query.data && !query.isLoading)) return ALL_MODULE_SLUGS;
    if (!query.data) return new Set<string>();
    return new Set(query.data.allowed_modules);
  }, [isDemoMode, session, query.data, query.isError, query.isLoading]);

  return {
    allowedModules,
    isLoading: !isDemoMode && query.isLoading,
    canAccess: (slug: string) => allowedModules.has(slug),
  };
}
