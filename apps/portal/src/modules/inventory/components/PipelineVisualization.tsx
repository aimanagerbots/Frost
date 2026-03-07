'use client';

import { ChevronRight } from 'lucide-react';
import type { PipelineGroup, ReadinessState } from '@/modules/inventory/types';

interface PipelineVisualizationProps {
  groups: PipelineGroup[];
  activeState?: ReadinessState;
  onStateClick?: (state: ReadinessState) => void;
}

export function PipelineVisualization({ groups, activeState, onStateClick }: PipelineVisualizationProps) {
  return (
    <div className="rounded-xl border border-default bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-text-bright">Production Pipeline</h3>
      <div className="space-y-3">
        {groups.map((group) => (
          <div key={group.division} className="flex items-start gap-3">
            {/* Division label */}
            <div className="w-28 flex-shrink-0 pt-1">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: group.color }}
                />
                <span className="text-xs font-medium text-text-bright">{group.label}</span>
              </div>
              <span className="ml-[18px] text-[10px] text-text-muted">{group.totalItems} items</span>
            </div>

            {/* State nodes */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 flex-1">
              {group.states.map((state, i) => (
                <div key={state.state} className="flex items-center">
                  <button
                    onClick={() => onStateClick?.(state.state)}
                    className={`flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1.5 transition-all min-w-[70px] ${
                      activeState === state.state
                        ? 'bg-elevated ring-1 ring-hover'
                        : 'hover:bg-elevated/50'
                    }`}
                  >
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: group.color }}
                    >
                      {state.count}
                    </div>
                    <span className="text-[9px] text-text-muted whitespace-nowrap leading-tight text-center max-w-[70px] truncate">
                      {state.label}
                    </span>
                  </button>
                  {i < group.states.length - 1 && (
                    <ChevronRight className="h-3 w-3 flex-shrink-0 text-text-muted/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Division flow arrows */}
      <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-text-muted">
        <span>Cultivation</span>
        <ChevronRight className="h-3 w-3" />
        <span>Manufacturing</span>
        <ChevronRight className="h-3 w-3" />
        <span>Packaging</span>
        <ChevronRight className="h-3 w-3" />
        <span>Fulfillment</span>
        <ChevronRight className="h-3 w-3" />
        <span>Delivery</span>
      </div>
    </div>
  );
}
