'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { PLStatement as PLStatementType, PLLineItem } from '@/modules/finance/types';

const fmt = (n: number) => {
  const abs = Math.abs(n);
  const str = abs >= 1000 ? `$${(abs / 1000).toFixed(abs >= 10000 ? 0 : 1)}K` : `$${abs.toLocaleString()}`;
  return n < 0 ? `(${str})` : str;
};

const fmtFull = (n: number) => {
  const abs = Math.abs(n);
  const str = `$${abs.toLocaleString()}`;
  return n < 0 ? `(${str})` : str;
};

const pct = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;

interface CollapsibleSectionProps {
  label: string;
  items: PLLineItem[];
  total: number;
  totalLabel: string;
  isCost?: boolean;
}

function CollapsibleSection({ label, items, total, totalLabel, isCost }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        className="cursor-pointer hover:bg-accent-hover transition-colors group"
        onClick={() => setOpen(!open)}
      >
        <td className="py-2 px-3 font-semibold text-default flex items-center gap-1">
          {open ? <ChevronDown className="w-3.5 h-3.5 text-muted" /> : <ChevronRight className="w-3.5 h-3.5 text-muted" />}
          {label}
        </td>
        <td className="py-2 px-3 text-right font-mono text-sm text-default">{fmtFull(total)}</td>
        <td className="py-2 px-3 text-right font-mono text-sm text-muted" />
        <td className="py-2 px-3 text-right font-mono text-sm text-muted" />
        <td className="py-2 px-3 text-right font-mono text-sm text-muted hidden lg:table-cell" />
        <td className="py-2 px-3 text-right font-mono text-sm text-muted hidden xl:table-cell" />
      </tr>
      {open &&
        items.map((item) => {
          const overBudget = isCost ? item.variance < 0 : item.variance < 0;
          const varianceColor = item.variance === 0
            ? 'text-muted'
            : (isCost ? item.variance > 0 : item.variance > 0)
            ? 'text-green-400'
            : 'text-red-400';

          return (
            <tr key={item.subcategory} className="border-t border-default/30">
              <td className="py-1.5 px-3 pl-9 text-sm text-muted">{item.subcategory}</td>
              <td className="py-1.5 px-3 text-right font-mono text-sm text-default">{fmtFull(item.actual)}</td>
              <td className="py-1.5 px-3 text-right font-mono text-sm text-muted">{fmtFull(item.budget)}</td>
              <td className={`py-1.5 px-3 text-right font-mono text-sm ${varianceColor}`}>
                {fmtFull(item.variance)} ({pct(item.variancePct)})
              </td>
              <td className="py-1.5 px-3 text-right font-mono text-sm text-muted hidden lg:table-cell">{fmtFull(item.priorPeriod)}</td>
              <td className="py-1.5 px-3 text-right font-mono text-sm text-muted hidden xl:table-cell">{fmtFull(item.ytd)}</td>
            </tr>
          );
        })}
    </>
  );
}

interface SummaryRowProps {
  label: string;
  value: number;
  margin?: number;
  bold?: boolean;
  topBorder?: boolean;
  doubleBorder?: boolean;
}

function SummaryRow({ label, value, margin, bold, topBorder, doubleBorder }: SummaryRowProps) {
  return (
    <tr className={`${topBorder ? 'border-t-2 border-default' : 'border-t border-default/30'} ${doubleBorder ? 'border-b-4 border-double border-default' : ''}`}>
      <td className={`py-2 px-3 ${bold ? 'font-bold text-default' : 'font-semibold text-default'}`}>
        {label}
        {margin !== undefined && (
          <span className="text-xs text-muted ml-2">({margin.toFixed(1)}%)</span>
        )}
      </td>
      <td className={`py-2 px-3 text-right font-mono text-sm ${bold ? 'font-bold text-default' : 'text-default'}`}>
        {fmtFull(value)}
      </td>
      <td className="py-2 px-3" colSpan={4} />
    </tr>
  );
}

interface PLStatementProps {
  statement: PLStatementType;
}

export function PLStatementView({ statement }: PLStatementProps) {
  const revenueTotal = statement.revenue.reduce((sum, i) => sum + i.actual, 0);
  const cogsTotal = statement.cogs.reduce((sum, i) => sum + i.actual, 0);
  const opexTotal = statement.opex.reduce((sum, i) => sum + i.actual, 0);

  return (
    <div className="overflow-x-auto">
      <div className="text-center mb-4">
        <h4 className="text-sm font-semibold text-default">Profit & Loss Statement</h4>
        <p className="text-xs text-muted">{statement.period}</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-default">
            <th className="py-2 px-3 text-left text-xs font-medium text-muted uppercase tracking-wider w-[200px]">Account</th>
            <th className="py-2 px-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Actual</th>
            <th className="py-2 px-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Budget</th>
            <th className="py-2 px-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Variance</th>
            <th className="py-2 px-3 text-right text-xs font-medium text-muted uppercase tracking-wider hidden lg:table-cell">Prior Period</th>
            <th className="py-2 px-3 text-right text-xs font-medium text-muted uppercase tracking-wider hidden xl:table-cell">YTD</th>
          </tr>
        </thead>
        <tbody>
          <CollapsibleSection label="Revenue" items={statement.revenue} total={revenueTotal} totalLabel="Net Revenue" />
          <SummaryRow label="Net Revenue" value={revenueTotal} topBorder />

          <CollapsibleSection label="Cost of Goods Sold" items={statement.cogs} total={cogsTotal} totalLabel="Total COGS" isCost />
          <SummaryRow label="Total COGS" value={cogsTotal} topBorder />

          <SummaryRow label="Gross Profit" value={statement.grossProfit} margin={statement.grossMargin} bold topBorder />

          <CollapsibleSection label="Operating Expenses" items={statement.opex} total={opexTotal} totalLabel="Total OpEx" isCost />
          <SummaryRow label="Total OpEx" value={opexTotal} topBorder />

          <SummaryRow label="EBITDA" value={statement.ebitda} margin={statement.ebitdaMargin} bold topBorder />

          <tr className="border-t border-default/30">
            <td className="py-1.5 px-3 text-sm text-muted">Depreciation & Amortization</td>
            <td className="py-1.5 px-3 text-right font-mono text-sm text-default">{fmtFull(statement.depreciation)}</td>
            <td className="py-1.5 px-3" colSpan={4} />
          </tr>
          <tr className="border-t border-default/30">
            <td className="py-1.5 px-3 text-sm text-muted">Interest Expense</td>
            <td className="py-1.5 px-3 text-right font-mono text-sm text-default">{fmtFull(statement.interest)}</td>
            <td className="py-1.5 px-3" colSpan={4} />
          </tr>

          <SummaryRow label="Net Income" value={statement.netIncome} margin={statement.netMargin} bold topBorder doubleBorder />
        </tbody>
      </table>
    </div>
  );
}
