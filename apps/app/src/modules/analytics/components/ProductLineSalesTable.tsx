'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { LoadingSkeleton } from '@/components';
import { useProductLineSalesByAccount } from '../hooks';
import { cn } from '@/lib/utils';

const ACCENT = '#06B6D4';

const LINE_COLORS: Record<string, string> = {
  flower: '#22C55E',
  preroll: '#3B82F6',
  vaporizer: '#8B5CF6',
  concentrate: '#F59E0B',
  edible: '#EC4899',
  beverage: '#06B6D4',
};

function formatCurrency(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

export function ProductLineSalesTable() {
  const { data, isLoading } = useProductLineSalesByAccount();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['flower']));

  if (isLoading || !data) {
    return <LoadingSkeleton variant="table" />;
  }

  function toggle(line: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(line)) next.delete(line);
      else next.add(line);
      return next;
    });
  }

  return (
    <div className="rounded-xl bg-card overflow-hidden">
      {data.map((group) => {
        const isOpen = expanded.has(group.productLine);
        const color = LINE_COLORS[group.productLine] ?? ACCENT;

        return (
          <div key={group.productLine} className="border-b border-default/50 last:border-b-0">
            {/* Section header */}
            <button
              onClick={() => toggle(group.productLine)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-card-hover"
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-text-muted" />
              ) : (
                <ChevronRight className="h-4 w-4 text-text-muted" />
              )}
              <div
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm font-semibold capitalize text-text-bright">
                {group.productLine}
              </span>
              <span className="ml-auto text-sm font-mono text-text-muted">
                {formatCurrency(group.totalRevenue)}
              </span>
            </button>

            {/* Account rows */}
            {isOpen && (
              <div className="pb-2">
                {group.accounts.length === 0 ? (
                  <p className="px-11 py-2 text-xs text-text-muted">No accounts for this product line.</p>
                ) : (
                  group.accounts.map((account) => (
                    <div
                      key={account.name}
                      className="flex items-center gap-3 px-11 py-2"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm text-text-default">
                        {account.name}
                      </span>
                      <span className="shrink-0 text-sm font-mono text-text-bright">
                        {formatCurrency(account.revenue)}
                      </span>
                      <div className="w-24 shrink-0">
                        <div className="h-2 w-full rounded-full bg-white/[0.06]">
                          <div
                            className={cn('h-2 rounded-full transition-all')}
                            style={{
                              width: `${Math.min(account.percentage, 100)}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                      <span className="w-10 shrink-0 text-right text-xs text-text-muted">
                        {account.percentage}%
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
