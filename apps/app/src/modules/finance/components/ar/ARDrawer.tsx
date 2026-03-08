'use client';

import { DrawerPanel, StatusBadge } from '@/components';
import type { Invoice } from '@/modules/finance/types';

const ACCENT = '#059669';

const statusVariant = (s: string) => {
  switch (s) {
    case 'paid': return 'success' as const;
    case 'pending': return 'warning' as const;
    case 'overdue': return 'danger' as const;
    case 'partial': return 'info' as const;
    default: return 'default' as const;
  }
};

const complianceVariant = (s: string) => {
  switch (s) {
    case 'compliant': return 'success' as const;
    case 'approaching': return 'warning' as const;
    case 'overdue': return 'danger' as const;
    default: return 'default' as const;
  }
};

const dunningLabels = ['No Action', 'Email Sent', 'Follow-up Email', 'Phone Call', 'Escalation / Hold'];

interface ARDrawerProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export function ARDrawer({ invoice, onClose }: ARDrawerProps) {
  if (!invoice) return null;

  const remaining = invoice.status === 'partial' && invoice.paidAmount
    ? invoice.amount - invoice.paidAmount
    : invoice.status === 'paid'
    ? 0
    : invoice.amount;

  const progressPct = invoice.paidAmount ? (invoice.paidAmount / invoice.amount) * 100 : 0;

  return (
    <DrawerPanel open={!!invoice} onClose={onClose} title={`Invoice ${invoice.invoiceNumber}`} width="md">
      <div className="space-y-6">
        {/* Status Row */}
        <div className="flex items-center gap-2">
          <StatusBadge variant={statusVariant(invoice.status)} label={invoice.status} dot />
          <StatusBadge variant={complianceVariant(invoice.complianceStatus)} label={invoice.complianceStatus} dot />
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-4">
          <Detail label="Account" value={invoice.accountName} />
          <Detail label="Order" value={invoice.orderNumber} />
          <Detail label="Amount" value={`$${invoice.amount.toLocaleString()}`} />
          <Detail label="Days Outstanding" value={String(invoice.daysOutstanding)} />
          <Detail label="Issued" value={invoice.issuedDate} />
          <Detail label="Delivered" value={invoice.deliveredDate} />
          <Detail label="Due Date" value={invoice.dueDate} />
          <Detail label="Compliance" value={
            invoice.complianceDaysRemaining >= 0
              ? `${invoice.complianceDaysRemaining} days remaining`
              : `${Math.abs(invoice.complianceDaysRemaining)} days overdue`
          } />
        </div>

        {/* Payment Progress */}
        {(invoice.status === 'partial' || invoice.status === 'paid') && (
          <div>
            <p className="text-xs font-medium text-muted mb-2">Payment Progress</p>
            <div className="w-full h-3 bg-elevated rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-[#059669] transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-muted">
              <span>${(invoice.paidAmount ?? 0).toLocaleString()} paid</span>
              <span>${remaining.toLocaleString()} remaining</span>
            </div>
          </div>
        )}

        {/* Payment Info */}
        {invoice.paidDate && (
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Paid Date" value={invoice.paidDate} />
            <Detail label="Method" value={invoice.method ?? 'N/A'} />
          </div>
        )}

        {/* Dunning Status */}
        <div>
          <p className="text-xs font-medium text-muted mb-2">Dunning Stage</p>
          <div className="flex gap-1">
            {dunningLabels.map((label, i) => (
              <div
                key={label}
                className={`flex-1 text-center py-1.5 rounded text-[10px] font-medium ${
                  i <= invoice.dunningStage
                    ? i >= 3
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-[#059669]/20 text-[#059669]'
                    : 'bg-elevated text-muted'
                }`}
              >
                {label}
              </div>
            ))}
          </div>
          {invoice.lastReminderDate && (
            <p className="text-xs text-muted mt-1">Last reminder: {invoice.lastReminderDate}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 rounded-lg bg-[#059669]/20 hover:bg-[#059669]/30 text-[#059669] text-sm font-medium transition-colors">
            Record Payment
          </button>
          <button className="flex-1 px-4 py-2 rounded-lg bg-elevated hover:bg-card-hover text-default text-sm font-medium transition-colors">
            Send Reminder
          </button>
        </div>
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
