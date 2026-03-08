'use client';

import { useState } from 'react';
import { BoxSelect, LayoutDashboard, ClipboardList, Package } from 'lucide-react';
import { SectionHeader } from '@/components';
import { FulfillmentDashboard } from './FulfillmentDashboard';
import { PickLists } from './PickLists';
import { PackingStation } from './PackingStation';

const ACCENT = '#14B8A6';

type FulfillmentTab = 'dashboard' | 'pick-lists' | 'packing-station';

const TABS: { key: FulfillmentTab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'pick-lists', label: 'Pick Lists', icon: ClipboardList },
  { key: 'packing-station', label: 'Packing Station', icon: Package },
];

export function FulfillmentPage() {
  const [activeTab, setActiveTab] = useState<FulfillmentTab>('dashboard');

  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={BoxSelect} title="Fulfillment" accentColor={ACCENT} />

      {/* Tab Bar */}
      <div className="flex gap-1 rounded-xl border border-default bg-base p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === key
                ? 'bg-elevated text-text-bright'
                : 'text-text-muted hover:text-text-default'
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <FulfillmentDashboard />}
      {activeTab === 'pick-lists' && <PickLists />}
      {activeTab === 'packing-station' && <PackingStation />}
    </div>
  );
}
