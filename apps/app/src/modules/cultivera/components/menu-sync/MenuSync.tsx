'use client';

import { useState } from 'react';
import { RefreshCw, Clock, CheckCircle, AlertTriangle, XCircle, FileText } from 'lucide-react';
import { StatusBadge } from '@/components';
import { useSyncStatus } from '../../hooks/useSyncStatus';
import { useCultiveraStore } from '../../store';
import { SyncLogModal } from './SyncLogModal';
import type { SyncRun } from '../../types';

const ACCENT = '#22D3EE';

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  if (isToday) return `Today ${time}`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + time;
}

function StatusIcon({ status }: { status: SyncRun['status'] }) {
  if (status === 'success') return <CheckCircle className="h-4 w-4 text-green-400" />;
  if (status === 'partial') return <AlertTriangle className="h-4 w-4 text-amber-400" />;
  return <XCircle className="h-4 w-4 text-red-400" />;
}

export function MenuSync() {
  const { data, isLoading } = useSyncStatus();
  const { selectedSyncRunId, selectSyncRun } = useCultiveraStore();
  const [isSyncing, setIsSyncing] = useState(false);

  function handleSyncNow() {
    if (isSyncing) return;
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2500);
  }

  if (isLoading || !data) {
    return <div className="h-64 rounded-xl bg-card animate-pulse" />;
  }

  const { syncStatus, syncRuns } = data;
  const { lastRun, nextScheduled, consecutiveFailures, totalLifetimeSyncs } = syncStatus;

  return (
    <div className="space-y-4">
      {/* Status Hero Card */}
      <div className="rounded-xl border bg-card p-5 space-y-4" style={{ borderColor: `${ACCENT}30` }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`h-2 w-2 rounded-full ${isSyncing ? 'animate-ping' : ''}`}
                style={{ background: isSyncing ? ACCENT : lastRun.status === 'success' ? '#22C55E' : lastRun.status === 'partial' ? '#F59E0B' : '#EF4444' }}
              />
              <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                {isSyncing ? 'Syncing...' : 'Last sync status'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">
              {isSyncing ? 'Menu sync in progress' : `${lastRun.itemsSynced} items synced successfully`}
            </h2>
            {!isSyncing && lastRun.errorMessage && (
              <p className="text-xs text-amber-400 mt-1">{lastRun.errorMessage}</p>
            )}
          </div>
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
            style={{ background: ACCENT, color: '#0A1628' }}
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-default">
          <div>
            <p className="text-xs text-text-muted mb-1">Last run</p>
            <p className="text-sm font-semibold text-white">{formatTimestamp(lastRun.timestamp)}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Next scheduled</p>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-text-muted" />
              <p className="text-sm font-semibold text-white">{formatTimestamp(nextScheduled)}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Schedule</p>
            <p className="text-sm font-semibold text-white">Daily · 6:00 AM PT</p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Lifetime syncs</p>
            <p className="text-sm font-semibold text-white">{totalLifetimeSyncs.toLocaleString()}</p>
          </div>
        </div>

        {consecutiveFailures > 0 && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 flex items-center gap-3">
            <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-400">
              {consecutiveFailures} consecutive failure{consecutiveFailures > 1 ? 's' : ''}. Check sync logs for details.
            </p>
          </div>
        )}
      </div>

      {/* Sync History Table */}
      <div className="rounded-xl border border-default bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-default">
          <h3 className="text-sm font-semibold text-white">Sync History</h3>
          <span className="text-xs text-text-muted">Last {syncRuns.length} runs</span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-default bg-card-hover">
              <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Date</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Synced</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Failed</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Duration</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {syncRuns.map((run) => (
              <tr key={run.id} className="border-b border-default last:border-0 hover:bg-card-hover transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <StatusIcon status={run.status} />
                    <span className="text-xs text-white">{formatTimestamp(run.timestamp)}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge
                    status={run.status === 'success' ? 'active' : run.status === 'partial' ? 'in-production' : 'failed'}
                  />
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-xs text-white font-medium">{run.itemsSynced}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className={`text-xs font-medium ${run.itemsFailed > 0 ? 'text-red-400' : 'text-text-muted'}`}>
                    {run.itemsFailed}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span className="text-xs text-text-muted">{run.duration}s</span>
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => selectSyncRun(run.id)}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium border border-default text-text-muted hover:text-white hover:bg-card-hover transition-colors"
                  >
                    <FileText className="h-3 w-3" />
                    View Log
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Modal */}
      {selectedSyncRunId && (
        <SyncLogModal runId={selectedSyncRunId} onClose={() => selectSyncRun(null)} />
      )}
    </div>
  );
}
