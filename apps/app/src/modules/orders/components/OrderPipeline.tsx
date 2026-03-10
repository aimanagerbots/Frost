'use client';

import { ChevronRight } from 'lucide-react';
import type { OrderPipelineStage, OrderStatus } from '@/modules/orders/types';

interface OrderPipelineProps {
  stages: OrderPipelineStage[];
  activeStatus?: OrderStatus;
  onStageClick?: (status: OrderStatus) => void;
}

export function OrderPipeline({ stages, activeStatus, onStageClick }: OrderPipelineProps) {
  return (
    <div className="rounded-xl bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-text-bright">Order Pipeline</h3>
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {stages.map((stage, i) => (
          <div key={stage.status} className="flex items-center">
            <button
              onClick={() => onStageClick?.(stage.status)}
              className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-all min-w-[80px] ${
                activeStatus === stage.status
                  ? 'bg-elevated ring-1 ring-hover'
                  : 'hover:bg-accent-hover/50'
              }`}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: stage.color }}
              >
                {stage.count}
              </div>
              <span className="text-[10px] text-text-muted whitespace-nowrap">{stage.label}</span>
            </button>
            {i < stages.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-text-muted/40" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
