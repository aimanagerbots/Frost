'use client';

import { SectionHeader, EmptyState } from '@/components';
import { SendHorizonal } from 'lucide-react';

export default function EmailMarketing() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Email Marketing" accentColor="#EC4899" icon={SendHorizonal} />
      <EmptyState
        icon={SendHorizonal}
        title="Coming Soon"
        description="Design and send marketing campaigns, drip sequences, and automated email workflows."
        accentColor="#EC4899"
      />
    </div>
  );
}
