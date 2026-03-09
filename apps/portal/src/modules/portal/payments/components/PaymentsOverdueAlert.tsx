'use client';

import { AlertTriangle } from 'lucide-react';

interface PaymentsOverdueAlertProps {
  overdueCount: number;
  totalOverdue: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function PaymentsOverdueAlert({
  overdueCount,
  totalOverdue,
}: PaymentsOverdueAlertProps) {
  if (overdueCount === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/[0.08] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-red-400">
            COMPLIANCE ALERT: {overdueCount} payment{overdueCount !== 1 ? 's' : ''} past 5-day window
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            Total overdue: {formatCurrency(totalOverdue)} — Immediate action required
          </p>
        </div>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/30"
        onClick={() => {
          const el = document.getElementById('outstanding-invoices');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        Pay Now
      </button>
    </div>
  );
}
