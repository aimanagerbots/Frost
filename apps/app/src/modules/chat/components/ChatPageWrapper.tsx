'use client';

import { Bot, Hash, MessageCircle } from 'lucide-react';
import { useTeamChatStore } from '@/modules/chat/store';
import { ChatPage as AIChatPage } from './ChatPage';
import { DirectMessagesPage } from './DirectMessagesPage';
import { ChatRoomPage } from './ChatRoomPage';
import { ACCENT } from '@/design/colors';

const TABS = [
  { id: 'dm' as const, label: 'Direct Messages', Icon: MessageCircle },
  { id: 'room' as const, label: 'Chat Rooms', Icon: Hash },
  { id: 'ai' as const, label: 'AI Chat', Icon: Bot },
];

function TabBar() {
  const activeTab = useTeamChatStore((s) => s.activeTab);
  const setActiveTab = useTeamChatStore((s) => s.setActiveTab);

  return (
    <div className="flex items-center gap-1 px-4 py-2">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? 'text-white'
                : 'text-text-muted hover:text-text-default hover:bg-accent-hover'
            }`}
            style={isActive ? { backgroundColor: ACCENT } : undefined}
          >
            <Icon size={14} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function ChatPage() {
  const activeTab = useTeamChatStore((s) => s.activeTab);

  return (
    <div className="flex h-[calc(100vh-7rem)] min-h-[500px] flex-col rounded-xl border border-default bg-card overflow-hidden">
      <TabBar />
      {activeTab === 'ai' && <AIChatPage />}
      {activeTab === 'dm' && <DirectMessagesPage />}
      {activeTab === 'room' && <ChatRoomPage />}
    </div>
  );
}
