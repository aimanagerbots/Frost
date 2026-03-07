'use client';

import { SectionHeader, EmptyState } from '@/components';
import { HardHat } from 'lucide-react';

export default function Labor() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Labor & Payroll" accentColor="#059669" icon={HardHat} />
      <EmptyState
        icon={HardHat}
        title="Coming Soon"
        description="Employee scheduling, time tracking, payroll management, and labor cost analytics."
        accentColor="#059669"
      />
    </div>
  );
}
