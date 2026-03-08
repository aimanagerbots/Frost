'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@frost/ui';
import {
  MEGA_MENU,
  STRAIN_TYPES,
  type MegaMenuCategoryItem,
  type MegaMenuColumn,
} from '@/lib/constants';

interface MegaMenuProps {
  isScrolled: boolean;
}

/* ── Shop panel: 3×2 grid of all product categories ── */
function ShopPanel({ categories }: { categories: MegaMenuCategoryItem[] }) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4">
        {categories.map((cat) => (
          <NavigationMenu.Link key={cat.slug} asChild>
            <Link
              href={`/products/${cat.slug}`}
              className="group/card rounded-lg border border-border-default bg-elevated/30 p-4 transition-all hover:border-accent-primary/40 hover:bg-elevated/60"
            >
              <h3 className="text-sm font-semibold text-text-default transition-colors group-hover/card:text-accent-primary">
                {cat.label}
              </h3>
              <p className="mt-1 text-[11px] text-text-muted">{cat.brand}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {cat.formats.slice(0, 3).map((f) => (
                  <span
                    key={f.slug}
                    className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-text-muted"
                  >
                    {f.label}
                  </span>
                ))}
                {cat.formats.length > 3 && (
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-text-muted">
                    +{cat.formats.length - 3}
                  </span>
                )}
              </div>
            </Link>
          </NavigationMenu.Link>
        ))}
      </div>
      <div className="mt-4 border-t border-border-default pt-4">
        <NavigationMenu.Link asChild>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-accent-primary transition-colors hover:text-accent-primary-hover"
          >
            Browse All Products
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </NavigationMenu.Link>
      </div>
    </div>
  );
}

/* ── Generic multi-column panel for Strains / Resources ── */
function ColumnsPanel({ columns }: { columns: MegaMenuColumn[] }) {
  return (
    <div
      className="grid gap-8 p-6"
      style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}
    >
      {columns.map((col) => (
        <div key={col.heading}>
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            {col.heading}
          </h3>
          <ul className="space-y-2">
            {col.links.map((link) => (
              <li key={link.href}>
                <NavigationMenu.Link asChild>
                  <Link
                    href={link.href}
                    className="block text-sm text-text-default transition-colors hover:text-accent-primary"
                  >
                    {link.label}
                  </Link>
                </NavigationMenu.Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ── Content wrapper with consistent styling ── */
function PanelWrapper({
  children,
  width,
}: {
  children: React.ReactNode;
  width: string;
}) {
  return (
    <NavigationMenu.Content
      className={cn(
        'absolute top-full left-0',
        width,
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1',
        'duration-200'
      )}
    >
      <div className="mt-2 rounded-xl border border-border-default bg-base/95 shadow-2xl backdrop-blur-md">
        {children}
      </div>
    </NavigationMenu.Content>
  );
}

export function MegaMenu({ isScrolled }: MegaMenuProps) {
  const triggerClass = cn(
    'group inline-flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors duration-200 outline-none',
    'data-[state=open]:text-accent-primary',
    isScrolled
      ? 'text-text-muted hover:text-text-default'
      : 'text-text-on-dark-muted hover:text-text-on-dark'
  );

  const linkClass = cn(
    'whitespace-nowrap rounded-md px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors duration-200 outline-none',
    isScrolled
      ? 'text-text-muted hover:text-text-default'
      : 'text-text-on-dark-muted hover:text-text-on-dark'
  );

  // Gather all product categories for the Shop panel
  const categories = MEGA_MENU
    .filter((item): item is Extract<typeof item, { type: 'category' }> => item.type === 'category')
    .map((item) => item.category);

  // Non-category items
  const otherItems = MEGA_MENU.filter((item) => item.type !== 'category');

  return (
    <NavigationMenu.Root className="relative hidden lg:block" delayDuration={150}>
      <NavigationMenu.List className="flex items-center gap-1">
        {/* Shop — consolidated product categories */}
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={triggerClass}>
            Shop
            <ChevronDown
              className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <PanelWrapper width="w-[640px]">
            <ShopPanel categories={categories} />
          </PanelWrapper>
        </NavigationMenu.Item>

        {/* Remaining items: Strains, Find Near You, Resources, Wholesale */}
        {otherItems.map((item) => {
          if (item.type === 'dropdown') {
            const width = item.columns.length <= 2 ? 'w-[320px]' : 'w-[480px]';
            return (
              <NavigationMenu.Item key={item.label}>
                <NavigationMenu.Trigger className={triggerClass}>
                  {item.label}
                  <ChevronDown
                    className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
                    aria-hidden
                  />
                </NavigationMenu.Trigger>
                <PanelWrapper width={width}>
                  <ColumnsPanel columns={item.columns} />
                </PanelWrapper>
              </NavigationMenu.Item>
            );
          }

          if (item.type === 'link') {
            return (
              <NavigationMenu.Item key={item.label}>
                <NavigationMenu.Link asChild>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            );
          }

          if (item.type === 'cta') {
            return (
              <NavigationMenu.Item key={item.label}>
                <NavigationMenu.Link asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'whitespace-nowrap rounded-full px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors duration-200',
                      isScrolled
                        ? 'bg-accent-primary text-text-on-dark hover:bg-accent-primary-hover'
                        : 'bg-white/15 text-text-on-dark backdrop-blur-sm hover:bg-white/25'
                    )}
                  >
                    {item.label}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            );
          }

          return null;
        })}
      </NavigationMenu.List>

      {/* Viewport — Radix renders dropdown content here with size animation */}
      <NavigationMenu.Viewport className="absolute top-full left-0 w-full" />
    </NavigationMenu.Root>
  );
}
