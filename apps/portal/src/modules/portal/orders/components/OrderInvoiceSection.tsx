'use client';

import { FileText, CheckCircle, AlertTriangle, Clock, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalOrder } from '@/modules/portal/shared/types';

interface OrderInvoiceSectionProps {
  order: PortalOrder;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getDueDate(orderDate: string): string {
  const date = new Date(orderDate);
  date.setDate(date.getDate() + 30);
  return date.toISOString();
}

function formatPaymentMethod(method?: 'ach' | 'echeck'): string {
  if (!method) return 'Not set';
  return method === 'ach' ? 'ACH Transfer' : 'eCheck';
}

export function OrderInvoiceSection({ order }: OrderInvoiceSectionProps) {
  const { paymentStatus, invoiceId, paymentMethod, total, orderDate } = order;
  const dueDate = getDueDate(orderDate);

  return (
    <div className="rounded-xl border border-border-default bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-4 w-4 text-text-muted" />
        <h3 className="text-sm font-semibold text-text-bright">
          Invoice &amp; Payment
        </h3>
      </div>

      <div className="space-y-4">
        {/* Invoice number */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Invoice</span>
          <span className="text-sm text-text-default">
            {invoiceId ? `#${invoiceId}` : 'Not yet issued'}
          </span>
        </div>

        {/* Payment method */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Payment Method</span>
          <div className="flex items-center gap-1.5 text-sm text-text-default">
            <CreditCard className="h-3.5 w-3.5 text-text-muted" />
            {formatPaymentMethod(paymentMethod)}
          </div>
        </div>

        {/* Amount due */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">Amount</span>
          <span className="text-sm font-semibold text-text-bright tabular-nums">
            {formatCurrency(total)}
          </span>
        </div>

        {/* Payment status section */}
        <div className="border-t border-border-default pt-4">
          {paymentStatus === 'overdue' && (
            <div className="flex items-start justify-between gap-3 rounded-lg border border-red-500/20 bg-red-500/[0.08] p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                <div>
                  <span className="inline-flex items-center rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-bold text-red-400">
                    OVERDUE
                  </span>
                  <p className="mt-1 text-xs text-text-muted">
                    Payment was due {formatDate(dueDate)}
                  </p>
                </div>
              </div>
              <a
                href="/payments"
                className="flex-shrink-0 rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/25"
              >
                Pay Now
              </a>
            </div>
          )}

          {paymentStatus === 'pending' && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-3">
              <Clock className="h-4 w-4 flex-shrink-0 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-amber-300">
                  Payment Pending
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  Due by {formatDate(dueDate)}
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'invoiced' && (
            <div className="flex items-center gap-3 rounded-lg border border-blue-500/20 bg-blue-500/[0.04] p-3">
              <FileText className="h-4 w-4 flex-shrink-0 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-300">
                  Invoice Sent
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  Due by {formatDate(dueDate)}
                </p>
              </div>
            </div>
          )}

          {paymentStatus === 'paid' && (
            <div className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/[0.04] p-3">
              <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-300">
                  Payment Received
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  Paid in full
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
