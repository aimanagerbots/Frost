'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
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
import type {
  BlogPost,
  SEOKeyword,
  SEOMetrics,
  Event,
  EventMetrics,
  AdCampaign,
  AdMetrics,
  MerchItem,
  OrganicTrendPoint,
  ComplianceCheckItem,
  MerchBudget,
} from '@/modules/marketing/types/seo-events';

export function useBlogPosts() {
  return useDemoQuery({
    queryKey: ['marketing', 'blog-posts'],
    demoQueryFn: getBlogPosts,
    emptyValue: [] as BlogPost[],
  });
}

export function useSEOKeywords() {
  return useDemoQuery({
    queryKey: ['marketing', 'seo-keywords'],
    demoQueryFn: getSEOKeywords,
    emptyValue: [] as SEOKeyword[],
  });
}

export function useSEOMetrics() {
  return useDemoQuery({
    queryKey: ['marketing', 'seo-metrics'],
    demoQueryFn: getSEOMetrics,
    emptyValue: {
      publishedPosts: 0,
      totalViews: 0,
      avgSeoScore: 0,
      organicTraffic: 0,
      totalOrganicVisits: 0,
      top10Count: 0,
      avgPosition: 0,
      topKeyword: '',
      topKeywordRank: 0,
    } as SEOMetrics,
  });
}

export function useEvents() {
  return useDemoQuery({
    queryKey: ['marketing', 'events'],
    demoQueryFn: getEvents,
    emptyValue: [] as Event[],
  });
}

export function useEventMetrics() {
  return useDemoQuery({
    queryKey: ['marketing', 'event-metrics'],
    demoQueryFn: getEventMetrics,
    emptyValue: {
      upcoming: 0,
      completedThisQuarter: 0,
      totalBudget: 0,
      avgROI: 0,
      vendorDaysThisMonth: 0,
      avgRevenueLift: 0,
      topLocation: '',
      nextTradeShowDays: 0,
    } as EventMetrics,
  });
}

export function useAdCampaigns() {
  return useDemoQuery({
    queryKey: ['marketing', 'ad-campaigns'],
    demoQueryFn: getAdCampaigns,
    emptyValue: [] as AdCampaign[],
  });
}

export function useAdMetrics() {
  return useDemoQuery({
    queryKey: ['marketing', 'ad-metrics'],
    demoQueryFn: getAdMetrics,
    emptyValue: {
      activeCampaigns: 0,
      totalSpendMTD: 0,
      totalBudget: 0,
      totalImpressions: 0,
      totalClicks: 0,
      avgCPC: 0,
      totalConversions: 0,
      flaggedCampaigns: 0,
    } as AdMetrics,
  });
}

export function useMerchItems() {
  return useDemoQuery({
    queryKey: ['marketing', 'merch-items'],
    demoQueryFn: getMerchItems,
    emptyValue: [] as MerchItem[],
  });
}

export function useOrganicTrend() {
  return useDemoQuery({
    queryKey: ['marketing', 'organic-trend'],
    demoQueryFn: getOrganicTrend,
    emptyValue: [] as OrganicTrendPoint[],
  });
}

export function useComplianceChecklist() {
  return useDemoQuery({
    queryKey: ['marketing', 'compliance-checklist'],
    demoQueryFn: getComplianceChecklist,
    emptyValue: [] as ComplianceCheckItem[],
  });
}

export function useMerchBudget() {
  return useDemoQuery({
    queryKey: ['marketing', 'merch-budget'],
    demoQueryFn: getMerchBudget,
    emptyValue: {
      annual: 0,
      spentYTD: 0,
      byCategory: [],
      monthlySpend: [],
    } as MerchBudget,
  });
}
