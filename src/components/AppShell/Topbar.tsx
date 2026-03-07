'use client';

import { usePathname } from 'next/navigation';
import { Menu, Search, Bell } from 'lucide-react';
import { useSidebarStore } from './store';
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
          className="p-2 rounded-md text-text-muted hover:text-text-default hover:bg-elevated transition-colors"
          aria-label="Search"
        >
          <Search size={18} />
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
