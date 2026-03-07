'use client';

import { SectionHeader, EmptyState } from '@/components';
import { PartyPopper } from 'lucide-react';

export default function Events() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Events" accentColor="#EC4899" icon={PartyPopper} />
      <EmptyState
        icon={PartyPopper}
        title="Coming Soon"
        description="Plan vendor days, industry events, and dispensary activations with ROI tracking."
        accentColor="#EC4899"
      />
    </div>
  );
}
