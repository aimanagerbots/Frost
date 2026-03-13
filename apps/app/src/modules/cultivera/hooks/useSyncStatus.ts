import { useDemoQuery } from '@/lib/use-demo-query';
import { SYNC_STATUS, SYNC_RUNS, SYNC_LOG_ENTRIES } from '@/mocks/cultivera';
import type { SyncStatus, SyncRun, SyncLogEntry } from '../types';

interface SyncStatusData {
  syncStatus: SyncStatus;
  syncRuns: SyncRun[];
  logEntries: Record<string, SyncLogEntry[]>;
}

export function useSyncStatus() {
  return useDemoQuery<SyncStatusData>({
    queryKey: ['cultivera', 'sync-status'],
    demoQueryFn: async () => {
      await new Promise(r => setTimeout(r, 200));
      return { syncStatus: SYNC_STATUS, syncRuns: SYNC_RUNS, logEntries: SYNC_LOG_ENTRIES };
    },
    emptyValue: {
      syncStatus: {
        lastRun: { id: '', timestamp: '', status: 'success', itemsSynced: 0, itemsFailed: 0, duration: 0 },
        nextScheduled: '',
        consecutiveFailures: 0,
        totalLifetimeSyncs: 0,
        isRunning: false,
      },
      syncRuns: [],
      logEntries: {},
    },
  });
}
