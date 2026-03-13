'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import {
  getTeamMembers,
  getTeamChannels,
  getTeamDMs,
  getChannelMessages,
  getDMMessages,
} from '@/mocks/team-chat';
import type { TeamMember, TeamChannel, TeamDM, TeamChatMessage } from '../types/team-chat';

export function useTeamMembers() {
  return useDemoQuery({
    queryKey: ['team-chat', 'members'],
    demoQueryFn: getTeamMembers,
    emptyValue: [] as TeamMember[],
  });
}

export function useTeamChannels() {
  return useDemoQuery({
    queryKey: ['team-chat', 'channels'],
    demoQueryFn: getTeamChannels,
    emptyValue: [] as TeamChannel[],
  });
}

export function useTeamDMs() {
  return useDemoQuery({
    queryKey: ['team-chat', 'dms'],
    demoQueryFn: getTeamDMs,
    emptyValue: [] as TeamDM[],
  });
}

export function useChannelMessages(channelId: string) {
  return useDemoQuery({
    queryKey: ['team-chat', 'channel-messages', channelId],
    demoQueryFn: () => getChannelMessages(channelId),
    emptyValue: [] as TeamChatMessage[],
    enabled: !!channelId,
  });
}

export function useDMMessages(dmId: string) {
  return useDemoQuery({
    queryKey: ['team-chat', 'dm-messages', dmId],
    demoQueryFn: () => getDMMessages(dmId),
    emptyValue: [] as TeamChatMessage[],
    enabled: !!dmId,
  });
}
