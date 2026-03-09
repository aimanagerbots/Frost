'use client';

import { Truck, Calendar, Navigation, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalDelivery } from '@/modules/portal/shared/types';

interface DeliveriesStatsProps {
  deliveries: PortalDelivery[];
}

interface StatCard {
  label: string;
  value: string;
  icon: React.ElementType;
  glow?: boolean;
}

export function DeliveriesStats({ deliveries }: DeliveriesStatsProps) {
  const totalDeliveries = deliveries.length;

  const upcomingCount = deliveries.filter(
    (d) => d.status === 'scheduled'
  ).length;

  const inTransitCount = deliveries.filter(
    (d) => d.status === 'in-transit'
  ).length;

  const deliveredThisMonth = deliveries.filter((d) => {
    if (d.status !== 'delivered') return false;
    const delivered = new Date(d.deliveredAt ?? d.scheduledDate);
    const now = new Date();
    return (
      delivered.getMonth() === now.getMonth() &&
      delivered.getFullYear() === now.getFullYear()
    );
  }).length;

  const stats: StatCard[] = [
    {
      label: 'Total Deliveries',
      value: totalDeliveries.toLocaleString(),
      icon: Truck,
    },
    {
      label: 'Upcoming',
      value: upcomingCount.toLocaleString(),
      icon: Calendar,
      glow: upcomingCount > 0,
    },
    {
      label: 'In Transit',
      value: inTransitCount.toLocaleString(),
      icon: Navigation,
      glow: inTransitCount > 0,
    },
    {
      label: 'Delivered This Month',
      value: deliveredThisMonth.toLocaleString(),
      icon: CheckCircle2,
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
