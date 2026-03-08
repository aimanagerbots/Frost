'use client';

import { useState } from 'react';
import { BoxSelect, LayoutDashboard, ClipboardList, Package } from 'lucide-react';
import { SectionHeader, ModuleTabs } from '@/components';
import { FulfillmentDashboard } from './FulfillmentDashboard';
import { PickLists } from './PickLists';
import { PackingStation } from './PackingStation';
import { ACCENT } from '@/design/colors';


type FulfillmentTab = 'dashboard' | 'pick-lists' | 'packing-station';

const TABS: { id: FulfillmentTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pick-lists', label: 'Pick Lists', icon: ClipboardList },
  { id: 'packing-station', label: 'Packing Station', icon: Package },
];

export function FulfillmentPage() {
  const [activeTab, setActiveTab] = useState<FulfillmentTab>('dashboard');

  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={BoxSelect} title="Fulfillment" accentColor={ACCENT} />

      {/* Tab Bar */}
      <ModuleTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as FulfillmentTab)}
        accentColor={ACCENT}
      />

      {/* Tab Content */}
      {activeTab === 'dashboard' && <FulfillmentDashboard />}
      {activeTab === 'pick-lists' && <PickLists />}
      {activeTab === 'packing-station' && <PackingStation />}
    </div>
  );
}
