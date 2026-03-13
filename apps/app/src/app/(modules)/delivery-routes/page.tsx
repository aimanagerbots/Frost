'use client';

import { Truck } from 'lucide-react';
import { SectionHeader, EmptyState } from '@/components';

export default function DeliveryRoutesPage() {
  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={Truck} title="Routes" accentColor="#94A3B8" />
      <EmptyState
        icon={Truck}
        title="Delivery Routes"
        description="Configure delivery route templates coming soon."
        accentColor="#94A3B8"
      />
    </div>
  );
}
