'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrderPipelineStep } from '@/modules/portal/shared/types';

interface PipelineTimestamp {
  step: OrderPipelineStep;
  timestamp: string;
  note?: string;
}

interface OrderPipelineTrackerProps {
  currentStep: OrderPipelineStep;
  timestamps: PipelineTimestamp[];
  compact?: boolean;
  className?: string;
}

interface VisibleStep {
  label: string;
  mappedSteps: OrderPipelineStep[];
}

const VISIBLE_STEPS: VisibleStep[] = [
  { label: 'Order Placed', mappedSteps: ['order-placed'] },
  { label: 'Being Prepared', mappedSteps: ['being-prepared'] },
  { label: 'Packaging', mappedSteps: ['packaging'] },
  { label: 'Ready to Ship', mappedSteps: ['ready-to-ship'] },
  { label: 'On the Way', mappedSteps: ['picked-packed', 'out-for-delivery'] },
  { label: 'Delivered', mappedSteps: ['delivered'] },
  { label: 'Payment Received', mappedSteps: ['payment-pending', 'complete'] },
];

function getStepIndex(step: OrderPipelineStep): number {
  return VISIBLE_STEPS.findIndex((vs) => vs.mappedSteps.includes(step));
}

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getTimestampForStep(
  step: VisibleStep,
  timestamps: PipelineTimestamp[]
): string | undefined {
  const match = timestamps.find((t) => step.mappedSteps.includes(t.step));
  return match?.timestamp;
}

type StepState = 'completed' | 'current' | 'future';

function getStepState(
  stepIndex: number,
  currentIndex: number
): StepState {
  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'current';
  return 'future';
}

export function OrderPipelineTracker({
  currentStep,
  timestamps,
  compact = false,
  className,
}: OrderPipelineTrackerProps) {
  const currentIndex = getStepIndex(currentStep);

  const circleSize = compact ? 'h-6 w-6' : 'h-8 w-8';
  const iconSize = compact ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className={cn('w-full', className)}>
      <div className="flex w-full items-center">
        {VISIBLE_STEPS.map((step, index) => {
          const state = getStepState(index, currentIndex);
          const ts = getTimestampForStep(step, timestamps);
          const isLast = index === VISIBLE_STEPS.length - 1;

          return (
            <div
              key={step.label}
              className={cn('flex items-center', !isLast && 'flex-1')}
            >
              {/* Step circle + label column */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'relative flex items-center justify-center rounded-full border-2 transition-all',
                    circleSize,
                    state === 'completed' &&
                      'border-accent-primary bg-accent-primary text-white',
                    state === 'current' &&
                      'border-accent-primary bg-accent-primary text-white animate-pulse shadow-[0_0_12px_rgba(91,184,230,0.5)]',
                    state === 'future' &&
                      'border-white/[0.06] bg-elevated text-text-muted'
                  )}
                >
                  {state === 'completed' ? (
                    <Check className={iconSize} strokeWidth={3} />
                  ) : state === 'current' ? (
                    <div
                      className={cn(
                        'rounded-full bg-white',
                        compact ? 'h-2 w-2' : 'h-2.5 w-2.5'
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        'rounded-full bg-white/20',
                        compact ? 'h-1.5 w-1.5' : 'h-2 w-2'
                      )}
                    />
                  )}
                </div>

                {/* Labels (hidden in compact mode) */}
                {!compact && (
                  <div className="mt-2 flex flex-col items-center">
                    <span
                      className={cn(
                        'text-center text-xs font-medium leading-tight',
                        state === 'future'
                          ? 'text-text-muted'
                          : 'text-text-default'
                      )}
                    >
                      {step.label}
                    </span>
                    {ts && (
                      <span className="mt-0.5 text-center text-xs text-text-muted">
                        {formatTimestamp(ts)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div
                  className={cn(
                    'mx-1 flex-1',
                    compact ? 'h-0.5' : 'h-[2px]',
                    state === 'completed' || state === 'current'
                      ? index < currentIndex
                        ? 'bg-accent-primary'
                        : 'bg-gradient-to-r from-accent-primary to-white/[0.06]'
                      : 'bg-white/[0.06]'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
