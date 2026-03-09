'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
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
    <div className="flex h-screen overflow-hidden bg-base">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {isDemoMode && (
          <div className="flex items-center justify-center gap-3 bg-[#F59E0B]/10 border-b border-[#F59E0B]/20 px-4 py-1.5 text-xs text-[#F59E0B]">
            <span>You&apos;re in Demo Mode — data shown is simulated</span>
            <button
              onClick={handleExitDemo}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-[#F59E0B]/20 transition-colors"
            >
              <X size={12} />
              Exit
            </button>
          </div>
        )}
        <Topbar />
        <main className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
