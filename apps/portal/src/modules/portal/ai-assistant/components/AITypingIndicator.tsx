'use client';

import { cn } from '@/lib/utils';

interface AITypingIndicatorProps {
  className?: string;
}

const dotStyle = (delay: number): React.CSSProperties => ({
  animation: 'aiBounce 1.4s ease-in-out infinite',
  animationDelay: `${delay}s`,
});

export function AITypingIndicator({ className }: AITypingIndicatorProps) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      {/* Keyframe definition */}
      <style>{`
        @keyframes aiBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>

      {/* Avatar matching assistant style */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-primary/15">
        <span className="text-xs font-bold text-accent-primary">F</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 rounded-2xl bg-elevated px-4 py-3">
          <span
            className="h-2 w-2 rounded-full bg-accent-primary/60"
            style={dotStyle(0)}
          />
          <span
            className="h-2 w-2 rounded-full bg-accent-primary/60"
            style={dotStyle(0.2)}
          />
          <span
            className="h-2 w-2 rounded-full bg-accent-primary/60"
            style={dotStyle(0.4)}
          />
        </div>
        <p className="px-1 text-[11px] text-text-muted">
          Frost AI is thinking...
        </p>
      </div>
    </div>
  );
}
