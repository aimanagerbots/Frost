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
import { cn } from '@/lib/utils';
import { useManufacturingStore } from '../store';
import type { ManufacturingView } from '../types';

const ACCENT = '#10B981';

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

  // Sync URL → store on mount
  useEffect(() => {
    const view = searchParams.get('view') as ManufacturingView | null;
    if (view && TABS.some((t) => t.id === view)) {
      setView(view);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync store → URL on change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('view', activeView);
    router.replace(`/manufacturing?${params.toString()}`, { scroll: false });
  }, [activeView, router]);

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
