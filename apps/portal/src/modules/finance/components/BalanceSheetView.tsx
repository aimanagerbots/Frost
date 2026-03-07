'use client';

import type { BalanceSheet as BalanceSheetType, BSLineItem } from '@/modules/finance/types';

const fmtFull = (n: number) => `$${Math.abs(n).toLocaleString()}`;

function LineItemRow({ item }: { item: BSLineItem }) {
  const change = item.amount - item.priorPeriod;
  const changeColor = change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-muted';

  return (
    <tr className="border-t border-default/30">
      <td className="py-1.5 px-3 pl-6 text-sm text-muted">{item.label}</td>
      <td className="py-1.5 px-3 text-right font-mono text-sm text-default">{fmtFull(item.amount)}</td>
      <td className="py-1.5 px-3 text-right font-mono text-sm text-muted hidden md:table-cell">{fmtFull(item.priorPeriod)}</td>
      <td className={`py-1.5 px-3 text-right font-mono text-sm hidden lg:table-cell ${changeColor}`}>
        {change >= 0 ? '+' : '-'}{fmtFull(Math.abs(change))}
      </td>
    </tr>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <tr className="border-b border-default">
      <td className="py-2 px-3 font-semibold text-default" colSpan={4}>{label}</td>
    </tr>
  );
}

function TotalRow({ label, amount, priorPeriod, bold, doubleBorder }: {
  label: string;
  amount: number;
  priorPeriod?: number;
  bold?: boolean;
  doubleBorder?: boolean;
}) {
  return (
    <tr className={`border-t-2 border-default ${doubleBorder ? 'border-b-4 border-double border-default' : ''}`}>
      <td className={`py-2 px-3 ${bold ? 'font-bold' : 'font-semibold'} text-default`}>{label}</td>
      <td className={`py-2 px-3 text-right font-mono text-sm ${bold ? 'font-bold' : 'font-semibold'} text-default`}>{fmtFull(amount)}</td>
      {priorPeriod !== undefined ? (
        <td className="py-2 px-3 text-right font-mono text-sm text-muted hidden md:table-cell">{fmtFull(priorPeriod)}</td>
      ) : (
        <td className="py-2 px-3 hidden md:table-cell" />
      )}
      <td className="py-2 px-3 hidden lg:table-cell" />
    </tr>
  );
}

interface BalanceSheetViewProps {
  sheet: BalanceSheetType;
}

export function BalanceSheetView({ sheet }: BalanceSheetViewProps) {
  const currentAssetsTotal = sheet.currentAssets.reduce((s, i) => s + i.amount, 0);
  const fixedAssetsTotal = sheet.fixedAssets.reduce((s, i) => s + i.amount, 0);
  const currentLiabTotal = sheet.currentLiabilities.reduce((s, i) => s + i.amount, 0);
  const longTermLiabTotal = sheet.longTermLiabilities.reduce((s, i) => s + i.amount, 0);

  const currentAssetsPrior = sheet.currentAssets.reduce((s, i) => s + i.priorPeriod, 0);
  const fixedAssetsPrior = sheet.fixedAssets.reduce((s, i) => s + i.priorPeriod, 0);
  const totalAssetsPrior = currentAssetsPrior + fixedAssetsPrior;
  const currentLiabPrior = sheet.currentLiabilities.reduce((s, i) => s + i.priorPeriod, 0);
  const longTermLiabPrior = sheet.longTermLiabilities.reduce((s, i) => s + i.priorPeriod, 0);
  const totalLiabPrior = currentLiabPrior + longTermLiabPrior;
  const totalEquityPrior = sheet.equity.reduce((s, i) => s + i.priorPeriod, 0);

  return (
    <div className="overflow-x-auto">
      <div className="text-center mb-4">
        <h4 className="text-sm font-semibold text-default">Balance Sheet</h4>
        <p className="text-xs text-muted">As of {sheet.period}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="bg-card border border-default rounded-xl p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-default">
                <th className="py-2 px-3 text-left text-xs font-medium text-muted uppercase">Assets</th>
                <th className="py-2 px-3 text-right text-xs font-medium text-muted uppercase">Current</th>
                <th className="py-2 px-3 text-right text-xs font-medium text-muted uppercase hidden md:table-cell">Prior</th>
                <th className="py-2 px-3 text-right text-xs font-medium text-muted uppercase hidden lg:table-cell">Change</th>
              </tr>
            </thead>
            <tbody>
              <SectionHeader label="Current Assets" />
              {sheet.currentAssets.map((item) => (
                <LineItemRow key={item.label} item={item} />
              ))}
              <TotalRow label="Total Current Assets" amount={currentAssetsTotal} priorPeriod={currentAssetsPrior} />

              <SectionHeader label="Fixed Assets" />
              {sheet.fixedAssets.map((item) => (
                <LineItemRow key={item.label} item={item} />
              ))}
              <TotalRow label="Total Fixed Assets" amount={fixedAssetsTotal} priorPeriod={fixedAssetsPrior} />

              <TotalRow label="TOTAL ASSETS" amount={sheet.totalAssets} priorPeriod={totalAssetsPrior} bold doubleBorder />
            </tbody>
          </table>
        </div>

        {/* Liabilities + Equity */}
        <div className="bg-card border border-default rounded-xl p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-default">
                <th className="py-2 px-3 text-left text-xs font-medium text-muted uppercase">Liabilities & Equity</th>
                <th className="py-2 px-3 text-right text-xs font-medium text-muted uppercase">Current</th>
                <th className="py-2 px-3 text-right text-xs font-medium text-muted uppercase hidden md:table-cell">Prior</th>
                <th className="py-2 px-3 text-right text-xs font-medium text-muted uppercase hidden lg:table-cell">Change</th>
              </tr>
            </thead>
            <tbody>
              <SectionHeader label="Current Liabilities" />
              {sheet.currentLiabilities.map((item) => (
                <LineItemRow key={item.label} item={item} />
              ))}
              <TotalRow label="Total Current Liabilities" amount={currentLiabTotal} priorPeriod={currentLiabPrior} />

              <SectionHeader label="Long-Term Liabilities" />
              {sheet.longTermLiabilities.map((item) => (
                <LineItemRow key={item.label} item={item} />
              ))}
              <TotalRow label="Total Long-Term" amount={longTermLiabTotal} priorPeriod={longTermLiabPrior} />

              <TotalRow label="TOTAL LIABILITIES" amount={sheet.totalLiabilities} priorPeriod={totalLiabPrior} bold />

              <SectionHeader label="Equity" />
              {sheet.equity.map((item) => (
                <LineItemRow key={item.label} item={item} />
              ))}

              <TotalRow label="TOTAL EQUITY" amount={sheet.totalEquity} priorPeriod={totalEquityPrior} bold />

              <TotalRow
                label="TOTAL L + E"
                amount={sheet.totalLiabilities + sheet.totalEquity}
                priorPeriod={totalLiabPrior + totalEquityPrior}
                bold
                doubleBorder
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
