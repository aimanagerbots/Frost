'use client';

import { Truck, Phone, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderDeliveryTrackerProps {
  driver: {
    name: string;
    phone: string;
  };
  manifestNumber: string;
  estimatedDelivery: string;
  className?: string;
}

function formatEta(dateStr: string): string {
  const target = new Date(dateStr);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  // If in the past or very soon, just show the date/time
  if (diffMs <= 0) {
    return target.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 24) {
    return target.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  if (diffHours > 0) {
    return `~${diffHours}h ${diffMinutes}m`;
  }

  return `~${diffMinutes}m`;
}

export function OrderDeliveryTracker({
  driver,
  manifestNumber,
  estimatedDelivery,
  className,
}: OrderDeliveryTrackerProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-accent-primary/20 bg-accent-primary/[0.04] p-5',
        className
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary/15">
          <Truck className="h-4 w-4 text-accent-primary" />
        </div>
        <h3 className="text-sm font-semibold text-text-bright">
          Out for Delivery
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Driver info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-text-muted" />
            <div>
              <p className="text-xs text-text-muted">Driver</p>
              <p className="text-sm font-medium text-text-default">
                {driver.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-text-muted" />
            <div>
              <p className="text-xs text-text-muted">Phone</p>
              <a
                href={`tel:${driver.phone}`}
                className="text-sm font-medium text-accent-primary hover:underline"
              >
                {driver.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Delivery details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Truck className="h-3.5 w-3.5 text-text-muted" />
            <div>
              <p className="text-xs text-text-muted">Manifest</p>
              <p className="text-sm font-medium text-text-default tabular-nums">
                {manifestNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-text-muted" />
            <div>
              <p className="text-xs text-text-muted">ETA</p>
              <p className="text-sm font-semibold text-accent-primary">
                {formatEta(estimatedDelivery)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="mt-4 flex h-32 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02]">
        <div className="flex flex-col items-center gap-1.5 text-text-muted">
          <MapPin className="h-5 w-5" />
          <span className="text-xs">Live tracking map</span>
        </div>
      </div>
    </div>
  );
}
