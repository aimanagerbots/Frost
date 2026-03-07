'use client';

import { SectionHeader, EmptyState } from '@/components';
import { Mail } from 'lucide-react';

export default function Email() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Email" accentColor="#3B82F6" icon={Mail} />
      <EmptyState
        icon={Mail}
        title="Coming Soon"
        description="Integrated email client for managing business communications and customer outreach."
        accentColor="#3B82F6"
      />
    </div>
  );
}
