'use client';

import { LoadingSkeleton } from '@/components';
import { usePipelineData } from '@/modules/pipeline/hooks/usePipelineData';

interface BarRowProps {
  label: string;
  count: number;
  total: number;
  colorBar: string;
  colorText: string;
}

function BarRow({ label, count, total, colorBar, colorText }: BarRowProps) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold ${colorText}`}>{label}</span>
        <span className="text-text-muted">
          {count} <span className="opacity-60">({pct}%)</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-elevated">
        <div
          className={`h-full rounded-full transition-all ${colorBar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function PipelineWidget() {
  const { data, isLoading } = usePipelineData();

  if (isLoading || !data) {
    return (
      <div className="rounded-xl border border-default bg-card p-5">
        <LoadingSkeleton variant="card" />
      </div>
    );
  }

  const { metrics } = data;
  const total = metrics.totalAccounts;

  return (
    <div className="rounded-xl border border-default bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-default">
        Pipeline Distribution
      </h3>
      <div className="space-y-4">
        <BarRow
          label="Active"
          count={metrics.totalActive}
          total={total}
          colorBar="bg-emerald-400"
          colorText="text-emerald-400"
        />
        <BarRow
          label="Inactive"
          count={metrics.totalInactive}
          total={total}
          colorBar="bg-blue-400"
          colorText="text-blue-400"
        />
        <BarRow
          label="Recovery"
          count={metrics.totalRecovery}
          total={total}
          colorBar="bg-red-400"
          colorText="text-red-400"
        />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-default pt-3 text-xs text-text-muted">
        <span>{total} total accounts</span>
        <span className="text-emerald-400">{metrics.recoveryRate}% recovery</span>
      </div>
    </div>
  );
}
