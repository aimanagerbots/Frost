'use client';

import { SectionHeader, EmptyState } from '@/components';
import { Megaphone } from 'lucide-react';

export default function PaidAds() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Paid Ads" accentColor="#EC4899" icon={Megaphone} />
      <EmptyState
        icon={Megaphone}
        title="Coming Soon"
        description="Manage paid advertising campaigns, budgets, and performance across channels."
        accentColor="#EC4899"
      />
    </div>
  );
}
