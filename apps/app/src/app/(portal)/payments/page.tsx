'use client';

import { CreditCard } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components/PortalPageHeader';
import { PortalCard } from '@/modules/portal/shared/components/PortalCard';

export default function PortalPaymentsPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={CreditCard}
        title="Payments"
        subtitle="View invoices, manage payment methods, and track balances"
      />
      <PortalCard>
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Payment Center</h3>
          <p className="text-sm text-gray-500">View outstanding invoices, set up ACH payments, and track your payment history.</p>
        </div>
      </PortalCard>
    </div>
  );
}
