'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { CartLineItem } from '@/modules/sales/types';

interface MarkTradeSamplesModalProps {
  open: boolean;
  onClose: () => void;
  lineItems: CartLineItem[];
}

export function MarkTradeSamplesModal({
  open,
  onClose,
  lineItems,
}: MarkTradeSamplesModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const dialogRef = useRef<HTMLDialogElement>(null);

  function handleClose() {
    setSelected(new Set());
    onClose();
  }

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

  const toggleItem = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === lineItems.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(lineItems.map((li) => li.id)));
    }
  };

  if (!open) return null;

  const hasSelection = selected.size > 0;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto max-h-[70vh] w-full max-w-lg overflow-hidden rounded-xl border border-default bg-card p-0 text-text-default backdrop:bg-black/60"
      onKeyDown={handleKeyDown}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      aria-label="Mark Trade Samples"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-default px-6 py-4">
          <h2 className="text-lg font-semibold">Mark Trade Samples</h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-accent-hover hover:text-text-default transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info */}
        <div className="flex items-center gap-2 border-b border-default bg-amber-500/10 px-6 py-3">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-300">
            Select items to mark as trade samples. These will be excluded from the order total.
          </p>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {/* Select all */}
          <label className="mb-3 flex items-center gap-3 cursor-pointer text-sm text-text-muted hover:text-text-default">
            <input
              type="checkbox"
              checked={selected.size === lineItems.length && lineItems.length > 0}
              onChange={toggleAll}
              className="accent-amber-500 h-4 w-4"
            />
            Select All ({lineItems.length} items)
          </label>

          <div className="space-y-2">
            {lineItems.map((li) => (
              <label
                key={li.id}
                className="flex items-center gap-3 rounded-lg border border-default p-3 cursor-pointer transition-colors hover:bg-accent-hover"
              >
                <input
                  type="checkbox"
                  checked={selected.has(li.id)}
                  onChange={() => toggleItem(li.id)}
                  className="accent-amber-500 h-4 w-4 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-default truncate">
                    {li.productName}
                  </p>
                  <p className="text-xs text-text-muted">
                    {li.strain} &middot; Qty: {li.quantity}
                  </p>
                </div>
                <span className="text-sm tabular-nums text-text-muted">
                  ${li.lineTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-default px-6 py-4">
          <p className="text-sm text-text-muted">
            {selected.size} item{selected.size !== 1 ? 's' : ''} selected
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="rounded-lg border border-default bg-card px-4 py-2 text-sm font-medium text-text-default transition-colors hover:bg-accent-hover"
            >
              Cancel
            </button>
            <button
              onClick={handleClose}
              disabled={!hasSelection}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Mark as Samples
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
