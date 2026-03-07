'use client';

import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while loading data. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
        <AlertTriangle className="h-8 w-8 text-red-400" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-text-bright">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-text-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/30"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
