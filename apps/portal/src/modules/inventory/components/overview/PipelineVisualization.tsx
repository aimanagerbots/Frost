'use client';

import { ArrowRight } from 'lucide-react';
import type { PipelineStateNode, ReadinessState } from '@/modules/inventory/types';

interface PipelineVisualizationProps {
  nodes: PipelineStateNode[];
  onStateClick?: (state: ReadinessState) => void;
}

const HEALTH_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  healthy: { bg: '#22C55E20', border: '#22C55E40', text: '#22C55E' },
  low: { bg: '#FBBF2420', border: '#FBBF2440', text: '#FBBF24' },
  critical: { bg: '#FB718520', border: '#FB718540', text: '#FB7185' },
};

export function PipelineVisualization({ nodes, onStateClick }: PipelineVisualizationProps) {
  return (
    <div className="rounded-xl border border-default bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-text-bright">Readiness State Pipeline</h3>
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {nodes.map((node, i) => {
          const colors = HEALTH_COLORS[node.health];
          return (
            <div key={node.state} className="flex items-center">
              <button
                onClick={() => onStateClick?.(node.state)}
                className="flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 transition-all hover:scale-[1.02] min-w-[90px]"
                style={{ backgroundColor: colors.bg, borderColor: colors.border }}
              >
                <span className="text-lg font-bold" style={{ color: colors.text }}>
                  {node.count.toLocaleString()}
                </span>
                <span className="text-[10px] text-text-muted whitespace-nowrap leading-tight">
                  {node.label}
                </span>
                <span className="text-[9px] text-text-muted/60">{node.unit}</span>
              </button>
              {i < nodes.length - 1 && (
                <ArrowRight className="mx-0.5 h-3.5 w-3.5 flex-shrink-0 text-text-muted/30" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
