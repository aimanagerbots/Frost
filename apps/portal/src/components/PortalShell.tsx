'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  User,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/account', label: 'Account', icon: User },
] as const;

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-base">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border-default bg-card/80 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
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
            <span className="text-sm font-semibold text-text-bright font-display tracking-wide">Frost</span>
            <span className="ml-1.5 text-[10px] text-accent-primary font-mono uppercase tracking-widest">Portal</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-text-muted hover:text-text-default lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-accent-primary/10 text-accent-primary'
                    : 'text-text-muted hover:bg-white/[0.04] hover:text-text-default'
                }`}
              >
                <Icon className={`h-[18px] w-[18px] ${active ? 'text-accent-primary' : 'text-text-muted group-hover:text-text-default'}`} />
                {label}
                {active && <ChevronRight className="ml-auto h-4 w-4 text-accent-primary/50" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border-default p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-primary/15 text-accent-primary text-xs font-bold">
              GD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-default truncate">Green Dreams</p>
              <p className="text-xs text-text-muted truncate">Dispensary Partner</p>
            </div>
          </div>
          <Link
            href="/login"
            className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-white/[0.04] hover:text-danger transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-border-default px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-text-muted hover:text-text-default lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <span className="rounded-full bg-accent-primary/10 px-3 py-1 text-xs font-medium text-accent-primary">
            Demo Mode
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
