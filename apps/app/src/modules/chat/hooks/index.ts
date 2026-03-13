import { useDemoQuery } from '@/lib/use-demo-query';
import { getChatConversations, getChatSuggestions } from '@/mocks/chat';
import type { ChatConversation, ChatSuggestion } from '../types';

export function useChatConversations() {
  return useDemoQuery({
    queryKey: ['chat', 'conversations'],
    demoQueryFn: getChatConversations,
    emptyValue: [] as ChatConversation[],
  });
}

export function useChatSuggestions() {
  return useDemoQuery({
    queryKey: ['chat', 'suggestions'],
    demoQueryFn: getChatSuggestions,
    emptyValue: [] as ChatSuggestion[],
  });
}
