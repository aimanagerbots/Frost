'use client';

import { cn } from '@/lib/utils';
import { LoadingSkeleton } from './LoadingSkeleton';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useCallback } from 'react';

interface TimelineItem {
  id: string;
  timestamp: string;
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  user?: string;
  channel?: string;
}

interface TimelineViewProps {
  items: TimelineItem[];
  loading?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function TimelineView({
  items,
  loading = false,
  onLoadMore,
  className,
}: TimelineViewProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && onLoadMore) {
        onLoadMore();
      }
    },
    [onLoadMore]
  );

  useEffect(() => {
    if (!onLoadMore || !sentinelRef.current) return;
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.1,
    });
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onLoadMore, handleIntersect]);

  if (loading) {
    return <LoadingSkeleton variant="list" count={5} />;
  }

  return (
    <div className={cn('relative', className)}>
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-default" />

      <div className="space-y-1">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={cn(
                'relative flex gap-4 rounded-lg px-2 py-3 transition-colors',
                index % 2 === 0 ? 'bg-transparent' : 'bg-card-hover/30'
              )}
            >
              {/* Icon circle */}
              <div
                className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card"
                style={item.iconColor ? { borderColor: `${item.iconColor}40` } : undefined}
              >
                <Icon
                  className="h-3.5 w-3.5"
                  style={{ color: item.iconColor || 'var(--text-text-muted)' }}
                />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-text-default">{item.title}</p>
                  <span className="shrink-0 text-xs text-text-muted">
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>
                {item.description && (
                  <p className="mt-0.5 text-xs text-text-muted line-clamp-2">
                    {item.description}
                  </p>
                )}
                {(item.user || item.channel) && (
                  <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                    {item.user && <span>{item.user}</span>}
                    {item.user && item.channel && <span>·</span>}
                    {item.channel && <span>{item.channel}</span>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Infinite scroll sentinel */}
      {onLoadMore && <div ref={sentinelRef} className="h-4" />}
    </div>
  );
}
