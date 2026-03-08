'use client';

import { Bot, Users } from 'lucide-react';
import { useTeamChatStore } from '@/modules/chat/store';
import { ChatPage as AIChatPage } from './ChatPage';
import { TeamChatPage } from './TeamChatPage';
import { ACCENT } from '@/design/colors';


const TABS = [
  { id: 'ai' as const, label: 'AI Chat', Icon: Bot },
  { id: 'team' as const, label: 'Team Chat', Icon: Users },
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

  if (activeTab === 'ai') {
    return (
      <div>
        <TabBar />
        <AIChatPage />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] min-h-[500px] flex-col rounded-xl border border-default bg-card overflow-hidden">
      <TabBar />
      <TeamChatPage />
    </div>
  );
}
