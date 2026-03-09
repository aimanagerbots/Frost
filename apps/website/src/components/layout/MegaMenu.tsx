'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@frost/ui';
import { MEGA_MENU } from '@/lib/constants';

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
};

interface MegaMenuProps {
  isScrolled: boolean;
}

export function MegaMenu(_props: MegaMenuProps) {
  const pathname = usePathname();

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

  const baseLink =
    'whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] transition-all duration-200 outline-none';

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
        <NavigationMenu.Item key={item.label}>
          <NavigationMenu.Link asChild>
            <Link href={`/${item.category.route}`} className={linkClassFor(item.label)}>
              {item.label}
            </Link>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      );
    }

    if (item.type === 'dropdown') {
      const href = NAV_PATH_MAP[item.label] ?? '#';
      return (
        <NavigationMenu.Item key={item.label}>
          <NavigationMenu.Link asChild>
            <Link href={href} className={linkClassFor(item.label)}>
              {item.label}
            </Link>
          </NavigationMenu.Link>
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
