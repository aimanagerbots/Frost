'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@frost/ui';
import { useOrderStore } from '@/stores/order-store';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const isOrderPage = pathname.startsWith('/order');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 border-none"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Desktop header */}
        <div className="relative hidden lg:flex items-center justify-center py-8 px-6">
          {/* Logo — far left */}
          <Link
            href="/home"
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 h-20 w-20"
          >
            <Image
              src="/FrostLogo_SnowflakeOnly.png"
              alt="Frost"
              fill
              className="object-contain logo-glow-img"
              priority
            />
          </Link>

          {/* Nav — centered on viewport */}
          <MegaMenu isScrolled={isScrolled} />

          {/* CTA slot — far right */}
          {isOrderPage ? (
            <BrowseModeToggle className="absolute right-6 top-1/2 -translate-y-1/2" />
          ) : (
            <Link
              href="/order"
              className="absolute right-6 top-1/2 -translate-y-1/2 shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.06em] cta-glow transition-all duration-200"
            >
              Order
            </Link>
          )}
        </div>

        {/* Mobile: logo left, hamburger right */}
        <div className="flex lg:hidden items-center justify-between py-2 px-6">
          <Link
            href="/home"
            className="relative z-10 h-16 w-16 shrink-0"
          >
            <Image
              src="/FrostLogo_SnowflakeOnly.png"
              alt="Frost"
              width={64}
              height={64}
              className="object-contain logo-glow-img"
              priority
            />
          </Link>

          {/* Mobile: show toggle inline when on order page */}
          {isOrderPage && (
            <BrowseModeToggle className="mr-3" />
          )}

          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className={cn(
              'shrink-0 transition-colors duration-200',
              'text-text-muted hover:text-text-default'
            )}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
}

/* ---------- Browse mode segmented toggle ---------- */

function BrowseModeToggle({ className }: { className?: string }) {
  const { browseMode, setBrowseMode } = useOrderStore();

  return (
    <div className={cn('flex bg-white/[0.04] rounded-lg p-0.5 border border-white/[0.06]', className)}>
      <button
        onClick={() => setBrowseMode('all-products')}
        className={`px-3 py-1.5 rounded-md text-[11px] uppercase tracking-[0.04em] font-semibold transition-all duration-200 whitespace-nowrap ${
          browseMode === 'all-products'
            ? 'bg-[#5BB8E6] text-black shadow-sm'
            : 'text-text-muted hover:text-text-default'
        }`}
      >
        All Products
      </button>
      <button
        onClick={() => setBrowseMode('by-store')}
        className={`px-3 py-1.5 rounded-md text-[11px] uppercase tracking-[0.04em] font-semibold transition-all duration-200 whitespace-nowrap ${
          browseMode === 'by-store'
            ? 'bg-[#5BB8E6] text-black shadow-sm'
            : 'text-text-muted hover:text-text-default'
        }`}
      >
        By Store
      </button>
    </div>
  );
}
