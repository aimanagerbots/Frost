'use client';

import { MapPin, Clock } from 'lucide-react';
import { StatusBadge, LoadingSkeleton } from '@/components';
import type { DeliveryRun, DeliveryRunStatus } from '../types';
import { ACCENT } from '@/design/colors';


const statusVariant = (s: DeliveryRunStatus) => {
  const map: Record<DeliveryRunStatus, 'default' | 'info' | 'success' | 'warning' | 'muted'> = {
    loading: 'warning',
    'in-transit': 'info',
    delivering: 'info',
    returning: 'muted',
    completed: 'success',
  };
  return map[s];
};

interface ActiveRoutesProps {
  runs: DeliveryRun[];
  loading: boolean;
  onSelectRun: (id: string) => void;
  selectedRunId: string | null;
}

export function ActiveRoutes({ runs, loading, onSelectRun, selectedRunId }: ActiveRoutesProps) {
  if (loading) return <LoadingSkeleton variant="card" count={3} />;

  // Sort: in-transit first, then loading, then completed
  const sortedRuns = [...runs].sort((a, b) => {
    const order: Record<DeliveryRunStatus, number> = {
      'in-transit': 0,
      delivering: 1,
      loading: 2,
      returning: 3,
      completed: 4,
    };
    return (order[a.status] ?? 5) - (order[b.status] ?? 5);
  });

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-text-muted">Active Routes</h3>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {sortedRuns.map((run) => {
          const isActive = run.status === 'in-transit' || run.status === 'delivering';
          const isSelected = selectedRunId === run.id;
          const progress = run.totalStops > 0 ? (run.completedStops / run.totalStops) * 100 : 0;

          return (
            <button
              key={run.id}
              onClick={() => onSelectRun(run.id)}
              className="rounded-xl border bg-card p-4 text-left transition-all hover:bg-accent-hover"
              style={{
                borderColor: isSelected ? ACCENT : 'var(--border-default)',
                boxShadow: isSelected ? `0 0 0 1px ${ACCENT}` : undefined,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-text-default">{run.routeName}</h4>
                  <p className="text-xs text-text-muted mt-0.5">{run.driverName}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {isActive && (
                    <span
                      className="h-2 w-2 rounded-full animate-pulse"
                      style={{ backgroundColor: ACCENT }}
                    />
                  )}
                  <StatusBadge label={run.status.replace(/-/g, ' ')} variant={statusVariant(run.status)} size="sm" />
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {run.completedStops} of {run.totalStops} stops
                  </span>
                  <span className="text-text-muted flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {run.estimatedDuration}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${progress}%`, backgroundColor: ACCENT }}
                  />
                </div>
              </div>

              <p className="text-xs text-text-muted">Vehicle: {run.vehicleId}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
