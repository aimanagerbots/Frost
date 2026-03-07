'use client';

import { SectionHeader, EmptyState } from '@/components';
import { Wand2 } from 'lucide-react';

export default function ContentCreator() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Content Creator" accentColor="#EC4899" icon={Wand2} />
      <EmptyState
        icon={Wand2}
        title="Coming Soon"
        description="AI-assisted content creation for marketing materials, product descriptions, and brand assets."
        accentColor="#EC4899"
      />
    </div>
  );
}
