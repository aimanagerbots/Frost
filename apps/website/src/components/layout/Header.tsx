'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, ShoppingBag, Navigation } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@frost/ui';
import { useOrderStore, useCartItemCount } from '@/stores/order-store';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';
import { LocationSelector } from './LocationSelector';

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

          {/* Location + CTA + Cart slot — far right */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <LocationSelector />
            {isOrderPage ? (
              <BrowseModeToggle />
            ) : (
              <Link
                href="/order"
                className="shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.06em] cta-glow transition-all duration-200"
              >
                Order
              </Link>
            )}
            <CartIconButton />
          </div>
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

          {/* Mobile: my location + browse toggle + cart + hamburger */}
          <div className="flex items-center gap-2">
            <MyLocationButton />
            {isOrderPage && (
              <BrowseModeToggle />
            )}
            <CartIconButton />

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
        </div>
      </header>

      <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
}

/* ---------- Cart icon button ---------- */

function CartIconButton() {
  const setCartOpen = useOrderStore((s) => s.setCartOpen);
  const itemCount = useCartItemCount();
  const hasItems = itemCount > 0;

  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      className={cn(
        'relative shrink-0 p-2 rounded-full transition-colors duration-200',
        hasItems
          ? 'text-[#5BB8E6] cart-glow'
          : 'text-text-muted hover:text-text-default',
      )}
      aria-label={hasItems ? `Open cart (${itemCount} items)` : 'Open cart'}
    >
      <ShoppingBag className="h-5 w-5" />

      {/* Badge */}
      {hasItems && (
        <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#5BB8E6] px-1 text-[10px] font-bold leading-none text-black">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}

/* ---------- My Location button (mobile) ---------- */

function MyLocationButton() {
  const userLocation = useOrderStore((s) => s.userLocation);
  const setUserLocation = useOrderStore((s) => s.setUserLocation);
  const hasLocation = userLocation !== null;

  const handleClick = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'My Location',
        });
      },
      () => {
        /* silently fail */
      },
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] uppercase tracking-[0.04em] font-semibold transition-colors border',
        hasLocation
          ? 'border-[#5BB8E6]/30 text-[#5BB8E6] bg-[#5BB8E6]/10'
          : 'border-white/[0.08] text-text-muted hover:text-text-default bg-white/[0.04]',
      )}
      aria-label="Use my location"
    >
      <Navigation className="h-3 w-3" />
      <span className="whitespace-nowrap">
        {hasLocation ? userLocation.label : 'My Location'}
      </span>
    </button>
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
