'use client';

import { Truck, Phone, Clock, Hash, CheckCircle2, Package, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalDelivery } from '@/modules/portal/shared/types';

interface DeliveriesTrackerProps {
  delivery: PortalDelivery;
  className?: string;
}

const PROGRESS_STEPS = [
  { key: 'scheduled', label: 'Scheduled', icon: Clock },
  { key: 'picked-up', label: 'Picked Up', icon: Package },
  { key: 'in-transit', label: 'In Transit', icon: Navigation },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
] as const;

function getStepIndex(status: PortalDelivery['status']): number {
  switch (status) {
    case 'scheduled':
    case 'rescheduled':
      return 0;
    case 'in-transit':
      return 2;
    case 'delivered':
      return 3;
    default:
      return 0;
  }
}

export function DeliveriesTracker({
  delivery,
  className,
}: DeliveriesTrackerProps) {
  const currentStep = getStepIndex(delivery.status);

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-sm font-semibold text-text-bright">
        Live Tracker
      </h2>

      {/* Mock map placeholder */}
      <div
        className={cn(
          'relative flex h-48 items-center justify-center overflow-hidden rounded-xl border border-border-default',
          'bg-gradient-to-br from-accent-primary/10 via-elevated to-accent-primary/5'
        )}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                'linear-gradient(rgba(91,184,230,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(91,184,230,0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* Truck icon */}
        <div className="relative flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-primary/20 shadow-[0_0_24px_rgba(91,184,230,0.3)]">
            <Truck className="h-7 w-7 text-accent-primary" />
          </div>
          {delivery.eta && (
            <span className="rounded-full bg-card/80 px-3 py-1 text-xs font-medium text-accent-primary backdrop-blur-sm">
              ETA: {delivery.eta}
            </span>
          )}
        </div>
      </div>

      {/* Driver info row */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-border-default bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-primary/10">
            <Truck className="h-4 w-4 text-accent-primary" />
          </div>
          <div>
            <p className="text-xs text-text-muted">Driver</p>
            <p className="text-sm font-medium text-text-bright">
              {delivery.driver.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Phone className="h-3.5 w-3.5" />
          {delivery.driver.phone}
        </div>

        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Hash className="h-3.5 w-3.5" />
          {delivery.orderNumber}
        </div>

        {delivery.eta && (
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Clock className="h-3.5 w-3.5" />
            ETA {delivery.eta}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border border-border-default bg-card p-5">
        <div className="relative flex items-center justify-between">
          {/* Connecting line */}
          <div className="absolute left-0 right-0 top-4 h-0.5 bg-border-default" />
          <div
            className="absolute left-0 top-4 h-0.5 bg-accent-primary transition-all duration-500"
            style={{
              width: `${(currentStep / (PROGRESS_STEPS.length - 1)) * 100}%`,
            }}
          />

          {PROGRESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div
                key={step.key}
                className="relative z-10 flex flex-col items-center gap-2"
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                    isCompleted
                      ? 'border-accent-primary bg-accent-primary/20'
                      : 'border-border-default bg-card',
                    isCurrent && 'shadow-[0_0_12px_rgba(91,184,230,0.4)]'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-3.5 w-3.5',
                      isCompleted ? 'text-accent-primary' : 'text-text-muted'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-[10px] font-medium',
                    isCompleted ? 'text-accent-primary' : 'text-text-muted'
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
