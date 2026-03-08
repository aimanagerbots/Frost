'use client';

import { Clock, AlertTriangle, Send } from 'lucide-react';
import type { Invoice } from '@/modules/finance/types';
import { ACCENT } from '@/design/colors';


interface ComplianceCountdownProps {
  invoices: Invoice[];
}

export function ComplianceCountdown({ invoices }: ComplianceCountdownProps) {
  // Only show open invoices (pending, overdue, partial with remaining balance)
  const openInvoices = invoices
    .filter((inv) => inv.status !== 'paid')
    .sort((a, b) => a.complianceDaysRemaining - b.complianceDaysRemaining);

  if (openInvoices.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted" />
        <h3 className="text-sm font-semibold text-default">Compliance Countdown</h3>
        <span className="text-xs text-muted">5-day payment window</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {openInvoices.map((inv) => {
          const isOverdue = inv.complianceDaysRemaining < 0;
          const isApproaching = inv.complianceDaysRemaining <= 1 && inv.complianceDaysRemaining >= 0;
          const remaining = inv.status === 'partial' && inv.paidAmount
            ? inv.amount - inv.paidAmount
            : inv.amount;

          // Progress: 5 days total, consumed = 5 - remaining
          const consumed = Math.max(0, 5 - Math.max(0, inv.complianceDaysRemaining));
          const progressPct = Math.min(100, (consumed / 5) * 100);

          const bgClass = isOverdue
            ? 'bg-red-500/10 border-red-500/40'
            : isApproaching
            ? 'bg-amber-500/10 border-amber-500/40'
            : 'bg-card border-default';

          const barColor = isOverdue
            ? 'bg-red-500'
            : isApproaching
            ? 'bg-amber-500'
            : consumed <= 2
            ? 'bg-green-500'
            : 'bg-amber-500';

          return (
            <div
              key={inv.id}
              className={`rounded-xl border p-4 ${bgClass} ${isOverdue ? 'animate-pulse-subtle' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-default">{inv.accountName}</p>
                  <p className="text-xs text-muted">{inv.invoiceNumber} &middot; {inv.orderNumber}</p>
                </div>
                {isOverdue && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
              </div>

              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted">
                  ${remaining.toLocaleString()}
                  {inv.status === 'partial' && (
                    <span className="text-muted"> (${inv.paidAmount?.toLocaleString()} paid)</span>
                  )}
                </span>
                <span className={isOverdue ? 'text-red-400 font-bold' : isApproaching ? 'text-amber-400 font-bold' : 'text-default font-medium'}>
                  {isOverdue
                    ? `${Math.abs(inv.complianceDaysRemaining)}d overdue`
                    : `${inv.complianceDaysRemaining}d remaining`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-elevated rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all ${barColor}`}
                  style={{ width: isOverdue ? '100%' : `${progressPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted">
                <span>Delivered: {inv.deliveredDate}</span>
                <span>Due: {inv.dueDate}</span>
              </div>

              {(isOverdue || isApproaching) && (
                <button className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5BB8E6]/20 hover:bg-accent-hover-strong text-[#5BB8E6] text-xs font-medium transition-colors">
                  <Send className="w-3 h-3" />
                  Send Reminder
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
