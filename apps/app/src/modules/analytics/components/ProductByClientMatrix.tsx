'use client';

import { LoadingSkeleton } from '@/components';
import { useProductByClient } from '../hooks';

function currency(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function cellColor(value: number, max: number): string {
  const ratio = Math.min(value / max, 1);
  if (ratio > 0.7) return 'text-emerald-400';
  if (ratio > 0.4) return 'text-cyan-400';
  if (ratio > 0.15) return 'text-text-default';
  return 'text-text-muted';
}

function cellBg(value: number, max: number): string {
  const ratio = Math.min(value / max, 1);
  if (ratio > 0.7) return 'bg-emerald-500/8';
  if (ratio > 0.4) return 'bg-cyan-500/8';
  return '';
}

const CATEGORY_LABELS: Record<string, string> = {
  flower: 'Flower',
  preroll: 'Pre-Roll',
  vaporizer: 'Vaporizer',
  concentrate: 'Concentrate',
  edible: 'Edible',
  beverage: 'Beverage',
};

export function ProductByClientMatrix() {
  const { data, isLoading } = useProductByClient();

  if (isLoading || !data) {
    return <LoadingSkeleton variant="table" />;
  }

  const { products, clients, matrix } = data;

  // Find max value for color scaling
  const allValues = matrix.flat();
  const maxVal = Math.max(...allValues);

  // Row totals (per product)
  const rowTotals = matrix.map((row) => row.reduce((s, v) => s + v, 0));

  // Column totals (per client)
  const colTotals = clients.map((_, ci) =>
    matrix.reduce((s, row) => s + row[ci], 0)
  );
  const grandTotal = colTotals.reduce((s, v) => s + v, 0);

  // Abbreviate client names for column headers
  function shortName(name: string): string {
    const words = name.split(' ');
    if (words.length <= 2) return name;
    return words.slice(0, 2).join(' ');
  }

  return (
    <div className="rounded-xl border border-default bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-default">
              <th className="sticky left-0 z-10 bg-card px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                Category
              </th>
              {clients.map((client) => (
                <th
                  key={client}
                  className="px-3 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-text-muted"
                  title={client}
                >
                  <span className="whitespace-nowrap">{shortName(client)}</span>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-text-bright">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, pi) => (
              <tr key={product} className="border-b border-default/50 transition-colors hover:bg-card-hover">
                <td className="sticky left-0 z-10 bg-card px-4 py-2.5 font-medium text-text-bright whitespace-nowrap">
                  {CATEGORY_LABELS[product] ?? product}
                </td>
                {matrix[pi].map((val, ci) => (
                  <td
                    key={ci}
                    className={`px-3 py-2.5 text-right font-mono text-xs ${cellColor(val, maxVal)} ${cellBg(val, maxVal)}`}
                  >
                    {currency(val)}
                  </td>
                ))}
                <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-text-bright">
                  {currency(rowTotals[pi])}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-default bg-elevated/50">
              <td className="sticky left-0 z-10 bg-elevated/50 px-4 py-3 font-bold text-text-bright">
                TOTAL
              </td>
              {colTotals.map((total, ci) => (
                <td
                  key={ci}
                  className="px-3 py-3 text-right font-mono text-xs font-bold text-text-bright"
                >
                  {currency(total)}
                </td>
              ))}
              <td className="px-4 py-3 text-right font-mono text-xs font-bold text-emerald-400">
                {currency(grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
