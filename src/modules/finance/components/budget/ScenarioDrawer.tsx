'use client';

import { DrawerPanel } from '@/components';
import type { BudgetScenario } from '@/modules/finance/types/budget-labor';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

const ACCENT = '#059669';

function formatCurrency(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

interface ScenarioDrawerProps {
  scenario: BudgetScenario | null;
  open: boolean;
  onClose: () => void;
}

export function ScenarioDrawer({ scenario, open, onClose }: ScenarioDrawerProps) {
  if (!scenario) return null;

  const netPositive = scenario.projectedNetIncome > 0;
  const cashPositive = scenario.cashImpact >= 0;

  return (
    <DrawerPanel open={open} onClose={onClose} title={scenario.name} width="lg">
      <div className="space-y-6">
        {/* Description */}
        <p className="text-sm leading-relaxed text-text-muted">{scenario.description}</p>

        {/* Assumptions Table */}
        <div className="rounded-xl border border-default bg-base p-4">
          <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
            Assumptions
          </h4>
          <div className="space-y-2">
            {scenario.assumptions.map((a, i) => {
              const changed = a.baseValue !== a.adjustedValue;
              return (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-text-default">{a.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted">
                      {typeof a.baseValue === 'number' && a.baseValue >= 1000
                        ? formatCurrency(a.baseValue)
                        : a.baseValue}
                    </span>
                    {changed && (
                      <>
                        <span className="text-text-muted">&rarr;</span>
                        <span className="font-medium" style={{ color: ACCENT }}>
                          {typeof a.adjustedValue === 'number' && a.adjustedValue >= 1000
                            ? formatCurrency(a.adjustedValue)
                            : a.adjustedValue}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projected P&L */}
        <div className="rounded-xl border border-default bg-base p-4">
          <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
            Projected Impact
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-text-muted">Revenue</p>
              <p className="text-lg font-bold text-text-bright">
                {formatCurrency(scenario.projectedRevenue)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-muted">Expenses</p>
              <p className="text-lg font-bold text-text-bright">
                {formatCurrency(scenario.projectedExpenses)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-muted">Net Income</p>
              <div className="flex items-center gap-2">
                {netPositive ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-danger" />
                )}
                <p className={`text-lg font-bold ${netPositive ? 'text-success' : 'text-danger'}`}>
                  {formatCurrency(scenario.projectedNetIncome)}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-muted">Cash Impact</p>
              <div className="flex items-center gap-2">
                {cashPositive ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-danger" />
                )}
                <p className={`text-lg font-bold ${cashPositive ? 'text-success' : 'text-danger'}`}>
                  {scenario.cashImpact >= 0 ? '+' : ''}{formatCurrency(scenario.cashImpact)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Breakeven */}
        {scenario.breakeven && (
          <div className="flex items-center gap-3 rounded-xl border border-default bg-base p-4">
            <Target className="h-5 w-5 shrink-0" style={{ color: ACCENT }} />
            <div>
              <p className="text-xs text-text-muted">Breakeven</p>
              <p className="text-sm font-medium text-text-bright">{scenario.breakeven}</p>
            </div>
          </div>
        )}
      </div>
    </DrawerPanel>
  );
}
