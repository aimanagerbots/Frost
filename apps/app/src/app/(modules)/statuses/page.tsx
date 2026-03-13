'use client';

import { CheckSquare } from 'lucide-react';
import { SectionHeader, EmptyState } from '@/components';

export default function StatusesPage() {
  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={CheckSquare} title="Statuses" accentColor="#94A3B8" />
      <EmptyState
        icon={CheckSquare}
        title="Statuses"
        description="Configure order and workflow statuses coming soon."
        accentColor="#94A3B8"
      />
    </div>
  );
}
