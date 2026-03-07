'use client';

import { useState, useCallback } from 'react';
import { Warehouse, LayoutGrid, List, Package, FlaskConical, AlertTriangle } from 'lucide-react';
import { SectionHeader } from '@/components';
import { useOverviewMetrics } from '@/modules/inventory/hooks';
import { InventoryOverview } from './overview/InventoryOverview';
import { CannabisInventory } from './cannabis/CannabisInventory';
import { NonCannabisInventory } from './materials/NonCannabisInventory';
import { COAManager } from './coa/COAManager';
import { InventoryAlerts } from './alerts/InventoryAlerts';
import type { ReadinessState } from '@/modules/inventory/types';

const INVENTORY_ACCENT = '#8B5CF6';

type InventoryTab = 'overview' | 'cannabis' | 'non-cannabis' | 'coa' | 'alerts';

const TABS: { key: InventoryTab; label: string; icon: typeof LayoutGrid }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  { key: 'cannabis', label: 'Cannabis Inventory', icon: List },
  { key: 'non-cannabis', label: 'Non-Cannabis Materials', icon: Package },
  { key: 'coa', label: 'COA Manager', icon: FlaskConical },
  { key: 'alerts', label: 'Alerts', icon: AlertTriangle },
];

export function InventoryLayout() {
  const [activeTab, setActiveTab] = useState<InventoryTab>('overview');
  const [pipelineFilter, setPipelineFilter] = useState<ReadinessState | undefined>();
  const { data: metrics } = useOverviewMetrics();

  const handlePipelineClick = useCallback((state: ReadinessState) => {
    setPipelineFilter(state);
    setActiveTab('cannabis');
  }, []);

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={Warehouse}
        title="Inventory"
        subtitle="Track products across the pipeline"
        accentColor={INVENTORY_ACCENT}
        stats={[
          { label: 'SKUs', value: metrics?.totalSKUs ?? 0 },
          { label: 'Value', value: `$${((metrics?.totalValue ?? 0) / 1000).toFixed(0)}K` },
          { label: 'Alerts', value: metrics?.belowReorderPoint ?? 0 },
        ]}
      />

      {/* Tab Bar */}
      <div className="flex gap-1 rounded-xl border border-default bg-base p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); if (key !== 'cannabis') setPipelineFilter(undefined); }}
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
      {activeTab === 'overview' && <InventoryOverview onStateClick={handlePipelineClick} />}
      {activeTab === 'cannabis' && <CannabisInventory initialState={pipelineFilter} />}
      {activeTab === 'non-cannabis' && <NonCannabisInventory />}
      {activeTab === 'coa' && <COAManager />}
      {activeTab === 'alerts' && <InventoryAlerts />}
    </div>
  );
}
