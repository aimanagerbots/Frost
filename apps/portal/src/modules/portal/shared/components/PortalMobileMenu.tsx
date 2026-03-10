'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
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
} from 'lucide-react';

interface PortalMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  newOrderCount: number;
  unreadMessages: number;
}

const MOBILE_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/shop', label: 'Shop', icon: ShoppingCart },
  { href: '/orders', label: 'My Orders', icon: Package },
  { href: '/deliveries', label: 'Deliveries', icon: Truck },
  { href: '/payments', label: 'Payments', icon: CreditCard },
  { type: 'separator' as const, label: 'Intelligence' },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/marketing', label: 'Marketing', icon: Megaphone },
  { href: '/rewards', label: 'Rewards', icon: Trophy },
  { type: 'separator' as const, label: 'Operations' },
  { href: '/comms-hub', label: 'Comms Hub', icon: MessageCircle },
  { href: '/store-ops', label: 'Store Ops', icon: Store },
  { href: '/account', label: 'My Account', icon: User },
] as const;

export function PortalMobileMenu({
  isOpen,
  onClose,
  newOrderCount,
  unreadMessages,
}: PortalMobileMenuProps) {
  const pathname = usePathname();

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60] lg:hidden',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'absolute inset-0 flex flex-col bg-base h-dvh transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header: logo + close */}
        <div className="relative flex shrink-0 items-center justify-center px-6 py-4">
          <div className="relative h-8 w-8">
            <Image
              src="/FrostLogo_SnowflakeOnly.png"
              alt="Frost"
              fill
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 text-text-muted transition-colors hover:text-text-default"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-6 pb-6">
          {MOBILE_NAV.map((item, idx) => {
            if ('type' in item && item.type === 'separator') {
              return (
                <div key={`sep-${item.label}`} className={cn('px-0 pt-4 pb-2', idx > 0 && 'mt-1')}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted/60">
                    {item.label}
                  </p>
                </div>
              );
            }

            if (!('href' in item)) return null;

            const active =
              pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            const showBadge =
              (item.href === '/store-ops' && newOrderCount > 0) ||
              (item.href === '/comms-hub' && unreadMessages > 0);
            const badgeCount =
              item.href === '/store-ops' ? newOrderCount : unreadMessages;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 border-b border-border-default py-4 text-lg font-semibold transition-colors',
                  active
                    ? 'text-accent-primary'
                    : 'text-text-default hover:text-accent-primary'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
                {showBadge && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-primary px-1.5 text-[10px] font-bold text-white">
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
