'use client';

import { Target } from 'lucide-react';
import { SectionHeader, EmptyState } from '@/components';

export default function LocationsPage() {
  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={Target} title="Locations" accentColor="#94A3B8" />
      <EmptyState
        icon={Target}
        title="Locations"
        description="Manage facility locations and rooms coming soon."
        accentColor="#94A3B8"
      />
    </div>
  );
}
