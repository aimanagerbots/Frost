'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getSystemHealth, getBackgroundJobs, getAIModelUsage, getFeatureFlags } from '@/mocks/system';
import type { SystemHealth, BackgroundJob, AIModelUsage, FeatureFlag } from '@/modules/system/types';

export function useSystemHealth() {
  return useDemoQuery({
    queryKey: ['system', 'health'],
    demoQueryFn: () => getSystemHealth(),
    emptyValue: [] as SystemHealth[],
  });
}

export function useBackgroundJobs() {
  return useDemoQuery({
    queryKey: ['system', 'jobs'],
    demoQueryFn: () => getBackgroundJobs(),
    emptyValue: [] as BackgroundJob[],
  });
}

export function useAIModelUsage() {
  return useDemoQuery({
    queryKey: ['system', 'ai-usage'],
    demoQueryFn: () => getAIModelUsage(),
    emptyValue: [] as AIModelUsage[],
  });
}

export function useFeatureFlags() {
  return useDemoQuery({
    queryKey: ['system', 'feature-flags'],
    demoQueryFn: () => getFeatureFlags(),
    emptyValue: [] as FeatureFlag[],
  });
}
