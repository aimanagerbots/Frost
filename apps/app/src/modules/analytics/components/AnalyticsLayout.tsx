'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LineChart } from 'lucide-react';
import { SectionHeader, EmptyState, LoadingSkeleton, ModuleTabs } from '@/components';
import { MonthlySalesChart } from './MonthlySalesChart';
import { SalesByPersonTable } from './SalesByPersonTable';
import { ClientByProductMatrix } from './ClientByProductMatrix';
import { ProductByClientMatrix } from './ProductByClientMatrix';
import { LastOrderedTable } from './LastOrderedTable';
import { MonthlySalesComparison } from './MonthlySalesComparison';
import { ProductLineSalesTable } from './ProductLineSalesTable';
import { ExpectedDaysInventory } from './ExpectedDaysInventory';

const ACCENT = '#06B6D4';

const TABS: { id: string; label: string }[] = [
  { id: 'monthly-sales', label: 'Monthly Sales (12mo)' },
  { id: 'sales-by-person', label: 'Sales By Person' },
  { id: 'client-by-product', label: 'Client By Product' },
  { id: 'product-by-client', label: 'Product By Client' },
  { id: 'last-ordered', label: 'Last Ordered By Account' },
  { id: 'monthly-comparison', label: 'Monthly Sales Comparison' },
  { id: 'product-line-sales', label: 'Product-Line Sales by Account' },
  { id: 'expected-days', label: 'Expected Days of Inventory' },
  { id: 'harvest-yield', label: 'Harvest Yield' },
  { id: 'production-io', label: 'Production Run I/O' },
  { id: 'sales-recommendations', label: 'Sales Recommendations' },
];

function TabContent({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case 'monthly-sales':
      return <MonthlySalesChart />;
    case 'sales-by-person':
      return <SalesByPersonTable />;
    case 'client-by-product':
      return <ClientByProductMatrix />;
    case 'product-by-client':
      return <ProductByClientMatrix />;
    case 'last-ordered':
      return <LastOrderedTable />;
    case 'monthly-comparison':
      return <MonthlySalesComparison />;
    case 'product-line-sales':
      return <ProductLineSalesTable />;
    case 'expected-days':
      return <ExpectedDaysInventory />;
    default: {
      const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];
      return (
        <EmptyState
          icon={LineChart}
          title={currentTab.label}
          description="This report is coming soon."
          accentColor={ACCENT}
        />
      );
    }
  }
}

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') ?? 'monthly-sales';

  const handleTabChange = (tabId: string) => {
    router.push(`/analytics?tab=${tabId}`);
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={LineChart}
        title="Analytics"
        subtitle="Sales and operations reports"
        accentColor={ACCENT}
      />

      <ModuleTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        accentColor={ACCENT}
      />

      <TabContent activeTab={activeTab} />
    </div>
  );
}

export function AnalyticsLayout() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="list" />}>
      <AnalyticsContent />
    </Suspense>
  );
}
