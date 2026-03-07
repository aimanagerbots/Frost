'use client';

import { cn } from '@/lib/utils';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components';
import { Sprout, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useGrowRooms } from '../../hooks';
import { useCultivationStore } from '../../store';
import { RoomCard } from './RoomCard';
import type { GrowStage, GrowRoom } from '../../types';

const ACCENT = '#22C55E';

const STAGE_FILTERS: { value: GrowStage | 'all'; label: string }[] = [
  { value: 'all', label: 'All Rooms' },
  { value: 'clone', label: 'Clone' },
  { value: 'veg', label: 'Veg' },
  { value: 'flower', label: 'Flower' },
  { value: 'harvest', label: 'Harvest' },
  { value: 'dry', label: 'Dry' },
  { value: 'cure', label: 'Cure' },
];

export function AllRoomsView() {
  const { data: rooms, isLoading, isError, refetch } = useGrowRooms();
  const navigateToRoom = useCultivationStore((s) => s.navigateToRoom);
  const [stageFilter, setStageFilter] = useState<GrowStage | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!rooms) return [];
    let list: GrowRoom[] = rooms;
    if (stageFilter !== 'all') {
      list = list.filter((r) => r.stage === stageFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.strainName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [rooms, stageFilter, search]);

  // ── Stats bar ─────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!rooms) return null;
    const active = rooms.filter((r) => r.status === 'active').length;
    const totalPlants = rooms.reduce((s, r) => s + r.plantCount, 0);
    const alertCount = rooms.reduce(
      (s, r) => s + r.alerts.filter((a) => !a.acknowledged).length,
      0
    );
    return { total: rooms.length, active, totalPlants, alertCount };
  }, [rooms]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          <LoadingSkeleton variant="card" count={6} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load grow rooms"
        message="Could not fetch room data. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Rooms', value: stats.total },
            { label: 'Active', value: stats.active },
            { label: 'Total Plants', value: stats.totalPlants.toLocaleString() },
            {
              label: 'Active Alerts',
              value: stats.alertCount,
              danger: stats.alertCount > 0,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-default bg-card px-4 py-3"
            >
              <p className="text-xs text-text-muted">{s.label}</p>
              <p
                className={cn(
                  'mt-1 text-xl font-bold',
                  'danger' in s && s.danger
                    ? 'text-danger'
                    : 'text-text-bright'
                )}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rooms or strains..."
            className="w-full rounded-lg border border-default bg-elevated py-2 pl-9 pr-3 text-sm text-text-default placeholder:text-text-muted outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/30"
          />
        </div>

        {/* Stage Filters */}
        <div className="flex flex-wrap gap-1.5">
          {STAGE_FILTERS.map((sf) => (
            <button
              key={sf.value}
              onClick={() => setStageFilter(sf.value)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                stageFilter === sf.value
                  ? 'text-white'
                  : 'bg-elevated text-text-muted hover:text-text-default'
              )}
              style={
                stageFilter === sf.value
                  ? { backgroundColor: ACCENT }
                  : undefined
              }
            >
              {sf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Room Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="No rooms found"
          description={
            search || stageFilter !== 'all'
              ? 'Try adjusting your filters.'
              : 'No grow rooms have been created yet.'
          }
          accentColor={ACCENT}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          {filtered.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={() => navigateToRoom(room.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
