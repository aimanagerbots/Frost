import { useMemo } from 'react';

interface PipelineRecommendation {
  text: string;
  category: 'growth' | 'retention' | 'recovery' | 'default';
}

const PIPELINE_RECOMMENDATIONS: Record<string, PipelineRecommendation> = {
  A1: { text: 'First reorder nudge \u2014 build confidence with their top sellers', category: 'growth' },
  A2: { text: 'Upsell opportunity \u2014 suggest complementary product lines', category: 'growth' },
  A3: { text: 'VMI enrollment candidate \u2014 propose automated restocking', category: 'growth' },
  A4: { text: 'Premium account \u2014 offer exclusive strains and early releases', category: 'retention' },
  A5: { text: 'Strategic partner \u2014 coordinate joint promotions', category: 'retention' },
  I1: { text: 'Win-back opportunity \u2014 offer a comeback bundle with incentive pricing', category: 'recovery' },
  I2: { text: 'Win-back opportunity \u2014 offer a comeback bundle with incentive pricing', category: 'recovery' },
  I3: { text: 'Win-back opportunity \u2014 offer a comeback bundle with incentive pricing', category: 'recovery' },
  I4: { text: 'Win-back opportunity \u2014 offer a comeback bundle with incentive pricing', category: 'recovery' },
  I5: { text: 'Win-back opportunity \u2014 offer a comeback bundle with incentive pricing', category: 'recovery' },
  R1: { text: 'Recovery account \u2014 focus on reliability and consistent supply', category: 'recovery' },
  R2: { text: 'Recovery account \u2014 focus on reliability and consistent supply', category: 'recovery' },
  R3: { text: 'Recovery account \u2014 focus on reliability and consistent supply', category: 'recovery' },
  R4: { text: 'Recovery account \u2014 focus on reliability and consistent supply', category: 'recovery' },
  R5: { text: 'Recovery account \u2014 focus on reliability and consistent supply', category: 'recovery' },
};

const DEFAULT_RECOMMENDATION: PipelineRecommendation = {
  text: 'Standard reorder proposal \u2014 review account history for tailored recommendations',
  category: 'default',
};

export function usePipelineRecommendation(pipelineCode?: string): PipelineRecommendation {
  return useMemo(() => {
    if (!pipelineCode) return DEFAULT_RECOMMENDATION;
    return PIPELINE_RECOMMENDATIONS[pipelineCode] ?? DEFAULT_RECOMMENDATION;
  }, [pipelineCode]);
}
