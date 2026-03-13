'use client';

import { PieChart } from 'lucide-react';
import { SectionHeader, EmptyState } from '@/components';

export default function ChartOfAccountsPage() {
  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={PieChart} title="Chart of Accounts" accentColor="#94A3B8" />
      <EmptyState
        icon={PieChart}
        title="Chart of Accounts"
        description="GL account mapping configuration coming soon."
        accentColor="#94A3B8"
      />
    </div>
  );
}
