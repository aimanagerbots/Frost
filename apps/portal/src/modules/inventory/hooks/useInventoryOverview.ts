'use client';

import { useQuery } from '@tanstack/react-query';
import { getOverviewMetrics, getPipelineNodes, getCategoryDistribution, getActivityFeed } from '@/mocks/inventory';

export function useOverviewMetrics() {
  return useQuery({ queryKey: ['inventory', 'overview-metrics'], queryFn: getOverviewMetrics });
}

export function usePipelineNodes() {
  return useQuery({ queryKey: ['inventory', 'pipeline-nodes'], queryFn: getPipelineNodes });
}

export function useCategoryDistribution() {
  return useQuery({ queryKey: ['inventory', 'category-distribution'], queryFn: getCategoryDistribution });
}

export function useActivityFeed() {
  return useQuery({ queryKey: ['inventory', 'activity-feed'], queryFn: getActivityFeed });
}
