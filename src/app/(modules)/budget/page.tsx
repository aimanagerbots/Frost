'use client';

import { SectionHeader, EmptyState } from '@/components';
import { Calculator } from 'lucide-react';

export default function Budget() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Budget & Planning" accentColor="#059669" icon={Calculator} />
      <EmptyState
        icon={Calculator}
        title="Coming Soon"
        description="Financial budgeting, forecasting, and strategic planning tools."
        accentColor="#059669"
      />
    </div>
  );
}
