'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShopSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ShopSearchBar({ value, onChange, className }: ShopSearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (nextValue: string) => {
    setLocalValue(nextValue);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(nextValue);
    }, 300);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search products, strains, brands..."
        className="w-full rounded-lg border border-border-default bg-elevated px-4 py-2.5 pl-10 text-sm text-text-default placeholder:text-text-muted transition-colors focus:border-accent-primary/50 focus:outline-none"
      />
    </div>
  );
}
