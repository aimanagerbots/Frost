'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@frost/ui';
import {
  MEGA_MENU,
  type MegaMenuCategoryItem,
  type MegaMenuColumn,
} from '@/lib/constants';

/** Map nav labels to the path prefixes they represent */
const NAV_PATH_MAP: Record<string, string> = {
  Flower: '/flower',
  'Pre-Rolls': '/pre-rolls',
  Vaporizers: '/vaporizers',
  Concentrates: '/concentrates',
  Edibles: '/edibles',
  Drinks: '/drinks',
  'Strain Library': '/strains',
  Blog: '/blog',
  Resources: '/faq',
  Merch: '/merch',
  Account: '/account',
};

interface MegaMenuProps {
  isScrolled: boolean;
}

/* ── Single category panel ── */
function CategoryPanel({ category }: { category: MegaMenuCategoryItem }) {
  return (
    <div className="p-5">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
        {category.brand}
      </p>
      <ul className="space-y-1.5">
        {category.formats.map((f) => (
          <li key={f.slug}>
            <NavigationMenu.Link asChild>
              <Link
                href={`/${category.route}?format=${f.slug}`}
                className="block text-sm text-text-default transition-colors hover:text-accent-primary"
              >
                {f.label}
              </Link>
            </NavigationMenu.Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t border-border-default pt-3">
        <NavigationMenu.Link asChild>
          <Link
            href={`/${category.route}`}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-accent-primary transition-colors hover:text-accent-primary-hover"
          >
            Browse All {category.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </NavigationMenu.Link>
      </div>
    </div>
  );
}

/* ── Generic multi-column panel for Strains / Resources ── */
function ColumnsPanel({
  columns,
  browseAllHref,
  browseAllLabel,
}: {
  columns: MegaMenuColumn[];
  browseAllHref?: string;
  browseAllLabel?: string;
}) {
  return (
    <div className="p-6">
      <div
        className="grid gap-8"
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
      {browseAllHref && browseAllLabel && (
        <div className="mt-4 border-t border-border-default pt-3">
          <NavigationMenu.Link asChild>
            <Link
              href={browseAllHref}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.05em] text-accent-primary transition-colors hover:text-accent-primary-hover"
            >
              {browseAllLabel}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </NavigationMenu.Link>
        </div>
      )}
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
  const pathname = usePathname();
  const router = useRouter();

  /** Check if a nav item is active based on current pathname */
  function isActive(label: string): boolean {
    const prefix = NAV_PATH_MAP[label];
    if (!prefix) return false;
    // Resources matches multiple paths
    if (label === 'Resources') {
      return ['/faq', '/newsletter', '/contact', '/wholesale'].some((p) =>
        pathname.startsWith(p)
      );
    }
    return pathname.startsWith(prefix);
  }

  const baseTrigger =
    'group inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] transition-all duration-200 outline-none';

  const baseLink =
    'whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] transition-all duration-200 outline-none';

  function triggerClass(label: string) {
    const active = isActive(label);
    return cn(
      baseTrigger,
      active
        ? 'bg-accent-primary/20 text-accent-primary'
        : 'text-text-default hover:text-accent-primary',
      'data-[state=open]:text-accent-primary'
    );
  }

  function linkClassFor(label: string) {
    const active = isActive(label);
    return cn(
      baseLink,
      active
        ? 'bg-accent-primary/20 text-accent-primary'
        : 'text-text-default hover:text-accent-primary'
    );
  }

  // Split items: categories (left of logo), other nav (right of logo), CTAs (far right)
  const leftItems = MEGA_MENU.filter((item) => item.type === 'category');
  const rightItems = MEGA_MENU.filter(
    (item) => item.type === 'dropdown' || item.type === 'link'
  );

  function renderNavItem(item: (typeof MEGA_MENU)[number]) {
    if (item.type === 'category') {
      return (
        <NavigationMenu.Item key={item.label} className="relative">
          <NavigationMenu.Trigger
            className={triggerClass(item.label)}
            onClick={(e) => {
              e.preventDefault();
              router.push(`/${item.category.route}`);
            }}
          >
            {item.label}
            <ChevronDown
              className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <PanelWrapper width="w-[220px]">
            <CategoryPanel category={item.category} />
          </PanelWrapper>
        </NavigationMenu.Item>
      );
    }

    if (item.type === 'dropdown') {
      const width =
        item.columns.length <= 1
          ? 'w-[220px]'
          : item.columns.length <= 2
            ? 'w-[320px]'
            : 'w-[480px]';
      const clickHref = NAV_PATH_MAP[item.label];
      return (
        <NavigationMenu.Item key={item.label} className="relative">
          <NavigationMenu.Trigger
            className={triggerClass(item.label)}
            onClick={clickHref ? (e) => {
              e.preventDefault();
              router.push(clickHref);
            } : undefined}
          >
            {item.label}
            <ChevronDown
              className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <PanelWrapper width={width}>
            <ColumnsPanel
              columns={item.columns}
              browseAllHref={item.label === 'Strain Library' ? '/strains' : undefined}
              browseAllLabel={item.label === 'Strain Library' ? 'Browse All Strains' : undefined}
            />
          </PanelWrapper>
        </NavigationMenu.Item>
      );
    }

    if (item.type === 'link') {
      return (
        <NavigationMenu.Item key={item.label}>
          <NavigationMenu.Link asChild>
            <Link href={item.href} className={linkClassFor(item.label)}>
              {item.label}
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      );
    }

    return null;
  }

  return (
    <NavigationMenu.Root className="relative hidden lg:flex items-center" delayDuration={150}>
      <NavigationMenu.List className="flex items-center gap-1">
        {/* Product categories */}
        {leftItems.map(renderNavItem)}

        {/* Small gap between Drinks and Strain Library */}
        <li className="w-6 shrink-0" aria-hidden="true" />

        {/* Strain Library, Blog, Resources */}
        {rightItems.map(renderNavItem)}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
