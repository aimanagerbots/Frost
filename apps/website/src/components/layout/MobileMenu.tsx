'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@frost/ui';
import { NAV_LINKS } from '@/lib/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 flex h-full w-72 flex-col bg-dark border-l border-border-default transition-transform duration-300 ease-in-out md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Close button */}
        <div className="flex items-center justify-end px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted transition-colors hover:text-text-default"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-2 px-6 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-lg px-4 py-3 text-lg font-medium text-text-muted transition-colors hover:bg-card hover:text-text-default"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="border-t border-border-default px-6 py-6">
          <Link
            href="/locations"
            onClick={onClose}
            className="block w-full rounded-full bg-accent-primary py-3 text-center text-sm font-medium text-text-on-dark transition-colors hover:bg-accent-primary-hover"
          >
            Find Near You
          </Link>
        </div>
      </div>
    </>
  );
}
