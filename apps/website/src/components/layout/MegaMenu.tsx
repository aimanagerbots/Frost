'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
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

function CategoryPanel({ category }: { category: MegaMenuCategoryItem }) {
  return (
    <div className="grid grid-cols-3 gap-8 p-6">
      {/* Column 1: By Type */}
      <div>
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
          By Type
        </h3>
        <ul className="space-y-2">
          {STRAIN_TYPES.map((t) => (
            <li key={t.slug}>
              <NavigationMenu.Link asChild>
                <Link
                  href={`/products/${category.slug}?type=${t.slug}`}
                  className="block text-sm text-text-default transition-colors hover:text-accent-primary"
                >
                  {t.label}
                </Link>
              </NavigationMenu.Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 2: By Format */}
      <div>
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
          By Format
        </h3>
        <ul className="space-y-2">
          {category.formats.map((f) => (
            <li key={f.slug}>
              <NavigationMenu.Link asChild>
                <Link
                  href={`/products/${category.slug}?format=${f.slug}`}
                  className="block text-sm text-text-default transition-colors hover:text-accent-primary"
                >
                  {f.label}
                </Link>
              </NavigationMenu.Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Column 3: Brand + Featured */}
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Brand
          </h3>
          <p className="text-sm font-medium text-text-default">{category.brand}</p>
          {category.featured && (
            <div className="mt-4 rounded-lg border border-border-default bg-elevated/50 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-accent-primary">
                <Sparkles className="h-3 w-3" />
                Featured
              </div>
              <NavigationMenu.Link asChild>
                <Link
                  href={`/products/${category.slug}/${category.featured.slug}`}
                  className="text-sm font-medium text-text-default transition-colors hover:text-accent-primary"
                >
                  {category.featured.name}
                </Link>
              </NavigationMenu.Link>
            </div>
          )}
        </div>
        <NavigationMenu.Link asChild>
          <Link
            href={`/products/${category.slug}`}
            className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-accent-primary transition-colors hover:text-accent-primary-hover"
          >
            Shop All {category.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </NavigationMenu.Link>
      </div>
    </div>
  );
}

function ColumnsPanel({ columns }: { columns: MegaMenuColumn[] }) {
  return (
    <div className={cn('grid gap-8 p-6', `grid-cols-${columns.length}`)}>
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

export function MegaMenu({ isScrolled }: MegaMenuProps) {
  const triggerClass = cn(
    'group inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors duration-200 outline-none',
    'data-[state=open]:text-accent-primary',
    isScrolled
      ? 'text-text-muted hover:text-text-default'
      : 'text-text-on-dark-muted hover:text-text-on-dark'
  );

  const linkClass = cn(
    'text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors duration-200 outline-none',
    isScrolled
      ? 'text-text-muted hover:text-text-default'
      : 'text-text-on-dark-muted hover:text-text-on-dark'
  );

  return (
    <NavigationMenu.Root className="relative hidden lg:block" delayDuration={100}>
      <NavigationMenu.List className="flex items-center gap-5">
        {MEGA_MENU.map((item) => {
          if (item.type === 'category') {
            return (
              <NavigationMenu.Item key={item.label}>
                <NavigationMenu.Trigger className={triggerClass}>
                  {item.label}
                  <ChevronDown
                    className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
                    aria-hidden
                  />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute left-0 top-full w-[560px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                  <div className="mt-2 rounded-xl border border-border-default bg-base/95 shadow-2xl backdrop-blur-md">
                    <CategoryPanel category={item.category} />
                  </div>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            );
          }

          if (item.type === 'dropdown') {
            const colCount = item.columns.length;
            const width = colCount <= 2 ? 'w-[360px]' : 'w-[520px]';
            return (
              <NavigationMenu.Item key={item.label}>
                <NavigationMenu.Trigger className={triggerClass}>
                  {item.label}
                  <ChevronDown
                    className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
                    aria-hidden
                  />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className={cn('absolute left-0 top-full', width, 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95')}>
                  <div className="mt-2 rounded-xl border border-border-default bg-base/95 shadow-2xl backdrop-blur-md">
                    <ColumnsPanel columns={item.columns} />
                  </div>
                </NavigationMenu.Content>
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
                      'rounded-full px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.05em] transition-colors duration-200',
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

      {/* Viewport renders dropdown content with size animation */}
      <NavigationMenu.Viewport className="absolute left-0 top-full" />
    </NavigationMenu.Root>
  );
}
