'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@frost/ui';
import { navGroups, type NavItem } from './nav-data';
import { usePermissions } from '@/modules/auth/hooks/usePermissions';
import { useMemo } from 'react';

/* ── Nav group config ────────────────────────────────────────────── */

interface MenuTrigger {
  type: 'link' | 'dropdown';
  label: string;
  href?: string;
  groups: { title: string; items: NavItem[] }[];
}

/**
 * Build the 8 top-level nav triggers from navGroups.
 * Chat & Dashboard are direct links; the rest are dropdowns.
 */
function buildMenuTriggers(
  filteredGroups: { title: string; items: NavItem[] }[]
): MenuTrigger[] {
  const triggers: MenuTrigger[] = [];

  for (const group of filteredGroups) {
    if (group.title === 'MAIN') {
      // Chat and Dashboard are direct links
      for (const item of group.items) {
        triggers.push({
          type: 'link',
          label: item.label,
          href: item.href,
          groups: [],
        });
      }
    } else if (group.title === 'AI & KNOWLEDGE' || group.title === 'ADMIN') {
      // Merge into "More" dropdown
      const existing = triggers.find((t) => t.label === 'More');
      if (existing) {
        existing.groups.push(group);
      } else {
        triggers.push({
          type: 'dropdown',
          label: 'More',
          groups: [group],
        });
      }
    } else {
      triggers.push({
        type: 'dropdown',
        label: group.title === 'SALES & CRM' ? 'Sales & CRM' : capitalize(group.title),
        groups: [group],
      });
    }
  }

  return triggers;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/* ── Icon grid panel ─────────────────────────────────────────────── */

function IconGridPanel({
  groups,
  onNavigate,
  pathname,
}: {
  groups: { title: string; items: NavItem[] }[];
  onNavigate: (href: string) => void;
  pathname: string;
}) {
  const isMultiSection = groups.length > 1;

  return (
    <div className={cn('p-4', isMultiSection && 'flex gap-6')}>
      {groups.map((group) => (
        <div key={group.title} className={cn(isMultiSection && 'min-w-[180px]')}>
          {isMultiSection && (
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              {group.title}
            </p>
          )}
          <div className="grid grid-cols-3 gap-2">
            {group.items.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <NavigationMenu.Link key={item.href} asChild>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.href)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-lg px-2 py-3 transition-all duration-150',
                      active
                        ? 'bg-accent-primary/15 text-accent-primary'
                        : 'bg-white/[0.03] text-text-muted hover:bg-white/[0.06] hover:text-text-default'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[10px] font-medium leading-tight text-center whitespace-nowrap">
                      {item.label}
                    </span>
                  </button>
                </NavigationMenu.Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Panel wrapper ───────────────────────────────────────────────── */

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
        'absolute top-full left-1/2 -translate-x-1/2',
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

/* ── Main component ──────────────────────────────────────────────── */

export function AppMegaMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { allowedModules } = usePermissions();

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

  const triggers = useMemo(
    () => buildMenuTriggers(filteredGroups),
    [filteredGroups]
  );

  function isGroupActive(trigger: MenuTrigger): boolean {
    if (trigger.type === 'link') {
      return (
        pathname === trigger.href ||
        pathname.startsWith(trigger.href + '/')
      );
    }
    return trigger.groups.some((group) =>
      group.items.some(
        (item) =>
          pathname === item.href || pathname.startsWith(item.href + '/')
      )
    );
  }

  function handleNavigate(href: string) {
    router.push(href);
  }

  const baseTrigger =
    'group inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] transition-all duration-200 outline-none';

  const baseLink =
    'whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] transition-all duration-200 outline-none';

  function panelWidth(trigger: MenuTrigger): string {
    const totalItems = trigger.groups.reduce(
      (sum, g) => sum + g.items.length,
      0
    );
    if (trigger.groups.length > 1) return 'w-[440px]';
    if (totalItems <= 4) return 'w-[260px]';
    if (totalItems <= 6) return 'w-[300px]';
    return 'w-[340px]';
  }

  return (
    <NavigationMenu.Root
      className="relative hidden lg:flex items-center"
      delayDuration={150}
    >
      <NavigationMenu.List className="flex items-center gap-0.5">
        {triggers.map((trigger) => {
          const active = isGroupActive(trigger);

          if (trigger.type === 'link') {
            return (
              <NavigationMenu.Item key={trigger.label}>
                <NavigationMenu.Link asChild>
                  <Link
                    href={trigger.href!}
                    className={cn(
                      baseLink,
                      active
                        ? 'bg-accent-primary/20 text-accent-primary'
                        : 'text-text-default hover:text-accent-primary'
                    )}
                  >
                    {trigger.label}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            );
          }

          return (
            <NavigationMenu.Item key={trigger.label} className="relative">
              <NavigationMenu.Trigger
                className={cn(
                  baseTrigger,
                  active
                    ? 'bg-accent-primary/20 text-accent-primary'
                    : 'text-text-default hover:text-accent-primary',
                  'data-[state=open]:text-accent-primary'
                )}
              >
                {trigger.label}
                <ChevronDown
                  className="h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </NavigationMenu.Trigger>
              <PanelWrapper width={panelWidth(trigger)}>
                <IconGridPanel
                  groups={trigger.groups}
                  onNavigate={handleNavigate}
                  pathname={pathname}
                />
              </PanelWrapper>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
