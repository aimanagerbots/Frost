'use client';

import { Package, Activity, DollarSign, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalOrder } from '@/modules/portal/shared/types';

interface OrdersSummaryStatsProps {
  orders: PortalOrder[];
}

interface StatCard {
  label: string;
  value: string;
  icon: React.ElementType;
  glow?: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function OrdersSummaryStats({ orders }: OrdersSummaryStatsProps) {
  const totalOrders = orders.length;

  const activeOrders = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'paid'
  ).length;

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  const stats: StatCard[] = [
    {
      label: 'Total Orders',
      value: totalOrders.toLocaleString(),
      icon: Package,
    },
    {
      label: 'Active Orders',
      value: activeOrders.toLocaleString(),
      icon: Activity,
      glow: activeOrders > 0,
    },
    {
      label: 'Total Spent',
      value: formatCurrency(totalSpent),
      icon: DollarSign,
    },
    {
      label: 'Avg. Order Value',
      value: formatCurrency(averageOrderValue),
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={cn(
              'rounded-xl border border-border-default bg-card p-5',
              stat.glow && 'shadow-[0_0_16px_rgba(91,184,230,0.15)]'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">{stat.label}</span>
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg',
                  stat.glow
                    ? 'bg-accent-primary/15 text-accent-primary'
                    : 'bg-elevated text-text-muted'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p
              className={cn(
                'mt-2 text-2xl font-semibold',
                stat.glow ? 'text-accent-primary' : 'text-text-bright'
              )}
            >
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
