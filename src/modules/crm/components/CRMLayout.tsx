'use client';

import { Suspense } from 'react';
import { Users, Construction } from 'lucide-react';
import { SectionHeader, EmptyState, LoadingSkeleton } from '@/components';
import { CRMNavigation } from './CRMNavigation';
import { useCRMStore, CRM_TABS } from '../store';
import { CRMDashboard } from './dashboard';

const CRM_ACCENT = '#F59E0B';

function CRMContent() {
  const { activeTab, activeSubModule } = useCRMStore();

  // Only Dashboard is built in this build
  if (activeTab === 'overview' && activeSubModule === 'dashboard') {
    return <CRMDashboard />;
  }

  // Find display name for the active sub-module
  const tabConfig = CRM_TABS.find((t) => t.id === activeTab);
  const subConfig = tabConfig?.subModules.find((s) => s.id === activeSubModule);
  const subLabel = subConfig?.label || activeSubModule;

  return (
    <EmptyState
      icon={Construction}
      title={subLabel}
      description={`Coming in Build 2-6. This sub-module will be available in a future release.`}
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
