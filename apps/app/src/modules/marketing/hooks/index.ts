'use client';

import { useQuery } from '@tanstack/react-query';
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
import type { ContentFilter, EmailCampaignFilter } from '@/modules/marketing/types';

export function useContentPieces(filters?: ContentFilter) {
  return useQuery({
    queryKey: ['marketing', 'content', filters],
    queryFn: () => getContentPieces(filters),
  });
}

export function useContentTemplates() {
  return useQuery({
    queryKey: ['marketing', 'templates'],
    queryFn: getContentTemplates,
  });
}

export function useContentChat(conversationId?: string) {
  return useQuery({
    queryKey: ['marketing', 'chat', conversationId],
    queryFn: () => getContentChat(conversationId),
  });
}

export function useSocialAccounts() {
  return useQuery({
    queryKey: ['marketing', 'social-accounts'],
    queryFn: getSocialAccounts,
  });
}

export function useSocialPosts() {
  return useQuery({
    queryKey: ['marketing', 'social-posts'],
    queryFn: getSocialPosts,
  });
}

export function useEmailCampaigns(filters?: EmailCampaignFilter) {
  return useQuery({
    queryKey: ['marketing', 'email-campaigns', filters],
    queryFn: () => getEmailCampaigns(filters),
  });
}

export function useEmailCampaign(id: string | null) {
  return useQuery({
    queryKey: ['marketing', 'email-campaign', id],
    queryFn: () => getEmailCampaign(id!),
    enabled: !!id,
  });
}

export function useEmailTemplates() {
  return useQuery({
    queryKey: ['marketing', 'email-templates'],
    queryFn: getEmailTemplates,
  });
}

export function useMarketingMetrics() {
  return useQuery({
    queryKey: ['marketing', 'metrics'],
    queryFn: getMarketingMetrics,
  });
}

export function useContentLibrary() {
  return useQuery({
    queryKey: ['marketing', 'content-library'],
    queryFn: async () => getContentLibrary(),
  });
}

export function usePostingTimesHeatMap() {
  return useQuery({
    queryKey: ['marketing', 'posting-times'],
    queryFn: async () => getPostingTimesHeatMap(),
  });
}

export function useFollowerGrowth() {
  return useQuery({
    queryKey: ['marketing', 'follower-growth'],
    queryFn: async () => getFollowerGrowth(),
  });
}

export function useEngagementByContentType() {
  return useQuery({
    queryKey: ['marketing', 'engagement-by-type'],
    queryFn: async () => getEngagementByContentType(),
  });
}

export function useHashtagSuggestions() {
  return useQuery({
    queryKey: ['marketing', 'hashtag-suggestions'],
    queryFn: async () => getHashtagSuggestions(),
  });
}

export function useGapSuggestions() {
  return useQuery({
    queryKey: ['marketing', 'gap-suggestions'],
    queryFn: async () => getGapSuggestions(),
  });
}

export function useCampaignPerformanceTrend(campaignId: string) {
  return useQuery({
    queryKey: ['marketing', 'campaign-trend', campaignId],
    queryFn: () => getCampaignPerformanceTrend(campaignId),
    enabled: !!campaignId,
  });
}
