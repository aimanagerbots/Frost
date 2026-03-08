'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getBlogPosts,
  getSEOKeywords,
  getSEOMetrics,
  getEvents,
  getEventMetrics,
  getAdCampaigns,
  getAdMetrics,
  getMerchItems,
  getOrganicTrend,
  getComplianceChecklist,
  getMerchBudget,
} from '@/mocks/marketing-seo-events';

export function useBlogPosts() {
  return useQuery({ queryKey: ['marketing', 'blog-posts'], queryFn: getBlogPosts });
}

export function useSEOKeywords() {
  return useQuery({ queryKey: ['marketing', 'seo-keywords'], queryFn: getSEOKeywords });
}

export function useSEOMetrics() {
  return useQuery({ queryKey: ['marketing', 'seo-metrics'], queryFn: getSEOMetrics });
}

export function useEvents() {
  return useQuery({ queryKey: ['marketing', 'events'], queryFn: getEvents });
}

export function useEventMetrics() {
  return useQuery({ queryKey: ['marketing', 'event-metrics'], queryFn: getEventMetrics });
}

export function useAdCampaigns() {
  return useQuery({ queryKey: ['marketing', 'ad-campaigns'], queryFn: getAdCampaigns });
}

export function useAdMetrics() {
  return useQuery({ queryKey: ['marketing', 'ad-metrics'], queryFn: getAdMetrics });
}

export function useMerchItems() {
  return useQuery({ queryKey: ['marketing', 'merch-items'], queryFn: getMerchItems });
}

export function useOrganicTrend() {
  return useQuery({ queryKey: ['marketing', 'organic-trend'], queryFn: getOrganicTrend });
}

export function useComplianceChecklist() {
  return useQuery({ queryKey: ['marketing', 'compliance-checklist'], queryFn: getComplianceChecklist });
}

export function useMerchBudget() {
  return useQuery({ queryKey: ['marketing', 'merch-budget'], queryFn: getMerchBudget });
}
