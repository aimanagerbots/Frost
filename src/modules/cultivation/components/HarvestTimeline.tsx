'use client';

import { cn } from '@/lib/utils';
import { StatusBadge, LoadingSkeleton } from '@/components';
import { useHarvestRecords } from '../hooks';
import { Calendar, Scale, Leaf } from 'lucide-react';
import type { HarvestRecord } from '../types';

const STATUS_VARIANT: Record<HarvestRecord['status'], 'warning' | 'info' | 'success'> = {
  upcoming: 'warning',
  drying: 'info',
  complete: 'success',
};

const STATUS_LABEL: Record<HarvestRecord['status'], string> = {
  upcoming: 'Upcoming',
  drying: 'Drying',
  complete: 'Complete',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatWeight(grams: number): string {
  if (grams >= 1000) return `${(grams / 1000).toFixed(1)} kg`;
  return `${grams} g`;
}

interface HarvestCardProps {
  harvest: HarvestRecord;
}

function HarvestCard({ harvest }: HarvestCardProps) {
  return (
    <div className="min-w-[220px] shrink-0 rounded-xl border border-default bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-bright">{harvest.strainName}</h4>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted">
            <Calendar className="h-3 w-3" />
            {formatDate(harvest.harvestDate)}
          </div>
        </div>
        <StatusBadge
          variant={STATUS_VARIANT[harvest.status]}
          label={STATUS_LABEL[harvest.status]}
          size="sm"
        />
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs text-muted">
        <Leaf className="h-3 w-3" />
        {harvest.plantCount} plants
      </div>

      {harvest.status === 'complete' && (
        <div className="mt-3 space-y-1.5 border-t border-default pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-muted">
              <Scale className="h-3 w-3" />
              Dry Weight
            </span>
            <span className="font-medium text-bright">{formatWeight(harvest.dryWeight)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Yield / Plant</span>
            <span className="font-medium text-bright">{harvest.yieldPerPlant} g</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Dry Ratio</span>
            <span className="font-medium text-bright">{harvest.dryRatio}%</span>
          </div>
        </div>
      )}

      {harvest.status === 'drying' && harvest.wetWeight > 0 && (
        <div className="mt-3 border-t border-default pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Wet Weight</span>
            <span className="font-medium text-bright">{formatWeight(harvest.wetWeight)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function HarvestTimeline() {
  const { data: harvests, isLoading } = useHarvestRecords();

  if (isLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (!harvests || harvests.length === 0) return null;

  const upcoming = harvests.filter((h) => h.status === 'upcoming');
  const drying = harvests.filter((h) => h.status === 'drying');
  const complete = harvests.filter((h) => h.status === 'complete');

  const sections: { label: string; items: HarvestRecord[]; accent: string }[] = [
    { label: 'Upcoming', items: upcoming, accent: '#F59E0B' },
    { label: 'Drying', items: drying, accent: '#38BDF8' },
    { label: 'Completed', items: complete, accent: '#22C55E' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-bright">Harvest Timeline</h2>
      {sections.map((section) =>
        section.items.length > 0 ? (
          <div key={section.label}>
            <div className="mb-2 flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: section.accent }}
              />
              <span className="text-xs font-medium text-muted">
                {section.label} ({section.items.length})
              </span>
            </div>
            <div className={cn('flex gap-3 overflow-x-auto pb-2', 'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-elevated')}>
              {section.items.map((harvest) => (
                <HarvestCard key={harvest.id} harvest={harvest} />
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
