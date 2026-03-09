'use client';

import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageRepHeaderProps {
  repName: string;
  repTitle?: string;
  className?: string;
}

export function MessageRepHeader({
  repName,
  repTitle,
  className,
}: MessageRepHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 border-b border-border-default bg-card px-5 py-4',
        className
      )}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated">
          <User className="h-5 w-5 text-text-muted" />
        </div>
        {/* Online indicator */}
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-bright">{repName}</p>
        {repTitle && (
          <p className="text-xs text-text-muted">{repTitle}</p>
        )}
      </div>

      {/* Status text */}
      <span className="text-xs text-emerald-400">Online</span>
    </div>
  );
}
