'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@frost/ui';
import { navGroups } from './nav-data';
import { getSubCategories } from './sub-nav-data';
import { usePermissions } from '@/modules/auth/hooks/usePermissions';
import { useTeamDMs } from '@/modules/chat/hooks/useTeamChat';

interface AppMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppMobileMenu({ isOpen, onClose }: AppMobileMenuProps) {
  const pathname = usePathname();
  const [rawExpandedIndex, setRawExpandedIndex] = useState<number | null>(null);
  const expandedIndex = isOpen ? rawExpandedIndex : null;
  const { allowedModules } = usePermissions();
  const { data: dms } = useTeamDMs();
  const dmUnreadCount = (dms ?? []).reduce((sum, dm) => sum + dm.unreadCount, 0);

  const filteredGroups = useMemo(
    () =>
      navGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => allowedModules.has(item.slug)),
        }))
        .filter((group) => group.items.length > 0),
    [allowedModules]
  );

  const subCats = getSubCategories(pathname);

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

  const toggle = (i: number) => {
    setRawExpandedIndex(expandedIndex === i ? null : i);
  };

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

        {/* Sub-categories for current module */}
        {subCats && (
          <div className="shrink-0 border-b border-border-default px-6 pb-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Current Module
            </p>
            <div className="flex flex-wrap gap-2">
              {subCats.items.map((item) => (
                <Link
                  key={item.tab}
                  href={`${subCats.basePath}?tab=${item.tab}${item.sub ? `&sub=${item.sub}` : ''}`}
                  onClick={onClose}
                  className="rounded-full bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-text-default transition-colors hover:bg-accent-primary/15 hover:text-accent-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-6 pb-6">
          {filteredGroups.map((group, i) => {
            // MAIN items (Chat, Dashboard) as direct links
            if (group.title === 'MAIN') {
              return group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + '/');
                const showBadge = item.href === '/chat' && dmUnreadCount > 0;

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
                        {dmUnreadCount}
                      </span>
                    )}
                  </Link>
                );
              });
            }

            // Other groups as accordion sections
            const isExpanded = expandedIndex === i;
            const hasActiveItem = group.items.some(
              (item) =>
                pathname === item.href ||
                pathname.startsWith(item.href + '/')
            );

            return (
              <div key={group.title} className="border-b border-border-default">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={cn(
                    'flex w-full items-center justify-between py-4 text-lg font-semibold transition-colors',
                    hasActiveItem
                      ? 'text-accent-primary'
                      : 'text-text-default hover:text-accent-primary'
                  )}
                >
                  {group.title === 'SALES & CRM'
                    ? 'Sales & CRM'
                    : group.title === 'AI & KNOWLEDGE'
                      ? 'AI & Knowledge'
                      : group.title.charAt(0) + group.title.slice(1).toLowerCase()}
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
                    isExpanded ? 'max-h-[600px] pb-4' : 'max-h-0'
                  )}
                >
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active =
                      pathname === item.href ||
                      pathname.startsWith(item.href + '/');
                    const showBadge =
                      item.href === '/chat' && dmUnreadCount > 0;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 py-2 pl-3 text-sm transition-colors',
                          active
                            ? 'text-accent-primary'
                            : 'text-text-default hover:text-accent-primary'
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                        {showBadge && (
                          <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-primary px-1 text-[10px] font-bold text-white">
                            {dmUnreadCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
