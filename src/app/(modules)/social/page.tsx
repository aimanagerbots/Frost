'use client';

import { SectionHeader, EmptyState } from '@/components';
import { Share2 } from 'lucide-react';

export default function Social() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Social Media" accentColor="#EC4899" icon={Share2} />
      <EmptyState
        icon={Share2}
        title="Coming Soon"
        description="Manage social media accounts, schedule posts, and track engagement metrics."
        accentColor="#EC4899"
      />
    </div>
  );
}
