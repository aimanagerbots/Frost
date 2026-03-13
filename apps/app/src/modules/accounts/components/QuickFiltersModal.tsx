'use client';

import { ModalShell } from './ModalShell';

interface QuickFiltersModalProps {
  open: boolean;
  onClose: () => void;
}

export function QuickFiltersModal({ open, onClose }: QuickFiltersModalProps) {
  return (
    <ModalShell open={open} onClose={onClose} title="Quick Filters">
      <p className="py-6 text-center text-sm text-text-muted">
        You don&apos;t have any filters set up for the grid.
      </p>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-default px-4 py-2 text-sm text-text-muted transition-colors hover:bg-elevated"
        >
          Cancel
        </button>
        <button
          type="button"
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: '#F59E0B' }}
        >
          Remember grid sort
        </button>
        <button
          type="button"
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: '#F59E0B' }}
        >
          Save Current Filter
        </button>
      </div>
    </ModalShell>
  );
}
