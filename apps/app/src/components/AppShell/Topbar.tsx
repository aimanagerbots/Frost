'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, Search, Bell, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@frost/ui';
import { useSidebarStore, useCommandPaletteStore } from './store';
import { useAuthStore } from '@/modules/auth/store';
import { navGroups } from './nav-data';

function pageLabelFromPathname(pathname: string): string {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(item.href + '/')) {
        return item.label;
      }
    }
  }
  return 'Frost';
}

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { setMobileOpen } = useSidebarStore();
  const { setCommandPaletteOpen } = useCommandPaletteStore();
  const { user, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    setUserMenuOpen(false);
    logout();
    router.push('/login');
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border-default bg-card px-6">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="text-text-muted hover:text-text-default lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page label (desktop) */}
      <h1 className="hidden text-sm font-medium text-text-default lg:block">
        {pageLabelFromPathname(pathname)}
      </h1>

      <div className="flex-1" />

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="relative rounded-lg p-2 text-text-muted hover:bg-white/[0.04] hover:text-text-default transition-colors"
          aria-label="Search (Ctrl+K)"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-text-muted hover:bg-white/[0.04] hover:text-text-default transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* User dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-default hover:bg-white/[0.04] transition-colors"
          >
            <span className="hidden max-w-[140px] truncate sm:inline">
              {user?.name ?? 'User'}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-text-muted transition-transform',
                userMenuOpen && 'rotate-180'
              )}
            />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-lg border border-border-default bg-card py-1 shadow-xl">
              {user && (
                <>
                  <div className="px-4 py-2.5">
                    <p className="text-sm font-medium text-text-bright">{user.name}</p>
                    <p className="text-xs text-text-muted">{user.role}</p>
                  </div>
                  <div className="my-1 h-px bg-border-default" />
                </>
              )}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-white/[0.04] transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
