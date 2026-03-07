'use client';

import { usePathname } from 'next/navigation';
import { Menu, Search, Bell } from 'lucide-react';
import { useSidebarStore, useCommandPaletteStore } from './store';
import { navGroups } from './nav-data';

function getPageName(pathname: string): string {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (item.href === pathname) return item.label;
    }
  }
  return 'Frost';
}

export function Topbar() {
  const pathname = usePathname();
  const { setMobileOpen } = useSidebarStore();
  const { setCommandPaletteOpen } = useCommandPaletteStore();
  const pageName = getPageName(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border-default bg-card px-4">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 text-text-muted hover:text-text-default lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-base font-semibold text-text-bright">{pageName}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-text-muted hover:text-text-default hover:bg-elevated transition-colors"
          aria-label="Search (Ctrl+K)"
        >
          <Search size={18} />
          <kbd className="hidden rounded bg-elevated px-1.5 py-0.5 text-[10px] font-medium sm:inline-block">
            Ctrl+K
          </kbd>
        </button>
        <button
          className="p-2 rounded-md text-text-muted hover:text-text-default hover:bg-elevated transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
        <div className="ml-2 h-8 w-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary text-sm font-semibold">
          F
        </div>
      </div>
    </header>
  );
}
