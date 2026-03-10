'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { PanelLeftClose, PanelLeft, X } from 'lucide-react';
import { cn } from '@frost/ui';
import { useSidebarStore } from './store';
import { navGroups } from './nav-data';
import { useTeamDMs } from '@/modules/chat/hooks/useTeamChat';
import { usePermissions } from '@/modules/auth/hooks/usePermissions';

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, mobileOpen, toggleCollapsed, setMobileOpen } =
    useSidebarStore();
  const { data: dms } = useTeamDMs();
  const dmUnreadCount = (dms ?? []).reduce((sum, dm) => sum + dm.unreadCount, 0);
  const { allowedModules } = usePermissions();

  const filteredGroups = useMemo(
    () =>
      navGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => allowedModules.has(item.slug)),
        }))
        .filter((group) => group.items.length > 0),
    [allowedModules],
  );

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
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border-default bg-card/80 backdrop-blur-xl transition-all duration-300 lg:translate-x-0 lg:static',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo area */}
        <div className={cn(
          'flex h-16 items-center border-b border-border-default',
          collapsed ? 'justify-center px-2' : 'gap-3 px-6'
        )}>
          <Image
            src="/FrostLogo_SnowflakeOnly.png"
            alt="Frost"
            width={32}
            height={32}
            className={cn(collapsed ? 'h-7 w-7' : 'h-8 w-8')}
          />
          {!collapsed && (
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-sm font-semibold text-text-bright font-display tracking-wide">
                Frost
              </span>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={toggleCollapsed}
              className="hidden lg:block p-1.5 rounded-md text-text-muted hover:text-text-default hover:bg-white/[0.04] transition-colors"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-[18px] w-[18px]" />
            </button>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto text-text-muted hover:text-text-default lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {filteredGroups.map((group, groupIdx) => (
            <div key={group.title}>
              {/* Section separator */}
              {groupIdx > 0 && !collapsed && (
                <div className="px-3 pt-4 pb-1 mt-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted/60">
                    {group.title}
                  </p>
                </div>
              )}

              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
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
                        ? 'border-l-[3px] border-accent-primary bg-accent-primary/10 text-accent-primary'
                        : 'text-text-muted hover:bg-white/[0.04] hover:text-text-default'
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={cn(
                        'h-[18px] w-[18px] shrink-0',
                        active
                          ? 'text-accent-primary'
                          : 'text-text-muted group-hover:text-text-default'
                      )}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {showBadge && (
                      <span
                        className={cn(
                          'flex items-center justify-center rounded-full bg-accent-primary text-[10px] font-bold text-white',
                          collapsed
                            ? 'absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1'
                            : 'ml-auto h-5 min-w-5 px-1.5'
                        )}
                      >
                        {dmUnreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
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
