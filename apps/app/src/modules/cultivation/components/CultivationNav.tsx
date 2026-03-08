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
} from 'lucide-react';
import { ModuleTabs } from '@/components';
import { useCultivationStore } from '../store';
import type { CultivationView } from '../types';
import { ACCENT } from '@/design/colors';


const TABS: { id: CultivationView; label: string; icon: React.ElementType }[] = [
  { id: 'environment', label: 'Environment', icon: Activity },
  { id: 'tasks', label: 'Tasks', icon: KanbanSquare },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'supplies', label: 'Supplies', icon: Package },
  { id: 'genetics', label: 'Genetics', icon: Dna },
  { id: 'chat', label: 'AI Chat', icon: MessageSquare },
];

export function CultivationNav() {
  const { activeView, selectedEnvironmentRoomId, setView, setEnvironmentRoom } = useCultivationStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync URL → store on mount
  useEffect(() => {
    const view = searchParams.get('view') as CultivationView | null;
    const roomId = searchParams.get('room');
    if (view) {
      setView(view);
      if (view === 'environment' && roomId) {
        setEnvironmentRoom(roomId);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync store → URL on change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('view', activeView);
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
