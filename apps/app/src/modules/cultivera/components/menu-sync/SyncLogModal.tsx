'use client';

import { useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, RefreshCw, Minus } from 'lucide-react';
import { SYNC_LOG_ENTRIES, SYNC_RUNS } from '@/mocks/cultivera';
import type { SyncRun } from '../../types';

interface SyncLogModalProps {
  runId: string;
  onClose: () => void;
}

function actionIcon(action: 'updated' | 'created' | 'unchanged' | 'failed') {
  if (action === 'updated') return <RefreshCw className="h-3.5 w-3.5 text-blue-400" />;
  if (action === 'created') return <CheckCircle className="h-3.5 w-3.5 text-green-400" />;
  if (action === 'unchanged') return <Minus className="h-3.5 w-3.5 text-text-muted" />;
  return <AlertTriangle className="h-3.5 w-3.5 text-red-400" />;
}

const ACTION_COLORS: Record<string, string> = {
  updated: 'text-blue-400 bg-blue-500/10',
  created: 'text-green-400 bg-green-500/10',
  unchanged: 'text-text-text-muted bg-white/[0.06]',
  failed: 'text-red-400 bg-red-500/10',
};

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

export function SyncLogModal({ runId, onClose }: SyncLogModalProps) {
  const run = SYNC_RUNS.find((r: SyncRun) => r.id === runId);
  const entries = SYNC_LOG_ENTRIES[runId] ?? [];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!run) return null;

  const statusColor = run.status === 'success' ? '#22C55E' : run.status === 'partial' ? '#F59E0B' : '#EF4444';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sync run log"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-default bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-default">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full" style={{ background: statusColor }} />
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: statusColor }}>
                {run.status}
              </span>
            </div>
            <h2 className="text-base font-bold text-white">Sync Run Log</h2>
            <p className="text-xs text-text-muted mt-0.5">
              {formatTimestamp(run.timestamp)} · {run.itemsSynced} synced · {run.itemsFailed} failed · {run.duration}s
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-card-hover transition-colors text-text-muted hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Error banner */}
        {run.errorMessage && (
          <div className="mx-5 mt-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
            <p className="text-xs text-red-400">{run.errorMessage}</p>
          </div>
        )}

        {/* Log entries */}
        <div className="p-5 max-h-[50vh] overflow-y-auto">
          {entries.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">No detailed log available for this run.</p>
          ) : (
            <div className="space-y-1">
              <div className="grid grid-cols-[1fr_auto_auto_1fr] gap-3 px-3 pb-2 text-xs font-semibold text-text-muted uppercase tracking-wide border-b border-default">
                <span>Product</span>
                <span>SKU</span>
                <span>Action</span>
                <span>Cultivera ID / Error</span>
              </div>
              {entries.map((entry, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_auto_auto_1fr] gap-3 px-3 py-2.5 rounded-lg hover:bg-card-hover transition-colors text-xs"
                >
                  <span className="text-white font-medium truncate">{entry.product}</span>
                  <span className="text-text-muted font-mono">{entry.sku}</span>
                  <span className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 font-semibold w-fit ${ACTION_COLORS[entry.action]}`}>
                    {actionIcon(entry.action)}
                    {entry.action}
                  </span>
                  <span className={entry.error ? 'text-red-400' : 'text-text-muted font-mono'}>
                    {entry.error ?? entry.cultiveraSku ?? '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-default flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-white border border-default hover:bg-card-hover transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
