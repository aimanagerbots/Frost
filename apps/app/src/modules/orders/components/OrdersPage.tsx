'use client';

import { useState } from 'react';
import { ClipboardList, LayoutDashboard, List } from 'lucide-react';
import { SectionHeader, ModuleTabs } from '@/components';
import { useOrderMetrics } from '../hooks/useOrderMetrics';
import { OrdersDashboard } from './OrdersDashboard';
import { OrdersQueue } from './OrdersQueue';
import { ACCENT as ORDERS_ACCENT } from '@/design/colors';


type OrdersTab = 'dashboard' | 'queue';

const TABS: { id: OrdersTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'queue', label: 'Order Queue', icon: List },
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
      <ModuleTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as OrdersTab)}
        accentColor={ORDERS_ACCENT}
      />

      {activeTab === 'dashboard' && <OrdersDashboard />}
      {activeTab === 'queue' && <OrdersQueue />}
    </div>
  );
}
