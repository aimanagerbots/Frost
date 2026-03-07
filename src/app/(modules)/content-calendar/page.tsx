'use client';

import { SectionHeader, EmptyState } from '@/components';
import { CalendarRange } from 'lucide-react';

export default function ContentCalendar() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Content Calendar" accentColor="#EC4899" icon={CalendarRange} />
      <EmptyState
        icon={CalendarRange}
        title="Coming Soon"
        description="Plan and schedule marketing content across channels with a visual calendar view."
        accentColor="#EC4899"
      />
    </div>
  );
}
