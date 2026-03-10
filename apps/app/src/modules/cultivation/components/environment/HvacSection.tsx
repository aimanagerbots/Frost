'use client';

import {
  Thermometer,
  Fan,
  Gauge,
  Zap,
  Filter,
  Droplets,
  ArrowRightLeft,
} from 'lucide-react';
import { useGrowRoom } from '../../hooks/useGrowRoom';
import { LoadingSkeleton } from '@/components';
import type { EquipmentStatus } from '../../types';

const STATUS_COLORS: Record<EquipmentStatus, string> = {
  running: '#5BB8E6',
  idle: '#5BB8E6',
  fault: '#EF4444',
};

interface HvacSectionProps {
  roomId: string;
}

export function HvacSection({ roomId }: HvacSectionProps) {
  const { data: room, isLoading } = useGrowRoom(roomId);

  if (isLoading || !room) return <LoadingSkeleton variant="card" count={3} />;
  if (!room.hvac) return null;

  const hvac = room.hvac;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-1 w-6 rounded-full bg-orange-500" />
        <h3 className="text-sm font-semibold text-text-bright">HVAC System</h3>
        <span className="text-[10px] text-text-muted uppercase tracking-wider">H.E. Anderson</span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* Supply Air Temp */}
        <div className="flex items-start gap-3 rounded-xl bg-card p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
            <Thermometer className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <p className="text-[11px] text-text-muted uppercase tracking-wider">Supply Air</p>
            <p className="text-lg font-bold text-text-bright">{hvac.supplyAirTemp}F</p>
            <p className="text-[10px] text-text-muted">Target: {hvac.supplyAirTempTarget}F</p>
          </div>
        </div>

        {/* Return Air Temp */}
        <div className="flex items-start gap-3 rounded-xl bg-card p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
            <ArrowRightLeft className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <p className="text-[11px] text-text-muted uppercase tracking-wider">Return Air</p>
            <p className="text-lg font-bold text-text-bright">{hvac.returnAirTemp}F</p>
            <p className="text-[10px] text-text-muted">Normal</p>
          </div>
        </div>

        {/* Damper Position */}
        <div className="flex items-start gap-3 rounded-xl bg-card p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
            <Gauge className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <p className="text-[11px] text-text-muted uppercase tracking-wider">Damper</p>
            <p className="text-lg font-bold text-text-bright">{hvac.damperPosition}%</p>
            <p className="text-[10px] text-text-muted capitalize">{hvac.damperMode}</p>
          </div>
        </div>

        {/* Compressor */}
        <div className="flex items-start gap-3 rounded-xl bg-card p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
            <Fan className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <p className="text-[11px] text-text-muted uppercase tracking-wider">Compressor</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-text-bright capitalize">{hvac.compressorStatus}</span>
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[hvac.compressorStatus] }} />
            </div>
            {hvac.compressorStatus === 'running' && (
              <p className="text-[10px] text-text-muted">Stage {hvac.compressorStage} of {hvac.compressorStagesTotal}</p>
            )}
          </div>
        </div>

        {/* Dehumidifier */}
        <div className="flex items-start gap-3 rounded-xl bg-card p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
            <Droplets className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <p className="text-[11px] text-text-muted uppercase tracking-wider">Dehumidifier</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-text-bright capitalize">{hvac.dehumidifierStatus}</span>
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[hvac.dehumidifierStatus] }} />
            </div>
            <p className="text-[10px] text-text-muted">{hvac.dehumidifierCapacity}% capacity</p>
          </div>
        </div>

        {/* Energy Usage */}
        <div className="flex items-start gap-3 rounded-xl bg-card p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
            <Zap className="h-4 w-4 text-orange-400" />
          </div>
          <div>
            <p className="text-[11px] text-text-muted uppercase tracking-wider">Energy (1hr)</p>
            <p className="text-lg font-bold text-text-bright">{hvac.energyUsageKwh} kWh</p>
            <p className="text-[10px] text-text-muted">Normal</p>
          </div>
        </div>

        {/* Filter Status */}
        <div className="flex items-start gap-3 rounded-xl bg-card p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
            <Filter className="h-4 w-4 text-orange-400" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-text-muted uppercase tracking-wider">Filter Life</p>
            <p className="text-lg font-bold text-text-bright">{hvac.filterLifePercent}%</p>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${hvac.filterLifePercent}%`,
                  backgroundColor: hvac.filterLifePercent > 20 ? '#5BB8E6' : '#EF4444',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
