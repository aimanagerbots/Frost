'use client';

import { Package, FlaskConical, CheckCircle, XCircle, Scissors, Truck, ShoppingCart, AlertTriangle, RefreshCw } from 'lucide-react';
import type { ActivityFeedEvent } from '@/modules/inventory/types';

interface ActivityFeedProps {
  events: ActivityFeedEvent[];
}

const EVENT_CONFIG: Record<ActivityFeedEvent['eventType'], { icon: typeof Package; color: string }> = {
  packaged: { icon: Package, color: '#84CC16' },
  'coa-submitted': { icon: FlaskConical, color: '#8B5CF6' },
  'coa-passed': { icon: CheckCircle, color: '#22C55E' },
  'coa-failed': { icon: XCircle, color: '#FB7185' },
  harvested: { icon: Scissors, color: '#22C55E' },
  fulfilled: { icon: ShoppingCart, color: '#14B8A6' },
  delivered: { icon: Truck, color: '#0EA5E9' },
  reorder: { icon: RefreshCw, color: '#FBBF24' },
  alert: { icon: AlertTriangle, color: '#FB7185' },
};

function timeAgo(timestamp: string): string {
  const now = new Date('2026-03-07T12:00:00Z');
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-default bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold text-text-bright">Recent Activity</h3>
      <div className="space-y-0">
        {events.slice(0, 10).map((event) => {
          const config = EVENT_CONFIG[event.eventType];
          const Icon = config.icon;
          return (
            <div
              key={event.id}
              className="flex items-start gap-3 border-b border-default/50 py-2.5 last:border-b-0"
            >
              <div
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: config.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-text-default">
                  <span className="font-medium text-text-bright">{event.productName}</span>
                  {' — '}{event.description}
                </p>
                {event.batchNumber && (
                  <span className="text-[10px] font-mono text-text-muted">{event.batchNumber}</span>
                )}
              </div>
              <span className="shrink-0 text-[10px] text-text-muted">{timeAgo(event.timestamp)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
