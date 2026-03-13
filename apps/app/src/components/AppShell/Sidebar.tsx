'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { PanelLeft, ChevronDown } from 'lucide-react';
import { cn } from '@frost/ui';
import { useSidebarStore } from './store';
import { getCategoryForPath } from './nav-data';
import { useTeamDMs } from '@/modules/chat/hooks/useTeamChat';
import { usePermissions } from '@/modules/auth/hooks/usePermissions';

const LOCATIONS = ['Frost Building 7', 'Frost Building 1', 'Frost Building 3'];
const LOCATION_KEY = 'frost-active-location';

function LocationDropdown() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(() => {
    if (typeof window === 'undefined') return LOCATIONS[0];
    return localStorage.getItem(LOCATION_KEY) ?? LOCATIONS[0];
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function select(loc: string) {
    setLocation(loc);
    localStorage.setItem(LOCATION_KEY, loc);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative px-3 pt-1 pb-2 border-b border-border-default">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-full gap-1.5 rounded-md px-2 py-1.5 hover:bg-white/[0.04] transition-colors"
      >
        <span className="text-sm font-semibold text-text-bright truncate">{location}</span>
        <ChevronDown className={cn('h-3 w-3 text-text-muted shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-3 right-3 top-full mt-1 z-50 rounded-lg border border-border-default bg-base/95 shadow-2xl backdrop-blur-md py-1">
          {LOCATIONS.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => select(loc)}
              className={cn(
                'flex w-full items-center px-3 py-2 text-sm transition-colors',
                loc === location ? 'text-accent-primary bg-accent-primary/10' : 'text-text-default hover:bg-white/[0.06]',
              )}
            >
              {loc}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarInner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { collapsed, mobileOpen, toggleCollapsed, setMobileOpen } =
    useSidebarStore();
  const { data: dms } = useTeamDMs();
  const dmUnreadCount = (dms ?? []).reduce((sum, dm) => sum + dm.unreadCount, 0);
  const { allowedModules } = usePermissions();

  const activeCategory = getCategoryForPath(pathname);
  const activeTab = searchParams.get('tab');

  // Filter route-based items by permissions
  const filteredItems = useMemo(() => {
    if (!activeCategory) return [];
    return activeCategory.items.filter((item) => allowedModules.has(item.slug));
  }, [activeCategory, allowedModules]);

  // Filter extra route items by permissions
  const filteredExtraItems = useMemo(() => {
    if (!activeCategory?.extraItems) return [];
    return activeCategory.extraItems.filter((item) => allowedModules.has(item.slug));
  }, [activeCategory, allowedModules]);

  function handleTabClick(tab: string, sub?: string) {
    if (!activeCategory?.tabRoute) return;
    const params = new URLSearchParams();
    params.set('tab', tab);
    if (sub) params.set('sub', sub);
    router.push(`${activeCategory.tabRoute}?${params.toString()}`);
    setMobileOpen(false);
  }

  // Determine if we have anything to show
  const hasTabs = activeCategory?.tabs && activeCategory.tabs.length > 0;
  const hasExtraTabs = activeCategory?.extraTabs && activeCategory.extraTabs.length > 0;
  const hasItems = filteredItems.length > 0;
  const hasExtraItems = filteredExtraItems.length > 0;
  const hasContent = hasTabs || hasExtraTabs || hasItems || hasExtraItems;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 bottom-0 z-50 flex flex-col border-r border-border-default bg-card/80 backdrop-blur-xl transition-all duration-300 lg:translate-x-0 lg:static',
          collapsed ? 'w-16' : 'w-[260px]',
          mobileOpen ? 'translate-x-0 top-0' : '-translate-x-full top-0',
          'lg:top-0'
        )}
      >
        {/* Location picker */}
        {!collapsed && <LocationDropdown />}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pt-4 pb-3 space-y-0.5">
          {!hasContent && !collapsed && (
            <p className="px-3 py-6 text-xs text-text-muted text-center">
              Select a category from the dropdown above
            </p>
          )}

          {/* Tab-based items */}
          {hasTabs &&
            activeCategory!.tabs!.map((tab) => {
              const isActive = activeTab === tab.tab;

              return (
                <button
                  key={tab.tab}
                  type="button"
                  onClick={() => handleTabClick(tab.tab, tab.sub)}
                  className={cn(
                    'group relative flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-all text-left',
                    collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                    isActive
                      ? 'bg-accent-primary/10 text-accent-primary shadow-[0_0_12px_2px_rgba(91,184,230,0.4),0_0_24px_4px_rgba(91,184,230,0.2)]'
                      : 'text-text-muted hover:bg-white/[0.04] hover:text-text-default',
                  )}
                  title={collapsed ? tab.label : undefined}
                >
                  {!collapsed && <span className="truncate">{tab.label}</span>}
                  {collapsed && (
                    <span className="text-[10px] font-bold uppercase">
                      {tab.label.charAt(0)}
                    </span>
                  )}
                </button>
              );
            })}

          {/* Extra tabs separator */}
          {hasExtraTabs && !collapsed && (
            <div className="px-3 pt-3 pb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">— More —</span>
            </div>
          )}

          {/* Extra tabs (Frost-only) */}
          {hasExtraTabs &&
            activeCategory!.extraTabs!.map((tab) => {
              const isActive = activeTab === tab.tab;

              return (
                <button
                  key={tab.tab}
                  type="button"
                  onClick={() => handleTabClick(tab.tab, tab.sub)}
                  className={cn(
                    'group relative flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-all text-left',
                    collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                    isActive
                      ? 'bg-accent-primary/10 text-accent-primary shadow-[0_0_12px_2px_rgba(91,184,230,0.4),0_0_24px_4px_rgba(91,184,230,0.2)]'
                      : 'text-text-muted hover:bg-white/[0.04] hover:text-text-default',
                  )}
                  title={collapsed ? tab.label : undefined}
                >
                  {!collapsed && <span className="truncate">{tab.label}</span>}
                  {collapsed && (
                    <span className="text-[10px] font-bold uppercase">
                      {tab.label.charAt(0)}
                    </span>
                  )}
                </button>
              );
            })}

          {/* Separator between tabs and route items if both exist */}
          {(hasTabs || hasExtraTabs) && hasItems && !collapsed && (
            <div className="px-3 pt-3 pb-1">
              <div className="h-px bg-border-default" />
            </div>
          )}

          {/* Route-based items */}
          {filteredItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            const showBadge = item.href === '/chat' && dmUnreadCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg text-sm font-medium transition-all',
                  collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                  active
                    ? 'bg-accent-primary/10 text-accent-primary shadow-[0_0_12px_2px_rgba(91,184,230,0.4),0_0_24px_4px_rgba(91,184,230,0.2)]'
                    : 'text-text-muted hover:bg-white/[0.04] hover:text-text-default',
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    active
                      ? 'text-accent-primary'
                      : 'text-text-muted group-hover:text-text-default',
                  )}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {showBadge && (
                  <span
                    className={cn(
                      'flex items-center justify-center rounded-full bg-accent-primary text-[10px] font-bold text-white',
                      collapsed
                        ? 'absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1'
                        : 'ml-auto h-5 min-w-5 px-1.5',
                    )}
                  >
                    {dmUnreadCount}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Separator between core and Frost-extra route items */}
          {filteredExtraItems.length > 0 && filteredItems.length > 0 && !collapsed && (
            <div className="my-2 mx-3 h-px bg-border-default" />
          )}

          {/* Frost-extra route items */}
          {filteredExtraItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg text-sm font-medium transition-all',
                  collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                  active
                    ? 'bg-accent-primary/10 text-accent-primary shadow-[0_0_12px_2px_rgba(91,184,230,0.4),0_0_24px_4px_rgba(91,184,230,0.2)]'
                    : 'text-text-muted hover:bg-white/[0.04] hover:text-text-default',
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0',
                    active
                      ? 'text-accent-primary'
                      : 'text-text-muted group-hover:text-text-default',
                  )}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border-default px-4 py-4">
          {collapsed ? (
            <div className="flex items-center justify-center">
              <button
                onClick={toggleCollapsed}
                className="p-2 rounded-md text-text-muted hover:text-text-default hover:bg-white/[0.04] transition-colors"
                aria-label="Expand sidebar"
              >
                <PanelLeft className="h-[18px] w-[18px]" />
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-text-muted">Powered by Frost</p>
          )}
        </div>
      </aside>
    </>
  );
}

export function Sidebar() {
  return (
    <Suspense>
      <SidebarInner />
    </Suspense>
  );
}
