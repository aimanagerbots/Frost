'use client';

import { Droplets, FlaskConical, Timer, Gauge, Waves, Beaker } from 'lucide-react';
import { useGrowRoom } from '../../hooks/useGrowRoom';
import { useIrrigationSchedule } from '../../hooks/useIrrigationSchedule';
import { useNutrientRecipe } from '../../hooks/useNutrientRecipe';
import { LoadingSkeleton } from '@/components';

const ACCENT = '#22C55E';

function formatTimeShort(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function formatTimeDiff(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  const absDiff = Math.abs(diff);
  const hours = Math.floor(absDiff / 3600000);
  const mins = Math.floor((absDiff % 3600000) / 60000);
  const prefix = diff < 0 ? '' : 'in ';
  const suffix = diff < 0 ? ' ago' : '';
  if (hours > 0) return `${prefix}${hours}h ${mins}m${suffix}`;
  return `${prefix}${mins}m${suffix}`;
}

interface MetricCardProps {
  label: string;
  value: string;
  target?: string;
  status?: 'ok' | 'warning';
  icon: React.ReactNode;
}

function MetricCard({ label, value, target, status = 'ok', icon }: MetricCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-default bg-card p-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${ACCENT}15` }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-text-muted uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-text-bright">{value}</p>
        {target && (
          <p className="text-[10px] text-text-muted">{target}</p>
        )}
      </div>
      <div
        className="mt-1 h-2 w-2 rounded-full"
        style={{ backgroundColor: status === 'ok' ? '#22C55E' : '#F59E0B' }}
      />
    </div>
  );
}

interface IrrigationSectionProps {
  roomId: string;
}

export function IrrigationSection({ roomId }: IrrigationSectionProps) {
  const { data: room, isLoading: roomLoading } = useGrowRoom(roomId);
  const { data: events, isLoading: eventsLoading } = useIrrigationSchedule(roomId);
  const { data: recipe } = useNutrientRecipe(roomId);

  if (roomLoading || eventsLoading) return <LoadingSkeleton variant="card" count={3} />;
  if (!room?.irrigation) return null;

  const irr = room.irrigation;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-1 w-6 rounded-full bg-blue-500" />
        <h3 className="text-sm font-semibold text-text-bright">Irrigation & Fertigation</h3>
        <span className="text-[10px] text-text-muted uppercase tracking-wider">GrowLink</span>
      </div>

      {/* Metric cards grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Water pH"
          value={irr.ph.toFixed(1)}
          target={`${irr.phMin}-${irr.phMax}`}
          icon={<Droplets className="h-4 w-4" style={{ color: ACCENT }} />}
        />
        <MetricCard
          label="Water EC"
          value={`${irr.ec.toFixed(1)} mS/cm`}
          target={`${irr.ecMin}-${irr.ecMax} mS/cm`}
          icon={<Gauge className="h-4 w-4" style={{ color: ACCENT }} />}
        />
        <MetricCard
          label="Runoff pH"
          value={irr.runoffPh.toFixed(1)}
          target={`${irr.runoffPhMin}-${irr.runoffPhMax}`}
          icon={<Droplets className="h-4 w-4" style={{ color: ACCENT }} />}
        />
        <MetricCard
          label="Runoff EC"
          value={`${irr.runoffEc.toFixed(1)} mS/cm`}
          target={`${irr.runoffEcMin}-${irr.runoffEcMax} mS/cm`}
          icon={<Gauge className="h-4 w-4" style={{ color: ACCENT }} />}
        />
        <MetricCard
          label="Water Temp"
          value={`${irr.waterTemp}F`}
          target={`${irr.waterTempMin}-${irr.waterTempMax}F`}
          icon={<FlaskConical className="h-4 w-4" style={{ color: ACCENT }} />}
        />
        <MetricCard
          label="Flow Rate"
          value={`${irr.flowRate} GPM`}
          icon={<Waves className="h-4 w-4" style={{ color: ACCENT }} />}
        />
        <MetricCard
          label="Reservoir"
          value={`${Math.round((irr.reservoirLevel / irr.reservoirCapacity) * 100)}%`}
          target={`${irr.reservoirLevel}/${irr.reservoirCapacity} gal`}
          status={irr.reservoirLevel / irr.reservoirCapacity < 0.25 ? 'warning' : 'ok'}
          icon={<Beaker className="h-4 w-4" style={{ color: ACCENT }} />}
        />
        <MetricCard
          label="Next Irrigation"
          value={formatTimeDiff(irr.nextIrrigationTime)}
          target={`Every ${irr.irrigationIntervalHours}h`}
          icon={<Timer className="h-4 w-4" style={{ color: ACCENT }} />}
        />
      </div>

      {/* Irrigation timeline */}
      {events && events.length > 0 && (
        <div className="rounded-xl border border-default bg-card p-4">
          <h4 className="text-xs font-semibold text-text-bright mb-3">Today&apos;s Irrigation Schedule</h4>
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {events.map((event, i) => (
              <div key={event.id} className="flex items-center">
                <div
                  className="flex flex-col items-center rounded-lg border px-3 py-2 text-center"
                  style={{
                    borderColor: event.completed ? `${ACCENT}40` : 'rgba(255,255,255,0.1)',
                    backgroundColor: event.completed ? `${ACCENT}08` : 'transparent',
                    borderStyle: event.completed ? 'solid' : 'dashed',
                  }}
                >
                  <span className="text-[10px] text-text-muted">{formatTimeShort(event.startTime)}</span>
                  <span className="text-xs font-semibold text-text-bright">{event.volumeGallons.toFixed(1)} gal</span>
                  <span className="text-[10px] text-text-muted">{event.durationMinutes} min</span>
                </div>
                {i < events.length - 1 && (
                  <div className="mx-1 h-px w-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nutrient recipe */}
      {recipe && (
        <div className="rounded-xl border border-default bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-text-bright">Active Recipe: {recipe.name}</h4>
            <span className="text-[10px] text-text-muted">NPK {recipe.npk} | EC {recipe.targetEc} | pH {recipe.targetPh}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {recipe.components.map((comp) => (
              <div key={comp.name} className="rounded-lg bg-base px-3 py-2">
                <p className="text-xs font-medium text-text-bright">{comp.name}</p>
                <p className="text-[11px] text-text-muted">{comp.amount}</p>
                <p className="text-[10px] text-text-muted opacity-60">{comp.brand}</p>
              </div>
            ))}
          </div>
          {recipe.notes && (
            <p className="mt-2 text-[11px] text-text-muted italic">{recipe.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
