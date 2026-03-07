'use client';

import { useState } from 'react';
import { LoadingSkeleton } from '@/components';
import { useAccount } from '../../hooks';
import { useCRMStore } from '../../store';
import { AccountDetailHeader } from './AccountDetailHeader';
import { AccountDetailTabs } from './AccountDetailTabs';
import {
  ProfileTab,
  PurchasesTab,
  HealthTab,
  VMITab,
  InteractionsTab,
  OpportunitiesTab,
  PaymentsTab,
  DeliveriesTab,
  FilesTab,
  NotesTab,
} from './tabs';
import type { AccountDetailTab } from '../../types';

export function AccountDetail() {
  const { selectedAccountId, setSelectedAccountId, setBreadcrumbs } = useCRMStore();
  const { data: account, isLoading } = useAccount(selectedAccountId || '');
  const [activeTab, setActiveTab] = useState<AccountDetailTab>('profile');

  const handleBack = () => {
    setSelectedAccountId(null);
    setBreadcrumbs([]);
  };

  if (isLoading || !account) {
    return <LoadingSkeleton variant="card" count={3} />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab account={account} />;
      case 'purchases': return <PurchasesTab accountId={account.id} account={account} />;
      case 'health': return <HealthTab accountId={account.id} />;
      case 'vmi': return <VMITab accountId={account.id} vmiEnrolled={account.vmiEnrolled} />;
      case 'interactions': return <InteractionsTab accountId={account.id} />;
      case 'opportunities': return <OpportunitiesTab accountId={account.id} />;
      case 'payments': return <PaymentsTab accountId={account.id} />;
      case 'deliveries': return <DeliveriesTab accountId={account.id} />;
      case 'files': return <FilesTab accountId={account.id} />;
      case 'notes': return <NotesTab accountId={account.id} />;
    }
  };

  return (
    <div className="space-y-4">
      <AccountDetailHeader account={account} onBack={handleBack} />
      <AccountDetailTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        vmiEnrolled={account.vmiEnrolled}
      />
      {renderTab()}
    </div>
  );
}
