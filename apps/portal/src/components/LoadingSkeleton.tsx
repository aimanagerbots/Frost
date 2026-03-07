'use client';

import { cn } from '@/lib/utils';

type SkeletonVariant = 'card' | 'list' | 'table' | 'chart' | 'text' | 'avatar';

interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
}

function ShimmerBar({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      style={style}
      className={cn(
        'animate-pulse rounded bg-elevated',
        className
      )}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-default bg-card p-4">
      <ShimmerBar className="mb-3 h-4 w-1/3" />
      <ShimmerBar className="mb-2 h-8 w-1/2" />
      <ShimmerBar className="h-3 w-2/3" />
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[100, 85, 70, 90, 60].map((width, i) => (
        <div key={i} className="flex items-center gap-3">
          <ShimmerBar className="h-8 w-8 rounded-full" />
          <ShimmerBar className="h-4" style={{ width: `${width}%` }} />
        </div>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <ShimmerBar key={i} className="h-4 flex-1" />
        ))}
      </div>
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className="flex gap-4">
          {[1, 2, 3, 4].map((col) => (
            <ShimmerBar key={col} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="relative h-[300px] rounded-xl border border-default bg-card p-4">
      <ShimmerBar className="mb-4 h-4 w-1/4" />
      <div className="flex h-[calc(100%-2rem)] items-end gap-2">
        {[60, 80, 45, 90, 70, 55, 85, 40, 75, 65].map((h, i) => (
          <ShimmerBar
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function TextSkeleton() {
  return (
    <div className="space-y-2">
      {[100, 95, 80, 90, 60].map((width, i) => (
        <ShimmerBar key={i} className="h-3" style={{ width: `${width}%` }} />
      ))}
    </div>
  );
}

function AvatarSkeleton() {
  return <ShimmerBar className="h-10 w-10 rounded-full" />;
}

const VARIANT_MAP: Record<SkeletonVariant, React.FC> = {
  card: CardSkeleton,
  list: ListSkeleton,
  table: TableSkeleton,
  chart: ChartSkeleton,
  text: TextSkeleton,
  avatar: AvatarSkeleton,
};

export function LoadingSkeleton({
  variant = 'card',
  count = 1,
  className,
}: LoadingSkeletonProps) {
  const Component = VARIANT_MAP[variant];

  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }, (_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}
