'use client';

import { ShoppingBag } from 'lucide-react';
import { SectionHeader, EmptyState } from '@/components';

export default function MarketplaceSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={ShoppingBag} title="Marketplace Settings" accentColor="#94A3B8" />
      <EmptyState
        icon={ShoppingBag}
        title="Marketplace Settings"
        description="Configure marketplace integrations coming soon."
        accentColor="#94A3B8"
      />
    </div>
  );
}
