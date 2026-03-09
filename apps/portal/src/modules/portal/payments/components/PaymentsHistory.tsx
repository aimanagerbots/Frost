'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalInvoice } from '@/modules/portal/shared/types';

interface PaymentsHistoryProps {
  invoices: PortalInvoice[];
}

const PAGE_SIZE = 10;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function PaymentsHistory({ invoices }: PaymentsHistoryProps) {
  const paidInvoices = invoices.filter((i) => i.status === 'paid');
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(paidInvoices.length / PAGE_SIZE));
  const pageInvoices = paidInvoices.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  if (paidInvoices.length === 0) {
    return (
      <div className="rounded-xl border border-border-default bg-card p-8 text-center text-text-muted">
        No payment history yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-default bg-card">
      {/* Header */}
      <div className="border-b border-border-default px-5 py-4">
        <h3 className="text-sm font-semibold text-text-bright">
          Payment History
        </h3>
        <p className="mt-0.5 text-xs text-text-muted">
          {paidInvoices.length} paid invoice{paidInvoices.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default text-left text-xs text-text-muted">
              <th className="px-5 py-3 font-medium">Invoice #</th>
              <th className="px-5 py-3 font-medium">Order #</th>
              <th className="px-5 py-3 font-medium text-right">Amount</th>
              <th className="px-5 py-3 font-medium">Paid Date</th>
              <th className="px-5 py-3 font-medium">Method</th>
            </tr>
          </thead>
          <tbody>
            {pageInvoices.map((inv) => (
              <tr
                key={inv.id}
                className="border-b border-border-default/50 transition-colors last:border-b-0 hover:bg-elevated/50"
              >
                <td className="px-5 py-3 font-medium text-text-default">
                  {inv.invoiceNumber}
                </td>
                <td className="px-5 py-3 text-text-muted">{inv.orderNumber}</td>
                <td className="px-5 py-3 text-right font-medium text-text-default">
                  {formatCurrency(inv.amount)}
                </td>
                <td className="px-5 py-3 text-text-muted">
                  {inv.paidDate ?? '—'}
                </td>
                <td className="px-5 py-3">
                  <span className="rounded-md bg-elevated px-2 py-0.5 text-xs font-medium uppercase text-text-muted">
                    {inv.paymentMethod ?? '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border-default px-5 py-3">
          <span className="text-xs text-text-muted">
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                page === 0
                  ? 'cursor-not-allowed text-text-muted/30'
                  : 'text-text-muted hover:bg-elevated hover:text-text-default'
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                page >= totalPages - 1
                  ? 'cursor-not-allowed text-text-muted/30'
                  : 'text-text-muted hover:bg-elevated hover:text-text-default'
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
