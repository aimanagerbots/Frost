'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Menu, Search, Bell, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useSidebarStore, useCommandPaletteStore, useThemeStore } from './store';
import { useAuthStore } from '@/modules/auth/store';

export function Topbar() {
  const router = useRouter();
  const { setMobileOpen } = useSidebarStore();
  const { setCommandPaletteOpen } = useCommandPaletteStore();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initials = user
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2)
    : 'F';

  function handleLogout() {
    setUserMenuOpen(false);
    logout();
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-30 flex h-48 items-center border-b border-border-default bg-black px-4">
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
          src="/FrostLogo_wordmark.png"
          alt="Frost"
          width={800}
          height={200}
          className="h-40 w-auto"
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

        {/* User menu */}
        <div className="relative ml-2">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-elevated transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] text-sm font-semibold">
              {initials}
            </div>
            {user && (
              <span className="hidden text-xs text-text-muted sm:block">{user.name}</span>
            )}
            <ChevronDown size={14} className="text-text-muted" />
          </button>
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-default bg-card py-1 shadow-xl">
                {user && (
                  <div className="border-b border-default px-3 py-2">
                    <p className="text-sm font-medium text-text-bright">{user.name}</p>
                    <p className="text-xs text-text-muted">{user.role}</p>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-muted hover:bg-elevated hover:text-text-default transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
