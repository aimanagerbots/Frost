'use client';

import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import {
  SectionHeader,
  MetricCard,
  LoadingSkeleton,
  ErrorState,
} from '@/components';
import {
  useSpeedometers,
  useCFOBriefing,
  usePLStatement,
  useCashFlowStatement,
  useBalanceSheet,
  useCashFlowProjections,
} from '@/modules/finance/hooks';
import { SpeedometerGauge } from './SpeedometerGauge';
import { CFOBriefing } from './CFOBriefing';
import { PLStatementView } from './PLStatement';
import { CashFlowView } from './CashFlowView';
import { BalanceSheetView } from './BalanceSheetView';

const ACCENT = '#059669';

type FinanceTab = 'daily-pl' | 'weekly-pl' | 'monthly-pl' | 'cashflow' | 'balance-sheet';

const TAB_OPTIONS: { key: FinanceTab; label: string }[] = [
  { key: 'daily-pl', label: 'Daily P&L' },
  { key: 'weekly-pl', label: 'Weekly P&L' },
  { key: 'monthly-pl', label: 'Monthly P&L' },
  { key: 'cashflow', label: 'Cash Flow' },
  { key: 'balance-sheet', label: 'Balance Sheet' },
];

const fmtCurrency = (n: number) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
};

export function FinancePage() {
  const [activeTab, setActiveTab] = useState<FinanceTab>('monthly-pl');

  const { data: speedometers, isLoading: speedLoading, isError: speedError, refetch: refetchSpeed } = useSpeedometers();
  const { data: briefing, isLoading: briefLoading } = useCFOBriefing();

  const plPeriod = activeTab === 'daily-pl' ? 'daily' : activeTab === 'weekly-pl' ? 'weekly' : 'monthly';
  const { data: plStatement, isLoading: plLoading } = usePLStatement(plPeriod);
  const { data: cashFlow, isLoading: cfLoading } = useCashFlowStatement();
  const { data: balanceSheet, isLoading: bsLoading } = useBalanceSheet();
  const { data: projections, isLoading: projLoading } = useCashFlowProjections();

  if (speedError) {
    return (
      <div className="space-y-6">
        <SectionHeader icon={DollarSign} title="Finance" subtitle="CFO command center" accentColor={ACCENT} />
        <ErrorState title="Failed to load finance data" message="Could not fetch financial data." onRetry={() => refetchSpeed()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={DollarSign}
        title="Finance"
        subtitle="CFO command center"
        accentColor={ACCENT}
      />

      {/* Speedometer Row */}
      {speedLoading ? (
        <LoadingSkeleton variant="card" count={5} />
      ) : speedometers ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {speedometers.map((gauge) => (
            <SpeedometerGauge key={gauge.id} gauge={gauge} />
          ))}
        </div>
      ) : null}

      {/* CFO Briefing */}
      {briefLoading ? (
        <LoadingSkeleton variant="list" count={3} />
      ) : briefing ? (
        <CFOBriefing items={briefing} />
      ) : null}

      {/* Financial Statement Tabs */}
      <div className="bg-card border border-default rounded-xl overflow-hidden">
        <div className="flex overflow-x-auto border-b border-default">
          {TAB_OPTIONS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'text-default border-b-2'
                  : 'text-muted hover:text-default'
              }`}
              style={activeTab === tab.key ? { borderBottomColor: ACCENT } : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* P&L Views */}
          {(activeTab === 'daily-pl' || activeTab === 'weekly-pl' || activeTab === 'monthly-pl') && (
            plLoading ? (
              <LoadingSkeleton variant="table" />
            ) : plStatement ? (
              <PLStatementView statement={plStatement} />
            ) : null
          )}

          {/* Cash Flow View */}
          {activeTab === 'cashflow' && (
            cfLoading || projLoading ? (
              <LoadingSkeleton variant="chart" />
            ) : cashFlow && projections ? (
              <CashFlowView statement={cashFlow} projections={projections} />
            ) : null
          )}

          {/* Balance Sheet View */}
          {activeTab === 'balance-sheet' && (
            bsLoading ? (
              <LoadingSkeleton variant="table" />
            ) : balanceSheet ? (
              <BalanceSheetView sheet={balanceSheet} />
            ) : null
          )}
        </div>
      </div>

      {/* Quick Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Bank Balance"
          value={fmtCurrency(170000)}
          accentColor={ACCENT}
          trend={{ value: 19.7, direction: 'up' }}
        />
        <MetricCard
          label="Revenue MTD"
          value={fmtCurrency(1240000)}
          accentColor={ACCENT}
          trend={{ value: 1.6, direction: 'up' }}
        />
        <MetricCard
          label="COGS MTD"
          value={fmtCurrency(520000)}
          accentColor={ACCENT}
          trend={{ value: 3.2, direction: 'up' }}
        />
        <MetricCard
          label="Gross Margin"
          value="57.4%"
          accentColor={ACCENT}
          trend={{ value: 0.8, direction: 'down' }}
        />
        <MetricCard
          label="Net Income MTD"
          value={fmtCurrency(349000)}
          accentColor={ACCENT}
          trend={{ value: 2.4, direction: 'up' }}
        />
        <MetricCard
          label="AR Outstanding"
          value={fmtCurrency(68000)}
          accentColor={ACCENT}
          trend={{ value: 5.6, direction: 'down' }}
        />
        <MetricCard
          label="AP Outstanding"
          value={fmtCurrency(42000)}
          accentColor={ACCENT}
          trend={{ value: 10.5, direction: 'up' }}
        />
        <MetricCard
          label="Burn Rate / Day"
          value={fmtCurrency(1567)}
          accentColor={ACCENT}
        />
        <MetricCard
          label="Cash Runway"
          value="108 days"
          accentColor={ACCENT}
        />
        <MetricCard
          label="Revenue / Employee"
          value={fmtCurrency(82000)}
          accentColor={ACCENT}
          trend={{ value: 4.2, direction: 'up' }}
        />
      </div>
    </div>
  );
}
