'use client';

import type { SalesOrderStatusTab } from '../hooks/useSalesOrders';

interface StatusTabDef {
  id: SalesOrderStatusTab;
  label: string;
  color: string;
}

const STATUS_TABS: StatusTabDef[] = [
  { id: 'all', label: 'Orders', color: '#94A3B8' },
  { id: 'submitted', label: 'Submitted', color: '#F59E0B' },
  { id: 'partially-sublotted', label: 'Partially Sublotted', color: '#F97316' },
  { id: 'sublotted', label: 'Sublotted', color: '#3B82F6' },
  { id: 'manifested', label: 'Manifested', color: '#22C55E' },
  { id: 'quarantined', label: 'Quarantined', color: '#EF4444' },
  { id: 'invoiced', label: 'Invoiced', color: '#8B5CF6' },
];

interface OrderStatusTabsProps {
  activeTab: SalesOrderStatusTab;
  onTabChange: (tab: SalesOrderStatusTab) => void;
  counts?: Record<string, number>;
}

export function OrderStatusTabs({ activeTab, onTabChange, counts }: OrderStatusTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-default bg-card px-3 py-2.5">
      {STATUS_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = counts?.[tab.id];

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative flex items-center gap-1.5 rounded-lg border px-3 py-1.5
              text-xs font-semibold uppercase tracking-wide transition-all
              ${
                isActive
                  ? 'border-transparent text-white shadow-md'
                  : 'border-default bg-transparent text-text-muted hover:border-hover hover:text-text-default'
              }
            `}
            style={
              isActive
                ? { backgroundColor: tab.color, borderColor: tab.color }
                : undefined
            }
          >
            {tab.label}
            {count !== undefined && count > 0 && (
              <span
                className={`
                  ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none
                  ${isActive ? 'bg-white/20 text-white' : 'bg-elevated text-text-muted'}
                `}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
