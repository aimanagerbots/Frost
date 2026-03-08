'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeft, X } from 'lucide-react';
import { useSidebarStore } from './store';
import { navGroups } from './nav-data';

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, mobileOpen, toggleCollapsed, setMobileOpen } =
    useSidebarStore();

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
          fixed top-0 left-0 z-50 flex h-screen flex-col
          border-r border-border-default bg-black
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-60'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative
        `}
      >
        {/* Mobile close */}
        <div className="flex h-14 items-center justify-end px-4 border-b border-border-default lg:hidden">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 text-text-muted hover:text-text-default"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-4">
              {!collapsed && (
                <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/60">
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
                          ? 'text-white font-medium'
                          : 'text-white hover:text-white hover:bg-white/5'
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
                      className={isActive ? '' : 'text-white'}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="hidden lg:flex items-center justify-center border-t border-border-default py-3">
          <button
            onClick={toggleCollapsed}
            className="p-2 rounded-md text-text-muted hover:text-text-default hover:bg-elevated transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
}
