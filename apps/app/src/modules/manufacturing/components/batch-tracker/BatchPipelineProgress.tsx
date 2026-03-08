'use client';

import { ACCENT } from '@/design/colors';


interface BatchPipelineProgressProps {
  pipelineStates: string[];
  currentState: string;
  completedStates: string[];
}

export function BatchPipelineProgress({ pipelineStates, currentState, completedStates }: BatchPipelineProgressProps) {
  const currentIdx = pipelineStates.indexOf(currentState);

  return (
    <div className="flex items-center gap-0 overflow-x-auto py-2">
      {pipelineStates.map((state, i) => {
        const isCompleted = completedStates.includes(state);
        const isCurrent = state === currentState;
        const isFuture = !isCompleted && !isCurrent;

        return (
          <div key={state} className="flex items-center">
            {/* Connecting line (before dot, skip first) */}
            {i > 0 && (
              <div
                className="h-0.5 w-6 sm:w-10"
                style={{
                  backgroundColor: i <= currentIdx ? ACCENT : '#334155',
                }}
              />
            )}
            {/* Dot + label */}
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full transition-all ${
                  isCurrent ? 'h-4 w-4 animate-pulse' : 'h-3 w-3'
                }`}
                style={{
                  backgroundColor: isCompleted || isCurrent ? ACCENT : 'transparent',
                  border: isFuture ? '2px solid #5BB8E6' : isCurrent ? `2px solid ${ACCENT}` : 'none',
                  boxShadow: isCurrent ? `0 0 0 2px ${ACCENT}40` : undefined,
                }}
              />
              <span
                className={`mt-1 whitespace-nowrap text-[9px] ${
                  isCurrent ? 'font-semibold text-text-bright' : isFuture ? 'text-text-muted/50' : 'text-text-muted'
                }`}
              >
                {state}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
