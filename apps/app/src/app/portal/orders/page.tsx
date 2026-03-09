'use client';

import { Package } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components/PortalPageHeader';
import { PortalCard } from '@/modules/portal/shared/components/PortalCard';

export default function PortalOrdersPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={Package}
        title="My Orders"
        subtitle="Track your wholesale orders from Frost"
      />
      <PortalCard>
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Order History</h3>
          <p className="text-sm text-gray-500">View order status, tracking, and history for all wholesale purchases.</p>
        </div>
      </PortalCard>
    </div>
  );
}
