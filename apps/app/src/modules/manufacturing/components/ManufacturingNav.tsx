'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  KanbanSquare,
  Workflow,
  Search,
  Wrench,
} from 'lucide-react';
import { ModuleTabs } from '@/components';
import { useManufacturingStore } from '../store';
import type { ManufacturingView } from '../types';
import { ACCENT } from '@/design/colors';


const TABS: { id: ManufacturingView; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'work-orders', label: 'Work Orders', icon: KanbanSquare },
  { id: 'production-lines', label: 'Production Lines', icon: Workflow },
  { id: 'batch-tracker', label: 'Batch Tracker', icon: Search },
  { id: 'equipment', label: 'Equipment', icon: Wrench },
];

export function ManufacturingNav() {
  const { activeView, setView } = useManufacturingStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync URL → store on mount/change
  useEffect(() => {
    const tab = (searchParams.get('tab') ?? searchParams.get('view')) as ManufacturingView | null;
    if (tab && TABS.some((t) => t.id === tab)) {
      setView(tab);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync store → URL on change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('tab', activeView);
    router.replace(`/manufacturing?${params.toString()}`, { scroll: false });
  }, [activeView, router]);

  return (
    <ModuleTabs
      tabs={TABS}
      activeTab={activeView}
      onTabChange={(id) => setView(id as ManufacturingView)}
      accentColor={ACCENT}
    />
  );
}
