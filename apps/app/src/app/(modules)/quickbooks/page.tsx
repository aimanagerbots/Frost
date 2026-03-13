'use client';

import { Calculator } from 'lucide-react';
import { SectionHeader, EmptyState } from '@/components';

export default function QuickBooksPage() {
  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={Calculator} title="QuickBooks" accentColor="#94A3B8" />
      <EmptyState
        icon={Calculator}
        title="QuickBooks Integration"
        description="QuickBooks sync configuration coming soon."
        accentColor="#94A3B8"
      />
    </div>
  );
}
