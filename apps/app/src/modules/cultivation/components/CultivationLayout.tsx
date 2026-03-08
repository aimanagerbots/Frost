'use client';

import { Suspense } from 'react';
import { Leaf } from 'lucide-react';
import { SectionHeader, LoadingSkeleton } from '@/components';
import { useCultivationStore } from '../store';
import { CultivationNav } from './CultivationNav';
import { EnvironmentTab } from './environment';
import { TasksKanban } from './tasks';
import { ProductionCalendar } from './calendar';
import { GrowSupplies } from './supplies';
import { GeneticsLibrary } from './genetics';
import { CultivationChat } from './chat';
import { ACCENT } from '@/design/colors';


const ROUTES: Record<string, React.ComponentType> = {
  environment: EnvironmentTab,
  tasks: TasksKanban,
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
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={Leaf}
        title="Cultivation"
        subtitle="Grow operations — environment, tasks, genetics, and more"
        accentColor={ACCENT}
      />
      <Suspense fallback={<LoadingSkeleton variant="list" />}>
        <CultivationNav />
      </Suspense>
      <CultivationContent />
    </div>
  );
}
