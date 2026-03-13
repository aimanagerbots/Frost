'use client';

import { Fragment, useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@frost/ui';
import { categories, getCategoryForPath } from './nav-data';
import { usePermissions } from '@/modules/auth/hooks/usePermissions';
import { useTeamDMs } from '@/modules/chat/hooks/useTeamChat';

interface AppMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppMobileMenu({ isOpen, onClose }: AppMobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [rawExpandedIndex, setRawExpandedIndex] = useState<number | null>(null);
  const expandedIndex = isOpen ? rawExpandedIndex : null;
  const { allowedModules } = usePermissions();
  const { data: dms } = useTeamDMs();
  const dmUnreadCount = (dms ?? []).reduce((sum, dm) => sum + dm.unreadCount, 0);

  const activeCategory = getCategoryForPath(pathname);

  const visibleCategories = useMemo(
    () =>
      categories.filter((cat) => {
        if (cat.tabRoute && cat.items.length === 0) {
          const moduleSlug = cat.tabRoute.replace('/', '');
          return allowedModules.has(moduleSlug);
        }
        return cat.items.some((item) => allowedModules.has(item.slug));
      }),
    [allowedModules],
  );

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
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

  function handleTabClick(tabRoute: string, tab: string, sub?: string) {
    const params = new URLSearchParams();
    params.set('tab', tab);
    if (sub) params.set('sub', sub);
    router.push(`${tabRoute}?${params.toString()}`);
    onClose();
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[60] lg:hidden',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none',
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          'absolute inset-0 flex flex-col bg-base h-dvh transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
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

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Dashboard link */}
          <Link
            href="/dashboard"
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 border-b border-border-default py-4 text-lg font-semibold transition-colors',
              pathname === '/dashboard'
                ? 'text-accent-primary'
                : 'text-text-default hover:text-accent-primary',
            )}
          >
            Dashboard
          </Link>

          {/* Category accordions */}
          {visibleCategories.map((cat, i) => {
            const Icon = cat.icon;
            const isExpanded = expandedIndex === i;
            const isActive = activeCategory?.key === cat.key;
            const hasTabs = cat.tabs && cat.tabs.length > 0;
            const hasExtraTabs = cat.extraTabs && cat.extraTabs.length > 0;
            const hasItems = cat.items.length > 0;
            const prevCat = visibleCategories[i - 1];
            const showDivider = cat.cultivera === false && prevCat?.cultivera === true;

            return (
              <Fragment key={cat.key}>
              {showDivider && (
                <div className="border-b border-border-default py-2">
                  <span className="block px-0 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                    More
                  </span>
                </div>
              )}
              <div className="border-b border-border-default">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={cn(
                    'flex w-full items-center gap-3 justify-between py-4 text-lg font-semibold transition-colors',
                    isActive
                      ? 'text-accent-primary'
                      : 'text-text-default hover:text-accent-primary',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    {cat.label}
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-text-muted transition-transform duration-200',
                      isExpanded && 'rotate-180',
                    )}
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    isExpanded ? 'max-h-[800px] pb-4' : 'max-h-0',
                  )}
                >
                  {/* Tab-based sub-items */}
                  {hasTabs &&
                    cat.tabs!.map((tab) => (
                      <button
                        key={tab.tab}
                        type="button"
                        onClick={() =>
                          handleTabClick(cat.tabRoute!, tab.tab, tab.sub)
                        }
                        className="flex w-full items-center gap-3 py-2 pl-3 text-sm text-text-default transition-colors hover:text-accent-primary text-left"
                      >
                        {tab.label}
                      </button>
                    ))}

                  {/* Extra tabs separator + items */}
                  {hasExtraTabs && (
                    <>
                      <div className="px-3 pt-2 pb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">— More —</span>
                      </div>
                      {cat.extraTabs!.map((tab) => (
                        <button
                          key={tab.tab}
                          type="button"
                          onClick={() =>
                            handleTabClick(cat.tabRoute!, tab.tab, tab.sub)
                          }
                          className="flex w-full items-center gap-3 py-2 pl-3 text-sm text-text-default transition-colors hover:text-accent-primary text-left"
                        >
                          {tab.label}
                        </button>
                      ))}
                    </>
                  )}

                  {/* Route-based sub-items */}
                  {hasItems &&
                    cat.items
                      .filter((item) => allowedModules.has(item.slug))
                      .map((item) => {
                        const ItemIcon = item.icon;
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
                                : 'text-text-default hover:text-accent-primary',
                            )}
                          >
                            <ItemIcon className="h-4 w-4 shrink-0" />
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
              </Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
