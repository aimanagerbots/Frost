'use client';

import { ShoppingCart } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components/PortalPageHeader';
import { PortalCard } from '@/modules/portal/shared/components/PortalCard';

export default function PortalShopPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={ShoppingCart}
        title="Shop"
        subtitle="Browse our wholesale catalog and place orders"
      />
      <PortalCard>
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Product Catalog</h3>
          <p className="text-sm text-gray-500">Browse flower, prerolls, vaporizers, concentrates, edibles, and beverages.</p>
        </div>
      </PortalCard>
    </div>
  );
}
