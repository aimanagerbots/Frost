'use client';

import { Users } from 'lucide-react';
import { LoadingSkeleton, ErrorState, EmptyState } from '@/components';
import { useDrivers } from '../hooks';
import { DriverCards } from './DriverCards';
import { ACCENT } from '@/design/colors';


export function DriverBoard() {
  const { data: drivers, isLoading, error, refetch } = useDrivers();

  if (isLoading) return <LoadingSkeleton variant="card" count={4} />;
  if (error) return <ErrorState title="Failed to load drivers" message={error.message} onRetry={() => refetch()} />;

  if (!drivers || drivers.length === 0) {
    return <EmptyState icon={Users} title="No drivers" description="No drivers available" accentColor={ACCENT} />;
  }

  const activeCount = drivers.filter((d) => d.status !== 'off-duty').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text-bright">Driver Board</h3>
          <span className="rounded-full bg-elevated px-2 py-0.5 text-xs font-medium text-text-muted">
            {activeCount} active
          </span>
        </div>
      </div>

      <DriverCards drivers={drivers} loading={false} />
    </div>
  );
}
