import { useQuery } from '@tanstack/react-query';
import { getChatConversations, getChatSuggestions } from '@/mocks/chat';

export function useChatConversations() {
  return useQuery({
    queryKey: ['chat', 'conversations'],
    queryFn: getChatConversations,
  });
}

export function useChatSuggestions() {
  return useQuery({
    queryKey: ['chat', 'suggestions'],
    queryFn: getChatSuggestions,
  });
}
