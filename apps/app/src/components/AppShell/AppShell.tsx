'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { CommandPalette } from '../CommandPalette';
import { useAuthStore } from '@/modules/auth/store';
import { usePermissions } from '@/modules/auth/hooks/usePermissions';

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isDemoMode, logout } = useAuthStore();
  const { canAccess, isLoading: permissionsLoading } = usePermissions();

  // Route protection: redirect to dashboard if user lacks permission
  useEffect(() => {
    if (permissionsLoading || isDemoMode) return;

    // Extract module slug from pathname (e.g. '/crm/accounts' → 'crm')
    const slug = pathname.split('/').filter(Boolean)[0];
    if (slug && !canAccess(slug)) {
      router.replace('/dashboard');
    }
  }, [pathname, canAccess, permissionsLoading, isDemoMode, router]);

  function handleExitDemo() {
    logout();
    router.push('/login');
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-base">
      {/* Fixed header */}
      <AppHeader />

      {/* Demo mode banner (below header) */}
      {isDemoMode && (
        <div className="fixed top-[var(--header-height)] left-0 right-0 z-40 flex items-center justify-center gap-3 bg-[#5BB8E6]/10 border-b border-[#5BB8E6]/20 px-4 py-1.5 text-xs text-[#5BB8E6]">
          <span>You&apos;re in Demo Mode — data shown is simulated</span>
          <button
            onClick={handleExitDemo}
            className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-[#5BB8E6]/20 transition-colors"
          >
            <X size={12} />
            Exit
          </button>
        </div>
      )}

      {/* Sidebar + Content area */}
      <div className="flex flex-1 overflow-hidden pt-[var(--header-height)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 bg-base">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
