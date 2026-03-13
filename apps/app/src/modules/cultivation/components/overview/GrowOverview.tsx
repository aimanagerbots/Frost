'use client';

import { useMemo } from 'react';
import {
  Thermometer,
  Droplets,
  Sprout,
  Calendar,
} from 'lucide-react';
import { AccentCard, StatusBadge, LoadingSkeleton } from '@/components';
import { useGrowRooms } from '@/modules/cultivation/hooks';
import { cn } from '@/lib/utils';
import type { GrowRoom, GrowStage, EnvironmentStatus, RoomStatus } from '@/modules/cultivation/types';

/* ── Constants ─────────────────────────────────────────────────── */

const CULTIVATION_ACCENT = '#22C55E';

type StageGroup = {
  key: string;
  label: string;
  stages: GrowStage[];
  gradient: string;
};

const STAGE_GROUPS: StageGroup[] = [
  {
    key: 'clone',
    label: 'Clone / Propagation',
    stages: ['clone', 'propagation'],
    gradient: 'from-teal-500/20 to-teal-500/5',
  },
  {
    key: 'veg',
    label: 'Vegetative',
    stages: ['veg', 'mother'],
    gradient: 'from-green-500/20 to-green-500/5',
  },
  {
    key: 'flower',
    label: 'Flowering',
    stages: ['flower'],
    gradient: 'from-purple-500/20 to-purple-500/5',
  },
  {
    key: 'drycure',
    label: 'Drying / Curing',
    stages: ['dry', 'cure', 'harvest'],
    gradient: 'from-amber-500/20 to-amber-500/5',
  },
  {
    key: 'other',
    label: 'Maintenance',
    stages: ['maintenance'],
    gradient: 'from-slate-500/20 to-slate-500/5',
  },
];

const COLUMN_HEADER_COLORS: Record<string, string> = {
  clone: '#14B8A6',
  veg: '#22C55E',
  flower: '#A855F7',
  drycure: '#F59E0B',
  other: '#64748B',
};

const ENV_STATUS_COLORS: Record<EnvironmentStatus, { dot: string; label: string }> = {
  optimal: { dot: 'bg-green-400', label: 'Optimal' },
  warning: { dot: 'bg-amber-400', label: 'Warning' },
  critical: { dot: 'bg-red-400', label: 'Critical' },
};

/** Map RoomStatus to a StatusBadge-compatible domain status */
function roomStatusToBadge(status: RoomStatus): 'active' | 'drying' | 'empty' | 'cleaning' | 'transition' {
  return status;
}

/* ── Helpers ───────────────────────────────────────────────────── */

function groupRoomsByStage(rooms: GrowRoom[]): Map<string, GrowRoom[]> {
  const grouped = new Map<string, GrowRoom[]>();

  for (const group of STAGE_GROUPS) {
    grouped.set(group.key, []);
  }

  for (const room of rooms) {
    const matchedGroup = STAGE_GROUPS.find((g) => g.stages.includes(room.stage));
    const key = matchedGroup?.key ?? 'other';
    const list = grouped.get(key) ?? [];
    list.push(room);
    grouped.set(key, list);
  }

  return grouped;
}

function formatDate(iso?: string): string {
  if (!iso) return '--';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ── Sub-components ────────────────────────────────────────────── */

function EnvironmentIndicator({ env }: { env: GrowRoom['environment'] }) {
  const config = ENV_STATUS_COLORS[env.status];

  return (
    <div className="flex items-center gap-3 text-[11px] text-text-muted">
      <span className="flex items-center gap-1">
        <Thermometer className="h-3 w-3 shrink-0" />
        {Math.round(env.temperature)}°F
      </span>
      <span className="flex items-center gap-1">
        <Droplets className="h-3 w-3 shrink-0" />
        {Math.round(env.humidity)}%
      </span>
      <span className="ml-auto flex items-center gap-1">
        <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
        <span className="sr-only">{config.label}</span>
      </span>
    </div>
  );
}

function StageProgress({
  dayInStage,
  totalDaysExpected,
}: {
  dayInStage: number;
  totalDaysExpected: number;
}) {
  const pct = totalDaysExpected > 0 ? Math.min((dayInStage / totalDaysExpected) * 100, 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-text-muted">
          Day {dayInStage} / {totalDaysExpected}
        </span>
        <span className="text-text-muted">{Math.round(pct)}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: CULTIVATION_ACCENT,
            opacity: 0.8,
          }}
        />
      </div>
    </div>
  );
}

