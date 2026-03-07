'use client';

import { cn } from '@/lib/utils';
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Sprout,
  AlertTriangle,
  Waves,
  Zap,
} from 'lucide-react';
import type { GrowRoom, GrowStage, EnvironmentStatus } from '../../types';

// ── Stage badge colors ──────────────────────────────────────────
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

// ── Environment status colors ───────────────────────────────────
const STATUS_COLOR: Record<EnvironmentStatus, string> = {
  optimal: '#22C55E',
  warning: '#F59E0B',
  critical: '#EF4444',
};

const STATUS_BG: Record<EnvironmentStatus, string> = {
  optimal: 'bg-success/20',
  warning: 'bg-warning/20',
  critical: 'bg-danger/20',
};

// ── Helpers ─────────────────────────────────────────────────────
function envStatus(current: number, target: number, tolerance: number): EnvironmentStatus {
  const diff = Math.abs(current - target);
  if (diff <= tolerance) return 'optimal';
  if (diff <= tolerance * 2) return 'warning';
  return 'critical';
}

interface EnvRowProps {
  icon: React.ReactNode;
  label: string;
  current: string;
  target: string;
  status: EnvironmentStatus;
}

function EnvRow({ icon, label, current, target, status }: EnvRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-text-muted">{icon}</span>
      <span className="text-[11px] text-text-muted w-12">{label}</span>
      <span className="ml-auto text-[11px] font-semibold text-text-bright">{current}</span>
      <span className="text-[10px] text-text-muted">/ {target}</span>
      <span
        className={cn('h-2 w-2 rounded-full', STATUS_BG[status])}
        style={{ backgroundColor: STATUS_COLOR[status] }}
      />
    </div>
  );
}

// ── Component ───────────────────────────────────────────────────
interface RoomCardProps {
  room: GrowRoom;
  onClick: () => void;
}

export function RoomCard({ room, onClick }: RoomCardProps) {
  const env = room.environment;
  const progress = Math.min(100, Math.round((room.dayInStage / room.totalDaysExpected) * 100));
  const alertCount = room.alerts.filter((a) => !a.acknowledged).length;
  const iconSize = 12;

  return (
    <div
      className="group cursor-pointer rounded-xl border border-default bg-card p-5 transition-all duration-200 hover:bg-card-hover hover:-translate-y-0.5"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-text-bright truncate">{room.name}</h3>
          <p className="mt-0.5 text-xs text-text-muted truncate">{room.strainName}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {alertCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-danger/20 px-2 py-0.5 text-xs font-semibold text-danger">
              <AlertTriangle className="h-3 w-3" />
              {alertCount}
            </span>
          )}
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: `${STAGE_COLOR[room.stage]}20`,
              color: STAGE_COLOR[room.stage],
            }}
          >
            {STAGE_LABEL[room.stage]}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-text-muted">Day {room.dayInStage} / {room.totalDaysExpected}</span>
          <span className="font-medium text-text-bright">{progress}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: progress >= 90 ? '#F59E0B' : '#22C55E',
            }}
          />
        </div>
      </div>

      {/* Environment Panel */}
      <div className="mt-3 space-y-1.5">
        <EnvRow
          icon={<Thermometer size={iconSize} />}
          label="Temp"
          current={`${env.temperature}°F`}
          target={`${env.temperatureTarget}°F`}
          status={envStatus(env.temperature, env.temperatureTarget, 3)}
        />
        <EnvRow
          icon={<Droplets size={iconSize} />}
          label="RH"
          current={`${env.humidity}%`}
          target={`${env.humidityTarget}%`}
          status={envStatus(env.humidity, env.humidityTarget, 5)}
        />
        <EnvRow
          icon={<Wind size={iconSize} />}
          label="VPD"
          current={`${env.vpd} kPa`}
          target={`${env.vpdTarget} kPa`}
          status={envStatus(env.vpd, env.vpdTarget, 0.15)}
        />
        <EnvRow
          icon={<Waves size={iconSize} />}
          label="CO2"
          current={`${env.co2} ppm`}
          target={`${env.co2Target} ppm`}
          status={envStatus(env.co2, env.co2Target, 100)}
        />
        <EnvRow
          icon={<Sun size={iconSize} />}
          label="Light"
          current={`${env.lightHours}h / ${env.lightIntensity} PPFD`}
          target=""
          status="optimal"
        />
        {env.waterEC != null && env.waterPH != null && (
          <EnvRow
            icon={<Zap size={iconSize} />}
            label="Water"
            current={`EC ${env.waterEC} / pH ${env.waterPH}`}
            target=""
            status="optimal"
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-default pt-2.5">
        <div className="flex items-center gap-1.5">
          <Sprout className="h-3.5 w-3.5 text-text-muted" />
          <span className="text-xs text-text-muted">{room.plantCount} plants</span>
        </div>
        {room.estimatedYield && (
          <span className="text-xs text-text-muted">~{room.estimatedYield}</span>
        )}
      </div>
    </div>
  );
}
