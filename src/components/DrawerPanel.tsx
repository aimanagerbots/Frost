'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, useRef, useCallback, type ReactNode } from 'react';

const WIDTH_MAP = {
  sm: 'max-w-sm', // 384px
  md: 'max-w-md', // 512px (approx)
  lg: 'max-w-2xl', // 672px (approx)
} as const;

interface DrawerPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  width?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DrawerPanel({
  open,
  onClose,
  title,
  width = 'md',
  footer,
  children,
  className,
}: DrawerPanelProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      // Focus the drawer
      drawerRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative flex w-full flex-col bg-card shadow-xl animate-in slide-in-from-right duration-200',
          WIDTH_MAP[width],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-default px-6 py-4">
          <h2 className="text-lg font-semibold text-bright">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-default"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="border-t border-default px-6 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
