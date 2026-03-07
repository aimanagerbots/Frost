'use client';

import { useQuery } from '@tanstack/react-query';
import { getSystemHealth, getBackgroundJobs, getAIModelUsage, getFeatureFlags } from '@/mocks/system';

export function useSystemHealth() {
  return useQuery({ queryKey: ['system', 'health'], queryFn: () => getSystemHealth() });
}

export function useBackgroundJobs() {
  return useQuery({ queryKey: ['system', 'jobs'], queryFn: () => getBackgroundJobs() });
}

export function useAIModelUsage() {
  return useQuery({ queryKey: ['system', 'ai-usage'], queryFn: () => getAIModelUsage() });
}

export function useFeatureFlags() {
  return useQuery({ queryKey: ['system', 'feature-flags'], queryFn: () => getFeatureFlags() });
}
