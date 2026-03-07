'use client';

import { cn } from '@/lib/utils';
import { LoadingSkeleton, EmptyState, StatusBadge } from '@/components';
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Wind,
  Waves,
  Sun,
  Sprout,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Grid3X3,
  Wheat,
  StickyNote,
} from 'lucide-react';
import { useCultivationStore } from '../../store';
import { useGrowRoom, useCultivationTasks, useRoomAlerts, useEnvironmentHistory } from '../../hooks';
import { EnvironmentGauge } from './EnvironmentGauge';
import { EnvironmentChart } from './EnvironmentChart';
import type { GrowStage, EnvironmentStatus, AlertSeverity, TaskCategory } from '../../types';

const ACCENT = '#22C55E';

// ── Stage badge ─────────────────────────────────────────────────
const STAGE_COLOR: Record<GrowStage, string> = {
  clone: '#06B6D4',
  veg: '#22C55E',
  flower: '#8B5CF6',
  harvest: '#F59E0B',
  dry: '#94A3B8',
  cure: '#D97706',
};

const STAGE_LABEL: Record<GrowStage, string> = {
  clone: 'Clone',
  veg: 'Vegetative',
  flower: 'Flowering',
  harvest: 'Harvest',
  dry: 'Drying',
  cure: 'Curing',
};

// ── Alert severity ──────────────────────────────────────────────
const SEVERITY_VARIANT: Record<AlertSeverity, 'danger' | 'warning' | 'info'> = {
  critical: 'danger',
  warning: 'warning',
  info: 'info',
};

