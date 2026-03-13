import { useDemoQuery } from '@/lib/use-demo-query';
import { SYNC_STATUS, SYNC_RUNS, BOT_STATUS, MARKETPLACE_STATS } from '@/mocks/cultivera';
import type { SyncStatus, SyncRun, BotStatus, MarketplaceStats } from '../types';

interface CultiveraDashboardData {
  syncStatus: SyncStatus;
  recentRuns: SyncRun[];
  botStatus: BotStatus;
  marketplaceStats: MarketplaceStats;
}

export function useCultiveraDashboard() {
  return useDemoQuery<CultiveraDashboardData>({
    queryKey: ['cultivera', 'dashboard'],
    demoQueryFn: async () => {
      await new Promise(r => setTimeout(r, 200));
      return {
        syncStatus: SYNC_STATUS,
        recentRuns: SYNC_RUNS.slice(0, 5),
        botStatus: BOT_STATUS,
        marketplaceStats: MARKETPLACE_STATS,
      };
    },
    emptyValue: {
      syncStatus: {
        lastRun: { id: '', timestamp: '', status: 'success', itemsSynced: 0, itemsFailed: 0, duration: 0 },
        nextScheduled: '',
        consecutiveFailures: 0,
        totalLifetimeSyncs: 0,
        isRunning: false,
      },
      recentRuns: [],
      botStatus: {
        state: 'idle',
        lastRun: '',
        nextRun: '',
        runsToday: 0,
        ordersImportedToday: 0,
        ordersImportedThisWeek: 0,
        pendingReview: 0,
      },
      marketplaceStats: {
        totalWALicensedRetailers: 0,
        cultiveraManagedRetailers: 0,
        frozenSupplierRank: 0,
        activeListings: 0,
        avgOrderValue: 0,
        repeatBuyerRate: 0,
      },
    },
  });
}
