'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Menu, Search, Bell, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@frost/ui';
import { useCommandPaletteStore, useMobileMenuStore } from './store';
import { useAuthStore } from '@/modules/auth/store';
import { AppMegaMenu } from './AppMegaMenu';
import { AppMobileMenu } from './AppMobileMenu';
import { getSubCategories } from './sub-nav-data';

function AppHeaderInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setCommandPaletteOpen } = useCommandPaletteStore();
  const { mobileMenuOpen, setMobileMenuOpen } = useMobileMenuStore();
  const { user, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const subCats = getSubCategories(pathname);
  const activeTab = searchParams.get('tab');

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

  function handleSubCategoryClick(tab: string, sub?: string) {
    const params = new URLSearchParams();
    params.set('tab', tab);
    if (sub) params.set('sub', sub);
    const basePath = subCats?.basePath ?? pathname;
    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 border-none"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Desktop header */}
        <div className="relative hidden lg:flex items-center justify-center py-6 px-6">
          {/* Logo — far left */}
          <Link
            href="/dashboard"
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2"
          >
            <div className="relative h-20 w-20">
              <Image
                src="/FrostLogo_SnowflakeOnly.png"
                alt="Frost"
                fill
                className="object-contain logo-glow-img"
                priority
              />
            </div>
            <div>
              <span className="text-sm font-semibold text-text-bright font-display tracking-wide">
                Frost
              </span>
              <span className="ml-1.5 text-[10px] text-accent-primary font-mono uppercase tracking-widest">
                Team
              </span>
            </div>
          </Link>

          {/* Nav — centered */}
          <AppMegaMenu />

          {/* Actions — far right */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="rounded-lg p-2 text-text-muted hover:bg-white/[0.04] hover:text-text-default transition-colors"
              aria-label="Search (Ctrl+K)"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button
              className="rounded-lg p-2 text-text-muted hover:bg-white/[0.04] hover:text-text-default transition-colors"
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

        {/* Sub-category bar (desktop, conditional) */}
        {subCats && (
          <div className="hidden lg:flex justify-center border-t border-white/[0.06] py-2 px-6">
            <div className="flex items-center gap-1">
              {subCats.items.map((item) => {
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() =>
                      handleSubCategoryClick(item.tab, item.sub)
                    }
                    className={cn(
                      'whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] transition-all duration-200',
                      isActive
                        ? 'bg-accent-primary/20 text-accent-primary'
                        : 'text-text-muted hover:text-text-default'
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile header */}
        <div className="flex lg:hidden items-center justify-between py-2 px-6">
          <Link href="/dashboard" className="relative z-10 flex items-center gap-2">
            <Image
              src="/FrostLogo_SnowflakeOnly.png"
              alt="Frost"
              width={64}
              height={64}
              className="object-contain logo-glow-img"
              priority
            />
            <span className="text-sm font-semibold text-text-bright font-display tracking-wide">
              Frost
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="rounded-lg p-2 text-text-muted hover:text-text-default transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="text-text-muted hover:text-text-default transition-colors"
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
