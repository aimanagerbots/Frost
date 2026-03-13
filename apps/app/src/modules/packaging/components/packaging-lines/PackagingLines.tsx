'use client';

import { LoadingSkeleton } from '@/components';
import { usePackagingLines } from '../../hooks';
import { PackagingLineCard } from './PackagingLineCard';

const ACCENT = '#84CC16';

export function PackagingLines() {
  const { data: lines, isLoading } = usePackagingLines();

  if (isLoading) return <LoadingSkeleton variant="card" count={6} />;

  if (!lines || lines.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-default bg-card">
        <p className="text-sm text-text-muted">No packaging lines configured</p>
      </div>
    );
  }

  // Summary bar
  const running = lines.filter((l) => l.status === 'running').length;
  const idle = lines.filter((l) => l.status === 'idle').length;
  const down = lines.filter((l) => l.status === 'down' || l.status === 'maintenance').length;

  return (
    <div className="space-y-4">
      {/* Summary chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-2.5 py-1 text-xs font-medium"
          style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}
        >
          {running} Running
        </span>
        <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
          {idle} Idle
        </span>
        {down > 0 && (
          <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
            {down} Down
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lines.map((line) => (
          <PackagingLineCard key={line.id} line={line} />
        ))}
      </div>
    </div>
  );
}
