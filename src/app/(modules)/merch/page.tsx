'use client';

import { SectionHeader, EmptyState } from '@/components';
import { ShoppingBag } from 'lucide-react';

export default function Merch() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Merchandise" accentColor="#EC4899" icon={ShoppingBag} />
      <EmptyState
        icon={ShoppingBag}
        title="Coming Soon"
        description="Design and manage branded merchandise, swag inventory, and promotional items."
        accentColor="#EC4899"
      />
    </div>
  );
}
