'use client';

import Image from 'next/image';
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react';
import { useSidebarStore, useCommandPaletteStore, useThemeStore } from './store';

export function Topbar() {
  const { setMobileOpen } = useSidebarStore();
  const { setCommandPaletteOpen } = useCommandPaletteStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border-default bg-card px-4">
      {/* Left — mobile menu */}
      <div className="flex items-center">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 text-text-muted hover:text-text-default lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Center — snowflake logo */}
      <div className="flex-1 flex items-center justify-center">
        <Image
          src="/FrostLogo_SnowflakeOnly.png"
          alt="Frost"
          width={160}
          height={160}
          className="h-10 w-10"
          priority
        />
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-text-muted hover:text-text-default hover:bg-elevated transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
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
