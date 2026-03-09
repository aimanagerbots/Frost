'use client';

import { Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalInvoice } from '@/modules/portal/shared/types';

interface PaymentsPayNowProps {
  invoice: PortalInvoice;
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

function getSegmentColor(segmentIndex: number, daysElapsed: number): string {
  if (segmentIndex >= daysElapsed) return 'bg-white/[0.06]';
  if (daysElapsed > 5) return 'bg-red-500';
  if (daysElapsed >= 4) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function getStatusLabel(daysElapsed: number): {
  text: string;
  color: string;
} {
  if (daysElapsed > 5) return { text: 'OVERDUE', color: 'text-red-400' };
  if (daysElapsed >= 4) return { text: 'URGENT', color: 'text-amber-400' };
  return { text: 'ON TRACK', color: 'text-emerald-400' };
}

export function PaymentsPayNow({ invoice, onPay }: PaymentsPayNowProps) {
  const status = getStatusLabel(invoice.daysElapsed);
  const isOverdue = invoice.daysElapsed > 5;

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-5',
        isOverdue ? 'border-red-500/30' : 'border-border-default'
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOverdue ? (
            <AlertTriangle className="h-4 w-4 text-red-400" />
          ) : (
            <Clock className="h-4 w-4 text-text-muted" />
          )}
          <span className="text-sm font-medium text-text-default">
            5-Day Compliance Window
          </span>
        </div>
        <span className={cn('text-xs font-semibold uppercase', status.color)}>
          {status.text}
        </span>
      </div>

      {/* Countdown bar: 5 segments */}
      <div className="mb-4 flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-2.5 flex-1 rounded-full transition-colors',
              getSegmentColor(i, invoice.daysElapsed)
            )}
          />
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between text-xs text-text-muted">
        <span>Day 1</span>
        <span>
          {invoice.daysElapsed > 5
            ? `${invoice.daysElapsed} days elapsed`
            : `Day ${invoice.daysElapsed} of 5`}
        </span>
        <span>Day 5</span>
      </div>

      {/* Invoice details */}
      <div className="mb-4 space-y-2 rounded-lg bg-elevated p-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Invoice</span>
          <span className="font-medium text-text-default">{invoice.invoiceNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Order</span>
          <span className="font-medium text-text-default">{invoice.orderNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Amount</span>
          <span className="font-semibold text-text-bright">
            {formatCurrency(invoice.amount)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Delivered</span>
          <span className="text-text-default">{invoice.deliveryDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Due</span>
          <span className={cn('font-medium', isOverdue ? 'text-red-400' : 'text-text-default')}>
            {invoice.dueDate}
          </span>
        </div>
      </div>

      {/* Pay button */}
      <button
        type="button"
        onClick={() => onPay(invoice.id)}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-primary/90"
      >
        <CreditCard className="h-4 w-4" />
        Pay Now
      </button>
    </div>
  );
}
