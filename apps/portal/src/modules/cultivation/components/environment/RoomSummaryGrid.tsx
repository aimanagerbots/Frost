'use client';

import { cn } from '@/lib/utils';
import type { GrowRoom, EnvironmentStatus } from '../../types';

const STATUS_DOT: Record<EnvironmentStatus, string> = {
  optimal: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-danger',
};

const STAGE_COLORS: Record<string, string> = {
  flower: '#EC4899',
  veg: '#22C55E',
  dry: '#F59E0B',
  cure: '#8B5CF6',
  propagation: '#06B6D4',
  clone: '#06B6D4',
  mother: '#3B82F6',
  harvest: '#EF4444',
  maintenance: '#94A3B8',
};

interface RoomSummaryGridProps {
  rooms: GrowRoom[];
  onSelectRoom: (id: string) => void;
}

export function RoomSummaryGrid({ rooms, onSelectRoom }: RoomSummaryGridProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-1 w-6 rounded-full bg-[#22C55E]" />
        <h3 className="text-sm font-semibold text-text-bright">All Rooms Overview</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rooms.map((room) => {
          const env = room.environment;
          const stageColor = STAGE_COLORS[room.stage] || '#94A3B8';
          const progress = room.totalDaysExpected > 0
            ? Math.round((room.dayInStage / room.totalDaysExpected) * 100)
            : 0;

          return (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room.id)}
              className="group flex flex-col rounded-xl border border-default bg-card p-4 text-left transition-all hover:border-[#22C55E]/30 hover:bg-card/80"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-text-bright group-hover:text-[#22C55E] transition-colors">
                    {room.name}
                  </h4>
                  <p className="text-xs text-text-muted">{room.strainName}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={cn('h-2 w-2 rounded-full', STATUS_DOT[env.status])} />
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                    style={{ backgroundColor: `${stageColor}15`, color: stageColor }}
                  >
                    {room.stage}
                  </span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] text-text-muted mb-1">
                  <span>Day {room.dayInStage}/{room.totalDaysExpected}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-elevated">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${progress}%`, backgroundColor: stageColor }}
                  />
                </div>
              </div>

              {/* Mini metrics */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs font-semibold text-text-bright">{env.temperature}F</p>
                  <p className="text-[10px] text-text-muted">Temp</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-bright">{env.humidity}%</p>
                  <p className="text-[10px] text-text-muted">RH</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-bright">{env.co2}</p>
                  <p className="text-[10px] text-text-muted">CO2</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between border-t border-default/50 pt-2">
                <span className="text-[11px] text-text-muted">
                  {room.plantCount > 0 ? `${room.plantCount} plants` : 'No plants'}
                </span>
                {room.alerts.length > 0 && (
                  <span className="rounded-full bg-danger/15 px-1.5 py-0.5 text-[10px] font-semibold text-danger">
                    {room.alerts.length} alert{room.alerts.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
