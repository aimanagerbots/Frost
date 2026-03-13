'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { Breadcrumb } from './Breadcrumb';
import { CommandPalette } from '../CommandPalette';
import { useAuthStore } from '@/modules/auth/store';
import { usePermissions } from '@/modules/auth/hooks/usePermissions';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isDemoMode, initSession } = useAuthStore();
  const { canAccess, isLoading: permissionsLoading } = usePermissions();

  // Restore Supabase session on app load (needed for API calls)
  useEffect(() => {
    initSession();
  }, [initSession]);

  // Route protection: redirect to dashboard if user lacks permission
  useEffect(() => {
    if (permissionsLoading || isDemoMode) return;

    // Extract module slug from pathname (e.g. '/crm/accounts' → 'crm')
    const slug = pathname.split('/').filter(Boolean)[0];
    if (slug && !canAccess(slug)) {
      router.replace('/dashboard');
    }
  }, [pathname, canAccess, permissionsLoading, isDemoMode, router]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-base">
      {/* Fixed header */}
      <AppHeader />

      {/* Sidebar + Content area */}
      <div
        className="flex flex-1 overflow-hidden"
        style={{ paddingTop: isDemoMode ? 'calc(var(--header-height) + 24px)' : 'var(--header-height)' }}
      >
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 pt-3 pb-6 bg-base">
          <Breadcrumb />
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
