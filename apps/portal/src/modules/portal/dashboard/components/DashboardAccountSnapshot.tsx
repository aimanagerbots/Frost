'use client';

import { DollarSign, CreditCard, Package, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth, usePortalOrders } from '@/modules/portal/shared/hooks';
import { PortalCard } from '@/modules/portal/shared/components';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function ordersThisMonth(orders: { orderDate: string }[]): number {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  return orders.filter((o) => {
    const d = new Date(o.orderDate);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;
}

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function Metric({ icon, label, value }: MetricProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-primary/10">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-display text-lg font-bold text-text-bright">
          {value}
        </p>
        <p className="text-xs text-text-muted">{label}</p>
      </div>
    </div>
  );
}

export function DashboardAccountSnapshot() {
  const { currentAccount } = usePortalAuth();
  const { data: orders } = usePortalOrders(currentAccount?.id ?? '');

  if (!currentAccount) return null;

  const monthCount = ordersThisMonth(orders ?? []);

  return (
    <PortalCard>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric
          icon={<DollarSign className="h-4 w-4 text-accent-primary" />}
          label="Lifetime Revenue"
          value={formatCurrency(currentAccount.lifetimeRevenue)}
        />
        <Metric
          icon={<CreditCard className="h-4 w-4 text-accent-primary" />}
          label="Outstanding Balance"
          value={formatCurrency(currentAccount.outstandingBalance)}
        />
        <Metric
          icon={<Package className="h-4 w-4 text-accent-primary" />}
          label="Orders This Month"
          value={String(monthCount)}
        />
        <Metric
          icon={<CalendarDays className="h-4 w-4 text-accent-primary" />}
          label="Last Order Date"
          value={formatDate(currentAccount.lastOrderDate)}
        />
      </div>
    </PortalCard>
  );
}
