'use client';

import { useState } from 'react';
import { X, Filter, RotateCcw, Save } from 'lucide-react';
import type { SalesOrderFilter } from '../hooks/useSalesOrders';

interface OrderQuickFiltersModalProps {
  open: boolean;
  onClose: () => void;
  currentFilters: SalesOrderFilter;
  onApply: (filters: SalesOrderFilter) => void;
}

export function OrderQuickFiltersModal({
  open,
  onClose,
  currentFilters,
  onApply,
}: OrderQuickFiltersModalProps) {
  const [draft, setDraft] = useState<SalesOrderFilter>({ ...currentFilters });

  if (!open) return null;

  function handleReset() {
    setDraft({});
  }

  function handleApply() {
    onApply(draft);
    onClose();
  }

  const inputClass =
    'w-full rounded-lg border border-default bg-elevated px-3 py-2 text-sm text-text-default placeholder-text-muted outline-none focus:border-hover focus:ring-1 focus:ring-hover';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-default bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-default px-5 py-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#F59E0B]" />
            <h2 className="text-sm font-semibold text-text-bright">Quick Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-elevated hover:text-text-default"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-5">
          {/* Client Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Client Name
            </label>
            <input
              type="text"
              value={draft.clientName ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, clientName: e.target.value || undefined }))}
              placeholder="Search by client name..."
              className={inputClass}
            />
          </div>

          {/* City */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
              City
            </label>
            <input
              type="text"
              value={draft.city ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value || undefined }))}
              placeholder="Filter by city..."
              className={inputClass}
            />
          </div>

          {/* Submitted By */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Submitted By
            </label>
            <input
              type="text"
              value={draft.submittedBy ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, submittedBy: e.target.value || undefined }))}
              placeholder="Sales rep name..."
              className={inputClass}
            />
          </div>

          {/* Toggle Filters */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-text-default cursor-pointer">
              <input
                type="checkbox"
                checked={!!draft.backordersOnly}
                onChange={(e) => setDraft((d) => ({ ...d, backordersOnly: e.target.checked || undefined }))}
                className="h-4 w-4 rounded border-default bg-elevated accent-[#F59E0B]"
              />
              Backorders
            </label>
            <label className="flex items-center gap-2 text-sm text-text-default cursor-pointer">
              <input
                type="checkbox"
                checked={!!draft.hideReleased}
                onChange={(e) => setDraft((d) => ({ ...d, hideReleased: e.target.checked || undefined }))}
                className="h-4 w-4 rounded border-default bg-elevated accent-[#F59E0B]"
              />
              Hide Released
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-default px-5 py-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-elevated hover:text-text-default"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-default px-4 py-1.5 text-xs font-medium text-text-default transition-colors hover:bg-elevated"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:brightness-110"
              style={{ backgroundColor: '#F59E0B' }}
            >
              <Save className="h-3.5 w-3.5" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
