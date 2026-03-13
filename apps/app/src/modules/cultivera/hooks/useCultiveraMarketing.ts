import { useDemoQuery } from '@/lib/use-demo-query';
import { AD_CAMPAIGNS } from '@/mocks/cultivera';
import type { AdCampaign } from '../types';

interface CultiveraMarketingData {
  campaigns: AdCampaign[];
}

export function useCultiveraMarketing() {
  return useDemoQuery<CultiveraMarketingData>({
    queryKey: ['cultivera', 'marketing'],
    demoQueryFn: async () => {
      await new Promise(r => setTimeout(r, 200));
      return { campaigns: AD_CAMPAIGNS };
    },
    emptyValue: { campaigns: [] },
  });
}
