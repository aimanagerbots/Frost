import { useQuery } from '@tanstack/react-query';
import { AD_CAMPAIGNS } from '@/mocks/cultivera';
import type { AdCampaign } from '../types';

interface CultiveraMarketingData {
  campaigns: AdCampaign[];
}

export function useCultiveraMarketing() {
  return useQuery<CultiveraMarketingData>({
    queryKey: ['cultivera', 'marketing'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 200));
      return { campaigns: AD_CAMPAIGNS };
    },
  });
}
