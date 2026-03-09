'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { PanelLeftClose, PanelLeft, X } from 'lucide-react';
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
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 flex h-screen flex-col font-bold
          border-r border-border-default bg-base
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-60'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative
        `}
      >
        {/* Mobile close */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-border-default lg:hidden">
          <Image
            src="/FrostLogo_wordmark.png"
            alt="Frost"
            width={1876}
            height={420}
            className="h-7 w-auto"
          />
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 text-text-muted hover:text-text-default"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Logo + collapse toggle — desktop */}
        <div
          className={`
            hidden lg:flex items-center border-b border-border-default
            ${collapsed ? 'justify-center px-2 py-4' : 'justify-between px-4 py-4'}
          `}
        >
          <Image
            src="/FrostLogo_wordmark.png"
            alt="Frost"
            width={1876}
            height={420}
            className={collapsed ? 'h-5 w-auto' : 'h-6 w-auto'}
          />
          {!collapsed && (
            <button
              onClick={toggleCollapsed}
              className="p-1.5 rounded-md text-text-muted hover:text-text-default hover:bg-accent-hover transition-colors"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          {filteredGroups.map((group) => (
            <div key={group.title} className="mb-4">
              {!collapsed && (
                <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-text-muted/60">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`
                      group relative flex items-center gap-3 px-4 py-2 text-sm
                      transition-colors duration-150
                      ${collapsed ? 'justify-center' : ''}
                      ${
                        isActive
                          ? 'text-text-bright font-medium'
                          : 'text-text-default hover:text-text-bright hover:bg-accent-hover'
                      }
                    `}
                    title={collapsed ? item.label : undefined}
                  >
                    {/* Active glow */}
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-r-md"
                        style={{
                          backgroundColor: 'rgba(91, 184, 230, 0.08)',
                          boxShadow: '0 0 20px rgba(91, 184, 230, 0.3), inset 0 0 20px rgba(91, 184, 230, 0.05)',
                        }}
                      />
                    )}
                    {/* Active indicator bar */}
                    {isActive && (
                      <span
                        className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full"
                        style={{
                          backgroundColor: '#5BB8E6',
                          boxShadow: '0 0 8px rgba(91, 184, 230, 0.6)',
                        }}
                      />
                    )}

                    <Icon
                      size={20}
                      style={isActive ? { color: '#5BB8E6', filter: 'drop-shadow(0 0 4px rgba(91, 184, 230, 0.5))' } : undefined}
                      className={isActive ? '' : 'text-text-default'}
                    />
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                    {item.href === '/chat' && dmUnreadCount > 0 && (
                      <span
                        className={`
                          relative flex items-center justify-center rounded-full text-[10px] font-bold text-black
                          ${collapsed ? 'absolute -top-1 -right-1 h-4 min-w-[16px] px-1' : 'h-5 min-w-[20px] px-1.5'}
                        `}
                        style={{
                          background: 'linear-gradient(135deg, #5BB8E6, #4AE0D6)',
                          boxShadow: '0 0 8px rgba(91, 184, 230, 0.6), 0 0 16px rgba(91, 184, 230, 0.3)',
                          animation: 'glow-pulse 2s ease-in-out infinite',
                        }}
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

        {/* Expand toggle — only visible when collapsed */}
        {collapsed && (
          <div className="hidden lg:flex items-center justify-center border-t border-border-default py-3">
            <button
              onClick={toggleCollapsed}
              className="p-2 rounded-md text-text-muted hover:text-text-default hover:bg-accent-hover transition-colors"
              aria-label="Expand sidebar"
            >
              <PanelLeft size={20} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
