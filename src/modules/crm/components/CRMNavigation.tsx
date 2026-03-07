'use client';

import { cn } from '@/lib/utils';
import { useCRMStore, CRM_TABS } from '../store';
import {
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Bot,
  Building2,
  Map,
  Tags,
  Target,
  RefreshCw,
  BookOpen,
  Trophy,
  MessageSquare,
  Megaphone,
  CalendarDays,
  BarChart3,
  Sparkles,
  Shield,
  FileText,
  BookMarked,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Bot,
  Building2,
  Map,
  Tags,
  Target,
  RefreshCw,
  BookOpen,
  Trophy,
  MessageSquare,
  Megaphone,
  CalendarDays,
  BarChart3,
  Sparkles,
  Shield,
  FileText,
  BookMarked,
};

const CRM_ACCENT = '#F59E0B';

export function CRMNavigation() {
  const {
    activeTab,
    activeSubModule,
    breadcrumbs,
    tabBarCollapsed,
    setActiveSubModule,
    toggleTabBar,
  } = useCRMStore();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync URL → store on mount
  useEffect(() => {
    const tab = searchParams.get('tab');
    const sub = searchParams.get('sub');
    if (tab && sub) {
      setActiveSubModule(tab, sub);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync store → URL on change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('tab', activeTab);
    params.set('sub', activeSubModule);
    router.replace(`/crm?${params.toString()}`, { scroll: false });
  }, [activeTab, activeSubModule, router]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleTabClick = useCallback(
    (tabId: string) => {
      if (openDropdown === tabId) {
        setOpenDropdown(null);
      } else {
        setOpenDropdown(tabId);
      }
    },
    [openDropdown]
  );

  const handleSubModuleClick = useCallback(
    (tabId: string, subId: string) => {
      setActiveSubModule(tabId, subId);
      setOpenDropdown(null);
    },
    [setActiveSubModule]
  );

  const activeTabConfig = CRM_TABS.find((t) => t.id === activeTab);
  const activeSubConfig = activeTabConfig?.subModules.find(
    (s) => s.id === activeSubModule
  );

  if (tabBarCollapsed) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-default bg-card px-3 py-2">
        <button
          onClick={toggleTabBar}
          className="flex items-center gap-1 text-xs text-text-muted hover:text-text-default transition-colors"
        >
          <ChevronDown className="h-3.5 w-3.5" />
          <span>Expand</span>
        </button>
        <ChevronRight className="h-3 w-3 text-text-muted" />
        <span className="text-xs font-medium text-text-default">
          {activeTabConfig?.label}
        </span>
        <ChevronRight className="h-3 w-3 text-text-muted" />
        <span className="text-xs" style={{ color: CRM_ACCENT }}>
          {activeSubConfig?.label}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Tab bar */}
      <div
        ref={dropdownRef}
        className="relative flex items-center gap-1 rounded-lg border border-default bg-card px-2"
      >
        {CRM_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div key={tab.id} className="relative">
              <button
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'text-text-bright' : 'text-text-muted hover:text-text-default'
                )}
              >
                {tab.label}
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 transition-transform',
                    openDropdown === tab.id && 'rotate-180'
                  )}
                />
                {isActive && (
                  <div
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{ backgroundColor: CRM_ACCENT }}
                  />
                )}
              </button>

              {/* Dropdown */}
              {openDropdown === tab.id && (
                <div className="absolute top-full left-0 z-40 mt-1 min-w-[200px] rounded-lg border border-default bg-elevated p-1.5 shadow-xl">
                  {tab.subModules.map((sub) => {
                    const Icon = ICON_MAP[sub.icon] || LayoutDashboard;
                    const isActiveSub =
                      activeTab === tab.id && activeSubModule === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSubModuleClick(tab.id, sub.id)}
                        className={cn(
                          'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                          isActiveSub
                            ? 'text-text-bright'
                            : 'text-text-muted hover:bg-card-hover hover:text-text-default'
                        )}
                        style={
                          isActiveSub
                            ? { backgroundColor: `${CRM_ACCENT}15`, color: CRM_ACCENT }
                            : undefined
                        }
                      >
                        <Icon className="h-4 w-4" />
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Collapse toggle */}
        <button
          onClick={toggleTabBar}
          className="ml-auto flex items-center gap-1 px-2 py-1 text-xs text-text-muted hover:text-text-default transition-colors"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Breadcrumb trail */}
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-1.5 px-1 text-xs text-text-muted">
          <span className="font-medium text-text-default">
            {activeTabConfig?.label}
          </span>
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3" />
              <span className={i === breadcrumbs.length - 1 ? 'text-text-default' : ''}>
                {crumb.label}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
