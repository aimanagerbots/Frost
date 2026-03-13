'use client';

import { AccentCard, StatusBadge } from '@/components';
import type { PackagingLine } from '../../types';

const ACCENT = '#84CC16';

const STATUS_ACCENT: Record<string, string> = {
  running: '#22C55E',
  idle: '#FBBF24',
  maintenance: '#EF4444',
  down: '#EF4444',
};

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  running: 'success',
  idle: 'warning',
  maintenance: 'danger',
  down: 'danger',
};

export function PackagingLineCard({ line }: { line: PackagingLine }) {
  const completedPct =
    line.packagesTarget > 0
      ? Math.min(Math.round((line.packagesCompletedToday / line.packagesTarget) * 100), 100)
      : 0;

  function progressColor(pct: number): string {
    if (pct >= 80) return ACCENT;
    if (pct >= 50) return '#FBBF24';
    return '#EF4444';
  }

  return (
    <AccentCard accentColor={STATUS_ACCENT[line.status] ?? '#64748B'} className="p-5 space-y-3">
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

      {/* Current order */}
      <div className="rounded-lg bg-elevated px-3 py-2">
        {line.currentOrderProduct ? (
          <>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">Current Order</p>
            <p className="text-xs font-medium text-text-bright">{line.currentOrderProduct}</p>
            {line.currentOrderId && (
              <p className="text-[10px] font-mono text-text-muted">{line.currentOrderId}</p>
            )}
          </>
        ) : (
          <p className="text-xs italic text-text-muted">No active order</p>
        )}
      </div>

      {/* Packages progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-text-muted mb-1">
          <span>Packages Today</span>
          <span style={{ color: progressColor(completedPct) }}>
            {line.packagesCompletedToday.toLocaleString()} / {line.packagesTarget.toLocaleString()} ({completedPct}%)
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${completedPct}%`, backgroundColor: progressColor(completedPct) }}
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
          <p className="text-[10px] italic text-text-muted">None assigned</p>
        )}
      </div>

      {/* Equipment count */}
      <p className="text-xs text-text-muted">{line.equipmentIds.length} equipment items</p>

      {/* Step flow */}
      {line.steps.length > 0 && (
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          {line.steps.map((step, i) => (
            <div key={step} className="flex items-center gap-1 shrink-0">
              <span
                className="whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-medium"
                style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}
              >
                {step}
              </span>
              {i < line.steps.length - 1 && (
                <span className="text-[10px] text-text-muted">→</span>
              )}
            </div>
          ))}
        </div>
      )}
    </AccentCard>
  );
}