function RoomCard({ room }: { room: GrowRoom }) {
  return (
    <AccentCard accentColor={CULTIVATION_ACCENT} padding="sm" className="border border-default">
      {/* Header row: name + status */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-text-default">
            {room.name}
          </h4>
          <p className="truncate text-xs text-text-muted">{room.strainName}</p>
        </div>
        <StatusBadge status={roomStatusToBadge(room.status)} size="xs" />
      </div>

      {/* Plant count + harvest */}
      <div className="mb-2 flex items-center gap-3 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <Sprout className="h-3 w-3 shrink-0 text-green-400" />
          {room.plantCount} plants
        </span>
        {room.estimatedHarvest && (
          <span className="flex items-center gap-1 ml-auto">
            <Calendar className="h-3 w-3 shrink-0" />
            {formatDate(room.estimatedHarvest)}
          </span>
        )}
      </div>

      {/* Stage progress bar */}
      <div className="mb-2">
        <StageProgress
          dayInStage={room.dayInStage}
          totalDaysExpected={room.totalDaysExpected}
        />
      </div>

      {/* Environment strip */}
      <EnvironmentIndicator env={room.environment} />
    </AccentCard>
  );
}

function ColumnHeader({
  group,
  count,
}: {
  group: StageGroup;
  count: number;
}) {
  const color = COLUMN_HEADER_COLORS[group.key] ?? '#64748B';

  return (
    <div className="mb-3 flex items-center gap-2">
      <div
        className="h-2.5 w-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        {group.label}
      </h3>
      <span
        className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {count}
      </span>
    </div>
  );
}

function StageColumn({
  group,
  rooms,
}: {
  group: StageGroup;
  rooms: GrowRoom[];
}) {
  return (
    <div className="min-w-[260px] flex-1">
      <ColumnHeader group={group} count={rooms.length} />

      <div
        className={cn(
          'space-y-2 rounded-xl border border-default/50 p-2',
          'bg-gradient-to-b',
          group.gradient
        )}
        style={{ minHeight: '120px' }}
      >
        {rooms.length === 0 && (
          <div className="flex h-20 items-center justify-center">
            <p className="text-xs text-text-muted/50">No rooms</p>
          </div>
        )}
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}

/* ── Loading State ─────────────────────────────────────────────── */

function GrowOverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="space-y-2">
          <LoadingSkeleton variant="card" count={2} />
        </div>
      ))}
    </div>
  );
}

/* ── Summary Strip ─────────────────────────────────────────────── */

function SummaryStrip({ rooms }: { rooms: GrowRoom[] }) {
  const totalPlants = rooms.reduce((sum, r) => sum + r.plantCount, 0);
  const activeRooms = rooms.filter((r) => r.status === 'active').length;
  const alertCount = rooms.reduce((sum, r) => sum + r.alerts.length, 0);

  const nextHarvest = rooms
    .filter((r) => r.estimatedHarvest)
    .sort((a, b) => new Date(a.estimatedHarvest!).getTime() - new Date(b.estimatedHarvest!).getTime())
    [0];

  const stats = [
    { label: 'Active Rooms', value: activeRooms, color: '#22C55E' },
    { label: 'Total Plants', value: totalPlants.toLocaleString(), color: '#22C55E' },
    {
      label: 'Next Harvest',
      value: nextHarvest ? formatDate(nextHarvest.estimatedHarvest) : '--',
      color: '#F59E0B',
    },
    {
      label: 'Alerts',
      value: alertCount,
      color: alertCount > 0 ? '#EF4444' : '#64748B',
    },
  ];

  return (
    <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-default bg-card px-3 py-2"
        >
          <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
            {stat.label}
          </p>
          <p className="text-lg font-bold" style={{ color: stat.color }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────── */

export function GrowOverview() {
  const { data: rooms, isLoading } = useGrowRooms();

  const grouped = useMemo(() => {
    if (!rooms) return null;
    return groupRoomsByStage(rooms);
  }, [rooms]);

  if (isLoading || !grouped || !rooms) {
    return <GrowOverviewSkeleton />;
  }

  // Filter out empty stage groups that have no rooms and aren't core stages
  const visibleGroups = STAGE_GROUPS.filter((group) => {
    const groupRooms = grouped.get(group.key) ?? [];
    // Always show the 4 core columns; hide "Maintenance" if empty
    return group.key !== 'other' || groupRooms.length > 0;
  });

  return (
    <div className="space-y-1">
      {/* Quick-stat summary */}
      <SummaryStrip rooms={rooms} />

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-x-visible xl:grid-cols-4">
        {visibleGroups.map((group) => (
          <StageColumn
            key={group.key}
            group={group}
            rooms={grouped.get(group.key) ?? []}
          />
        ))}
      </div>
    </div>
  );
}
