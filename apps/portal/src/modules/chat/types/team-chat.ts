export type TeamMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  language: 'en' | 'es';
  status: 'online' | 'away' | 'offline';
};

export type TeamChannel = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  memberIds: string[];
  moduleLink?: string;
  unreadCount: number;
  lastMessage?: TeamChatMessage;
  createdAt: string;
};

export type TeamDM = {
  id: string;
  participantIds: [string, string];
  unreadCount: number;
  lastMessage?: TeamChatMessage;
};

export type TeamChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  channelId?: string;
  dmId?: string;
  originalText: string;
  translatedText?: string;
  language: 'en' | 'es';
  timestamp: string;
  reactions?: { emoji: string; userIds: string[] }[];
};

export type ChatViewState = {
  activeView: 'channel' | 'dm';
  activeChannelId?: string;
  activeDmId?: string;
  showContextPanel: boolean;
};
