'use client';

import { cn } from '@/lib/utils';
import { useUIPreferences } from '@/stores/ui-preferences';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ElementType;
}

interface ModuleTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  accentColor: string;
  className?: string;
}

export function ModuleTabs({
  tabs,
  activeTab,
  onTabChange,
  accentColor,
  className,
}: ModuleTabsProps) {
  const tabStyle = useUIPreferences((s) => s.tabStyle);

  if (tabStyle === 'underline') {
    return (
      <div
        className={cn(
          'flex gap-1 overflow-x-auto border-b border-default scrollbar-none',
          className
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'text-text-bright'
                  : 'text-text-muted hover:text-text-default'
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span className={cn(Icon && 'hidden sm:inline')}>{tab.label}</span>
              {isActive && (
                <div
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Pill mode (default)
  return (
    <div
      className={cn(
        'flex gap-1 overflow-x-auto rounded-xl border border-default bg-base p-1 scrollbar-none',
        className
      )}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors',
              isActive
                ? 'bg-elevated text-text-bright'
                : 'text-text-muted hover:text-text-default'
            )}
          >
            {Icon && <Icon size={14} />}
            <span className={cn(Icon && 'hidden sm:inline')}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
