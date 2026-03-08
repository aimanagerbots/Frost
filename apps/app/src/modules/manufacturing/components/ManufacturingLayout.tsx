'use client';

import { Suspense } from 'react';
import { Factory } from 'lucide-react';
import { SectionHeader, LoadingSkeleton } from '@/components';
import { useManufacturingStore } from '../store';
import { ManufacturingNav } from './ManufacturingNav';
import { ManufacturingDashboard } from './dashboard';
import { WorkOrderBoard } from './work-orders';
import { ProductionLines } from './production-lines';
import { BatchTracker } from './batch-tracker';
import { EquipmentList } from './equipment';
import { ACCENT } from '@/design/colors';


const ROUTES: Record<string, React.ComponentType> = {
  dashboard: ManufacturingDashboard,
  'work-orders': WorkOrderBoard,
  'production-lines': ProductionLines,
  'batch-tracker': BatchTracker,
  equipment: EquipmentList,
};

function ManufacturingContent() {
  const { activeView } = useManufacturingStore();
  const Component = ROUTES[activeView];
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
        <ManufacturingNav />
      </Suspense>
      <ManufacturingContent />
    </div>
  );
}
