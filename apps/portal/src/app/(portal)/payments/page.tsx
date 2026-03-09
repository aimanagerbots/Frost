'use client';

import { CreditCard } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components';

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={CreditCard}
        title="Payments"
        subtitle="Manage invoices and payment methods"
      />
      <div className="rounded-xl border border-border-default bg-card p-8 text-center text-text-muted">
        Payments module coming in Phase 10...
      </div>
    </div>
  );
}
