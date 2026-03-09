'use client';

import { useState } from 'react';
import { User, UserCircle, Users, FlaskConical, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PortalPageHeader } from '@/modules/portal/shared/components';
import { usePortalAuth } from '@/modules/portal/shared/hooks';
import {
  AccountProfile,
  AccountContacts,
  AccountCOAs,
  AccountDocuments,
  AccountPreferences,
} from '@/modules/portal/account/components';

const TABS = [
  { id: 'profile', label: 'Profile', icon: UserCircle },
  { id: 'contacts', label: 'Contacts', icon: Users },
  { id: 'coas', label: 'COAs', icon: FlaskConical },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'preferences', label: 'Preferences', icon: Settings },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const { currentAccount } = usePortalAuth();

  if (!currentAccount) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          icon={User}
          title="My Account"
          subtitle="Manage your dispensary profile and preferences"
        />
        <div className="rounded-xl border border-border-default bg-card p-8 text-center text-text-muted">
          Please log in to view your account.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={User}
        title="My Account"
        subtitle="Manage your dispensary profile and preferences"
      />

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto border-b border-border-default">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'border-accent-primary text-accent-primary'
                  : 'border-transparent text-text-muted hover:text-text-default'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'profile' && <AccountProfile account={currentAccount} />}
      {activeTab === 'contacts' && <AccountContacts account={currentAccount} />}
      {activeTab === 'coas' && <AccountCOAs />}
      {activeTab === 'documents' && <AccountDocuments />}
      {activeTab === 'preferences' && <AccountPreferences account={currentAccount} />}
    </div>
  );
}
