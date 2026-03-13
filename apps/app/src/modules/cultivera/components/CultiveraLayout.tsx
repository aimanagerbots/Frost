'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Store } from 'lucide-react';
import { SectionHeader, LoadingSkeleton } from '@/components';
import { useCultiveraStore } from '../store';
import { CultiveraDashboard } from './dashboard/CultiveraDashboard';
import { MenuSync } from './menu-sync/MenuSync';
import { OrderIntake } from './order-intake/OrderIntake';
import { CultiveraMarketing } from './marketing/CultiveraMarketing';
import { CultiveraMarketplace } from './marketplace/CultiveraMarketplace';
import type { CultiveraView } from '../types';

const ACCENT = '#22D3EE';

const ROUTES: Record<string, React.ComponentType> = {
  dashboard: CultiveraDashboard,
  'menu-sync': MenuSync,
  'order-intake': OrderIntake,
  marketing: CultiveraMarketing,
  marketplace: CultiveraMarketplace,
};

function CultiveraContent() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') ?? searchParams.get('view') ?? 'dashboard') as CultiveraView;
  const { setView } = useCultiveraStore();

  // Sync URL tab to store so child components can read activeView
  useEffect(() => {
    setView(tab);
  }, [tab, setView]);

  const Component = ROUTES[tab];
  return Component ? <Component /> : null;
}

export function CultiveraLayout() {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={Store}
        title="Cultivera"
        subtitle="Marketplace bridge � menu sync, order intake, advertising, and WA market intelligence"
        accentColor={ACCENT}
      />
      <Suspense fallback={<LoadingSkeleton variant="list" />}>
        <CultiveraContent />
      </Suspense>
    </div>
  );
}
