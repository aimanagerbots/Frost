'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BoxSelect, Truck, ClipboardList, Package } from 'lucide-react';
import { SectionHeader, EmptyState, LoadingSkeleton } from '@/components';
import { FulfillmentDashboard } from './FulfillmentDashboard';
import { PickLists } from './PickLists';
import { PackingStation } from './PackingStation';
import { ACCENT } from '@/design/colors';


const STUB_TABS: Record<string, { label: string; icon: typeof BoxSelect }> = {
  vehicles: { label: 'Vehicles', icon: Truck },
  drivers: { label: 'Drivers', icon: ClipboardList },
  'delivery-agents': { label: 'Delivery Agents', icon: Package },
  'quarantine-schedule': { label: 'Quarantine Schedule', icon: BoxSelect },
  'delivery-schedule': { label: 'Delivery Schedule', icon: BoxSelect },
  'transfer-inbound': { label: 'Transfer Inbound', icon: BoxSelect },
  'transfer-outbound': { label: 'Transfer Outbound', icon: BoxSelect },
  delivery: { label: 'Delivery', icon: Truck },
};

function FulfillmentContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'orders';
  const stub = STUB_TABS[activeTab];

  return (
    <div className="space-y-6">
      <SectionHeader icon={BoxSelect} title="Fulfillment" accentColor={ACCENT} />
      {activeTab === 'orders' && <FulfillmentDashboard />}
      {stub && (
        <EmptyState
          icon={stub.icon}
          title={stub.label}
          description="This section is coming soon."
          accentColor={ACCENT}
        />
      )}
    </div>
  );
}

export function FulfillmentPage() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="card" count={3} />}>
      <FulfillmentContent />
    </Suspense>
  );
}
