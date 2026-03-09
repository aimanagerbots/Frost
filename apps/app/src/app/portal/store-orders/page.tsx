'use client';

import { Store } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components/PortalPageHeader';
import { PortalCard } from '@/modules/portal/shared/components/PortalCard';

export default function PortalStoreOrdersPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={Store}
        title="Store Orders"
        subtitle="Manage consumer pickup orders from your storefront"
      />
      <PortalCard>
        <div className="text-center py-12">
          <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Consumer Pickup Orders</h3>
          <p className="text-sm text-gray-500">Accept, prepare, and manage orders from Frost website, Dutchie, Jane, and more.</p>
        </div>
      </PortalCard>
    </div>
  );
}
