'use client';

import { BarChart3 } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components';

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={BarChart3}
        title="Insights"
        subtitle="Performance analytics, peer benchmarks, and AI recommendations"
      />
      <div className="flex items-center justify-center rounded-xl border border-border-default bg-card p-16">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-text-muted/30" />
          <p className="mt-4 font-display text-lg font-semibold text-text-bright">
            Coming in Phase 2
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Sell-through analytics, margin calculator, and market trends
          </p>
        </div>
      </div>
    </div>
  );
}
