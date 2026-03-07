'use client';

import { cn } from '@/lib/utils';

interface PipelineAccountCardProps {
  name: string;
  healthScore: number;
  thirtyDayRevenue: number;
}

function healthColor(score: number): string {
  if (score >= 80) return 'bg-emerald-400';
  if (score >= 60) return 'bg-amber-400';
  if (score >= 40) return 'bg-orange-400';
  return 'bg-red-400';
}

export function PipelineAccountCard({ name, healthScore, thirtyDayRevenue }: PipelineAccountCardProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-default bg-elevated px-2.5 py-1.5 text-xs">
      <span className={cn('h-2 w-2 shrink-0 rounded-full', healthColor(healthScore))} />
      <span className="min-w-0 flex-1 truncate text-text-default">{name}</span>
      <span className="shrink-0 font-medium text-text-muted">
        ${(thirtyDayRevenue / 1000).toFixed(1)}k
      </span>
    </div>
  );
}
