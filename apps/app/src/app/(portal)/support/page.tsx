'use client';

import { Headphones } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components/PortalPageHeader';
import { PortalCard } from '@/modules/portal/shared/components/PortalCard';

export default function PortalSupportPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={Headphones}
        title="Support"
        subtitle="Get help with orders, deliveries, payments, and more"
      />
      <PortalCard>
        <div className="text-center py-12">
          <Headphones className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Help Center</h3>
          <p className="text-sm text-gray-500">Browse FAQs, submit support tickets, and contact your account team.</p>
        </div>
      </PortalCard>
    </div>
  );
}
