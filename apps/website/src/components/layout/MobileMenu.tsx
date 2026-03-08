'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@frost/ui';
import { MEGA_MENU, STRAIN_TYPES } from '@/lib/constants';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
      setExpandedIndex(null);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleEscape]);

  const toggle = (i: number) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 lg:hidden',
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
          'absolute inset-0 flex flex-col bg-base overflow-y-auto transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Close */}
        <div className="relative flex items-center justify-center px-6 py-4">
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

        {/* Nav sections */}
        <nav className="flex-1 px-6 pb-6">
          {MEGA_MENU.map((item, i) => {
            if (item.type === 'link') {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="block border-b border-border-default py-4 text-lg font-semibold text-text-default transition-colors hover:text-accent-primary"
                >
                  {item.label}
                </Link>
              );
            }

            if (item.type === 'cta') {
              return (
                <div key={item.label} className="pt-4">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block w-full rounded-full bg-accent-primary py-3 text-center text-sm font-semibold uppercase tracking-[0.05em] text-text-on-dark transition-colors hover:bg-accent-primary-hover"
                  >
                    {item.label}
                  </Link>
                </div>
              );
            }

            const isExpanded = expandedIndex === i;

            if (item.type === 'category') {
              return (
                <div key={item.label} className="border-b border-border-default">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="flex w-full items-center justify-between py-4 text-lg font-semibold text-text-default transition-colors hover:text-accent-primary"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-text-muted transition-transform duration-200',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-200',
                      isExpanded ? 'max-h-[500px] pb-4' : 'max-h-0'
                    )}
                  >
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                      By Type
                    </p>
                    {STRAIN_TYPES.map((t) => (
                      <Link
                        key={t.slug}
                        href={`/products/${item.category.slug}?type=${t.slug}`}
                        onClick={onClose}
                        className="block py-1.5 pl-3 text-sm text-text-default transition-colors hover:text-accent-primary"
                      >
                        {t.label}
                      </Link>
                    ))}
                    <p className="mb-2 mt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                      By Format
                    </p>
                    {item.category.formats.map((f) => (
                      <Link
                        key={f.slug}
                        href={`/products/${item.category.slug}?format=${f.slug}`}
                        onClick={onClose}
                        className="block py-1.5 pl-3 text-sm text-text-default transition-colors hover:text-accent-primary"
                      >
                        {f.label}
                      </Link>
                    ))}
                    <Link
                      href={`/products/${item.category.slug}`}
                      onClick={onClose}
                      className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-accent-primary"
                    >
                      Shop All {item.category.label}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            }

            if (item.type === 'dropdown') {
              return (
                <div key={item.label} className="border-b border-border-default">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="flex w-full items-center justify-between py-4 text-lg font-semibold text-text-default transition-colors hover:text-accent-primary"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-text-muted transition-transform duration-200',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-200',
                      isExpanded ? 'max-h-[500px] pb-4' : 'max-h-0'
                    )}
                  >
                    {item.columns.map((col) => (
                      <div key={col.heading} className="mb-3">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                          {col.heading}
                        </p>
                        {col.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className="block py-1.5 pl-3 text-sm text-text-default transition-colors hover:text-accent-primary"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </nav>
      </div>
    </div>
  );
}
