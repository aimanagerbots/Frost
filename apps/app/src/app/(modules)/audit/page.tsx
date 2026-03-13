'use client';

import { Search } from 'lucide-react';
import { SectionHeader, EmptyState } from '@/components';

export default function AuditPage() {
  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={Search} title="Audit" accentColor="#94A3B8" />
      <EmptyState
        icon={Search}
        title="Audit Log"
        description="System audit trail and activity log coming soon."
        accentColor="#94A3B8"
      />
    </div>
  );
}
