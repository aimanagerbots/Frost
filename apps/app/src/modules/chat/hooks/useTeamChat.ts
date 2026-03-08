'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getTeamMembers,
  getTeamChannels,
  getTeamDMs,
  getChannelMessages,
  getDMMessages,
} from '@/mocks/team-chat';

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team-chat', 'members'],
    queryFn: getTeamMembers,
  });
}

export function useTeamChannels() {
  return useQuery({
    queryKey: ['team-chat', 'channels'],
    queryFn: getTeamChannels,
  });
}

export function useTeamDMs() {
  return useQuery({
    queryKey: ['team-chat', 'dms'],
    queryFn: getTeamDMs,
  });
}

export function useChannelMessages(channelId: string) {
  return useQuery({
    queryKey: ['team-chat', 'channel-messages', channelId],
    queryFn: () => getChannelMessages(channelId),
    enabled: !!channelId,
  });
}

export function useDMMessages(dmId: string) {
  return useQuery({
    queryKey: ['team-chat', 'dm-messages', dmId],
    queryFn: () => getDMMessages(dmId),
    enabled: !!dmId,
  });
}
