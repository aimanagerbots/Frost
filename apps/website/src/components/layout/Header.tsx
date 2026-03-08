'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { cn } from '@frost/ui';
import { MegaMenu } from './MegaMenu';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
        className="fixed top-0 left-0 right-0 z-50 bg-base border-b border-border-default"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/home" className="relative h-16 w-16 shrink-0">
            <Image
              src="/FrostLogo_SnowflakeOnly.png"
              alt="Frost"
              fill
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop mega menu */}
          <MegaMenu isScrolled={isScrolled} />

          {/* Mobile hamburger */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className={cn(
                'transition-colors duration-200 md:hidden',
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
