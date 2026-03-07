'use client';

import { Suspense } from 'react';
import { Users, Construction } from 'lucide-react';
import { SectionHeader, EmptyState, LoadingSkeleton } from '@/components';
import { CRMNavigation } from './CRMNavigation';
import { useCRMStore, CRM_TABS } from '../store';
import { CRMDashboard } from './dashboard';
import { AccountsList } from './accounts';
import { AccountDetail } from './account-detail';
import { OpportunitiesPipeline, ReorderCenter, PriceBook, Leaderboard } from './sales';

const CRM_ACCENT = '#F59E0B';

function CRMContent() {
  const { activeTab, activeSubModule, selectedAccountId } = useCRMStore();

  if (activeTab === 'overview' && activeSubModule === 'dashboard') {
    return <CRMDashboard />;
  }

  // Account Detail takes priority when an account is selected
  if (activeTab === 'accounts' && selectedAccountId) {
    return <AccountDetail />;
  }

  // Accounts List
  if (activeTab === 'accounts' && activeSubModule === 'accounts') {
    return <AccountsList />;
  }

  // Sales sub-modules
  if (activeTab === 'sales' && activeSubModule === 'opportunities') {
    return <OpportunitiesPipeline />;
  }
  if (activeTab === 'sales' && activeSubModule === 'reorder-center') {
    return <ReorderCenter />;
  }
  if (activeTab === 'sales' && activeSubModule === 'price-book') {
    return <PriceBook />;
  }
  if (activeTab === 'sales' && activeSubModule === 'leaderboard') {
    return <Leaderboard />;
  }

  // Find display name for the active sub-module
  const tabConfig = CRM_TABS.find((t) => t.id === activeTab);
  const subConfig = tabConfig?.subModules.find((s) => s.id === activeSubModule);
  const subLabel = subConfig?.label || activeSubModule;

  return (
    <EmptyState
      icon={Construction}
      title={subLabel}
      description={`Coming in Build 4-6. This sub-module will be available in a future release.`}
      accentColor={CRM_ACCENT}
    />
  );
}

export function CRMLayout() {
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
