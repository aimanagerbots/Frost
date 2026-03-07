'use client';

import { useState } from 'react';
import { Truck } from 'lucide-react';
import { LoadingSkeleton, ErrorState, EmptyState } from '@/components';
import { useDeliveryRuns } from '../hooks';
import { ActiveRoutes } from './ActiveRoutes';
import { RouteDrawer } from './RouteDrawer';

const ACCENT = '#0EA5E9';

export function DeliveryRoutes() {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const { data: runs, isLoading, error, refetch } = useDeliveryRuns();

  const selectedRun = runs?.find((r) => r.id === selectedRunId) ?? null;

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (error) return <ErrorState title="Failed to load routes" message={error.message} onRetry={() => refetch()} />;

  if (!runs || runs.length === 0) {
    return <EmptyState icon={Truck} title="No delivery runs" description="No active delivery runs to display" accentColor={ACCENT} />;
  }

  return (
    <div className="space-y-6">
      <ActiveRoutes
        runs={runs}
        loading={false}
        onSelectRun={setSelectedRunId}
        selectedRunId={selectedRunId}
      />

      <RouteDrawer
        run={selectedRun}
        open={!!selectedRunId}
        onClose={() => setSelectedRunId(null)}
      />
    </div>
  );
}
