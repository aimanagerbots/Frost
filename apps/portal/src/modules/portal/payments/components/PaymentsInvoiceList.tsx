'use client';

import { FileText, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalInvoice } from '@/modules/portal/shared/types';

interface PaymentsInvoiceListProps {
  invoices: PortalInvoice[];
  onPay: (invoiceId: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getComplianceBadge(status: PortalInvoice['complianceStatus']): {
  label: string;
  className: string;
} {
  switch (status) {
    case 'compliant':
      return {
        label: 'Compliant',
        className: 'bg-emerald-500/15 text-emerald-400',
      };
    case 'approaching':
      return {
        label: 'Approaching',
        className: 'bg-amber-500/15 text-amber-400',
      };
    case 'overdue':
      return {
        label: 'Overdue',
        className: 'bg-red-500/15 text-red-400',
      };
  }
}

export function PaymentsInvoiceList({
  invoices,
  onPay,
}: PaymentsInvoiceListProps) {
  const outstanding = invoices.filter(
    (i) => i.status === 'outstanding' || i.status === 'overdue'
  );

  if (outstanding.length === 0) {
    return (
      <div className="rounded-xl border border-border-default bg-card p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
          <FileText className="h-6 w-6 text-emerald-400" />
        </div>
        <p className="text-sm font-medium text-text-default">All caught up!</p>
        <p className="mt-1 text-xs text-text-muted">
          No outstanding invoices at this time.
        </p>
      </div>
    );
  }

  return (
    <div id="outstanding-invoices" className="rounded-xl border border-border-default bg-card">
      {/* Header */}
      <div className="border-b border-border-default px-5 py-4">
        <h3 className="text-sm font-semibold text-text-bright">
          Outstanding Invoices
        </h3>
        <p className="mt-0.5 text-xs text-text-muted">
          {outstanding.length} invoice{outstanding.length !== 1 ? 's' : ''} pending payment
        </p>
      </div>

      {/* List */}
      <div className="divide-y divide-border-default/50">
        {outstanding.map((inv) => {
          const isOverdue = inv.status === 'overdue';
          const badge = getComplianceBadge(inv.complianceStatus);

          return (
            <div
              key={inv.id}
              className={cn(
                'flex items-center gap-4 px-5 py-4 transition-colors hover:bg-elevated/30',
                isOverdue && 'border-l-2 border-l-red-500'
              )}
            >
              {/* Invoice info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-default">
                    {inv.invoiceNumber}
                  </span>
                  <span className={cn('rounded-md px-2 py-0.5 text-xs font-medium', badge.className)}>
                    {badge.label}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-text-muted">
                  Order {inv.orderNumber} — {inv.daysElapsed} day{inv.daysElapsed !== 1 ? 's' : ''} since delivery
                </p>
              </div>

              {/* Amount */}
              <div className="shrink-0 text-right">
                <p className={cn(
                  'text-sm font-semibold',
                  isOverdue ? 'text-red-400' : 'text-text-bright'
                )}>
                  {formatCurrency(inv.amount)}
                </p>
                <p className="text-xs text-text-muted">
                  Due {inv.dueDate}
                </p>
              </div>

              {/* Pay button */}
              <button
                type="button"
                onClick={() => onPay(inv.id)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
                  isOverdue
                    ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                    : 'bg-accent-primary/15 text-accent-primary hover:bg-accent-primary/25'
                )}
              >
                <CreditCard className="h-3.5 w-3.5" />
                Pay
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
