'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Package } from 'lucide-react';
import { SectionHeader, LoadingSkeleton } from '@/components';
import { usePackagingStore } from '../store';
import { PackagingDashboard } from './dashboard';
import { PackagingWorkOrderBoard } from './work-orders';
import { PackagingLines } from './packaging-lines';
import { OrderTracker } from './order-tracker';
import { PackagingEquipmentList } from './equipment';
import type { PackagingView } from '../types';

const ACCENT = '#84CC16';

const ROUTES: Record<string, React.ComponentType> = {
  dashboard: PackagingDashboard,
  'work-orders': PackagingWorkOrderBoard,
  'packaging-lines': PackagingLines,
  'order-tracker': OrderTracker,
  equipment: PackagingEquipmentList,
};

function PackagingContent() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') ?? 'dashboard') as PackagingView;
  const { setView } = usePackagingStore();

  // Sync URL tab to store so child components can read activeView
  useEffect(() => {
    setView(tab);
  }, [tab, setView]);

  const Component = ROUTES[tab];
  return Component ? <Component /> : null;
}

export function PackagingLayout() {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={Package}
        title="Packaging"
        subtitle="Package cannabis products into retail-ready SKUs across 6 category lines"
        accentColor={ACCENT}
      />
      <Suspense fallback={<LoadingSkeleton variant="list" />}>
        <PackagingContent />
      </Suspense>
    </div>
  );
}
