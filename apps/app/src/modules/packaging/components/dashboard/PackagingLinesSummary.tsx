'use client';

import { ChartWrapper } from '@/components';
import { usePackagingLines } from '../../hooks';

const ACCENT = '#84CC16';

const CATEGORY_COLORS: Record<string, string> = {
  flower: '#22C55E',
  preroll: '#F97316',
  vaporizer: '#3B82F6',
  concentrate: '#F59E0B',
  edible: '#8B5CF6',
  beverage: '#14B8A6',
};

const LINE_STATUS_COLORS: Record<string, string> = {
  running: '#22C55E',
  idle: '#94A3B8',
  maintenance: '#FBBF24',
  down: '#EF4444',
};

export function PackagingLinesSummary() {
  const { data: lines, isLoading } = usePackagingLines();

  return (
    <ChartWrapper
      title="Packaging Lines Today"
      subtitle="Packages completed vs target per line"
      loading={isLoading}
      empty={!lines?.length}
      height={280}
    >
      <div className="flex h-full flex-col justify-center gap-2.5 py-1">
        {lines?.map((line) => {
          const pct = line.packagesTarget > 0
            ? Math.min(100, Math.round((line.packagesCompletedToday / line.packagesTarget) * 100))
            : 0;
          const barColor = CATEGORY_COLORS[line.category] ?? ACCENT;
          const statusColor = LINE_STATUS_COLORS[line.status] ?? '#94A3B8';

          return (
            <div key={line.id} className="group">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: statusColor }}
                  />
                  <span className="text-xs font-medium text-text-default truncate max-w-[120px]">
                    {line.name}
                  </span>
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize"
                    style={{
                      backgroundColor: `${barColor}20`,
                      color: barColor,
                    }}
                  >
                    {line.category}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-semibold text-text-bright">
                    {line.packagesCompletedToday}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    / {line.packagesTarget}
                  </span>
                  <span
                    className="text-[10px] font-medium tabular-nums"
                    style={{ color: pct >= 80 ? '#22C55E' : pct >= 50 ? '#FBBF24' : '#EF4444' }}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartWrapper>
  );
}
