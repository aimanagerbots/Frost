'use client';

import { TrendingUp, Package, DollarSign, RotateCw, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth, usePortalScorecard } from '@/modules/portal/shared/hooks';
import { PortalCard } from '@/modules/portal/shared/components';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

interface VelocityBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

function VelocityBar({ label, value, maxValue, color }: VelocityBarProps) {
  const widthPercent = Math.min((value / maxValue) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">{label}</span>
        <span className="font-semibold text-text-default">{value.toFixed(1)}x</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className={cn('h-full rounded-full transition-all duration-700', color)}
          style={{ width: `${widthPercent}%` }}
        />
      </div>
    </div>
  );
}

interface MetricCellProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function MetricCell({ icon, label, value }: MetricCellProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-primary/10">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-display text-lg font-bold text-text-bright">{value}</p>
        <p className="text-xs text-text-muted">{label}</p>
      </div>
    </div>
  );
}

export function DashboardScorecard() {
  const { currentAccount } = usePortalAuth();
  const { data } = usePortalScorecard(currentAccount?.id ?? '');

  if (!currentAccount || !data) return null;

  const maxVelocity = Math.max(data.frostVelocity, data.categoryAvgVelocity) * 1.15;

  return (
    <PortalCard>
      <div className="flex flex-col gap-6">
        {/* Hero: velocity multiplier */}
        <div className="flex flex-col items-center gap-1 text-center lg:flex-row lg:gap-6 lg:text-left">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-5xl font-extrabold text-accent-primary">
              {data.velocityMultiplier.toFixed(1)}x
            </span>
            <Zap className="h-7 w-7 text-accent-primary" />
          </div>
          <p className="text-sm text-text-muted">
            faster than category average sell-through
          </p>
        </div>

        {/* Velocity comparison bars */}
        <div className="space-y-3">
          <VelocityBar
            label="Your Frost Velocity"
            value={data.frostVelocity}
            maxValue={maxVelocity}
            color="bg-accent-primary"
          />
          <VelocityBar
            label="Category Average"
            value={data.categoryAvgVelocity}
            maxValue={maxVelocity}
            color="bg-white/15"
          />
        </div>

        {/* 4 supporting metrics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCell
            icon={<Package className="h-4 w-4 text-accent-primary" />}
            label="Units Sold"
            value={formatNumber(data.totalUnitsSold)}
          />
          <MetricCell
            icon={<DollarSign className="h-4 w-4 text-accent-primary" />}
            label="Revenue"
            value={formatCurrency(data.totalRevenue)}
          />
          <MetricCell
            icon={<RotateCw className="h-4 w-4 text-accent-primary" />}
            label="Avg Turn Rate"
            value={`${data.avgTurnRate.toFixed(1)}x`}
          />
          <MetricCell
            icon={<Clock className="h-4 w-4 text-accent-primary" />}
            label="Days on Shelf"
            value={String(data.avgDaysOnShelf)}
          />
        </div>

        {/* Top SKU callout */}
        <div className="rounded-lg bg-accent-primary/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent-primary" />
            <p className="text-sm text-text-default">
              <span className="font-semibold text-text-bright">Your fastest mover:</span>{' '}
              {data.topSku.name} &mdash; {data.topSku.velocity.toFixed(1)}x velocity
            </p>
          </div>
        </div>

        {/* SKU count comparison — normative pressure */}
        <p className="text-center text-xs text-text-muted">
          You carry{' '}
          <span className="font-semibold text-text-default">{data.frostSkuCount} Frost SKUs</span>.
          Top partners carry{' '}
          <span className="font-semibold text-accent-primary">{data.peerAvgSkuCount}</span>.
        </p>
      </div>
    </PortalCard>
  );
}
