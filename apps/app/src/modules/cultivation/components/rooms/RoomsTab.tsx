'use client';

import { useState } from 'react';
import {
  LayoutGrid,
  List,
  Thermometer,
  Droplets,
  Wind,
  Leaf,
  AlertTriangle,
  Calendar,
  Waves,
  Gauge,
  Sun,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AccentCard,
  StatusBadge,
  LoadingSkeleton,
  DrawerPanel,
} from '@/components';
import { useGrowRooms } from '../../hooks/useGrowRooms';
import type {
  GrowRoom,
  RoomEnvironment,
  IrrigationData,
  RoomAlert,
} from '../../types';

const ACCENT = '#22C55E';

type ViewMode = 'grid' | 'list';

// ── Stage formatting ──────────────────────────────────────────────

function formatStage(stage: string): string {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

function stageLabel(room: GrowRoom): string {
  return `${formatStage(room.stage)} Day ${room.dayInStage}/${room.totalDaysExpected}`;
}

// ── Environment status dot color ──────────────────────────────────

function envDotColor(status: RoomEnvironment['status']): string {
  switch (status) {
    case 'optimal':
      return 'bg-green-400';
    case 'warning':
      return 'bg-amber-400';
    case 'critical':
      return 'bg-red-400';
    default:
      return 'bg-gray-400';
  }
}

function envDotPulse(status: RoomEnvironment['status']): string {
  return status === 'critical' ? 'animate-pulse' : '';
}

// ── Metric box (reused in cards + drawer) ─────────────────────────

function MetricBox({
  label,
  value,
  unit,
  compact,
}: {
  label: string;
  value: string | number;
  unit?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-lg bg-elevated',
        compact ? 'px-2 py-1.5' : 'px-3 py-2'
      )}
    >
      <p className="text-[10px] uppercase tracking-wider text-text-muted">
        {label}
      </p>
      <p
        className={cn(
          'font-semibold text-text-bright',
          compact ? 'text-xs' : 'text-sm'
        )}
      >
        {value}
        {unit && (
          <span className="ml-0.5 text-[10px] font-normal text-text-muted">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

// ── Range metric (drawer detail with target) ──────────────────────

function RangeMetric({
  icon: Icon,
  label,
  value,
  unit,
  target,
  min,
  max,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  unit: string;
  target: number;
  min: number;
  max: number;
}) {
  const inRange = value >= min && value <= max;
  return (
    <div className="rounded-lg bg-elevated px-4 py-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-text-muted" />
        <span className="text-xs uppercase tracking-wider text-text-muted">
          {label}
        </span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span
          className={cn(
            'text-xl font-bold',
            inRange ? 'text-text-bright' : 'text-amber-400'
          )}
        >
          {value}
        </span>
        <span className="text-xs text-text-muted">{unit}</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-text-muted">
        <span>Target {target}{unit}</span>
        <span className="text-text-muted/40">|</span>
        <span>
          Range {min}–{max}
          {unit}
        </span>
      </div>
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────

function CapacityBar({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: pct > 90 ? '#EF4444' : ACCENT,
          }}
        />
      </div>
      <span className="min-w-[3rem] text-right text-xs text-text-muted">
        {current}/{max}
      </span>
    </div>
  );
}

// ── Room card ─────────────────────────────────────────────────────

function RoomCard({
  room,
  onClick,
  mode,
}: {
  room: GrowRoom;
  onClick: () => void;
  mode: ViewMode;
}) {
  const capacity = room.capacity ?? room.plantCount;
  const alertCount = room.alerts.filter((a) => !a.acknowledged).length;

  if (mode === 'list') {
    return (
      <AccentCard
        accentColor={ACCENT}
        onClick={onClick}
        padding="sm"
        className="border border-default"
      >
        <div className="flex items-center gap-4">
          {/* Name + status */}
          <div className="min-w-[140px]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-text-bright">{room.name}</span>
              <div
                className={cn(
                  'h-2 w-2 rounded-full',
                  envDotColor(room.environment.status),
                  envDotPulse(room.environment.status)
                )}
              />
            </div>
            <p className="text-xs text-text-muted">{room.strainName}</p>
          </div>

          {/* Status badge */}
          <StatusBadge status={room.status} size="sm" />

          {/* Stage */}
          <span className="hidden text-xs text-text-muted sm:inline">
            {stageLabel(room)}
          </span>

          {/* Env summary */}
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-text-muted md:inline">
              {room.environment.temperature}F
            </span>
            <span className="hidden text-xs text-text-muted md:inline">
              {room.environment.humidity}%
            </span>
            <span className="hidden text-xs text-text-muted lg:inline">
              {room.environment.co2} ppm
            </span>
            {alertCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-400">
                <AlertTriangle className="h-3 w-3" />
                {alertCount}
              </span>
            )}
            <span className="text-xs text-text-muted">
              {room.plantCount}/{capacity}
            </span>
          </div>
        </div>
      </AccentCard>
    );
  }

  // Grid card
  return (
    <AccentCard
      accentColor={ACCENT}
      onClick={onClick}
      padding="md"
      className="border border-default"
    >
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-bold text-text-bright">{room.name}</h3>
            <div
              className={cn(
                'h-2 w-2 shrink-0 rounded-full',
                envDotColor(room.environment.status),
                envDotPulse(room.environment.status)
              )}
            />
          </div>
          <p className="mt-0.5 text-xs text-text-muted">{room.strainName}</p>
        </div>
        <StatusBadge status={room.status} size="sm" />
      </div>

      {/* Stage badge */}
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-elevated px-2 py-1 text-xs font-medium text-text-bright">
        <Leaf className="h-3 w-3" style={{ color: ACCENT }} />
        {stageLabel(room)}
      </div>

      {/* Capacity */}
      <div className="mt-3">
        <p className="mb-1 text-[10px] uppercase tracking-wider text-text-muted">
          Plants
        </p>
        <CapacityBar current={room.plantCount} max={capacity} />
      </div>

      {/* Environment summary */}
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <MetricBox
          label="Temp"
          value={`${room.environment.temperature}`}
          unit="F"
          compact
        />
        <MetricBox
          label="RH"
          value={`${room.environment.humidity}`}
          unit="%"
          compact
        />
        <MetricBox
          label="CO2"
          value={room.environment.co2}
          unit="ppm"
          compact
        />
      </div>

      {/* Footer: harvest + alerts */}
      <div className="mt-3 flex items-center justify-between">
        {room.estimatedHarvest ? (
          <span className="flex items-center gap-1 text-[11px] text-text-muted">
            <Calendar className="h-3 w-3" />
            {room.estimatedHarvest}
          </span>
        ) : (
          <span />
        )}
        {alertCount > 0 && (
          <span className="flex items-center gap-1 text-xs font-medium text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            {alertCount}
          </span>
        )}
      </div>
    </AccentCard>
  );
}

// ── Alert row (drawer) ────────────────────────────────────────────

function AlertRow({ alert }: { alert: RoomAlert }) {
  const sevColor: Record<string, string> = {
    critical: 'text-red-400',
    warning: 'text-amber-400',
    info: 'text-blue-400',
  };

  return (
    <div className="flex items-start gap-3 rounded-lg bg-elevated px-3 py-2">
      <AlertTriangle
        className={cn('mt-0.5 h-4 w-4 shrink-0', sevColor[alert.severity])}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-text-bright">{alert.message}</p>
        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-text-muted">
          <span className="uppercase">{alert.source}</span>
          {alert.currentValue && (
            <>
              <span className="text-text-muted/40">|</span>
              <span>Current: {alert.currentValue}</span>
            </>
          )}
          {alert.threshold && (
            <>
              <span className="text-text-muted/40">|</span>
              <span>Threshold: {alert.threshold}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Irrigation section (drawer) ───────────────────────────────────

function IrrigationSection({ data }: { data: IrrigationData }) {
  const reservoirPct =
    data.reservoirCapacity > 0
      ? Math.round((data.reservoirLevel / data.reservoirCapacity) * 100)
      : 0;

  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-text-bright">
        <Waves className="h-4 w-4" style={{ color: ACCENT }} />
        Irrigation
      </h4>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <MetricBox label="pH" value={data.ph} />
        <MetricBox label="EC" value={data.ec} unit="mS/cm" />
        <MetricBox label="Water Temp" value={data.waterTemp} unit="F" />
        <MetricBox label="Runoff pH" value={data.runoffPh} />
        <MetricBox label="Runoff EC" value={data.runoffEc} unit="mS/cm" />
        <MetricBox label="Flow Rate" value={data.flowRate} unit="gal/m" />
      </div>

      {/* Reservoir gauge */}
      <div className="rounded-lg bg-elevated px-3 py-2">
        <p className="text-[10px] uppercase tracking-wider text-text-muted">
          Reservoir Level
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-base">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${reservoirPct}%`,
                backgroundColor:
                  reservoirPct < 20
                    ? '#EF4444'
                    : reservoirPct < 40
                      ? '#F59E0B'
                      : ACCENT,
              }}
            />
          </div>
          <span className="text-xs font-semibold text-text-bright">
            {reservoirPct}%
          </span>
        </div>
        <p className="mt-1 text-[10px] text-text-muted">
          {data.reservoirLevel} / {data.reservoirCapacity} gal
        </p>
      </div>
    </div>
  );
}

// ── Room detail drawer ────────────────────────────────────────────

function RoomDetailDrawer({
  room,
  open,
  onClose,
}: {
  room: GrowRoom | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!room) return null;

  const env = room.environment;
  const unacknowledgedAlerts = room.alerts.filter((a) => !a.acknowledged);

  return (
    <DrawerPanel
      open={open}
      onClose={onClose}
      title={room.name}
      width="lg"
    >
      <div className="space-y-6">
        {/* Status + stage overview */}
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={room.status} />
          <span className="inline-flex items-center gap-1.5 rounded-md bg-elevated px-2.5 py-1 text-xs font-medium text-text-bright">
            <Leaf className="h-3.5 w-3.5" style={{ color: ACCENT }} />
            {stageLabel(room)}
          </span>
          <span className="text-sm text-text-muted">
            {room.plantCount} plants
            {room.capacity ? ` / ${room.capacity} capacity` : ''}
          </span>
        </div>

        {/* Strain + harvest */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <MetricBox label="Strain" value={room.strainName} />
          {room.estimatedHarvest && (
            <MetricBox label="Est. Harvest" value={room.estimatedHarvest} />
          )}
          {room.estimatedYield && (
            <MetricBox label="Est. Yield" value={room.estimatedYield} />
          )}
        </div>

        {/* Environment readings */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-text-bright">
            <Thermometer className="h-4 w-4" style={{ color: ACCENT }} />
            Environment
            <div
              className={cn(
                'ml-1 h-2 w-2 rounded-full',
                envDotColor(env.status),
                envDotPulse(env.status)
              )}
            />
          </h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <RangeMetric
              icon={Thermometer}
              label="Temperature"
              value={env.temperature}
              unit="F"
              target={env.temperatureTarget}
              min={env.temperatureMin}
              max={env.temperatureMax}
            />
            <RangeMetric
              icon={Droplets}
              label="Humidity"
              value={env.humidity}
              unit="%"
              target={env.humidityTarget}
              min={env.humidityMin}
              max={env.humidityMax}
            />
            <RangeMetric
              icon={Wind}
              label="CO2"
              value={env.co2}
              unit=" ppm"
              target={env.co2Target}
              min={env.co2Min}
              max={env.co2Max}
            />
            <RangeMetric
              icon={Gauge}
              label="VPD"
              value={env.vpd}
              unit=" kPa"
              target={env.vpdTarget}
              min={env.vpdMin}
              max={env.vpdMax}
            />
            <RangeMetric
              icon={Sun}
              label="PPFD"
              value={env.ppfd}
              unit=" mol/m/s"
              target={env.ppfdTarget}
              min={env.ppfdMin}
              max={env.ppfdMax}
            />
            <RangeMetric
              icon={Zap}
              label="DLI"
              value={env.dli}
              unit=" mol/m/d"
              target={env.dliTarget}
              min={env.dliMin}
              max={env.dliMax}
            />
          </div>
        </div>

        {/* Irrigation */}
        {room.irrigation && <IrrigationSection data={room.irrigation} />}

        {/* Alerts */}
        {unacknowledgedAlerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-text-bright">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Active Alerts
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500/15 px-1.5 text-[10px] font-bold text-amber-400">
                {unacknowledgedAlerts.length}
              </span>
            </h4>
            <div className="space-y-2">
              {unacknowledgedAlerts.map((alert) => (
                <AlertRow key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {room.notes && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-text-bright">Notes</h4>
            <p className="rounded-lg bg-elevated px-3 py-2 text-sm leading-relaxed text-text-muted">
              {room.notes}
            </p>
          </div>
        )}
      </div>
    </DrawerPanel>
  );
}

// ── Main component ────────────────────────────────────────────────

export function RoomsTab() {
  const { data: rooms, isLoading } = useGrowRooms();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedRoom, setSelectedRoom] = useState<GrowRoom | null>(null);

  if (isLoading || !rooms) {
    return <LoadingSkeleton variant="card" count={6} />;
  }

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-text-bright">Grow Rooms</h2>
          <span
            className="inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold"
            style={{
              backgroundColor: `${ACCENT}20`,
              color: ACCENT,
            }}
          >
            {rooms.length}
          </span>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-0.5 rounded-lg bg-elevated p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
              viewMode === 'grid'
                ? 'bg-card text-text-bright shadow-sm'
                : 'text-text-muted hover:text-text-default'
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
              viewMode === 'list'
                ? 'bg-card text-text-bright shadow-sm'
                : 'text-text-muted hover:text-text-default'
            )}
            aria-label="List view"
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Room cards */}
      <div
        className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col gap-2'
        )}
      >
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onClick={() => setSelectedRoom(room)}
            mode={viewMode}
          />
        ))}
      </div>

      {/* Detail drawer */}
      <RoomDetailDrawer
        room={selectedRoom}
        open={selectedRoom !== null}
        onClose={() => setSelectedRoom(null)}
      />
    </div>
  );
}
