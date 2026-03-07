'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Users } from 'lucide-react';
import { SectionHeader, LoadingSkeleton } from '@/components';
import { CRMNavigation } from './CRMNavigation';
import { useCRMStore } from '../store';
import { CRMDashboard } from './dashboard';
import { AccountsList, TerritoryMap, Segments } from './accounts';
import { AccountDetail } from './account-detail';
import { OpportunitiesPipeline, ReorderCenter, PriceBook, Leaderboard } from './sales';
import { AICopilot } from './overview';
import { InteractionsHub, CampaignsList, VendorDays } from './outreach';
import { Analytics, ProductRecommendations, ComplianceMonitor, WinLossLog } from './intelligence';
import { Playbooks } from './tools';

const CRM_ACCENT = '#F59E0B';

const ROUTES: Record<string, Record<string, React.ComponentType>> = {
  overview: { dashboard: CRMDashboard, 'ai-copilot': AICopilot },
  accounts: { accounts: AccountsList, 'territory-map': TerritoryMap, segments: Segments },
  sales: { opportunities: OpportunitiesPipeline, 'reorder-center': ReorderCenter, 'price-book': PriceBook, leaderboard: Leaderboard },
  outreach: { interactions: InteractionsHub, campaigns: CampaignsList, 'vendor-days': VendorDays },
  intelligence: { analytics: Analytics, 'product-recommendations': ProductRecommendations, 'compliance-monitor': ComplianceMonitor, 'win-loss-log': WinLossLog },
  tools: { playbooks: Playbooks },
};

function CRMContent() {
  const { activeTab, activeSubModule, selectedAccountId } = useCRMStore();

  // Account Detail takes priority when an account is selected
  if (activeTab === 'accounts' && selectedAccountId) {
    return <AccountDetail />;
  }

  const Component = ROUTES[activeTab]?.[activeSubModule];
  return Component ? <Component /> : null;
}

export function CRMLayout() {
  const searchParams = useSearchParams();
  const accountParam = searchParams.get('account');
  const { setSelectedAccountId, setActiveTab } = useCRMStore();

  useEffect(() => {
    if (accountParam) {
      setActiveTab('accounts');
      setSelectedAccountId(accountParam);
    }
  }, [accountParam, setActiveTab, setSelectedAccountId]);

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={Users}
        title="CRM"
        subtitle="Customer relationship management — accounts, pipeline, and outreach"
        accentColor={CRM_ACCENT}
      />
      <Suspense fallback={<LoadingSkeleton variant="list" />}>
        <CRMNavigation />
      </Suspense>
      <CRMContent />
    </div>
  );
}
