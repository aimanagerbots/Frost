'use client';

import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderBottleneckAlertProps {
  bottleneck: {
    productName: string;
    reason: string;
    estimatedReady: string;
  };
  className?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function OrderBottleneckAlert({
  bottleneck,
  className,
}: OrderBottleneckAlertProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 rounded-lg border border-amber-500/20 bg-amber-500/[0.08] p-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-amber-300">
            Waiting on: {bottleneck.productName}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">
            {bottleneck.reason}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-xs text-text-muted">Est. ready</p>
        <p className="text-sm font-medium text-text-default">
          {formatDate(bottleneck.estimatedReady)}
        </p>
      </div>
    </div>
  );
}
