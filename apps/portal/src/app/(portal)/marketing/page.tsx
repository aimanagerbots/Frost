'use client';

import { Megaphone } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components';

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={Megaphone}
        title="Marketing"
        subtitle="Menu assets, POP materials, staff training, and promo programs"
      />
      <div className="flex items-center justify-center rounded-xl border border-border-default bg-card p-16">
        <div className="text-center">
          <Megaphone className="mx-auto h-12 w-12 text-text-muted/30" />
          <p className="mt-4 font-display text-lg font-semibold text-text-bright">
            Coming in Phase 4
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Digital menu assets, in-store materials, and budtender programs
          </p>
        </div>
      </div>
    </div>
  );
}
