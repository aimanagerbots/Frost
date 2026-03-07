'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartWrapper, CHART_THEME } from '@/components';
import { useProductionDistribution } from '../../hooks';

export function ProductionSummary() {
  const { data, isLoading } = useProductionDistribution();

  return (
    <ChartWrapper title="Production by Pipeline" loading={isLoading} empty={!data?.length} height={280}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="percentage"
            nameKey="category"
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={90}
            strokeWidth={2}
            stroke="var(--color-card)"
          >
            {data?.map((entry) => (
              <Cell key={entry.category} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: CHART_THEME.tooltipBg,
              border: `1px solid ${CHART_THEME.tooltipBorder}`,
              borderRadius: 8,
              color: CHART_THEME.tooltipText,
              fontSize: 12,
            }}
            formatter={(value) => [`${value}%`, '']}
          />
        </PieChart>
      </ResponsiveContainer>
      {data && (
        <div className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {data.map((d) => (
            <div key={d.category} className="flex items-center gap-1.5 text-xs text-text-muted">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
              {d.category} ({d.percentage}%)
            </div>
          ))}
        </div>
      )}
    </ChartWrapper>
  );
}
