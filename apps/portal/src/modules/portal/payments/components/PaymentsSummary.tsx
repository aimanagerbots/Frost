'use client';

import { DollarSign, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalInvoice } from '@/modules/portal/shared/types';

interface PaymentsSummaryProps {
  invoices: PortalInvoice[];
}

interface StatCard {
  label: string;
  value: string;
  icon: React.ElementType;
  variant: 'default' | 'accent' | 'danger' | 'success';
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PaymentsSummary({ invoices }: PaymentsSummaryProps) {
  const outstanding = invoices.filter((i) => i.status === 'outstanding' || i.status === 'overdue');
  const paid = invoices.filter((i) => i.status === 'paid');
  const overdue = invoices.filter((i) => i.status === 'overdue');

  const totalOutstanding = outstanding.reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = paid.reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = overdue.reduce((sum, i) => sum + i.amount, 0);
  const complianceRate = invoices.length > 0
    ? Math.round((paid.length / invoices.length) * 100)
    : 100;

  const stats: StatCard[] = [
    {
      label: 'Total Outstanding',
      value: formatCurrency(totalOutstanding),
      icon: DollarSign,
      variant: totalOutstanding > 0 ? 'accent' : 'default',
    },
    {
      label: 'Total Paid (Quarter)',
      value: formatCurrency(totalPaid),
      icon: CheckCircle,
      variant: 'success',
    },
    {
      label: 'Overdue Amount',
      value: formatCurrency(totalOverdue),
      icon: AlertTriangle,
      variant: totalOverdue > 0 ? 'danger' : 'default',
    },
    {
      label: 'Compliance Rate',
      value: `${complianceRate}%`,
      icon: ShieldCheck,
      variant: complianceRate >= 90 ? 'success' : complianceRate >= 70 ? 'accent' : 'danger',
    },
  ];

  const variantStyles = {
    default: {
      iconBg: 'bg-elevated text-text-muted',
      value: 'text-text-bright',
      border: '',
    },
    accent: {
      iconBg: 'bg-accent-primary/15 text-accent-primary',
      value: 'text-accent-primary',
      border: 'shadow-[0_0_16px_rgba(91,184,230,0.15)]',
    },
    danger: {
      iconBg: 'bg-red-500/15 text-red-400',
      value: 'text-red-400',
      border: 'shadow-[0_0_16px_rgba(239,68,68,0.12)]',
    },
    success: {
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      value: 'text-emerald-400',
      border: '',
    },
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const styles = variantStyles[stat.variant];
        return (
          <div
            key={stat.label}
            className={cn(
              'rounded-xl border border-border-default bg-card p-5',
              styles.border
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">{stat.label}</span>
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg',
                  styles.iconBg
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className={cn('mt-2 text-2xl font-semibold', styles.value)}>
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
