'use client';

import { useTeamChatStore } from '@/modules/chat/store';
import { TeamChatSidebar } from './TeamChatSidebar';
import { TeamChatThread } from './TeamChatThread';
import { TeamChatContextPanel } from './TeamChatContextPanel';

export function TeamChatPage() {
  const activeView = useTeamChatStore((s) => s.activeView);
  const contextPanelOpen = useTeamChatStore((s) => s.contextPanelOpen);

  return (
    <div className="flex flex-1 min-h-0">
      <TeamChatSidebar />
      <TeamChatThread key={`${activeView.type}:${activeView.id}`} />
      {contextPanelOpen && <TeamChatContextPanel />}
    </div>
  );
}
