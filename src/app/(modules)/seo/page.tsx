'use client';

import { SectionHeader, EmptyState } from '@/components';
import { Search } from 'lucide-react';

export default function SEO() {
  return (
    <div className="space-y-6">
      <SectionHeader title="SEO / Blog" accentColor="#EC4899" icon={Search} />
      <EmptyState
        icon={Search}
        title="Coming Soon"
        description="SEO optimization tools, blog management, and search performance analytics."
        accentColor="#EC4899"
      />
    </div>
  );
}
