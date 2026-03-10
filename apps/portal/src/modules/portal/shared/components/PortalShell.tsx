'use client';

import { useState, useRef, useEffect, startTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  usePortalAuth,
  usePortalStoreOrders,
} from '../hooks';
import { PortalHeader } from './PortalHeader';

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

// ─── Component ─────────────────────────────────────────────────────

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { currentAccount } = usePortalAuth();
  const { storeOrders } = usePortalStoreOrders();

  const newOrderCount = storeOrders.filter((o) => o.status === 'new').length;
  const unreadMessages = currentAccount?.unreadMessages ?? 0;

  // Close sidebar on route change (mobile)
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      startTransition(() => setSidebarOpen(false));
    }
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-base">
      {/* Fixed header */}
      <PortalHeader />

      {/* Sidebar + Content area */}
      <div className="flex flex-1 pt-[var(--header-height)]">
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
            'fixed left-0 bottom-0 z-50 flex w-64 flex-col border-r border-border-default bg-card/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 lg:static',
            sidebarOpen ? 'translate-x-0 top-0' : '-translate-x-full top-0',
            'lg:top-0'
          )}
        >
          {/* Logo area (mobile only) */}
          <div className="flex h-16 items-center gap-3 px-6 border-b border-border-default lg:hidden">
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
              className="ml-auto text-text-muted hover:text-text-default"
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
        <main className="flex-1 overflow-y-auto p-6 bg-base">{children}</main>
      </div>
    </div>
  );
}
