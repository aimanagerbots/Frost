'use client';

import { useQuery } from '@tanstack/react-query';
import type { CopilotSuggestion, SegmentCriterion } from '@/modules/crm/types';
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
  return useQuery<CopilotConversation[]>({
    queryKey: ['crm', 'copilot-conversations'],
    queryFn: async () => {
      await delay(300);
      return getCopilotConversations();
    },
  });
}

export function useCopilotConversation(conversationId?: string) {
  return useQuery<CopilotConversation | undefined>({
    queryKey: ['crm', 'copilot-conversation', conversationId],
    queryFn: async () => {
      await delay(300);
      return conversationId ? getCopilotConversation(conversationId) : undefined;
    },
    enabled: !!conversationId,
  });
}

export function useCopilotSuggestions() {
  return useQuery<CopilotSuggestion[]>({
    queryKey: ['crm', 'copilot-suggestions'],
    queryFn: async () => {
      await delay(300);
      return getCopilotSuggestions();
    },
  });
}

export function useTerritoryData() {
  return useQuery({
    queryKey: ['crm', 'territory-data'],
    queryFn: async () => {
      await delay(300);
      return getTerritoryData();
    },
  });
}

export function useTerritoryMetrics() {
  return useQuery({
    queryKey: ['crm', 'territory-metrics'],
    queryFn: async () => {
      await delay(300);
      return getTerritoryMetrics();
    },
  });
}

export function useSegments() {
  return useQuery({
    queryKey: ['crm', 'segments'],
    queryFn: async () => {
      await delay(300);
      return getSegments();
    },
  });
}

export function useSegmentPreview(criteria?: SegmentCriterion[]) {
  return useQuery({
    queryKey: ['crm', 'segment-preview', criteria],
    queryFn: async () => {
      await delay(300);
      return getSegmentPreview(criteria ?? []);
    },
    enabled: !!criteria && criteria.length > 0,
  });
}
