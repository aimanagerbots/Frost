'use client';

import { cn } from '@/lib/utils';

interface PipelineBadgeProps {
  code: string;
  size?: 'sm' | 'md';
  className?: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  A: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  I: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  R: { bg: 'bg-red-500/15', text: 'text-red-400' },
};

export function PipelineBadge({ code, size = 'sm', className }: PipelineBadgeProps) {
  const prefix = code.charAt(0).toUpperCase();
  const style = STATUS_STYLES[prefix] ?? STATUS_STYLES.A;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-bold',
        style.bg,
        style.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        className,
      )}
    >
      {code}
    </span>
  );
}
