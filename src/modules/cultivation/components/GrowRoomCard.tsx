'use client';

import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components';
import { Sprout } from 'lucide-react';
import type { GrowRoom, GrowStage, EnvironmentStatus } from '../types';

const STAGE_VARIANT: Record<GrowStage, 'success' | 'info' | 'warning' | 'muted'> = {
  veg: 'success',
  flower: 'info',
  harvest: 'warning',
  dry: 'muted',
};

const STAGE_LABEL: Record<GrowStage, string> = {
  veg: 'Vegetative',
  flower: 'Flowering',
  harvest: 'Harvest',
  dry: 'Drying',
};

const ENV_DOT: Record<EnvironmentStatus, string> = {
  optimal: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-danger',
};

interface EnvReadingProps {
  label: string;
  value: string;
  status: EnvironmentStatus;
}

function EnvReading({ label, value, status }: EnvReadingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('h-1.5 w-1.5 rounded-full', ENV_DOT[status])} />
      <span className="text-[11px] text-text-muted">{label}</span>
      <span className="ml-auto text-[11px] font-medium text-text-bright">{value}</span>
    </div>
  );
}

function getReadingStatus(
  key: 'temperature' | 'humidity' | 'co2' | 'lightHours',
  value: number,
  stage: GrowStage
): EnvironmentStatus {
  if (key === 'temperature') {
    if (value >= 70 && value <= 80) return 'optimal';
    if (value >= 65 && value <= 85) return 'warning';
    return 'critical';
  }
  if (key === 'humidity') {
    const ideal = stage === 'dry' ? [50, 60] : [45, 65];
    if (value >= ideal[0] && value <= ideal[1]) return 'optimal';
    if (value >= ideal[0] - 10 && value <= ideal[1] + 10) return 'warning';
    return 'critical';
  }
  if (key === 'co2') {
    if (value >= 900 && value <= 1200) return 'optimal';
    if (value >= 700 && value <= 1400) return 'warning';
    return 'critical';
  }
  return 'optimal';
}

interface GrowRoomCardProps {
  room: GrowRoom;
  onClick: (id: string) => void;
}

export function GrowRoomCard({ room, onClick }: GrowRoomCardProps) {
  const progress = Math.min(100, Math.round((room.dayInStage / room.expectedStageDays) * 100));
  const env = room.environment;

  return (
    <div
      className="group cursor-pointer rounded-xl border border-default bg-card p-4 transition-all duration-200 hover:bg-card-hover hover:-translate-y-0.5"
      onClick={() => onClick(room.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(room.id); }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-bright">{room.name}</h3>
          <p className="mt-0.5 text-xs text-text-muted">{room.strainName}</p>
        </div>
        <StatusBadge
          variant={STAGE_VARIANT[room.stage]}
          label={STAGE_LABEL[room.stage]}
          size="sm"
          dot
        />
      </div>

      {/* Day Progress */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-text-muted">Day {room.dayInStage} / {room.expectedStageDays}</span>
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

      {/* Environment Mini Dashboard */}
      <div className="mt-3 space-y-1">
        <EnvReading label="Temp" value={`${env.temperature}°F`} status={getReadingStatus('temperature', env.temperature, room.stage)} />
        <EnvReading label="RH" value={`${env.humidity}%`} status={getReadingStatus('humidity', env.humidity, room.stage)} />
        <EnvReading label="CO2" value={`${env.co2} ppm`} status={getReadingStatus('co2', env.co2, room.stage)} />
        <EnvReading label="Light" value={`${env.lightHours}h`} status={getReadingStatus('lightHours', env.lightHours, room.stage)} />
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center gap-1.5 border-t border-default pt-2.5">
        <Sprout className="h-3.5 w-3.5 text-text-muted" />
        <span className="text-xs text-text-muted">{room.plantCount} plants</span>
      </div>
    </div>
  );
}
