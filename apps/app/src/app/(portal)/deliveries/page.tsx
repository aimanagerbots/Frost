'use client';

import { Truck } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components/PortalPageHeader';
import { PortalCard } from '@/modules/portal/shared/components/PortalCard';

export default function PortalDeliveriesPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={Truck}
        title="Deliveries"
        subtitle="Track upcoming and past deliveries"
      />
      <PortalCard>
        <div className="text-center py-12">
          <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Delivery Tracking</h3>
          <p className="text-sm text-gray-500">View scheduled deliveries, track in-transit shipments, and manage delivery windows.</p>
        </div>
      </PortalCard>
    </div>
  );
}
