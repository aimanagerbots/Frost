'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import type { CopilotSuggestion, SegmentCriterion, TerritoryData, TerritoryMetrics, Segment, SegmentPreview } from '@/modules/crm/types';
import type { CopilotConversation } from '@/mocks/crm-copilot';
import {
  getCopilotConversations,
  getCopilotSuggestions,
  getCopilotConversation,
} from '@/mocks/crm-copilot';
import { getTerritoryData, getTerritoryMetrics } from '@/mocks/crm-territory';
import { getSegments, getSegmentPreview } from '@/mocks/crm-segments';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useCopilotConversations() {
  return useDemoQuery<CopilotConversation[]>({
    queryKey: ['crm', 'copilot-conversations'],
    demoQueryFn: async () => {
      await delay(300);
      return getCopilotConversations();
    },
    emptyValue: [] as CopilotConversation[],
  });
}

export function useCopilotConversation(conversationId?: string) {
  return useDemoQuery<CopilotConversation | undefined>({
    queryKey: ['crm', 'copilot-conversation', conversationId],
    demoQueryFn: async () => {
      await delay(300);
      return conversationId ? getCopilotConversation(conversationId) : undefined;
    },
    emptyValue: undefined,
    enabled: !!conversationId,
  });
}

export function useCopilotSuggestions() {
  return useDemoQuery<CopilotSuggestion[]>({
    queryKey: ['crm', 'copilot-suggestions'],
    demoQueryFn: async () => {
      await delay(300);
      return getCopilotSuggestions();
    },
    emptyValue: [] as CopilotSuggestion[],
  });
}

export function useTerritoryData() {
  return useDemoQuery({
    queryKey: ['crm', 'territory-data'],
    demoQueryFn: async () => {
      await delay(300);
      return getTerritoryData();
    },
    emptyValue: [] as TerritoryData[],
  });
}

export function useTerritoryMetrics() {
  return useDemoQuery({
    queryKey: ['crm', 'territory-metrics'],
    demoQueryFn: async () => {
      await delay(300);
      return getTerritoryMetrics();
    },
    emptyValue: [] as TerritoryMetrics[],
  });
}

export function useSegments() {
  return useDemoQuery({
    queryKey: ['crm', 'segments'],
    demoQueryFn: async () => {
      await delay(300);
      return getSegments();
    },
    emptyValue: [] as Segment[],
  });
}

export function useSegmentPreview(criteria?: SegmentCriterion[]) {
  return useDemoQuery<SegmentPreview>({
    queryKey: ['crm', 'segment-preview', criteria],
    demoQueryFn: async () => {
      await delay(300);
      return getSegmentPreview(criteria ?? []);
    },
    emptyValue: { accounts: [], totalCount: 0, totalRevenue: 0 },
    enabled: !!criteria && criteria.length > 0,
  });
}
