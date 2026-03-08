'use client';

import { useState } from 'react';
import { ClipboardList, LayoutDashboard, List } from 'lucide-react';
import { SectionHeader } from '@/components';
import { useOrderMetrics } from '../hooks/useOrderMetrics';
import { OrdersDashboard } from './OrdersDashboard';
import { OrdersQueue } from './OrdersQueue';

const ORDERS_ACCENT = '#F59E0B';

type OrdersTab = 'dashboard' | 'queue';

const TABS: { key: OrdersTab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'queue', label: 'Order Queue', icon: List },
];

export function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrdersTab>('dashboard');
  const { data: metrics } = useOrderMetrics();

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={ClipboardList}
        title="Orders"
        subtitle="Sales order management"
        accentColor={ORDERS_ACCENT}
        stats={[
          { label: 'Total', value: metrics?.totalOrders ?? 0 },
          { label: 'Pending', value: metrics?.pendingCount ?? 0 },
          { label: 'This Month', value: `$${((metrics?.revenueThisMonth ?? 0) / 1000000).toFixed(2)}M` },
        ]}
      />

      {/* Tab Bar */}
      <div className="flex gap-1 rounded-xl border border-default bg-base p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === key
                ? 'bg-elevated text-text-bright'
                : 'text-text-muted hover:text-text-default'
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && <OrdersDashboard />}
      {activeTab === 'queue' && <OrdersQueue />}
    </div>
  );
}
