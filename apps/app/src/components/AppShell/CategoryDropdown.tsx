'use client';

import { Fragment, useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@frost/ui';
import { categories, getCategoryForPath } from './nav-data';
import { usePermissions } from '@/modules/auth/hooks/usePermissions';

export function CategoryDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { allowedModules } = usePermissions();

  const activeCategory = getCategoryForPath(pathname);

  // Filter categories based on permissions
  const visibleCategories = useMemo(
    () =>
      categories.filter((cat) => {
        // Tab-only categories (no route items) are always visible if user has the base module
        if (cat.tabRoute && cat.items.length === 0) {
          const moduleSlug = cat.tabRoute.replace('/', '');
          return allowedModules.has(moduleSlug);
        }
        // Route-based: show if at least one item is permitted
        return cat.items.some((item) => allowedModules.has(item.slug));
      }),
    [allowedModules],
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(cat: typeof categories[number]) {
    setOpen(false);
    if (cat.tabRoute) {
      router.push(cat.tabRoute);
    } else if (cat.items.length > 0) {
      router.push(cat.items[0].href);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
          'text-white hover:bg-white/20',
          open && 'bg-white/20',
        )}
      >
        {activeCategory ? (
          <>
            {(() => {
              const Icon = activeCategory.icon;
              return <Icon className="h-4 w-4 text-white" />;
            })()}
            <span className="text-white">{activeCategory.label}</span>
          </>
        ) : (
          <span className="text-white/70">Navigate</span>
        )}
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-white/70 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 w-56 rounded-xl border border-border-default bg-base/95 shadow-2xl backdrop-blur-md py-2">
          {visibleCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory?.key === cat.key;

            return (
              <Fragment key={cat.key}>
                <button
                  type="button"
                  onClick={() => handleSelect(cat)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'text-text-default hover:bg-white/[0.06]',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isActive ? 'text-accent-primary' : 'text-text-muted',
                    )}
                  />
                  <span className="truncate">{cat.label}</span>
                  {!cat.cultivera && (
                    <Image
                      src="/FrostLogo_SnowflakeOnly.png"
                      alt="Frost"
                      width={14}
                      height={14}
                      className="ml-auto shrink-0 opacity-50"
                    />
                  )}
                </button>
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
