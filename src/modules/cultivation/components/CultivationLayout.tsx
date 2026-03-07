'use client';

import { Suspense } from 'react';
import { Leaf } from 'lucide-react';
import { SectionHeader, LoadingSkeleton } from '@/components';
import { useCultivationStore } from '../store';
import { CultivationNav } from './CultivationNav';
import { CultivationDashboard } from './dashboard';
import { AllRoomsView } from './rooms';
import { RoomDetail } from './room-detail';
import { ProductionCalendar } from './calendar';
import { GrowSupplies } from './supplies';
import { GeneticsLibrary } from './genetics';
import { CultivationChat } from './chat';

const ACCENT = '#22C55E';

const ROUTES: Record<string, React.ComponentType> = {
  dashboard: CultivationDashboard,
  rooms: AllRoomsView,
  room: RoomDetail,
  calendar: ProductionCalendar,
  supplies: GrowSupplies,
  genetics: GeneticsLibrary,
  chat: CultivationChat,
};

function CultivationContent() {
  const { activeView } = useCultivationStore();
  const Component = ROUTES[activeView];
  return Component ? <Component /> : null;
}

export function CultivationLayout() {
  const { language } = useCultivationStore();

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={Leaf}
        title={language === 'es' ? 'Cultivo' : 'Cultivation'}
        subtitle={
          language === 'es'
            ? 'Operaciones de cultivo — cuartos, genética, calendario y más'
            : 'Grow operations — rooms, genetics, calendar, and more'
        }
        accentColor={ACCENT}
      />
      <Suspense fallback={<LoadingSkeleton variant="list" />}>
        <CultivationNav />
      </Suspense>
      <CultivationContent />
    </div>
  );
}
