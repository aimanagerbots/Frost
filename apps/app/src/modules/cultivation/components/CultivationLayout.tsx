'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Leaf } from 'lucide-react';
import { SectionHeader, LoadingSkeleton } from '@/components';
import { useCultivationStore } from '../store';
import { EnvironmentTab } from './environment';
import { TasksKanban } from './tasks';
import { ProductionCalendar } from './calendar';
import { GrowSupplies } from './supplies';
import { GeneticsLibrary } from './genetics';
import { CultivationChat } from './chat';
import { GrowCyclesTab } from './grow-cycles/GrowCyclesTab';
import { GrowOverview } from './overview/GrowOverview';
import { GrowDashboard } from './dashboard/GrowDashboard';
import { HarvestTab } from './harvest/HarvestTab';
import { PlantsTab } from './plants/PlantsTab';
import { QALotTab } from './qa-lot/QALotTab';
import { QASampleTab } from './qa-sample/QASampleTab';
import { DisposalTab } from './disposal/DisposalTab';
import { RoomsTab } from './rooms/RoomsTab';
import { ACCENT } from '@/design/colors';
import type { CultivationView } from '../types';
import { useEffect } from 'react';

const ROUTES: Partial<Record<CultivationView, React.ComponentType>> = {
  overview: GrowOverview,
  dashboard: GrowDashboard,
  'grow-cycles': GrowCyclesTab,
  plants: PlantsTab,
  'grow-sources': GeneticsLibrary,
  rooms: RoomsTab,
  harvest: HarvestTab,
  'qa-lot': QALotTab,
  'qa-sample': QASampleTab,
  disposal: DisposalTab,
  environment: EnvironmentTab,
  tasks: TasksKanban,
  calendar: ProductionCalendar,
  supplies: GrowSupplies,
  chat: CultivationChat,
};

function CultivationContent() {
  const searchParams = useSearchParams();
  const tab = (searchParams.get('tab') ?? 'overview') as CultivationView;
  const { setView, setEnvironmentRoom } = useCultivationStore();

  // Sync URL tab to store so child components (e.g. EnvironmentTab) can read activeView
  useEffect(() => {
    setView(tab);
    if (tab === 'environment') {
      const roomId = searchParams.get('room');
      if (roomId) setEnvironmentRoom(roomId);
    }
  }, [tab, searchParams, setView, setEnvironmentRoom]);

  const Component = ROUTES[tab];
  if (Component) return <Component />;
  return null;
}

export function CultivationLayout() {
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={Leaf}
        title="Cultivation"
        subtitle="Grow operations — environment, tasks, genetics, and more"
        accentColor={ACCENT}
      />
      <Suspense fallback={<LoadingSkeleton variant="list" />}>
        <CultivationContent />
      </Suspense>
    </div>
  );
}
