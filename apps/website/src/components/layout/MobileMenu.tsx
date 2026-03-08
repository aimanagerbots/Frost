'use client';

import { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@frost/ui';
import { NAV_LINKS } from '@/lib/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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
        'fixed inset-0 z-50 md:hidden',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-dark/40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'absolute inset-0 flex flex-col bg-base transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Close */}
        <div className="flex items-center justify-between px-6 py-4">
          <span className="font-display text-2xl italic text-text-default">Frost</span>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted transition-colors hover:text-text-default"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Nav links — large Sora style */}
        <nav className="flex flex-1 flex-col justify-center gap-2 px-6">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="font-display text-4xl text-text-default transition-colors hover:text-accent-primary"
              style={{
                animationDelay: isOpen ? `${i * 100}ms` : '0ms',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="border-t border-border-default px-6 py-6">
          <Link
            href="/find"
            onClick={onClose}
            className="block w-full rounded-full bg-accent-primary py-3 text-center text-sm font-medium uppercase tracking-[0.05em] text-text-on-dark transition-colors hover:bg-accent-primary-hover"
          >
            Find Near You
          </Link>
        </div>
      </div>
    </div>
  );
}
