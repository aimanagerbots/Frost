'use client';

import {
  Thermometer,
  Droplets,
  Wind,
  Activity,
  Sun,
  Zap,
  Clock,
} from 'lucide-react';
import { useGrowRoom } from '../../hooks/useGrowRoom';
import { useEnvironmentHistory } from '../../hooks/useEnvironmentHistory';
import { EnvironmentGauge } from './EnvironmentGauge';
import { EnvironmentChart } from './EnvironmentChart';
import { LoadingSkeleton } from '@/components';
import type { EnvironmentStatus } from '../../types';

function getStatus(value: number, min: number, max: number): EnvironmentStatus {
  if (value >= min && value <= max) return 'optimal';
  const margin = (max - min) * 0.15;
  if (value >= min - margin && value <= max + margin) return 'warning';
  return 'critical';
}

interface ClimateSectionProps {
  roomId: string;
}

export function ClimateSection({ roomId }: ClimateSectionProps) {
  const { data: room, isLoading } = useGrowRoom(roomId);
  const { data: history } = useEnvironmentHistory(roomId);

  if (isLoading || !room) return <LoadingSkeleton variant="card" count={4} />;

  const env = room.environment;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-1 w-6 rounded-full bg-[#22C55E]" />
        <h3 className="text-sm font-semibold text-text-bright">Climate Control</h3>
        <span className="text-[10px] text-text-muted uppercase tracking-wider">Trollmaster</span>
      </div>

      {/* Gauges grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <EnvironmentGauge
          label="Temperature"
          value={env.temperature}
          unit="F"
          status={getStatus(env.temperature, env.temperatureMin, env.temperatureMax)}
          icon={Thermometer}
          targetRange={`${env.temperatureMin}-${env.temperatureMax}F`}
        />
        <EnvironmentGauge
          label="Humidity"
          value={env.humidity}
          unit="%"
          status={getStatus(env.humidity, env.humidityMin, env.humidityMax)}
          icon={Droplets}
          targetRange={`${env.humidityMin}-${env.humidityMax}%`}
        />
        <EnvironmentGauge
          label="CO2"
          value={env.co2}
          unit="ppm"
          status={getStatus(env.co2, env.co2Min, env.co2Max)}
          icon={Wind}
          targetRange={`${env.co2Min}-${env.co2Max} ppm`}
        />
        <EnvironmentGauge
          label="VPD"
          value={env.vpd}
          unit="kPa"
          status={getStatus(env.vpd, env.vpdMin, env.vpdMax)}
          icon={Activity}
          targetRange={`${env.vpdMin}-${env.vpdMax} kPa`}
        />
        <EnvironmentGauge
          label="PPFD"
          value={env.ppfd}
          unit="umol/m2/s"
          status={env.ppfd === 0 ? 'optimal' : getStatus(env.ppfd, env.ppfdMin, env.ppfdMax)}
          icon={Sun}
          targetRange={env.ppfd > 0 ? `${env.ppfdMin}-${env.ppfdMax}` : 'Lights off'}
        />
        <EnvironmentGauge
          label="DLI"
          value={env.dli}
          unit="mol/m2/d"
          status={env.dli === 0 ? 'optimal' : getStatus(env.dli, env.dliMin, env.dliMax)}
          icon={Zap}
          targetRange={env.dli > 0 ? `${env.dliMin}-${env.dliMax}` : 'N/A'}
        />
        <EnvironmentGauge
          label="Light Cycle"
          value={`${env.lightHours}/${env.darkHours}`}
          unit=""
          status="optimal"
          icon={Clock}
          subtitle={env.lightHours >= 16 ? 'Vegetative' : env.lightHours === 0 ? 'Dark' : 'Flowering'}
        />
      </div>

      {/* 24-hour chart */}
      {history && history.length > 0 && (
        <EnvironmentChart data={history} roomName={room.name} />
      )}
    </div>
  );
}
