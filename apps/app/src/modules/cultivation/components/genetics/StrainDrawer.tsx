'use client';

import { DrawerPanel, StatusBadge } from '@/components';
import type { Strain, StrainType, MotherPlantStatus, StrainDifficulty } from '../../types';
import {
  Sprout,
  DoorOpen,
  Calendar,
  Scale,
} from 'lucide-react';

const TYPE_COLORS: Record<StrainType, string> = {
  indica: '#5BB8E6',
  sativa: '#5BB8E6',
  hybrid: '#5BB8E6',
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

const TERPENE_COLORS = [
  '#5BB8E6', '#5BB8E6', '#5BB8E6', '#5BB8E6', '#EF4444',
  '#5BB8E6', '#5BB8E6', '#5BB8E6', '#5BB8E6', '#5BB8E6',
];

interface StrainDrawerProps {
  strain: Strain | null;
  open: boolean;
  onClose: () => void;
  activeRooms: { id: string; name: string }[];
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-sm font-semibold text-text-bright">{children}</h3>;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <span className="text-text-muted">{label}</span>
      <span className="text-right font-medium text-text-bright">{value}</span>
    </>
  );
}

function NotesBlock({ title, text }: { title: string; text: string | undefined }) {
  if (!text) return null;
  return (
    <div className="rounded-xl border border-default bg-elevated p-4">
      <SectionTitle>{title}</SectionTitle>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-default">{text}</p>
    </div>
  );
}

export function StrainDrawer({ strain, open, onClose, activeRooms }: StrainDrawerProps) {
  if (!strain) return null;

  const cloneColor = strain.cloneAvailability > 5 ? '#5BB8E6' : strain.cloneAvailability > 0 ? '#5BB8E6' : '#EF4444';

  return (
    <DrawerPanel
      open={open}
      onClose={onClose}
      title={strain.name}
      width="lg"
    >
      <div className="space-y-5">
        {/* Overview */}
        <div className="rounded-xl border border-default bg-elevated p-4">
          <SectionTitle>Overview</SectionTitle>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
              style={{
                backgroundColor: `${TYPE_COLORS[strain.type]}15`,
                color: TYPE_COLORS[strain.type],
              }}
            >
              {strain.type}
            </span>
            <StatusBadge
              variant={MOTHER_VARIANT[strain.motherPlantStatus]}
              label={strain.motherPlantStatus}
              size="sm"
              dot
            />
            <span
              className="rounded-full px-2 py-0.5 text-xs font-medium capitalize"
              style={{
                backgroundColor: `${DIFFICULTY_COLORS[strain.difficulty]}15`,
                color: DIFFICULTY_COLORS[strain.difficulty],
              }}
            >
              {strain.difficulty}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <InfoRow label="Breeder" value={strain.breeder} />
            <InfoRow label="Lineage" value={strain.lineage} />
            <InfoRow
              label="Clone Availability"
              value={
                <span className="inline-flex items-center gap-1" style={{ color: cloneColor }}>
                  <Sprout className="h-3 w-3" />
                  {strain.cloneAvailability}
                </span>
              }
            />
          </div>
        </div>

        {/* Performance */}
        <div className="rounded-xl border border-default bg-elevated p-4">
          <SectionTitle>Performance</SectionTitle>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <InfoRow label="THC Range" value={strain.thcRange} />
            <InfoRow label="CBD Range" value={strain.cbdRange} />
            <InfoRow label="Flower Time" value={`${strain.flowerTimeDays} days`} />
            <InfoRow label="Veg Time" value={`${strain.vegTimeDays} days`} />
            <InfoRow label="Est. Yield / Plant" value={strain.estimatedYieldPerPlant} />
            {strain.avgYieldActual && (
              <InfoRow label="Actual Avg Yield" value={strain.avgYieldActual} />
            )}
          </div>
        </div>

        {/* Terpene Profile */}
        {strain.terpeneProfile.length > 0 && (
          <div className="rounded-xl border border-default bg-elevated p-4">
            <SectionTitle>Terpene Profile</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {strain.terpeneProfile.map((terp, i) => (
                <span
                  key={terp}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${TERPENE_COLORS[i % TERPENE_COLORS.length]}15`,
                    color: TERPENE_COLORS[i % TERPENE_COLORS.length],
                  }}
                >
                  {terp}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes Sections */}
        <NotesBlock title="Grow Notes" text={strain.growNotes} />
        <NotesBlock title="Feeding Schedule" text={strain.feedingSchedule} />
        <NotesBlock title="IPM Notes" text={strain.ipmNotes} />
        <NotesBlock title="Phenotype Notes" text={strain.phenoNotes} />

        {/* Where is this strain now? */}
        {activeRooms.length > 0 && (
          <div className="rounded-xl border border-default bg-elevated p-4">
            <SectionTitle>Where is this strain now?</SectionTitle>
            <div className="space-y-2">
              {activeRooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center gap-2 rounded-lg border border-default/50 bg-card p-3"
                >
                  <DoorOpen className="h-4 w-4 text-info" />
                  <span className="text-sm font-medium text-text-bright">{room.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last Harvest */}
        {strain.lastHarvest && (
          <div className="rounded-xl border border-default bg-elevated p-4">
            <SectionTitle>Last Harvest</SectionTitle>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <InfoRow
                label="Date"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-text-muted" />
                    {strain.lastHarvest}
                  </span>
                }
              />
              {strain.avgYieldActual && (
                <InfoRow
                  label="Actual Yield"
                  value={
                    <span className="inline-flex items-center gap-1">
                      <Scale className="h-3 w-3 text-text-muted" />
                      {strain.avgYieldActual}
                    </span>
                  }
                />
              )}
            </div>
          </div>
        )}
      </div>
    </DrawerPanel>
  );
}
