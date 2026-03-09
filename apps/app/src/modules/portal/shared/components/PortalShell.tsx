'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Store,
  Truck,
  Mail,
  User,
  CreditCard,
  Headphones,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Sparkles,
} from 'lucide-react';
import {
  usePortalAuth,
  usePortalCart,
  usePortalNotifications,
  usePortalStoreOrders,
} from '../hooks';
import { NotificationDropdown } from './NotificationDropdown';
import { PortalCartDrawer } from './PortalCartDrawer';

// ─── Nav Items ─────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
  { label: 'Shop', href: '/portal/shop', icon: ShoppingCart },
  { label: 'My Orders', href: '/portal/orders', icon: Package },
  { label: 'Store Orders', href: '/portal/store-orders', icon: Store },
  { label: 'Deliveries', href: '/portal/deliveries', icon: Truck },
  { label: 'AI Assistant', href: '/portal/ai-assistant', icon: Sparkles },
  { label: 'Messages', href: '/portal/messages', icon: Mail },
  { label: 'My Account', href: '/portal/account', icon: User },
  { label: 'Payments', href: '/portal/payments', icon: CreditCard },
  { label: 'Support', href: '/portal/support', icon: Headphones },
] as const;

const SWITCHABLE_ACCOUNTS = [
  { id: 'acct-1', name: 'Greenfield Dispensary' },
  { id: 'acct-2', name: 'Emerald City Cannabis' },
  { id: 'acct-3', name: 'Pacific Roots Collective' },
];

// ─── Helpers ───────────────────────────────────────────────────

function pageLabelFromPathname(pathname: string): string {
  const match = NAV_ITEMS.find((item) => pathname.startsWith(item.href));
  return match?.label ?? 'Portal';
}

// ─── Component ─────────────────────────────────────────────────

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentAccount, logout, switchAccount } = usePortalAuth();
  const cart = usePortalCart();
  const { unreadCount } = usePortalNotifications();
  const storeOrders = usePortalStoreOrders();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const newStoreOrderCount = storeOrders.storeOrders.filter(
    (o) => o.status === 'new'
  ).length;

  const pageLabel = pageLabelFromPathname(pathname);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ── Mobile overlay ─────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5">
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-xl font-bold tracking-widest text-transparent">
            FROST
          </span>
          <span className="text-xs font-medium text-gray-400">B2B Portal</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-l-[3px] border-amber-500 bg-amber-50 text-amber-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon size={18} />
                    <span className="flex-1">{item.label}</span>

                    {/* Store Orders badge */}
                    {item.label === 'Store Orders' && newStoreOrderCount > 0 && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                        {newStoreOrderCount}
                      </span>
                    )}

                    {/* Messages badge */}
                    {item.label === 'Messages' &&
                      (currentAccount?.unreadMessages ?? 0) > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                          {currentAccount?.unreadMessages}
                        </span>
                      )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-200 px-4 py-3">
          {currentAccount && (
            <p className="truncate text-sm font-medium text-gray-700">
              {currentAccount.businessName}
            </p>
          )}
          <p className="mt-1 text-[10px] text-gray-400">Powered by Frost</p>
        </div>
      </aside>

      {/* ── Main area ──────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          {/* Left: hamburger + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-gray-800">
              {pageLabel}
            </h1>
          </div>

          {/* Right: notifications, cart, account */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <NotificationDropdown />

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <ShoppingCart size={20} />
              {cart.totalItems() > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
                  {cart.totalItems()}
                </span>
              )}
            </button>

            {/* Account switcher */}
            <div className="relative ml-2">
              <button
                onClick={() => setAccountDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
              >
                <span className="hidden max-w-[140px] truncate font-medium sm:inline">
                  {currentAccount?.businessName ?? 'Select Account'}
                </span>
                <ChevronDown size={14} />
              </button>

              {accountDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setAccountDropdownOpen(false)}
                  />
                  <div className="absolute right-0 z-40 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {SWITCHABLE_ACCOUNTS.map((acct) => (
                      <button
                        key={acct.id}
                        onClick={() => {
                          switchAccount(acct.id);
                          setAccountDropdownOpen(false);
                        }}
                        className={cn(
                          'flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors',
                          currentAccount?.id === acct.id
                            ? 'bg-amber-50 font-medium text-amber-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        <Store size={14} />
                        {acct.name}
                      </button>
                    ))}
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={() => {
                        logout();
                        setAccountDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* Cart drawer */}
      <PortalCartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
