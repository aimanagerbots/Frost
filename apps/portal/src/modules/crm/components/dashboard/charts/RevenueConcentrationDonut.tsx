'use client';

import { ChartWrapper, CHART_THEME, legendFormatter } from '@/components';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { RevenueConcentrationSlice } from '@/mocks/crm-kpi-charts';

interface RevenueConcentrationDonutProps {
  data: RevenueConcentrationSlice[];
}

export function RevenueConcentrationDonut({ data }: RevenueConcentrationDonutProps) {
  return (
    <ChartWrapper title="Revenue Concentration" subtitle="Top accounts vs. rest">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="78%"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as RevenueConcentrationSlice;
              return (
                <div
                  className="rounded-lg border px-3 py-2 text-xs shadow-lg"
                  style={{
                    backgroundColor: CHART_THEME.tooltipBg,
                    borderColor: CHART_THEME.tooltipBorder,
                    color: CHART_THEME.tooltipText,
                  }}
                >
                  <p className="font-medium">{d.name}</p>
                  <p>${d.value.toLocaleString()}</p>
                </div>
              );
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} formatter={legendFormatter} />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
