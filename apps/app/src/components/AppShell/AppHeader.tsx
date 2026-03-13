'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, Search, Bell, LogOut, ChevronDown, X, Sun, Moon } from 'lucide-react';
import { cn } from '@frost/ui';
import { useCommandPaletteStore, useMobileMenuStore, useThemeStore } from './store';
import { useAuthStore } from '@/modules/auth/store';
import { AppMobileMenu } from './AppMobileMenu';
import { CategoryDropdown } from './CategoryDropdown';


function AppHeaderInner() {
  const router = useRouter();
  const { setCommandPaletteOpen } = useCommandPaletteStore();
  const { mobileMenuOpen, setMobileMenuOpen } = useMobileMenuStore();
  const { user, logout, isDemoMode } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
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

  function handleExitDemo() {
    logout();
    router.push('/login');
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 border-none"
        style={{ backgroundColor: '#5BB8E6' }}
      >
        {/* Desktop header */}
        <div className="hidden lg:flex h-14 items-stretch">
          {/* Logo zone — same width as sidebar */}
          <div className="w-[260px] flex items-center gap-2 px-4 border-r border-white/30 shrink-0">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="relative h-9 w-9">
                <Image
                  src="/FrostLogo_SnowflakeOnly.png"
                  alt="Frost"
                  fill
                  className="object-contain brightness-0"
                  priority
                />
              </div>
              <div className="leading-none">
                <span className="text-base font-bold text-white font-display tracking-[0.15em] uppercase">
                  Frost
                </span>
                <span className="ml-1.5 text-[10px] text-black/70 font-mono font-bold uppercase tracking-widest">
                  Team
                </span>
              </div>
            </Link>
          </div>

          {/* Content zone — aligns with main page content */}
          <div className="flex flex-1 items-center justify-between px-4">
            <CategoryDropdown />

            {/* Actions — right */}
            <div className="flex items-center gap-1">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Search */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
                aria-label="Search (Ctrl+K)"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Notifications */}
              <button
                className="rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>

              {/* User dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-white hover:bg-white/20 transition-colors"
                >
                  <span className="hidden max-w-[120px] truncate sm:inline text-xs text-white">
                    {user?.name ?? 'User'}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 text-white/70 transition-transform',
                      userMenuOpen && 'rotate-180'
                    )}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-lg border border-border-default bg-card py-1 shadow-xl">
                    {user && (
                      <>
                        <div className="px-4 py-2.5">
                          <p className="text-sm font-medium text-text-bright">
                            {user.name}
                          </p>
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
          </div>
        </div>

        {/* Mobile header */}
        <div className="flex lg:hidden items-center justify-between py-2 px-6">
          <Link href="/dashboard" className="relative z-10 flex items-center gap-2">
            <Image
              src="/FrostLogo_SnowflakeOnly.png"
              alt="Frost"
              width={64}
              height={64}
              className="object-contain brightness-0"
              priority
            />
            <span className="text-sm font-semibold text-white font-display tracking-wide">
              Frost
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="rounded-lg p-2 text-white hover:bg-white/20 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="text-white hover:bg-white/20 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <AppMobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}

export function AppHeader() {
  return (
    <Suspense>
      <AppHeaderInner />
    </Suspense>
  );
}
