'use client';

import { useState } from 'react';
import { Leaf, AlertTriangle } from 'lucide-react';
import { SectionHeader, MetricCard, LoadingSkeleton } from '@/components';
import { useCultivationMetrics, useGrowRooms } from '../hooks';
import { GrowRoomCard } from './GrowRoomCard';
import { HarvestTimeline } from './HarvestTimeline';
import { RoomDrawer } from './RoomDrawer';

const ACCENT = '#22C55E';

export function CultivationPage() {
  const { data: metrics, isLoading: metricsLoading } = useCultivationMetrics();
  const { data: rooms, isLoading: roomsLoading } = useGrowRooms();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  if (metricsLoading) return <LoadingSkeleton variant="card" count={4} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        icon={Leaf}
        title="Cultivation"
        subtitle="Grow rooms, environment monitoring, and harvest tracking"
        accentColor={ACCENT}
        stats={metrics ? [
          { label: 'In Flower', value: metrics.plantsInFlower },
          { label: 'In Veg', value: metrics.plantsInVeg },
        ] : undefined}
      />

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            label="Active Rooms"
            value={metrics.activeRooms}
            accentColor={ACCENT}
          />
          <MetricCard
            label="Total Plants"
            value={metrics.totalPlants.toLocaleString()}
            accentColor={ACCENT}
          />
          <MetricCard
            label="Next Harvest"
            value={metrics.daysToNextHarvest > 0 ? `${metrics.daysToNextHarvest}d` : 'Today'}
            accentColor={ACCENT}
          />
          <MetricCard
            label="Avg Yield / Plant"
            value={`${metrics.avgYieldPerPlant}g`}
            accentColor={ACCENT}
          />
          <MetricCard
            label="Env Alerts"
            value={metrics.environmentAlerts}
            accentColor={metrics.environmentAlerts > 0 ? '#FB7185' : ACCENT}
          />
        </div>
      )}

      {/* Next Harvest Banner */}
      {metrics && metrics.daysToNextHarvest > 0 && metrics.daysToNextHarvest <= 7 && (
        <div
          className="flex items-center gap-3 rounded-xl border px-4 py-3"
          style={{
            borderColor: '#F59E0B33',
            backgroundColor: '#F59E0B0A',
          }}
        >
          <AlertTriangle className="h-5 w-5 shrink-0" style={{ color: '#F59E0B' }} />
          <div>
            <p className="text-sm font-medium text-text-bright">
              Harvest approaching: {metrics.nextHarvestStrain}
            </p>
            <p className="text-xs text-text-muted">
              Scheduled in {metrics.daysToNextHarvest} day{metrics.daysToNextHarvest !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Grow Room Grid */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text-bright">Grow Rooms</h2>
        {roomsLoading ? (
          <LoadingSkeleton variant="card" count={8} />
        ) : rooms && rooms.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room) => (
              <GrowRoomCard
                key={room.id}
                room={room}
                onClick={setSelectedRoomId}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-default bg-card p-8 text-center">
            <Leaf className="mx-auto h-8 w-8 text-text-muted" />
            <p className="mt-2 text-sm text-text-muted">No grow rooms configured</p>
          </div>
        )}
      </div>

      {/* Harvest Timeline */}
      <HarvestTimeline />

      {/* Room Detail Drawer */}
      <RoomDrawer
        roomId={selectedRoomId}
        onClose={() => setSelectedRoomId(null)}
      />
    </div>
  );
}
