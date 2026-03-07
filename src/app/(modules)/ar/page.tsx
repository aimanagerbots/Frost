'use client';

import { SectionHeader, EmptyState } from '@/components';
import { ArrowDownToLine } from 'lucide-react';

export default function AccountsReceivable() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Accounts Receivable" accentColor="#059669" icon={ArrowDownToLine} />
      <EmptyState
        icon={ArrowDownToLine}
        title="Coming Soon"
        description="Track incoming payments, manage invoices, and monitor outstanding receivables."
        accentColor="#059669"
      />
    </div>
  );
}
