'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Activity,
  KanbanSquare,
  CalendarDays,
  Package,
  Dna,
  MessageSquare,
  LayoutDashboard,
  RefreshCw,
  Sprout,
  Home,
  Scissors,
  FlaskConical,
  TestTube,
  Trash2,
  Eye,
} from 'lucide-react';
import { ModuleTabs } from '@/components';
import { useCultivationStore } from '../store';
import type { CultivationView } from '../types';
import { ACCENT } from '@/design/colors';


const TABS: { id: CultivationView; label: string; icon: React.ElementType }[] = [
  // Cultivera tabs first
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'grow-cycles', label: 'Grow Cycles', icon: RefreshCw },
  { id: 'plants', label: 'Plants', icon: Sprout },
  { id: 'grow-sources', label: 'Grow Sources', icon: Dna },
  { id: 'rooms', label: 'Rooms', icon: Home },
  { id: 'harvest', label: 'Harvest', icon: Scissors },
  { id: 'qa-lot', label: 'QA Lot', icon: FlaskConical },
  { id: 'qa-sample', label: 'QA Sample', icon: TestTube },
  { id: 'disposal', label: 'Disposal', icon: Trash2 },
  // Frost extras
  { id: 'environment', label: 'Environment', icon: Activity },
  { id: 'tasks', label: 'Tasks', icon: KanbanSquare },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'supplies', label: 'Supplies', icon: Package },
  { id: 'chat', label: 'AI Chat', icon: MessageSquare },
];

export function CultivationNav() {
  const { activeView, selectedEnvironmentRoomId, setView, setEnvironmentRoom } = useCultivationStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync URL → store on mount; reads 'tab' param (sidebar), falls back to 'view' (legacy)
  useEffect(() => {
    const tab = (searchParams.get('tab') ?? searchParams.get('view')) as CultivationView | null;
    const roomId = searchParams.get('room');
    if (tab) {
      setView(tab);
      if (tab === 'environment' && roomId) {
        setEnvironmentRoom(roomId);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync store → URL on change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('tab', activeView);
    if (activeView === 'environment' && selectedEnvironmentRoomId) {
      params.set('room', selectedEnvironmentRoomId);
    }
    router.replace(`/cultivation?${params.toString()}`, { scroll: false });
  }, [activeView, selectedEnvironmentRoomId, router]);

  return (
    <ModuleTabs
      tabs={TABS}
      activeTab={activeView}
      onTabChange={(id) => setView(id as CultivationView)}
      accentColor={ACCENT}
    />
  );
}
