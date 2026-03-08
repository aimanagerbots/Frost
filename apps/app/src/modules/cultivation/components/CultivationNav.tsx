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
import { cn } from '@/lib/utils';
import { useCultivationStore } from '../store';
import type { CultivationView } from '../types';

const ACCENT = '#22C55E';

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
    <div className="flex items-center gap-1 rounded-lg border border-default bg-card px-2">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={cn(
              'relative flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors',
              isActive ? 'text-text-bright' : 'text-text-muted hover:text-text-default'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            {isActive && (
              <div
                className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
