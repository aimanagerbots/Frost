'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Factory } from 'lucide-react';
import { SectionHeader, LoadingSkeleton } from '@/components';
import { useManufacturingStore } from '../store';
import { ManufacturingDashboard } from './dashboard';
import { WorkOrderBoard } from './work-orders';
import { ProductionLines } from './production-lines';
import { BatchTracker } from './batch-tracker';
import { EquipmentList } from './equipment';
import { ACCENT } from '@/design/colors';
import type { ManufacturingView } from '../types';


const ROUTES: Record<string, React.ComponentType> = {
  dashboard: ManufacturingDashboard,
  'work-orders': WorkOrderBoard,
  'production-lines': ProductionLines,
  'batch-tracker': BatchTracker,
  equipment: EquipmentList,
};

function ManufacturingContent() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') ?? 'dashboard') as ManufacturingView;
  const { setView } = useManufacturingStore();

  // Sync URL tab to store so child components can read activeView
  useEffect(() => {
    setView(tab);
  }, [tab, setView]);

  const Component = ROUTES[tab];
  return Component ? <Component /> : null;
}

export function ManufacturingLayout() {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={Factory}
        title="Manufacturing"
        subtitle="Production pipelines, work orders, and processing operations"
        accentColor={ACCENT}
      />
      <Suspense fallback={<LoadingSkeleton variant="list" />}>
        <ManufacturingContent />
      </Suspense>
    </div>
  );
}
