'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, Legend,
} from 'recharts';
import { ChartWrapper, CHART_THEME } from '@/components';
import type { CashFlowStatement, CashFlowProjection } from '@/modules/finance/types';

const fmtFull = (n: number) => {
  const abs = Math.abs(n);
  const str = `$${abs.toLocaleString()}`;
  return n < 0 ? `(${str})` : str;
};

const fmtShort = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
};

interface CashFlowViewProps {
  statement: CashFlowStatement;
  projections: CashFlowProjection[];
}

export function CashFlowView({ statement, projections }: CashFlowViewProps) {
  // Build waterfall chart data
  const waterfallData: { name: string; value: number; fill: string }[] = [
    { name: 'Starting Cash', value: statement.beginningCash, fill: '#3B82F6' },
  ];

  statement.operating.forEach((line) => {
    waterfallData.push({
      name: line.label.length > 18 ? line.label.slice(0, 16) + '...' : line.label,
      value: line.amount,
      fill: line.category === 'inflow' ? '#22C55E' : '#EF4444',
    });
  });

  statement.investing.forEach((line) => {
    waterfallData.push({
      name: line.label.length > 18 ? line.label.slice(0, 16) + '...' : line.label,
      value: line.amount,
      fill: line.category === 'inflow' ? '#22C55E' : '#EF4444',
    });
  });

  statement.financing.forEach((line) => {
    waterfallData.push({
      name: line.label.length > 18 ? line.label.slice(0, 16) + '...' : line.label,
      value: line.amount,
      fill: line.category === 'inflow' ? '#22C55E' : '#EF4444',
    });
  });

  waterfallData.push({ name: 'Ending Cash', value: statement.endingCash, fill: '#3B82F6' });

  const operatingNet = statement.operating.reduce((s, l) => s + l.amount, 0);
  const investingNet = statement.investing.reduce((s, l) => s + l.amount, 0);
  const financingNet = statement.financing.reduce((s, l) => s + l.amount, 0);

  return (
    <div className="space-y-6">
      {/* Waterfall Chart */}
      <ChartWrapper title="Cash Flow Waterfall" subtitle={statement.period} height={320}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: CHART_THEME.axisColor, fontSize: 10 }}
              angle={-35}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
              tickFormatter={fmtShort}
            />
            <Tooltip
              contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: 'none', borderRadius: 8, color: '#E2E8F0' }}
              formatter={(value) => [fmtFull(Number(value)), 'Amount']}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {waterfallData.map((entry, i) => (
                <rect key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      {/* Line-item Statement */}
      <div className="bg-card border border-default rounded-xl p-4 overflow-x-auto">
        <h4 className="text-sm font-semibold text-default mb-3">Statement of Cash Flows — {statement.period}</h4>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-default">
              <td className="py-2 px-2 font-semibold text-default" colSpan={2}>Operating Activities</td>
            </tr>
            {statement.operating.map((line) => (
              <tr key={line.label} className="border-t border-default/30">
                <td className="py-1.5 px-2 pl-6 text-muted">{line.label}</td>
                <td className={`py-1.5 px-2 text-right font-mono ${line.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {fmtFull(line.amount)}
                </td>
              </tr>
            ))}
            <tr className="border-t border-default">
              <td className="py-2 px-2 pl-6 font-medium text-default">Net Operating</td>
              <td className={`py-2 px-2 text-right font-mono font-medium ${operatingNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {fmtFull(operatingNet)}
              </td>
            </tr>

            <tr className="border-b border-default">
              <td className="py-2 px-2 font-semibold text-default pt-4" colSpan={2}>Investing Activities</td>
            </tr>
            {statement.investing.map((line) => (
              <tr key={line.label} className="border-t border-default/30">
                <td className="py-1.5 px-2 pl-6 text-muted">{line.label}</td>
                <td className={`py-1.5 px-2 text-right font-mono ${line.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {fmtFull(line.amount)}
                </td>
              </tr>
            ))}
            <tr className="border-t border-default">
              <td className="py-2 px-2 pl-6 font-medium text-default">Net Investing</td>
              <td className={`py-2 px-2 text-right font-mono font-medium ${investingNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {fmtFull(investingNet)}
              </td>
            </tr>

            <tr className="border-b border-default">
              <td className="py-2 px-2 font-semibold text-default pt-4" colSpan={2}>Financing Activities</td>
            </tr>
            {statement.financing.map((line) => (
              <tr key={line.label} className="border-t border-default/30">
                <td className="py-1.5 px-2 pl-6 text-muted">{line.label}</td>
                <td className={`py-1.5 px-2 text-right font-mono ${line.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {fmtFull(line.amount)}
                </td>
              </tr>
            ))}
            <tr className="border-t border-default">
              <td className="py-2 px-2 pl-6 font-medium text-default">Net Financing</td>
              <td className={`py-2 px-2 text-right font-mono font-medium ${financingNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {fmtFull(financingNet)}
              </td>
            </tr>

            <tr className="border-t-2 border-default">
              <td className="py-2 px-2 font-bold text-default">Net Change in Cash</td>
              <td className={`py-2 px-2 text-right font-mono font-bold ${statement.netChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {fmtFull(statement.netChange)}
              </td>
            </tr>
            <tr className="border-t border-default/30">
              <td className="py-1.5 px-2 text-muted">Beginning Cash</td>
              <td className="py-1.5 px-2 text-right font-mono text-default">{fmtFull(statement.beginningCash)}</td>
            </tr>
            <tr className="border-t border-default/30 border-b-4 border-double border-default">
              <td className="py-2 px-2 font-bold text-default">Ending Cash</td>
              <td className="py-2 px-2 text-right font-mono font-bold text-default">{fmtFull(statement.endingCash)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Cash Flow Projection Chart */}
      <ChartWrapper title="90-Day Cash Flow Projection" subtitle="Expected, best, and worst case scenarios" height={280}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projections} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.gridColor} vertical={false} />
            <XAxis dataKey="date" tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} />
            <YAxis tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }} tickFormatter={fmtShort} />
            <Tooltip
              contentStyle={{ backgroundColor: CHART_THEME.tooltipBg, border: 'none', borderRadius: 8, color: '#E2E8F0' }}
              formatter={(value) => [fmtFull(Number(value))]}
            />
            <Legend wrapperStyle={{ color: '#E2E8F0', fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="best"
              stroke="none"
              fill="#22C55E"
              fillOpacity={0.08}
            />
            <Area
              type="monotone"
              dataKey="worst"
              stroke="none"
              fill="#EF4444"
              fillOpacity={0.08}
            />
            <Line type="monotone" dataKey="best" stroke="#22C55E" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Best Case" />
            <Line type="monotone" dataKey="worst" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Worst Case" />
            <Line type="monotone" dataKey="expected" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3, fill: '#3B82F6' }} name="Expected" />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
}
