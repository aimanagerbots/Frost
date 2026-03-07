'use client';

import { StatusBadge } from '@/components';
import { useProductionLines } from '../hooks';

function capacityColor(pct: number): string {
  if (pct >= 90) return '#FB7185';
  if (pct >= 70) return '#FBBF24';
  return '#00E5A0';
}

export function ProductionLines() {
  const { data: lines } = useProductionLines();

  if (!lines) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-bright">Production Lines</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
        {lines.map((line) => {
          const pct = Math.round((line.currentBatches / line.capacity) * 100);
          const color = capacityColor(pct);
          return (
            <div
              key={line.id}
              className="rounded-xl border border-default bg-card p-4"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-medium text-bright">{line.name}</h3>
                <StatusBadge
                  variant={line.category === 'flower' ? 'success' : line.category === 'vaporizer' ? 'info' : line.category === 'preroll' ? 'warning' : 'default'}
                  label={line.category}
                  size="sm"
                />
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{line.currentBatches} / {line.capacity}</span>
                  <span style={{ color }}>{pct}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
              <div className="mt-2 text-xs text-muted">
                {line.states.join(' → ')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
