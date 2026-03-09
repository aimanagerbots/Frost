'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const DECLINE_REASONS = [
  'Out of stock',
  'Store closing soon',
  'Item unavailable',
  'Customer request',
  'Other',
] as const;

export function DeclineModal({ isOpen, onClose, onConfirm }: DeclineModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherText, setOtherText] = useState('');

  if (!isOpen) return null;

  const finalReason =
    selectedReason === 'Other'
      ? otherText.trim() || 'Other'
      : selectedReason;

  function handleConfirm() {
    if (!selectedReason) return;
    onConfirm(finalReason);
    setSelectedReason('');
    setOtherText('');
  }

  function handleClose() {
    setSelectedReason('');
    setOtherText('');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') handleClose();
        }}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl border border-border-default bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-text-bright">Decline Order</h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-text-muted hover:bg-elevated hover:text-text-default transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-text-muted mb-4">
          Select a reason for declining this order. The customer will be notified.
        </p>

        {/* Reasons */}
        <div className="space-y-2 mb-4">
          {DECLINE_REASONS.map((reason) => (
            <label
              key={reason}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-4 py-2.5 cursor-pointer transition-colors',
                selectedReason === reason
                  ? 'border-accent-primary bg-accent-primary/10 text-text-bright'
                  : 'border-border-default bg-elevated text-text-default hover:border-border-default/80'
              )}
            >
              <input
                type="radio"
                name="decline-reason"
                value={reason}
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
                className="sr-only"
              />
              <div
                className={cn(
                  'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                  selectedReason === reason
                    ? 'border-accent-primary'
                    : 'border-text-muted'
                )}
              >
                {selectedReason === reason && (
                  <div className="h-2 w-2 rounded-full bg-accent-primary" />
                )}
              </div>
              <span className="text-sm">{reason}</span>
            </label>
          ))}
        </div>

        {/* Other text input */}
        {selectedReason === 'Other' && (
          <textarea
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            placeholder="Describe the reason..."
            className="w-full rounded-lg border border-border-default bg-elevated px-3 py-2 text-sm text-text-default placeholder:text-text-muted/50 focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary mb-4 resize-none"
            rows={3}
          />
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-border-default bg-elevated px-4 py-2 text-sm font-medium text-text-muted hover:text-text-default transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedReason}
            className={cn(
              'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
              selectedReason
                ? 'border-red-500/30 bg-red-500/15 text-red-400 hover:bg-red-500/25'
                : 'border-border-default bg-elevated text-text-muted cursor-not-allowed'
            )}
          >
            Confirm Decline
          </button>
        </div>
      </div>
    </div>
  );
}
