'use client';

import { useState, useMemo } from 'react';
import { LoadingSkeleton, ErrorState, EmptyState } from '@/components';
import { useGeneticsLibrary, useGrowRooms } from '../../hooks';
import type { Strain, StrainType, MotherPlantStatus } from '../../types';
import { StrainCard } from './StrainCard';
import { StrainDrawer } from './StrainDrawer';
import { ACCENT } from '@/design/colors';
import {
  Search,
  Filter,
  Dna,
  Sprout,
  TreeDeciduous,
  Library,
} from 'lucide-react';


const TYPE_OPTIONS: { value: StrainType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'indica', label: 'Indica' },
  { value: 'sativa', label: 'Sativa' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'cbd', label: 'CBD' },
  { value: 'balanced', label: 'Balanced' },
];

const MOTHER_OPTIONS: { value: MotherPlantStatus | ''; label: string }[] = [
  { value: '', label: 'All Mother Status' },
  { value: 'active', label: 'Active' },
  { value: 'retired', label: 'Retired' },
  { value: 'archived', label: 'Archived' },
];

export function GeneticsLibrary() {
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [motherFilter, setMotherFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);

  const filters = useMemo(() => ({
    ...(typeFilter && { type: typeFilter }),
    ...(motherFilter && { motherStatus: motherFilter }),
    ...(searchQuery && { search: searchQuery }),
  }), [typeFilter, motherFilter, searchQuery]);

  const { data: strains, isLoading, isError, refetch } = useGeneticsLibrary(
    Object.keys(filters).length > 0 ? filters : undefined
  );

  const { data: rooms } = useGrowRooms();

  // Build a map of strain ID -> rooms currently growing it
  const strainRoomMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string }[]>();
    if (!rooms) return map;
    for (const room of rooms) {
      if (room.status === 'active' && room.strainId) {
        const existing = map.get(room.strainId) ?? [];
        existing.push({ id: room.id, name: room.name });
        map.set(room.strainId, existing);
      }
    }
    return map;
  }, [rooms]);

  // Stats
  const stats = useMemo(() => {
    if (!strains) return { activeMothers: 0, totalClones: 0, totalStrains: 0 };
    return {
      activeMothers: strains.filter((s) => s.motherPlantStatus === 'active').length,
      totalClones: strains.reduce((sum, s) => sum + s.cloneAvailability, 0),
      totalStrains: strains.length,
    };
  }, [strains]);

  // Active rooms for the selected strain
  const selectedStrainRooms = useMemo(() => {
    if (!selectedStrain) return [];
    return strainRoomMap.get(selectedStrain.id) ?? [];
  }, [selectedStrain, strainRoomMap]);

  if (isLoading) return <LoadingSkeleton variant="card" count={6} />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-text-muted" />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:border-hover focus:outline-none"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={motherFilter}
          onChange={(e) => setMotherFilter(e.target.value)}
          className="rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:border-hover focus:outline-none"
        >
          {MOTHER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search strains..."
            className="w-full rounded-lg border border-default bg-base py-2 pl-9 pr-3 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none"
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-card p-4">
          <div className="flex items-center gap-2 text-text-muted">
            <TreeDeciduous className="h-4 w-4" style={{ color: ACCENT }} />
            <span className="text-xs font-medium uppercase tracking-wider">Active Mothers</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-text-bright">{stats.activeMothers}</p>
        </div>
        <div className="rounded-xl bg-card p-4">
          <div className="flex items-center gap-2 text-text-muted">
            <Sprout className="h-4 w-4" style={{ color: ACCENT }} />
            <span className="text-xs font-medium uppercase tracking-wider">Clones Available</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-text-bright">{stats.totalClones}</p>
        </div>
        <div className="rounded-xl bg-card p-4">
          <div className="flex items-center gap-2 text-text-muted">
            <Library className="h-4 w-4" style={{ color: ACCENT }} />
            <span className="text-xs font-medium uppercase tracking-wider">Strains in Library</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-text-bright">{stats.totalStrains}</p>
        </div>
      </div>

      {/* Strain Cards Grid */}
      {!strains || strains.length === 0 ? (
        <EmptyState
          icon={Dna}
          title="No strains found"
          description="No genetics match your current filters. Try adjusting your search criteria."
          accentColor={ACCENT}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {strains.map((strain) => (
            <StrainCard
              key={strain.id}
              strain={strain}
              onClick={() => setSelectedStrain(strain)}
              activeRoomCount={strainRoomMap.get(strain.id)?.length ?? 0}
            />
          ))}
        </div>
      )}

      {/* Strain Detail Drawer */}
      <StrainDrawer
        strain={selectedStrain}
        open={!!selectedStrain}
        onClose={() => setSelectedStrain(null)}
        activeRooms={selectedStrainRooms}
      />
    </div>
  );
}
