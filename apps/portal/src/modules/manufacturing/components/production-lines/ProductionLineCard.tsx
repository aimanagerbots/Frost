'use client';

import { StatusBadge } from '@/components';
import type { ProductionLine } from '../../types';

const ACCENT = '#10B981';

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  running: 'success',
  idle: 'warning',
  maintenance: 'danger',
  down: 'danger',
};

export function ProductionLineCard({ line }: { line: ProductionLine }) {
  const throughputPct = line.throughputTarget > 0
    ? Math.round((line.throughputToday / line.throughputTarget) * 100)
    : 0;

  function throughputColor(pct: number) {
    if (pct >= 80) return '#22C55E';
    if (pct >= 50) return '#FBBF24';
    return '#EF4444';
  }

  return (
    <div className="rounded-xl border border-default bg-card p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-text-bright">{line.name}</h3>
        <StatusBadge
          variant={STATUS_VARIANT[line.status] ?? 'default'}
          label={line.status.charAt(0).toUpperCase() + line.status.slice(1)}
          size="sm"
          dot
          pulse={line.status === 'running'}
        />
      </div>

      {/* Current batch */}
      {line.currentBatchName ? (
        <div className="rounded-lg bg-elevated px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Current</p>
          <p className="text-xs font-medium text-text-bright">{line.currentBatchName}</p>
          <p className="text-[10px] text-text-muted">WO: {line.currentWorkOrderId}</p>
        </div>
      ) : (
        <div className="rounded-lg bg-elevated px-3 py-2">
          <p className="text-xs text-text-muted italic">No active batch</p>
        </div>
      )}

      {/* Throughput */}
      <div>
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>Throughput</span>
          <span style={{ color: throughputColor(throughputPct) }}>
            {line.throughputToday} / {line.throughputTarget} ({throughputPct}%)
          </span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${Math.min(throughputPct, 100)}%`, backgroundColor: throughputColor(throughputPct) }}
          />
        </div>
      </div>

      {/* Workers */}
      <div>
        <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Workers</p>
        {line.workers.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {line.workers.map((w) => (
              <span key={w} className="rounded-full bg-elevated px-2 py-0.5 text-[10px] text-text-default">
                {w}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-text-muted italic">None assigned</p>
        )}
      </div>

      {/* Equipment count */}
      <div className="flex items-center gap-1.5 text-xs text-text-muted">
        <span>{line.equipmentIds.length} equipment items</span>
      </div>

      {/* State flow */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {line.states.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <span className="whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-medium" style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}>
              {s}
            </span>
            {i < line.states.length - 1 && <span className="text-[10px] text-text-muted">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
