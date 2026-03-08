'use client';

import { AccentCard, StatusBadge } from '@/components';
import type { Strain, StrainType, MotherPlantStatus, StrainDifficulty } from '../../types';
import { Sprout, DoorOpen } from 'lucide-react';

const TYPE_COLORS: Record<StrainType, string> = {
  indica: '#8B5CF6',
  sativa: '#F59E0B',
  hybrid: '#22C55E',
  cbd: '#5BB8E6',
  balanced: '#5BB8E6',
};

const MOTHER_VARIANT: Record<MotherPlantStatus, 'success' | 'warning' | 'muted'> = {
  active: 'success',
  retired: 'warning',
  archived: 'muted',
};

const DIFFICULTY_COLORS: Record<StrainDifficulty, string> = {
  easy: '#5BB8E6',
  moderate: '#5BB8E6',
  advanced: '#EF4444',
};

interface StrainCardProps {
  strain: Strain;
  onClick: () => void;
  activeRoomCount: number;
}

export function StrainCard({ strain, onClick, activeRoomCount }: StrainCardProps) {
  const cloneColor = strain.cloneAvailability > 5 ? '#5BB8E6' : strain.cloneAvailability > 0 ? '#5BB8E6' : '#EF4444';

  return (
    <AccentCard accentColor={TYPE_COLORS[strain.type]} onClick={onClick} className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-text-bright">{strain.name}</h3>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium capitalize"
          style={{
            backgroundColor: `${TYPE_COLORS[strain.type]}15`,
            color: TYPE_COLORS[strain.type],
          }}
        >
          {strain.type}
        </span>
      </div>

      {/* Breeder & Lineage */}
      <p className="mt-1 text-sm text-text-muted">{strain.breeder}</p>
      <p className="mt-0.5 text-xs italic text-text-muted">{strain.lineage}</p>

      {/* THC / CBD */}
      <div className="mt-3 flex items-center gap-4 text-sm">
        <span className="text-text-default">
          THC <span className="font-medium text-text-bright">{strain.thcRange}</span>
        </span>
        <span className="text-text-default">
          CBD <span className="font-medium text-text-bright">{strain.cbdRange}</span>
        </span>
      </div>

      {/* Terpenes */}
      {strain.terpeneProfile.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {strain.terpeneProfile.slice(0, 3).map((terp) => (
            <span
              key={terp}
              className="rounded-full bg-elevated px-2 py-0.5 text-xs text-text-muted"
            >
              {terp}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Row */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-default/50 pt-3">
        <span className="text-xs text-text-muted">{strain.flowerTimeDays}d flower</span>
        <span className="text-xs text-text-muted">{strain.estimatedYieldPerPlant}/plant</span>
        <StatusBadge
          variant={MOTHER_VARIANT[strain.motherPlantStatus]}
          label={strain.motherPlantStatus}
          size="sm"
        />
        <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: cloneColor }}>
          <Sprout className="h-3 w-3" />
          {strain.cloneAvailability} clones
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium capitalize"
          style={{
            backgroundColor: `${DIFFICULTY_COLORS[strain.difficulty]}15`,
            color: DIFFICULTY_COLORS[strain.difficulty],
          }}
        >
          {strain.difficulty}
        </span>
        {activeRoomCount > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-info">
            <DoorOpen className="h-3 w-3" />
            {activeRoomCount} room{activeRoomCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </AccentCard>
  );
}
