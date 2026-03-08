'use client';

import { DrawerPanel, StatusBadge } from '@/components';
import type { Bill } from '@/modules/finance/types';

const statusVariant = (s: string) => {
  switch (s) {
    case 'paid': return 'success' as const;
    case 'pending': return 'warning' as const;
    case 'overdue': return 'danger' as const;
    default: return 'default' as const;
  }
};

interface BillDrawerProps {
  bill: Bill | null;
  onClose: () => void;
}

export function BillDrawer({ bill, onClose }: BillDrawerProps) {
  if (!bill) return null;

  return (
    <DrawerPanel open={!!bill} onClose={onClose} title={`Bill — ${bill.vendorName}`} width="md">
      <div className="space-y-6">
        <StatusBadge variant={statusVariant(bill.status)} label={bill.status} dot />

        <div className="grid grid-cols-2 gap-4">
          <Detail label="Vendor" value={bill.vendorName} />
          <Detail label="Category" value={bill.category} />
          <Detail label="Amount" value={`$${bill.amount.toLocaleString()}`} />
          <Detail label="Description" value={bill.description} />
          <Detail label="Issued" value={bill.issuedDate} />
          <Detail label="Due" value={bill.dueDate} />
          {bill.paidDate && <Detail label="Paid" value={bill.paidDate} />}
        </div>

        {bill.status !== 'paid' && (
          <button className="w-full px-4 py-2 rounded-lg bg-[#5BB8E6]/20 hover:bg-accent-hover-strong text-[#5BB8E6] text-sm font-medium transition-colors">
            Mark as Paid
          </button>
        )}
      </div>
    </DrawerPanel>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted mb-0.5">{label}</p>
      <p className="text-sm text-default font-medium">{value}</p>
    </div>
  );
}
