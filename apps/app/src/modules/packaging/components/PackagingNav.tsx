'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  KanbanSquare,
  Package,
  List,
  Wrench,
} from 'lucide-react';
import { ModuleTabs } from '@/components';
import { usePackagingStore } from '../store';
import type { PackagingView } from '../types';

const ACCENT = '#84CC16';

const TABS: { id: PackagingView; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'work-orders', label: 'Work Orders', icon: KanbanSquare },
  { id: 'packaging-lines', label: 'Packaging Lines', icon: Package },
  { id: 'order-tracker', label: 'Order Tracker', icon: List },
  { id: 'equipment', label: 'Equipment', icon: Wrench },
];

export function PackagingNav() {
  const { activeView, setView } = usePackagingStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync URL → store on mount; reads 'tab' param (sidebar), falls back to 'view' (legacy)
  useEffect(() => {
    const tab = (searchParams.get('tab') ?? searchParams.get('view')) as PackagingView | null;
    if (tab && TABS.some((t) => t.id === tab)) {
      setView(tab);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync store → URL on change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('tab', activeView);
    router.replace(`/packaging?${params.toString()}`, { scroll: false });
  }, [activeView, router]);

  return (
    <ModuleTabs
      tabs={TABS}
      activeTab={activeView}
      onTabChange={(id) => setView(id as PackagingView)}
      accentColor={ACCENT}
    />
  );
}
