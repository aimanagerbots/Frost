'use client';

import { useGrowRooms } from '../../hooks/useGrowRooms';
import { useGrowRoom } from '../../hooks/useGrowRoom';
import { useCultivationStore } from '../../store';
import { LoadingSkeleton } from '@/components';
import { RoomSelectorStrip } from './RoomSelectorStrip';
import { ClimateSection } from './ClimateSection';
import { IrrigationSection } from './IrrigationSection';
import { HvacSection } from './HvacSection';
import { AlertsSection } from './AlertsSection';
import { RoomSummaryGrid } from './RoomSummaryGrid';

const STAGES_WITHOUT_IRRIGATION = new Set(['dry', 'cure']);

function RoomHeader({ roomId }: { roomId: string }) {
  const { data: room } = useGrowRoom(roomId);
  if (!room) return null;

  const progress = room.totalDaysExpected > 0
    ? Math.round((room.dayInStage / room.totalDaysExpected) * 100)
    : 0;

  return (
    <div className="rounded-xl bg-card p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-bright">{room.name}</h2>
          <p className="text-sm text-text-muted">{room.strainName} — {room.stage} stage, Day {room.dayInStage}/{room.totalDaysExpected}</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-text-muted">
          {room.plantCount > 0 && <span>{room.plantCount} plants</span>}
          {room.estimatedYield && <span>Est. yield: {room.estimatedYield}</span>}
          {room.estimatedHarvest && <span>Harvest: {room.estimatedHarvest}</span>}
        </div>
      </div>
      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated">
          <div
            className="h-full rounded-full bg-[#5BB8E6] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {room.notes && (
        <p className="mt-2 text-xs text-text-muted italic">{room.notes}</p>
      )}
    </div>
  );
}

export function EnvironmentTab() {
  const { selectedEnvironmentRoomId, setEnvironmentRoom } = useCultivationStore();
  const { data: rooms, isLoading } = useGrowRooms();

  if (isLoading || !rooms) return <LoadingSkeleton variant="card" count={4} />;

  const selectedRoom = selectedEnvironmentRoomId
    ? rooms.find((r) => r.id === selectedEnvironmentRoomId)
    : null;

  const showIrrigation = selectedRoom && !STAGES_WITHOUT_IRRIGATION.has(selectedRoom.stage);

  return (
    <div className="space-y-6">
      {/* Room Selector Strip */}
      <RoomSelectorStrip
        rooms={rooms}
        selectedRoomId={selectedEnvironmentRoomId}
        onSelectRoom={setEnvironmentRoom}
      />

      {/* All Rooms View */}
      {!selectedEnvironmentRoomId && (
        <>
          <RoomSummaryGrid rooms={rooms} onSelectRoom={setEnvironmentRoom} />
          <AlertsSection />
        </>
      )}

      {/* Single Room View */}
      {selectedEnvironmentRoomId && selectedRoom && (
        <>
          <RoomHeader roomId={selectedEnvironmentRoomId} />
          <ClimateSection roomId={selectedEnvironmentRoomId} />
          {showIrrigation && <IrrigationSection roomId={selectedEnvironmentRoomId} />}
          <HvacSection roomId={selectedEnvironmentRoomId} />
          <AlertsSection roomId={selectedEnvironmentRoomId} />
        </>
      )}
    </div>
  );
}
