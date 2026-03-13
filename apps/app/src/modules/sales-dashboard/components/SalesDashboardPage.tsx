'use client';

import { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { SectionHeader } from '@/components';
import { SalesMetrics } from './SalesMetrics';
import { WeeklySalesChart } from './WeeklySalesChart';
import { ActiveCartsPanel } from './ActiveCartsPanel';
import { RecentOrdersPanel } from './RecentOrdersPanel';
import { RecentClientsPanel } from './RecentClientsPanel';
import { PipelineWidget } from './PipelineWidget';
import { SalesBriefingWidget } from './SalesBriefingWidget';

const ACCENT = '#F59E0B';
const CURRENT_REP = 'Michael Perkins';

export function SalesDashboardPage() {
  const [myAccountsOnly, setMyAccountsOnly] = useState(false);

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={LayoutDashboard}
        title="Sales Dashboard"
        accentColor={ACCENT}
        actions={
          <button
            type="button"
            onClick={() => setMyAccountsOnly((prev) => !prev)}
            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors"
            style={{
              backgroundColor: myAccountsOnly ? ACCENT : 'transparent',
              color: myAccountsOnly ? '#000' : ACCENT,
              border: `1.5px solid ${ACCENT}`,
            }}
          >
            {myAccountsOnly ? 'My Accounts' : 'All Accounts'}
            <span
              className="inline-block h-3.5 w-3.5 rounded-full border-2 transition-colors"
              style={{
                borderColor: myAccountsOnly ? '#000' : ACCENT,
                backgroundColor: myAccountsOnly ? '#000' : 'transparent',
              }}
            />
          </button>
        }
      />

      {/* AI Sales Briefing */}
      <SalesBriefingWidget />

      {/* Metric cards row */}
      <SalesMetrics myAccountsOnly={myAccountsOnly} currentRep={CURRENT_REP} />

      {/* Chart + sidebar grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <WeeklySalesChart myAccountsOnly={myAccountsOnly} currentRep={CURRENT_REP} />
        </div>
        <div className="lg:col-span-2">
          <RecentClientsPanel myAccountsOnly={myAccountsOnly} currentRep={CURRENT_REP} />
        </div>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RecentOrdersPanel myAccountsOnly={myAccountsOnly} currentRep={CURRENT_REP} />
        <ActiveCartsPanel myAccountsOnly={myAccountsOnly} currentRep={CURRENT_REP} />
        <PipelineWidget />
      </div>
    </div>
  );
}
