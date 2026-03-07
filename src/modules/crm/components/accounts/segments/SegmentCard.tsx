'use client';

import { Users, Calendar } from 'lucide-react';
import type { Segment } from '@/modules/crm/types';
import { StatusBadge } from '@/components';

interface SegmentCardProps {
  segment: Segment;
  isSelected: boolean;
  onClick: () => void;
}

export function SegmentCard({ segment, isSelected, onClick }: SegmentCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group w-full rounded-xl border p-4 text-left transition-all ${
        isSelected
          ? 'border-[#F59E0B]/40 bg-[#F59E0B]/5 ring-1 ring-[#F59E0B]/20'
          : 'border-default bg-card hover:border-hover'
      }`}
    >
      <div className="mb-2 flex items-start justify-between">
        <h4 className="text-sm font-semibold text-text-bright">{segment.name}</h4>
        <StatusBadge
          variant={segment.isPrebuilt ? 'info' : 'success'}
          label={segment.isPrebuilt ? 'Pre-built' : 'Custom'}
          size="sm"
        />
      </div>

      <p className="mb-3 text-xs text-text-muted line-clamp-2">{segment.description}</p>

      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1 text-text-muted">
          <Users className="h-3 w-3" />
          <span className="font-medium text-text-default">{segment.accountCount}</span>
          <span>accounts</span>
        </div>
        <div className="text-text-muted">
          <span className="font-medium text-text-default">
            ${segment.totalRevenue >= 1000
              ? `${(segment.totalRevenue / 1000).toFixed(1)}k`
              : segment.totalRevenue.toLocaleString()}
          </span>
          <span> / 30d</span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1 text-[10px] text-text-muted/70">
        <Calendar className="h-3 w-3" />
        Updated {new Date(segment.updatedAt).toLocaleDateString()}
      </div>
    </button>
  );
}
