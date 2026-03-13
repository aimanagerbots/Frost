'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { LoadingSkeleton } from '@/components';
import { useCartAllocation } from '../hooks';
import type { CartLineItem, AllocationMode } from '@/modules/sales/types';

interface ConversionSettingModalProps {
  open: boolean;
  onClose: () => void;
  cartId: string;
  lineItems: CartLineItem[];
}

export function ConversionSettingModal({
  open,
  onClose,
  cartId,
  lineItems,
}: ConversionSettingModalProps) {
  const defaultLineItem = open && lineItems.length > 0 ? lineItems[0].id : null;
  const [selectedLineItem, setSelectedLineItem] = useState<string | null>(null);
  const [mode, setMode] = useState<AllocationMode>('combine');
  const dialogRef = useRef<HTMLDialogElement>(null);

  const effectiveLineItem = selectedLineItem ?? defaultLineItem;

  const { data: allocations = [], isLoading } = useCartAllocation(
    open ? effectiveLineItem : null
  );

  // Calculate summary from allocations
  const needed = allocations.reduce((s, a) => s + a.needed, 0);
  const allocated = allocations.reduce((s, a) => s + a.allocated, 0);
  const remaining = needed - allocated;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  // Manage dialog open/close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!open) return null;

  const activeLineItem = lineItems.find((li) => li.id === effectiveLineItem);

  // Suppress unused var lint — cartId is part of the public interface for future API calls
  void cartId;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-xl border border-default bg-card p-0 text-text-default backdrop:bg-black/60"
      onKeyDown={handleKeyDown}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-label="Conversion Setting"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-default px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Conversion Setting</h2>
            {activeLineItem && (
              <p className="text-sm text-text-muted mt-1">
                {activeLineItem.productName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-accent-hover hover:text-text-default transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Line item selector */}
        <div className="border-b border-default px-6 py-3">
          <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Line Item
          </label>
          <select
            value={effectiveLineItem ?? ''}
            onChange={(e) => setSelectedLineItem(e.target.value)}
            className="mt-1 w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:border-hover focus:outline-none"
          >
            {lineItems.map((li) => (
              <option key={li.id} value={li.id}>
                {li.productName} (Qty: {li.quantity})
              </option>
            ))}
          </select>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-4 border-b border-default px-6 py-4">
          <div className="rounded-lg bg-elevated px-3 py-2 text-center">
            <p className="text-xs text-text-muted">Needed (units/grams)</p>
            <p className="text-lg font-semibold tabular-nums">{needed.toFixed(2)}</p>
          </div>
          <div className="rounded-lg bg-elevated px-3 py-2 text-center">
            <p className="text-xs text-text-muted">Allocated (units/grams)</p>
            <p className="text-lg font-semibold tabular-nums text-green-400">
              {allocated.toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg bg-elevated px-3 py-2 text-center">
            <p className="text-xs text-text-muted">Remaining (units/grams)</p>
            <p className="text-lg font-semibold tabular-nums text-amber-400">
              {remaining.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Batch allocation table */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-text-muted">
            Batch Sorting
          </h3>
          {isLoading ? (
            <LoadingSkeleton variant="table" />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-default">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-default">
                    {['Batch Date', 'DOH', 'DOM', 'Use', 'Barcode', 'Room', 'Available', 'Allocated'].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((a) => (
                    <tr
                      key={a.batchId}
                      className="border-b border-default/50 transition-colors hover:bg-accent-hover"
                    >
                      <td className="px-3 py-2 tabular-nums">{a.batchDate}</td>
                      <td className="px-3 py-2 tabular-nums">{a.doh}</td>
                      <td className="px-3 py-2 tabular-nums">{a.dom}</td>
                      <td className="px-3 py-2">{a.use}</td>
                      <td className="px-3 py-2 font-mono text-xs">{a.barcode}</td>
                      <td className="px-3 py-2">{a.room}</td>
                      <td className="px-3 py-2 tabular-nums">{a.available}</td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          defaultValue={a.allocated}
                          min={0}
                          max={a.available}
                          className="w-20 rounded border border-default bg-base px-2 py-1 text-sm tabular-nums text-text-default focus:border-hover focus:outline-none"
                          readOnly
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mode selector + footer */}
        <div className="flex items-center justify-between border-t border-default px-6 py-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="conversion-mode"
                checked={mode === 'combine'}
                onChange={() => setMode('combine')}
                className="accent-amber-500"
              />
              Combine into 1 Batch
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="conversion-mode"
                checked={mode === 'generate-multiple'}
                onChange={() => setMode('generate-multiple')}
                className="accent-amber-500"
              />
              Generate Multiple Batches
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-default bg-card px-4 py-2 text-sm font-medium text-text-default transition-colors hover:bg-accent-hover"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
