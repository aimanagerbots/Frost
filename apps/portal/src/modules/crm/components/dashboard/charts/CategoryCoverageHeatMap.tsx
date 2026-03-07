'use client';

import type { CategoryCoverageRow } from '@/mocks/crm-kpi-charts';

interface CategoryCoverageHeatMapProps {
  data: CategoryCoverageRow[];
}

const CATEGORIES = ['flower', 'preroll', 'vaporizer', 'concentrate', 'edible', 'beverage'];
const CATEGORY_LABELS: Record<string, string> = {
  flower: 'Flower',
  preroll: 'Preroll',
  vaporizer: 'Vape',
  concentrate: 'Conc.',
  edible: 'Edible',
  beverage: 'Bev.',
};

function intensityColor(value: number, max: number): string {
  if (value === 0) return 'rgba(100, 116, 139, 0.15)';
  const ratio = Math.min(value / max, 1);
  const alpha = 0.2 + ratio * 0.8;
  return `rgba(245, 158, 11, ${alpha.toFixed(2)})`;
}

export function CategoryCoverageHeatMap({ data }: CategoryCoverageHeatMapProps) {
  const maxValue = Math.max(...data.flatMap((r) => CATEGORIES.map((c) => r.categories[c] ?? 0)), 1);

  return (
    <div className="rounded-xl border border-default bg-card p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-bright">Category Coverage</h3>
        <p className="mt-0.5 text-xs text-text-muted">Revenue by category per top account</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Header */}
          <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: '140px repeat(6, 1fr)' }}>
            <div />
            {CATEGORIES.map((c) => (
              <div key={c} className="text-center text-[10px] font-medium text-text-muted uppercase">
                {CATEGORY_LABELS[c]}
              </div>
            ))}
          </div>

          {/* Rows */}
          {data.map((row) => (
            <div
              key={row.accountId}
              className="grid gap-1 mb-1"
              style={{ gridTemplateColumns: '140px repeat(6, 1fr)' }}
            >
              <div className="flex items-center text-xs text-text-default truncate pr-2">
                {row.accountName}
              </div>
              {CATEGORIES.map((c) => {
                const val = row.categories[c] ?? 0;
                return (
                  <div
                    key={c}
                    className="flex items-center justify-center rounded h-7 text-[10px] font-medium"
                    style={{
                      backgroundColor: intensityColor(val, maxValue),
                      color: val > 0 ? '#E2E8F0' : 'var(--color-text-muted)',
                    }}
                  >
                    {val > 0 ? `$${(val / 1000).toFixed(1)}k` : '--'}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
