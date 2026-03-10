'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  ShoppingCart,
  ChevronDown,
  LogOut,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth, usePortalCart, usePortalStoreOrders } from '../hooks';
import { NotificationDropdown } from './NotificationDropdown';
import { PortalCartDrawer } from './PortalCartDrawer';
import { PortalMobileMenu } from './PortalMobileMenu';

/* ── Nav links ───────────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', group: 'main' },
  { href: '/shop', label: 'Shop', group: 'main' },
  { href: '/orders', label: 'Orders', group: 'main' },
  { href: '/deliveries', label: 'Deliveries', group: 'main' },
  { href: '/payments', label: 'Payments', group: 'main' },
  { href: '/insights', label: 'Insights', group: 'intel' },
  { href: '/marketing', label: 'Marketing', group: 'intel' },
  { href: '/rewards', label: 'Rewards', group: 'intel' },
  { href: '/comms-hub', label: 'Comms', group: 'ops' },
  { href: '/store-ops', label: 'Store Ops', group: 'ops' },
  { href: '/account', label: 'Account', group: 'ops' },
] as const;

const SWITCHABLE_ACCOUNTS = [
  { id: 'acct-1', name: 'Greenfield Dispensary' },
  { id: 'acct-2', name: 'Pacific Leaf' },
  { id: 'acct-3', name: 'Cascade Wellness' },
] as const;

/* ── Component ───────────────────────────────────────────────────── */

export function PortalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  const { currentAccount, logout, switchAccount } = usePortalAuth();
  const cartStore = usePortalCart();
  const totalItems = cartStore.totalItems();
  const { storeOrders } = usePortalStoreOrders();

  const newOrderCount = storeOrders.filter((o) => o.status === 'new').length;
  const unreadMessages = currentAccount?.unreadMessages ?? 0;

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(e.target as Node)
      ) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSignOut() {
    setAccountDropdownOpen(false);
    logout();
    router.push('/login');
  }

  function handleSwitchAccount(accountId: string) {
    switchAccount(accountId);
    setAccountDropdownOpen(false);
  }

  const baseLink =
    'whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] transition-all duration-200 outline-none';

  let prevGroup = '';

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 border-none"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Desktop header */}
        <div className="relative hidden lg:flex items-center justify-center py-5 px-6">
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
                Portal
              </span>
            </div>
          </Link>

          {/* Nav — centered */}
          <nav className="flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href ||
                pathname.startsWith(link.href + '/');

              // Insert spacer between groups
              const showSpacer = prevGroup !== '' && prevGroup !== link.group;
              prevGroup = link.group;

              return (
                <span key={link.href} className="contents">
                  {showSpacer && (
                    <span
                      className="mx-2 h-3 w-px bg-white/[0.1]"
                      aria-hidden="true"
                    />
                  )}
                  <Link
                    href={link.href}
                    className={cn(
                      baseLink,
                      active
                        ? 'bg-accent-primary/20 text-accent-primary'
                        : 'text-text-default hover:text-accent-primary'
                    )}
                  >
                    {link.label}
                  </Link>
                </span>
              );
            })}
          </nav>

          {/* Actions — far right */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <NotificationDropdown />

            {/* Cart button */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative rounded-lg p-2 text-text-muted hover:bg-white/[0.04] hover:text-text-default transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-primary px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Account switcher */}
            <div ref={accountDropdownRef} className="relative">
              <button
                onClick={() => setAccountDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-default hover:bg-white/[0.04] transition-colors"
                aria-label="Switch account"
              >
                <span className="hidden max-w-[140px] truncate sm:inline">
                  {currentAccount?.businessName ?? 'Select Account'}
                </span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-text-muted transition-transform',
                    accountDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {accountDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-lg border border-border-default bg-card py-1 shadow-xl">
                  {SWITCHABLE_ACCOUNTS.map((acct) => {
                    const isActive = currentAccount?.id === acct.id;
                    return (
                      <button
                        key={acct.id}
                        onClick={() => handleSwitchAccount(acct.id)}
                        className={cn(
                          'flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors text-left',
                          isActive
                            ? 'bg-accent-primary/10 text-accent-primary'
                            : 'text-text-default hover:bg-white/[0.04]'
                        )}
                      >
                        <span className="flex-1 truncate">{acct.name}</span>
                        {isActive && <Check className="h-4 w-4 shrink-0" />}
                      </button>
                    );
                  })}
                  <div className="my-1 h-px bg-border-default" />
                  <button
                    onClick={handleSignOut}
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
            <div>
              <span className="text-sm font-semibold text-text-bright font-display tracking-wide">
                Frost
              </span>
              <span className="ml-1.5 text-[10px] text-accent-primary font-mono uppercase tracking-widest">
                Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {/* Cart */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative rounded-lg p-2 text-text-muted hover:text-text-default transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-primary px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger */}
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

      <PortalMobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        newOrderCount={newOrderCount}
        unreadMessages={unreadMessages}
      />

      <PortalCartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </>
  );
}
