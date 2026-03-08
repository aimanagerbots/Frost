'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { cn } from '@frost/ui';
import { NAV_LINKS } from '@/lib/constants';
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
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-base/95 backdrop-blur-md border-b border-border-default'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/home" className="relative h-8 w-28">
            <Image
              src="/FrostLogo_wordmark.png"
              alt="Frost"
              fill
              className={cn(
                'object-contain transition-all duration-300',
                isScrolled ? 'brightness-100' : 'brightness-0 invert'
              )}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-[13px] font-medium uppercase tracking-[0.05em] transition-colors duration-200',
                  'after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:transition-all after:duration-200 hover:after:w-full',
                  isScrolled
                    ? 'text-text-muted hover:text-text-default after:bg-text-default'
                    : 'text-text-on-dark-muted hover:text-text-on-dark after:bg-text-on-dark'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/find"
              className={cn(
                'hidden rounded-full px-6 py-2 text-[13px] font-medium uppercase tracking-[0.05em] transition-colors duration-200 md:inline-flex',
                isScrolled
                  ? 'bg-accent-primary text-text-on-dark hover:bg-accent-primary-hover'
                  : 'bg-text-on-dark/20 text-text-on-dark backdrop-blur-sm hover:bg-text-on-dark/30'
              )}
            >
              Find Near You
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className={cn(
                'transition-colors duration-200 md:hidden',
                isScrolled
                  ? 'text-text-muted hover:text-text-default'
                  : 'text-text-on-dark-muted hover:text-text-on-dark'
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
