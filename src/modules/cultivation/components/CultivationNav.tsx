'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Warehouse,
  CalendarDays,
  Package,
  Dna,
  MessageSquare,
  ArrowLeft,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCultivationStore } from '../store';
import type { CultivationView } from '../types';

const ACCENT = '#22C55E';

const TABS: { id: CultivationView; label: string; labelEs: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', labelEs: 'Panel', icon: LayoutDashboard },
  { id: 'rooms', label: 'All Rooms', labelEs: 'Cuartos', icon: Warehouse },
  { id: 'calendar', label: 'Calendar', labelEs: 'Calendario', icon: CalendarDays },
  { id: 'supplies', label: 'Supplies', labelEs: 'Insumos', icon: Package },
  { id: 'genetics', label: 'Genetics', labelEs: 'Genética', icon: Dna },
  { id: 'chat', label: 'AI Chat', labelEs: 'Chat IA', icon: MessageSquare },
];

export function CultivationNav() {
  const { activeView, selectedRoomId, language, setView, setLanguage } = useCultivationStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync URL → store on mount
  useEffect(() => {
    const view = searchParams.get('view') as CultivationView | null;
    const roomId = searchParams.get('id');
    if (view) {
      if (view === 'room' && roomId) {
        useCultivationStore.getState().navigateToRoom(roomId);
      } else {
        setView(view);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync store → URL on change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('view', activeView);
    if (activeView === 'room' && selectedRoomId) {
      params.set('id', selectedRoomId);
    }
    router.replace(`/cultivation?${params.toString()}`, { scroll: false });
  }, [activeView, selectedRoomId, router]);

  const isRoomDetail = activeView === 'room';

  return (
    <div className="flex items-center gap-1 rounded-lg border border-default bg-card px-2">
      {isRoomDetail && (
        <button
          onClick={() => setView('rooms')}
          className="flex items-center gap-1 px-2 py-2.5 text-sm text-text-muted hover:text-text-default transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-xs">{language === 'es' ? 'Volver' : 'Back'}</span>
        </button>
      )}

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
            <span className="hidden sm:inline">{language === 'es' ? tab.labelEs : tab.label}</span>
            {isActive && (
              <div
                className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
            )}
          </button>
        );
      })}

      {/* Language toggle */}
      <button
        onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
        className="ml-auto flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-text-muted hover:text-text-default transition-colors"
        title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="uppercase">{language}</span>
      </button>
    </div>
  );
}
