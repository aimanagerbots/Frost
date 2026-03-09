'use client';

import { cn } from '@/lib/utils';

interface OrderStatusTimelineProps {
  history: { status: string; timestamp: string }[];
  className?: string;
}

const STATUS_DOT_COLORS: Record<string, string> = {
  confirmed: 'bg-blue-500',
  'in-production': 'bg-cyan-500',
  packaged: 'bg-purple-500',
  shipped: 'bg-blue-400',
  delivered: 'bg-green-500',
  paid: 'bg-green-400',
  fulfilled: 'bg-teal-500',
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Order Confirmed',
  'in-production': 'In Production',
  packaged: 'Packaged',
  fulfilled: 'Fulfilled',
  shipped: 'Shipped',
  delivered: 'Delivered',
  paid: 'Payment Received',
};

function formatTimestamp(ts: string): { date: string; time: string } {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }),
  };
}

export function OrderStatusTimeline({
  history,
  className,
}: OrderStatusTimelineProps) {
  const sorted = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className={cn('relative', className)}>
      {sorted.map((entry, index) => {
        const { date, time } = formatTimestamp(entry.timestamp);
        const dotColor =
          STATUS_DOT_COLORS[entry.status] ?? 'bg-text-muted';
        const label =
          STATUS_LABELS[entry.status] ?? entry.status;
        const isLast = index === sorted.length - 1;

        return (
          <div key={`${entry.status}-${entry.timestamp}`} className="flex gap-4">
            {/* Timestamp column */}
            <div className="w-20 flex-shrink-0 pt-0.5 text-right">
              <p className="text-xs font-medium text-text-muted">{date}</p>
              <p className="text-xs text-text-muted">{time}</p>
            </div>

            {/* Dot + line column */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'relative z-10 mt-1 h-3 w-3 rounded-full ring-4 ring-base',
                  dotColor
                )}
              />
              {!isLast && (
                <div className="w-px flex-1 bg-white/[0.08]" />
              )}
            </div>

            {/* Label column */}
            <div className={cn('pb-6', isLast && 'pb-0')}>
              <p className="text-sm font-medium text-text-default">{label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
