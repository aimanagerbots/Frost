'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LayoutDashboard, RefreshCw, Download, Megaphone, Globe } from 'lucide-react';
import { ModuleTabs } from '@/components';
import { useCultiveraStore } from '../store';
import type { CultiveraView } from '../types';

const ACCENT = '#22D3EE';

const TABS: { id: CultiveraView; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'menu-sync', label: 'Menu Sync', icon: RefreshCw },
  { id: 'order-intake', label: 'Order Intake', icon: Download },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'marketplace', label: 'Marketplace', icon: Globe },
];

export function CultiveraNav() {
  const { activeView, setView } = useCultiveraStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const view = searchParams.get('view') as CultiveraView | null;
    if (view && TABS.some((t) => t.id === view)) {
      setView(view);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('view', activeView);
    router.replace(`/cultivera?${params.toString()}`, { scroll: false });
  }, [activeView, router]);

  return (
    <ModuleTabs
      tabs={TABS}
      activeTab={activeView}
      onTabChange={(id) => setView(id as CultiveraView)}
      accentColor={ACCENT}
    />
  );
}
