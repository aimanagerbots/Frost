'use client';

import { useState, useRef, useEffect, startTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Store,
  Truck,
  BarChart3,
  Megaphone,
  Trophy,
  MessageCircle,
  User,
  CreditCard,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  usePortalAuth,
  usePortalCart,
  usePortalStoreOrders,
} from '../hooks';
import { NotificationDropdown } from './NotificationDropdown';
import { PortalCartDrawer } from './PortalCartDrawer';

// ─── Navigation ────────────────────────────────────────────────────

type NavItem =
  | { type: 'link'; href: string; label: string; icon: typeof LayoutDashboard }
  | { type: 'separator'; label: string };

const NAV_ITEMS: NavItem[] = [
  { type: 'link', href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { type: 'link', href: '/shop', label: 'Shop', icon: ShoppingCart },
  { type: 'link', href: '/orders', label: 'My Orders', icon: Package },
  { type: 'link', href: '/deliveries', label: 'Deliveries', icon: Truck },
  { type: 'link', href: '/payments', label: 'Payments', icon: CreditCard },
  { type: 'separator', label: 'Intelligence' },
  { type: 'link', href: '/insights', label: 'Insights', icon: BarChart3 },
  { type: 'link', href: '/marketing', label: 'Marketing', icon: Megaphone },
  { type: 'link', href: '/rewards', label: 'Rewards', icon: Trophy },
  { type: 'separator', label: 'Operations' },
  { type: 'link', href: '/comms-hub', label: 'Comms Hub', icon: MessageCircle },
  { type: 'link', href: '/store-ops', label: 'Store Ops', icon: Store },
  { type: 'link', href: '/account', label: 'My Account', icon: User },
];

const SWITCHABLE_ACCOUNTS = [
  { id: 'acct-1', name: 'Greenfield Dispensary' },
  { id: 'acct-2', name: 'Pacific Leaf' },
  { id: 'acct-3', name: 'Cascade Wellness' },
] as const;

// ─── Helpers ───────────────────────────────────────────────────────

function pageLabelFromPathname(pathname: string): string {
  const item = NAV_ITEMS.find(
    (nav): nav is Extract<NavItem, { type: 'link' }> =>
      nav.type === 'link' &&
      (pathname === nav.href || pathname.startsWith(nav.href + '/'))
  );
  return item?.label ?? 'Portal';
}

// ─── Component ─────────────────────────────────────────────────────

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const accountDropdownRef = useRef<HTMLDivElement>(null);

  // Store hooks
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

  // Close sidebar on route change (mobile)
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      // Use startTransition to avoid setState-in-effect lint error
      startTransition(() => setSidebarOpen(false));
    }
  }, [pathname]);

  function handleSignOut() {
    setAccountDropdownOpen(false);
    logout();
    router.push('/login');
  }

  function handleSwitchAccount(accountId: string) {
    switchAccount(accountId);
    setAccountDropdownOpen(false);
  }

  return (
    <div className="flex min-h-screen bg-base">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ──────────────────────────────────────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border-default bg-card/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 lg:static',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-border-default">
          <Image
            src="/FrostLogo_SnowflakeOnly.png"
            alt="Frost"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <div>
            <span className="text-sm font-semibold text-text-bright font-display tracking-wide">
              Frost
            </span>
            <span className="ml-1.5 text-[10px] text-accent-primary font-mono uppercase tracking-widest">
              Portal
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-text-muted hover:text-text-default lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item, idx) => {
            if (item.type === 'separator') {
              return (
                <div key={`sep-${item.label}`} className={cn('px-3 pt-4 pb-1', idx > 0 && 'mt-1')}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted/60">
                    {item.label}
                  </p>
                </div>
              );
            }

            const { href, label, icon: Icon } = item;
            const active = pathname === href || pathname.startsWith(href + '/');
            const showBadge =
              (href === '/store-ops' && newOrderCount > 0) ||
              (href === '/comms-hub' && unreadMessages > 0);
            const badgeCount =
              href === '/store-ops' ? newOrderCount : unreadMessages;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  active
                    ? 'border-l-[3px] border-accent-primary bg-accent-primary/10 text-accent-primary'
                    : 'text-text-muted hover:bg-white/[0.04] hover:text-text-default'
                )}
              >
                <Icon
                  className={cn(
                    'h-[18px] w-[18px] shrink-0',
                    active
                      ? 'text-accent-primary'
                      : 'text-text-muted group-hover:text-text-default'
                  )}
                />
                <span className="truncate">{label}</span>
                {showBadge && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-primary px-1.5 text-[10px] font-bold text-white">
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-border-default px-4 py-4">
          {currentAccount && (
            <p className="truncate text-sm text-text-default mb-1">
              {currentAccount.businessName}
            </p>
          )}
          <p className="text-[11px] text-text-muted">Powered by Frost</p>
        </div>
      </aside>

      {/* ─── Main column ──────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b border-border-default bg-card px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
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
            {/* Notifications */}
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
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-base">{children}</main>
      </div>

      {/* Cart drawer */}
      <PortalCartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />
    </div>
  );
}
