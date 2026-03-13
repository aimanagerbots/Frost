import { useQuery } from '@tanstack/react-query';
import { SYNC_STATUS, SYNC_RUNS, BOT_STATUS, MARKETPLACE_STATS } from '@/mocks/cultivera';
import type { SyncStatus, SyncRun, BotStatus, MarketplaceStats } from '../types';

interface CultiveraDashboardData {
  syncStatus: SyncStatus;
  recentRuns: SyncRun[];
  botStatus: BotStatus;
  marketplaceStats: MarketplaceStats;
}

export function useCultiveraDashboard() {
  return useQuery<CultiveraDashboardData>({
    queryKey: ['cultivera', 'dashboard'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 200));
      return {
        syncStatus: SYNC_STATUS,
        recentRuns: SYNC_RUNS.slice(0, 5),
        botStatus: BOT_STATUS,
        marketplaceStats: MARKETPLACE_STATS,
      };
    },
  });
}
