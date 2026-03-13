import { useQuery } from '@tanstack/react-query';
import { SYNC_STATUS, SYNC_RUNS, SYNC_LOG_ENTRIES } from '@/mocks/cultivera';
import type { SyncStatus, SyncRun, SyncLogEntry } from '../types';

interface SyncStatusData {
  syncStatus: SyncStatus;
  syncRuns: SyncRun[];
  logEntries: Record<string, SyncLogEntry[]>;
}

export function useSyncStatus() {
  return useQuery<SyncStatusData>({
    queryKey: ['cultivera', 'sync-status'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 200));
      return { syncStatus: SYNC_STATUS, syncRuns: SYNC_RUNS, logEntries: SYNC_LOG_ENTRIES };
    },
  });
}
