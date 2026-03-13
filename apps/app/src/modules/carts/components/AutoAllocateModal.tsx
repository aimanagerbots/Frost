'use client';

import { useEffect, useCallback, useRef } from 'react';
import { X, Wand2 } from 'lucide-react';

interface AutoAllocateModalProps {
  open: boolean;
  onClose: () => void;
  cartId: string;
}

export function AutoAllocateModal({
  open,
  onClose,
  cartId,
}: AutoAllocateModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Suppress unused var — cartId used for future API integration
  void cartId;

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-full max-w-md overflow-hidden rounded-xl border border-default bg-card p-0 text-text-default backdrop:bg-black/60"
      onKeyDown={handleKeyDown}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-label="Auto Allocate"
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-default px-6 py-4">
          <h2 className="text-lg font-semibold">Auto Allocate</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-accent-hover hover:text-text-default transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-4 px-6 py-8">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}
          >
            <Wand2 className="h-8 w-8 text-amber-400" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-text-default">
              Auto-Allocate Inventory
            </h3>
            <p className="mt-2 text-sm text-text-muted leading-relaxed">
              This will automatically allocate available inventory batches to all
              line items in this cart using your fulfillment priority settings
              (FIFO, Newest First, Highest QA, or Lowest QA).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-default px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-default bg-card px-4 py-2 text-sm font-medium text-text-default transition-colors hover:bg-accent-hover"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500"
          >
            Auto Allocate
          </button>
        </div>
      </div>
    </dialog>
  );
}
