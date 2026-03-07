'use client';

import { SectionHeader, EmptyState } from '@/components';
import { ArrowUpFromLine } from 'lucide-react';

export default function AccountsPayable() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Accounts Payable" accentColor="#059669" icon={ArrowUpFromLine} />
      <EmptyState
        icon={ArrowUpFromLine}
        title="Coming Soon"
        description="Manage vendor payments, purchase orders, and outgoing payment schedules."
        accentColor="#059669"
      />
    </div>
  );
}