// ── Task category labels ────────────────────────────────────────
const CATEGORY_LABEL: Record<TaskCategory, string> = {
  feeding: 'Feeding',
  ipm: 'IPM',
  defoliation: 'Defoliation',
  training: 'Training',
  transplant: 'Transplant',
  flush: 'Flush',
  'harvest-prep': 'Harvest Prep',
  environmental: 'Environmental',
  cleaning: 'Cleaning',
  inspection: 'Inspection',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ── Env status helper ───────────────────────────────────────────
function envStatus(current: number, target: number, tolerance: number): EnvironmentStatus {
  const diff = Math.abs(current - target);
  if (diff <= tolerance) return 'optimal';
  if (diff <= tolerance * 2) return 'warning';
  return 'critical';
}

// ── Component ───────────────────────────────────────────────────
export function RoomDetail() {
  const { selectedRoomId, setView } = useCultivationStore();
  const { data: room, isLoading: roomLoading } = useGrowRoom(selectedRoomId ?? '');
  const { data: tasks } = useCultivationTasks(selectedRoomId ?? undefined);
  const { data: alerts } = useRoomAlerts(selectedRoomId ?? undefined);
  const { data: envHistory } = useEnvironmentHistory(selectedRoomId ?? '');

  if (!selectedRoomId) {
    return (
      <EmptyState
        icon={Sprout}
        title="No room selected"
        description="Select a room from the rooms list."
        accentColor={ACCENT}
      />
    );
  }

  if (roomLoading || !room) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  const env = room.environment;
  const progress = Math.min(100, Math.round((room.dayInStage / room.totalDaysExpected) * 100));

  return (
    <div className="space-y-6">
      {/* ── Back Button + Header ──────────────────────────────── */}
      <div>
        <button
          onClick={() => setView('rooms')}
          className="mb-4 flex items-center gap-1.5 text-sm text-text-muted hover:text-text-default transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Rooms
        </button>

        <div className="rounded-xl border border-default bg-card p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-text-bright">{room.name}</h2>
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${STAGE_COLOR[room.stage]}20`,
                    color: STAGE_COLOR[room.stage],
                  }}
                >
                  {STAGE_LABEL[room.stage]}
                </span>
              </div>
              <p className="mt-1 text-sm text-text-muted">
                Strain:{' '}
                <span className="text-text-default font-medium" style={{ color: ACCENT }}>
                  {room.strainName}
                </span>
              </p>
            </div>

            {/* Key stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-text-muted">
                <Sprout className="h-4 w-4" />
                <span>{room.plantCount} plants</span>
              </div>
              {room.layout && (
                <div className="flex items-center gap-1.5 text-text-muted">
                  <Grid3X3 className="h-4 w-4" />
                  <span>{room.layout.rows} x {room.layout.columns}</span>
                </div>
              )}
              {room.estimatedYield && (
                <div className="flex items-center gap-1.5 text-text-muted">
                  <Wheat className="h-4 w-4" />
                  <span>~{room.estimatedYield}</span>
                </div>
              )}
              {room.estimatedHarvest && (
                <div className="flex items-center gap-1.5 text-text-muted">
                  <CalendarDays className="h-4 w-4" />
                  <span>Harvest: {room.estimatedHarvest}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">
                Day {room.dayInStage} of {room.totalDaysExpected}
              </span>
              <span className="font-medium text-text-bright">{progress}%</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-elevated">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  backgroundColor: progress >= 90 ? '#F59E0B' : ACCENT,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Environment Gauges ────────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-text-bright">Environment</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <EnvironmentGauge
            label="Temperature"
            value={env.temperature}
            target={env.temperatureTarget}
            unit="°F"
            status={envStatus(env.temperature, env.temperatureTarget, 3)}
            icon={Thermometer}
          />
          <EnvironmentGauge
            label="Humidity"
            value={env.humidity}
            target={env.humidityTarget}
            unit="%"
            status={envStatus(env.humidity, env.humidityTarget, 5)}
            icon={Droplets}
          />
          <EnvironmentGauge
            label="VPD"
            value={env.vpd}
            target={env.vpdTarget}
            unit="kPa"
            status={envStatus(env.vpd, env.vpdTarget, 0.15)}
            icon={Wind}
          />
          <EnvironmentGauge
            label="CO2"
            value={env.co2}
            target={env.co2Target}
            unit="ppm"
            status={envStatus(env.co2, env.co2Target, 100)}
            icon={Waves}
          />
          <EnvironmentGauge
            label="Light"
            value={env.lightIntensity}
            target={env.lightIntensity}
            unit="PPFD"
            status="optimal"
            icon={Sun}
          />
          <EnvironmentGauge
            label="Soil Moisture"
            value={env.soilMoisture ?? 0}
            target={env.soilMoisture ?? 0}
            unit="%"
            status="optimal"
            icon={Droplets}
          />
        </div>
      </div>

      {/* ── 24hr Chart ────────────────────────────────────────── */}
      {envHistory && envHistory.length > 0 && (
        <EnvironmentChart data={envHistory} roomName={room.name} />
      )}

      {/* ── Room Tasks ────────────────────────────────────────── */}
      {tasks && tasks.length > 0 && (
        <div className="rounded-xl border border-default bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-text-bright">
            This Week&apos;s Tasks
          </h3>
          <div className="space-y-2">
            {tasks.slice(0, 8).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-lg bg-elevated px-3 py-2.5"
              >
                <button
                  className={cn(
                    'h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors',
                    task.completedAt
                      ? 'border-success bg-success/20'
                      : 'border-default hover:border-text-muted'
                  )}
                  aria-label={task.completedAt ? 'Completed' : 'Mark complete'}
                >
                  {task.completedAt && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'text-sm truncate',
                      task.completedAt
                        ? 'text-text-muted line-through'
                        : 'text-text-default'
                    )}
                  >
                    {task.title}
                  </p>
                </div>
                <StatusBadge
                  variant="muted"
                  label={CATEGORY_LABEL[task.category]}
                  size="sm"
                />
                {task.assignee && (
                  <span className="text-xs text-text-muted hidden sm:inline">
                    {task.assignee}
                  </span>
                )}
                <span className="text-xs text-text-muted">
                  {DAY_NAMES[task.dayOfWeek]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Alerts ────────────────────────────────────────────── */}
      {alerts && alerts.length > 0 && (
        <div className="rounded-xl border border-default bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-semibold text-text-bright">
              Alerts ({alerts.length})
            </h3>
          </div>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg px-3 py-2.5',
                  alert.acknowledged ? 'bg-elevated/50' : 'bg-elevated'
                )}
              >
                <StatusBadge
                  variant={SEVERITY_VARIANT[alert.severity]}
                  label={alert.severity}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'text-sm',
                      alert.acknowledged
                        ? 'text-text-muted'
                        : 'text-text-default'
                    )}
                  >
                    {alert.message}
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-muted">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                {!alert.acknowledged && (
                  <button
                    className="shrink-0 rounded-lg border border-default px-3 py-1 text-xs text-text-muted hover:text-text-default hover:bg-elevated transition-colors"
                    aria-label="Acknowledge alert"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Notes ─────────────────────────────────────────────── */}
      {room.notes && (
        <div className="rounded-xl border border-default bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-text-muted" />
            <h3 className="text-sm font-semibold text-text-bright">Room Notes</h3>
          </div>
          <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
            {room.notes}
          </p>
        </div>
      )}
    </div>
  );
}
