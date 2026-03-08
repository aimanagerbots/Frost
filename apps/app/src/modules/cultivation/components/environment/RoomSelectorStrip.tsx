'use client';

import { cn } from '@/lib/utils';
import type { GrowRoom, EnvironmentStatus } from '../../types';
import { ACCENT } from '@/design/colors';


const STATUS_DOT: Record<EnvironmentStatus, string> = {
  optimal: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-danger',
};

const STAGE_SHORT: Record<string, string> = {
  flower: 'FLR',
  veg: 'VEG',
  dry: 'DRY',
  cure: 'CUR',
  propagation: 'CLN',
  clone: 'CLN',
  mother: 'MTH',
  harvest: 'HRV',
  maintenance: 'MNT',
};

interface RoomSelectorStripProps {
  rooms: GrowRoom[];
  selectedRoomId: string | null;
  onSelectRoom: (id: string | null) => void;
}

export function RoomSelectorStrip({ rooms, selectedRoomId, onSelectRoom }: RoomSelectorStripProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {/* All Rooms pill */}
      <button
        onClick={() => onSelectRoom(null)}
        className={cn(
          'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all',
          selectedRoomId === null
            ? 'border-[#5BB8E6]/50 bg-[#5BB8E6]/10 text-[#5BB8E6]'
            : 'border-default bg-card text-text-muted hover:text-text-default hover:border-default/80',
        )}
      >
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: selectedRoomId === null ? ACCENT : 'rgba(255,255,255,0.2)' }}
        />
        All Rooms
      </button>

      {rooms.map((room) => {
        const isActive = selectedRoomId === room.id;
        return (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all',
              isActive
                ? 'border-[#5BB8E6]/50 bg-[#5BB8E6]/10 text-text-bright'
                : 'border-default bg-card text-text-muted hover:text-text-default hover:border-default/80',
            )}
          >
            <div className={cn('h-2 w-2 rounded-full', STATUS_DOT[room.environment.status])} />
            <span>{room.name}</span>
            <span className="text-[10px] uppercase tracking-wider opacity-60">
              {STAGE_SHORT[room.stage] || room.stage}
            </span>
          </button>
        );
      })}
    </div>
  );
}
