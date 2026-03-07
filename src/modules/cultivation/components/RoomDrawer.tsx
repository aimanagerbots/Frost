'use client';

import { cn } from '@/lib/utils';
import { DrawerPanel, ChartWrapper, StatusBadge, CHART_THEME, CHART_COLORS, LoadingSkeleton } from '@/components';
import { useGrowRoom } from '../hooks';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Thermometer, Droplets, Wind, Sun, Scissors, ClipboardCheck } from 'lucide-react';
import type { GrowStage, EnvironmentStatus } from '../types';

const ACCENT = '#22C55E';

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

const STATUS_BG: Record<EnvironmentStatus, string> = {
  optimal: 'bg-success/10 border-success/20',
  warning: 'bg-warning/10 border-warning/20',
  critical: 'bg-danger/10 border-danger/20',
};

const STATUS_TEXT: Record<EnvironmentStatus, string> = {
  optimal: 'text-success',
  warning: 'text-warning',
  critical: 'text-danger',
};

interface EnvCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  status: EnvironmentStatus;
}

function EnvCard({ icon: Icon, label, value, status }: EnvCardProps) {
  return (
    <div className={cn('rounded-lg border p-3', STATUS_BG[status])}>
      <div className="flex items-center gap-2">
        <Icon className={cn('h-4 w-4', STATUS_TEXT[status])} />
        <span className="text-xs text-muted">{label}</span>
      </div>
      <div className={cn('mt-1 text-lg font-bold', STATUS_TEXT[status])}>{value}</div>
    </div>
  );
}

interface RoomDrawerProps {
  roomId: string | null;
  onClose: () => void;
}

export function RoomDrawer({ roomId, onClose }: RoomDrawerProps) {
  const { data: room, isLoading } = useGrowRoom(roomId ?? '');

  const chartData = room?.environmentHistory.map((snap) => {
    const hour = new Date(snap.timestamp).getHours();
    return {
      time: `${hour}:00`,
      temp: Math.round(snap.temperature * 10) / 10,
      humidity: Math.round(snap.humidity * 10) / 10,
      co2: Math.round(snap.co2),
    };
  }) ?? [];

  return (
    <DrawerPanel
      open={!!roomId}
      onClose={onClose}
      title={room?.name ?? 'Room Detail'}
      width="lg"
    >
      {isLoading || !room ? (
        <LoadingSkeleton variant="card" count={3} />
      ) : (
        <div className="space-y-6">
          {/* Room Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted">Strain</p>
              <p className="text-lg font-semibold text-bright">{room.strainName}</p>
            </div>
            <div className="text-right">
              <StatusBadge
                variant={STAGE_VARIANT[room.stage]}
                label={STAGE_LABEL[room.stage]}
                dot
                pulse={room.stage === 'flower'}
              />
              <p className="mt-1 text-xs text-muted">
                Day {room.dayInStage} of {room.expectedStageDays}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-elevated">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((room.dayInStage / room.expectedStageDays) * 100))}%`,
                  backgroundColor: ACCENT,
                }}
              />
            </div>
          </div>

          {/* Environment Readings */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-bright">Environment</h3>
            <div className="grid grid-cols-2 gap-3">
              <EnvCard icon={Thermometer} label="Temperature" value={`${room.environment.temperature}°F`} status={room.environment.status} />
              <EnvCard icon={Droplets} label="Humidity" value={`${room.environment.humidity}%`} status={room.environment.status} />
              <EnvCard icon={Wind} label="CO2" value={`${room.environment.co2} ppm`} status={room.environment.status} />
              <EnvCard icon={Sun} label="Light Cycle" value={`${room.environment.lightHours}h`} status={room.environment.status} />
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-muted">
              <span>VPD: {room.environment.vpd} kPa</span>
              <span className={cn('font-medium', STATUS_TEXT[room.environment.status])}>
                {room.environment.status.charAt(0).toUpperCase() + room.environment.status.slice(1)}
              </span>
            </div>
          </div>

          {/* 24h Trend Chart */}
          <ChartWrapper title="24-Hour Environment Trends" height={220}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke={CHART_THEME.gridColor} strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                />
                <YAxis
                  yAxisId="temp"
                  tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                />
                <YAxis
                  yAxisId="co2"
                  orientation="right"
                  tick={{ fill: CHART_THEME.axisColor, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: CHART_THEME.tooltipBg,
                    border: `1px solid ${CHART_THEME.tooltipBorder}`,
                    borderRadius: 8,
                    color: CHART_THEME.tooltipText,
                    fontSize: 12,
                  }}
                />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temp"
                  stroke={CHART_COLORS.danger}
                  strokeWidth={2}
                  dot={false}
                  name="Temp (°F)"
                />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="humidity"
                  stroke={CHART_COLORS.info}
                  strokeWidth={2}
                  dot={false}
                  name="RH (%)"
                />
                <Line
                  yAxisId="co2"
                  type="monotone"
                  dataKey="co2"
                  stroke={CHART_COLORS.warning}
                  strokeWidth={2}
                  dot={false}
                  name="CO2 (ppm)"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Plant Info */}
          <div className="rounded-xl border border-default bg-elevated p-4">
            <h3 className="mb-2 text-sm font-semibold text-bright">Plant Info</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-muted">Plant Count</span>
              <span className="text-right font-medium text-bright">{room.plantCount}</span>
              {room.estimatedYield && (
                <>
                  <span className="text-muted">Est. Yield</span>
                  <span className="text-right font-medium text-bright">{room.estimatedYield}</span>
                </>
              )}
              {room.estimatedHarvest && (
                <>
                  <span className="text-muted">Est. Harvest</span>
                  <span className="text-right font-medium text-bright">{room.estimatedHarvest}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-default bg-elevated px-4 py-2.5 text-sm font-medium text-bright transition-colors hover:bg-card-hover"
            >
              <Scissors className="h-4 w-4" />
              Schedule Harvest
            </button>
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-default bg-elevated px-4 py-2.5 text-sm font-medium text-bright transition-colors hover:bg-card-hover"
            >
              <ClipboardCheck className="h-4 w-4" />
              Log Inspection
            </button>
          </div>
        </div>
      )}
    </DrawerPanel>
  );
}
