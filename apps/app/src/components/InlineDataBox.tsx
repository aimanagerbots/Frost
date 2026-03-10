'use client';

import { cn } from '@/lib/utils';

interface InlineDataBoxProps {
  label: string;
  value: string | number;
  className?: string;
}

export function InlineDataBox({ label, value, className }: InlineDataBoxProps) {
  return (
    <div className={cn('rounded-lg bg-elevated px-3 py-2', className)}>
      <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-text-bright">
        {value}
      </div>
    </div>
  );
}
