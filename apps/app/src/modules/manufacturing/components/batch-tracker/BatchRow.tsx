'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components';
import { BatchPipelineProgress } from './BatchPipelineProgress';
import type { ManufacturingBatch } from '../../types';

const CATEGORY_COLORS: Record<string, string> = {
  flower: '#22C55E',
  preroll: '#84CC16',
  vaporizer: '#06B6D4',
  concentrate: '#F59E0B',
  edible: '#EC4899',
  beverage: '#8B5CF6',
};

const COA_VARIANT: Record<string, 'default' | 'info' | 'success' | 'danger' | 'warning'> = {
  'not-required': 'default',
  pending: 'warning',
  submitted: 'info',
  passed: 'success',
  failed: 'danger',
};

export function BatchRow({ batch }: { batch: ManufacturingBatch }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[batch.category] ?? '#666';
  const completedStates = batch.previousStates.map((ps) => ps.state);

  return (
    <div className="rounded-xl border border-default bg-card">
      {/* Collapsed row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-elevated/50"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" />
        )}

        <span className="w-28 shrink-0 font-mono text-xs text-text-muted">{batch.batchNumber}</span>

        <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-bright">
          {batch.productName || batch.strainName}
        </span>

        <span
          className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: `${catColor}20`, color: catColor }}
        >
          {batch.category}
        </span>

        <StatusBadge
          variant="info"
          label={batch.currentState}
          size="sm"
        />

        <StatusBadge
          variant={COA_VARIANT[batch.coaStatus] ?? 'default'}
          label={`COA: ${batch.coaStatus}`}
          size="sm"
        />

        {batch.estimatedCompletion && (
          <span className="hidden shrink-0 text-xs text-text-muted lg:block">
            Est. {new Date(batch.estimatedCompletion).toLocaleDateString()}
          </span>
        )}
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-default px-4 py-4 space-y-4">
          {/* Pipeline progress */}
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-wider text-text-muted">Pipeline Progress</p>
            <BatchPipelineProgress
              pipelineStates={batch.pipelineStates}
              currentState={batch.currentState}
              completedStates={completedStates}
            />
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-[10px] text-text-muted">Quantity</p>
              <p className="text-sm text-text-bright">{batch.quantity} {batch.unit}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-muted">Location</p>
              <p className="text-sm text-text-bright">{batch.location}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-muted">Started</p>
              <p className="text-sm text-text-bright">{new Date(batch.startDate).toLocaleDateString()}</p>
            </div>
            {batch.estimatedCompletion && (
              <div>
                <p className="text-[10px] text-text-muted">Est. Complete</p>
                <p className="text-sm text-text-bright">{new Date(batch.estimatedCompletion).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {/* Yield info */}
          {batch.yieldInput != null && (
            <div className="rounded-lg bg-elevated px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-text-muted">Yield</p>
              <p className="text-sm text-text-bright">
                {batch.yieldInput} {batch.yieldInputUnit} → {batch.yieldOutput ?? '—'} {batch.yieldOutputUnit ?? ''}
                {batch.yieldPercent != null && (
                  <span className="ml-2 text-xs text-text-muted">({batch.yieldPercent}%)</span>
                )}
              </p>
            </div>
          )}

          {/* Notes */}
          {batch.notes && (
            <p className="text-xs italic text-text-muted">{batch.notes}</p>
          )}

          {/* State history */}
          {batch.previousStates.length > 0 && (
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-wider text-text-muted">State History</p>
              <div className="space-y-1">
                {batch.previousStates.map((ps, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="w-20 shrink-0">{new Date(ps.timestamp).toLocaleDateString()}</span>
                    <span className="font-medium text-text-default">{ps.state}</span>
                    <span>by {ps.operator}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
