'use client';

import { useState, useCallback, useMemo } from 'react';
import { Layers, Plus, MapPin, Download, Megaphone, Trash2 } from 'lucide-react';
import { LoadingSkeleton, EmptyState, DrawerPanel, DataTable, StatusBadge } from '@/components';
import type { Segment, SegmentCriterion } from '@/modules/crm/types';
import { useSegments } from '@/modules/crm/hooks/copilot-territory-hooks';
import { getSegmentPreview } from '@/mocks/crm-segments';
import { SegmentCard } from './segments/SegmentCard';
import { SegmentBuilder } from './segments/SegmentBuilder';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


function healthVariant(score: number): 'success' | 'info' | 'warning' | 'danger' {
  if (score >= 80) return 'success';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'danger';
}

export function Segments() {
  const { data: segments, isLoading } = useSegments();

  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [localSegments, setLocalSegments] = useState<Segment[]>([]);

  const allSegments = useMemo(() => {
    const server = segments ?? [];
    return [...server, ...localSegments];
  }, [segments, localSegments]);

  const selectedSegment = allSegments.find((s) => s.id === selectedSegmentId);

  const previewData = useMemo(() => {
    if (!selectedSegment) return null;
    return getSegmentPreview(selectedSegment.criteria);
  }, [selectedSegment]);

  const handleSave = useCallback(
    (name: string, description: string, criteria: SegmentCriterion[]) => {
      const preview = getSegmentPreview(criteria);
      const newSegment: Segment = {
        id: `seg-custom-${Date.now()}`,
        name,
        description,
        criteria,
        accountCount: preview.totalCount,
        totalRevenue: preview.totalRevenue,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPrebuilt: false,
      };
      setLocalSegments((prev) => [...prev, newSegment]);
      setBuilderOpen(false);
    },
    [],
  );

  if (isLoading) {
    return <LoadingSkeleton variant="card" count={4} />;
  }

  if (allSegments.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="No segments yet"
        description="Create segments to group and analyze accounts"
        accentColor={CRM_ACCENT}
      />
    );
  }

  const detailColumns: { header: string; accessor: string; sortable?: boolean; render?: (row: Record<string, unknown>) => React.ReactNode }[] = [
    {
      header: 'Account',
      accessor: 'name' as const,
      sortable: true,
    },
    {
      header: 'City',
      accessor: 'city' as const,
      sortable: true,
    },
    {
      header: 'Health',
      accessor: 'health' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => (
        <StatusBadge variant={healthVariant(row.health as number)} label={String(row.health)} size="sm" />
      ),
    },
    {
      header: '30-Day Revenue',
      accessor: 'revenue30d' as const,
      sortable: true,
      render: (row: Record<string, unknown>) => (
        <span className="tabular-nums">${(row.revenue30d as number).toLocaleString()}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-bright">Segments</h3>
          <p className="text-sm text-text-muted">{allSegments.length} saved segments</p>
        </div>
        <button
          onClick={() => setBuilderOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#5BB8E6] px-4 py-2 text-sm font-medium text-black hover:opacity-90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Segment
        </button>
      </div>

      {/* Segment cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allSegments.map((seg) => (
          <SegmentCard
            key={seg.id}
            segment={seg}
            isSelected={selectedSegmentId === seg.id}
            onClick={() =>
              setSelectedSegmentId((prev) =>
                prev === seg.id ? null : seg.id,
              )
            }
          />
        ))}
      </div>

      {/* Selected segment detail */}
      {selectedSegment && previewData && (
        <div className="rounded-xl border border-default bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-text-bright">
                {selectedSegment.name}
              </h4>
              <p className="text-xs text-text-muted">
                {previewData.totalCount} accounts — $
                {previewData.totalRevenue.toLocaleString()} total revenue
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-xs text-text-muted hover:text-text-default transition-colors">
                <MapPin className="h-3 w-3" />
                View on Map
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-xs text-text-muted hover:text-text-default transition-colors">
                <Download className="h-3 w-3" />
                Export
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-xs text-text-muted hover:text-text-default transition-colors">
                <Megaphone className="h-3 w-3" />
                Launch Campaign
              </button>
              {!selectedSegment.isPrebuilt && (
                <button className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Criteria pills */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {selectedSegment.criteria.map((c, i) => (
              <span
                key={i}
                className="rounded-full bg-[#5BB8E6]/10 px-2.5 py-1 text-[11px] text-[#5BB8E6]"
              >
                {c.label}
              </span>
            ))}
          </div>

          <DataTable
            data={previewData.accounts as unknown as Record<string, unknown>[]}
            columns={detailColumns}
            pageSize={10}
            searchable
            searchPlaceholder="Search accounts..."
            emptyState={{
              title: 'No accounts match',
              accentColor: CRM_ACCENT,
            }}
          />
        </div>
      )}

      {/* Builder Drawer */}
      <DrawerPanel
        open={builderOpen}
        onClose={() => setBuilderOpen(false)}
        title="Create Segment"
        width="lg"
      >
        <SegmentBuilder
          onSave={handleSave}
          onCancel={() => setBuilderOpen(false)}
        />
      </DrawerPanel>
    </div>
  );
}
