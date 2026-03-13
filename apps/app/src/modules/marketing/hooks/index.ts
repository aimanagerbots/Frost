'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import {
  getContentPieces,
  getContentTemplates,
  getContentChat,
  getContentLibrary,
  getSocialAccounts,
  getSocialPosts,
  getEmailCampaigns,
  getEmailCampaign,
  getEmailTemplates,
  getMarketingMetrics,
  getPostingTimesHeatMap,
  getFollowerGrowth,
  getEngagementByContentType,
  getHashtagSuggestions,
  getGapSuggestions,
  getCampaignPerformanceTrend,
} from '@/mocks/marketing';
import type {
  ContentFilter,
  EmailCampaignFilter,
  ContentPiece,
  ContentTemplate,
  AIContentMessage,
  SocialAccount,
  SocialPost,
  EmailCampaign,
  EmailTemplate,
  MarketingMetrics,
  PostingTimeHeat,
  FollowerGrowthPoint,
  EngagementByType,
  HashtagSuggestion,
  GapSuggestion,
  CampaignPerformanceTrend,
  ContentLibraryCategory,
} from '@/modules/marketing/types';

export function useContentPieces(filters?: ContentFilter) {
  return useDemoQuery({
    queryKey: ['marketing', 'content', filters],
    demoQueryFn: () => getContentPieces(filters),
    emptyValue: [] as ContentPiece[],
  });
}

export function useContentTemplates() {
  return useDemoQuery({
    queryKey: ['marketing', 'templates'],
    demoQueryFn: getContentTemplates,
    emptyValue: [] as ContentTemplate[],
  });
}

export function useContentChat(conversationId?: string) {
  return useDemoQuery({
    queryKey: ['marketing', 'chat', conversationId],
    demoQueryFn: () => getContentChat(conversationId),
    emptyValue: [] as AIContentMessage[],
  });
}

export function useSocialAccounts() {
  return useDemoQuery({
    queryKey: ['marketing', 'social-accounts'],
    demoQueryFn: getSocialAccounts,
    emptyValue: [] as SocialAccount[],
  });
}

export function useSocialPosts() {
  return useDemoQuery({
    queryKey: ['marketing', 'social-posts'],
    demoQueryFn: getSocialPosts,
    emptyValue: [] as SocialPost[],
  });
}

export function useEmailCampaigns(filters?: EmailCampaignFilter) {
  return useDemoQuery({
    queryKey: ['marketing', 'email-campaigns', filters],
    demoQueryFn: () => getEmailCampaigns(filters),
    emptyValue: [] as EmailCampaign[],
  });
}

export function useEmailCampaign(id: string | null) {
  return useDemoQuery({
    queryKey: ['marketing', 'email-campaign', id],
    demoQueryFn: () => getEmailCampaign(id!),
    emptyValue: undefined as EmailCampaign | undefined,
    enabled: !!id,
  });
}

export function useEmailTemplates() {
  return useDemoQuery({
    queryKey: ['marketing', 'email-templates'],
    demoQueryFn: getEmailTemplates,
    emptyValue: [] as EmailTemplate[],
  });
}

export function useMarketingMetrics() {
  return useDemoQuery({
    queryKey: ['marketing', 'metrics'],
    demoQueryFn: getMarketingMetrics,
    emptyValue: {
      postsThisMonth: 0,
      scheduledCount: 0,
      draftsInPipeline: 0,
      avgEngagementRate: 0,
      contentGapDays: 0,
      totalFollowers: 0,
      emailsSentMTD: 0,
      avgOpenRate: 0,
      avgClickRate: 0,
      activeCampaigns: 0,
      listHealth: 0,
      revenueAttributed: 0,
    } as MarketingMetrics,
  });
}

export function useContentLibrary() {
  return useDemoQuery({
    queryKey: ['marketing', 'content-library'],
    demoQueryFn: async () => getContentLibrary(),
    emptyValue: {
      instagram_caption: [],
      product_description: [],
      email_copy: [],
      blog_intro: [],
      image_concept: [],
    } as Record<ContentLibraryCategory, ContentPiece[]>,
  });
}

export function usePostingTimesHeatMap() {
  return useDemoQuery({
    queryKey: ['marketing', 'posting-times'],
    demoQueryFn: async () => getPostingTimesHeatMap(),
    emptyValue: [] as PostingTimeHeat[],
  });
}

export function useFollowerGrowth() {
  return useDemoQuery({
    queryKey: ['marketing', 'follower-growth'],
    demoQueryFn: async () => getFollowerGrowth(),
    emptyValue: [] as FollowerGrowthPoint[],
  });
}

export function useEngagementByContentType() {
  return useDemoQuery({
    queryKey: ['marketing', 'engagement-by-type'],
    demoQueryFn: async () => getEngagementByContentType(),
    emptyValue: [] as EngagementByType[],
  });
}

export function useHashtagSuggestions() {
  return useDemoQuery({
    queryKey: ['marketing', 'hashtag-suggestions'],
    demoQueryFn: async () => getHashtagSuggestions(),
    emptyValue: [] as HashtagSuggestion[],
  });
}

export function useGapSuggestions() {
  return useDemoQuery({
    queryKey: ['marketing', 'gap-suggestions'],
    demoQueryFn: async () => getGapSuggestions(),
    emptyValue: [] as GapSuggestion[],
  });
}

export function useCampaignPerformanceTrend(campaignId: string) {
  return useDemoQuery({
    queryKey: ['marketing', 'campaign-trend', campaignId],
    demoQueryFn: () => getCampaignPerformanceTrend(campaignId),
    emptyValue: [] as CampaignPerformanceTrend[],
    enabled: !!campaignId,
  });
}
