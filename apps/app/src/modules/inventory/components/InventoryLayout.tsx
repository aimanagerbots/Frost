'use client';

import { useState, useCallback } from 'react';
import { Warehouse, LayoutGrid, List, Package, FlaskConical, AlertTriangle } from 'lucide-react';
import { SectionHeader, ModuleTabs } from '@/components';
import { useOverviewMetrics } from '@/modules/inventory/hooks';
import { InventoryOverview } from './overview/InventoryOverview';
import { CannabisInventory } from './cannabis/CannabisInventory';
import { NonCannabisInventory } from './materials/NonCannabisInventory';
import { COAManager } from './coa/COAManager';
import { InventoryAlerts } from './alerts/InventoryAlerts';
import type { ReadinessState } from '@/modules/inventory/types';
import { ACCENT as INVENTORY_ACCENT } from '@/design/colors';


type InventoryTab = 'overview' | 'cannabis' | 'non-cannabis' | 'coa' | 'alerts';

const TABS: { id: InventoryTab; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'cannabis', label: 'Cannabis Inventory', icon: List },
  { id: 'non-cannabis', label: 'Non-Cannabis Materials', icon: Package },
  { id: 'coa', label: 'COA Manager', icon: FlaskConical },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
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
      <ModuleTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab as InventoryTab); if (tab !== 'cannabis') setPipelineFilter(undefined); }}
        accentColor={INVENTORY_ACCENT}
      />

      {/* Tab Content */}
      {activeTab === 'overview' && <InventoryOverview onStateClick={handlePipelineClick} />}
      {activeTab === 'cannabis' && <CannabisInventory initialState={pipelineFilter} />}
      {activeTab === 'non-cannabis' && <NonCannabisInventory />}
      {activeTab === 'coa' && <COAManager />}
      {activeTab === 'alerts' && <InventoryAlerts />}
    </div>
  );
}
