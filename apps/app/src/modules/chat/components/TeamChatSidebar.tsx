'use client';

import { useState } from 'react';
import { Hash, Search, MessageSquarePlus } from 'lucide-react';
import { useTeamChannels, useTeamDMs, useTeamMembers } from '@/modules/chat/hooks/useTeamChat';
import { useTeamChatStore } from '@/modules/chat/store';
import { MemberAvatar } from './MemberAvatar';

export function TeamChatSidebar() {
  const [search, setSearch] = useState('');
  const { data: channels } = useTeamChannels();
  const { data: dms } = useTeamDMs();
  const { data: members } = useTeamMembers();

  const activeView = useTeamChatStore((s) => s.activeView);
  const setActiveView = useTeamChatStore((s) => s.setActiveView);

  const memberMap = new Map(members?.map((m) => [m.id, m]));

  const filteredChannels = (channels ?? []).filter((ch) =>
    ch.name.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredDMs = (dms ?? []).filter((dm) => {
    const other = dm.participantIds.find((id) => id !== 'tm-you');
    const member = other ? memberMap.get(other) : undefined;
    return member?.name.toLowerCase().includes(search.toLowerCase()) ?? false;
  });

  return (
    <div className="flex w-[280px] shrink-0 flex-col border-r border-default bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-default px-4 py-3">
        <h3 className="text-sm font-semibold text-text-default">Messages</h3>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-accent-hover hover:text-text-default transition-colors"
          title="New message"
        >
          <MessageSquarePlus size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 rounded-lg bg-base px-3 py-1.5">
          <Search size={14} className="text-text-muted/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-xs text-text-default placeholder:text-text-muted/50 outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Channels */}
        <div className="px-3 pt-2 pb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted/60">
            Channels
          </span>
        </div>
        {filteredChannels.map((ch) => {
          const isActive =
            activeView.type === 'channel' && activeView.id === ch.id;
          return (
            <button
              key={ch.id}
              onClick={() => setActiveView({ type: 'channel', id: ch.id })}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors ${
                isActive
                  ? 'bg-[#5BB8E6]/10 text-text-default'
                  : 'text-text-muted hover:bg-accent-hover hover:text-text-default'
              }`}
            >
              <Hash size={14} className="shrink-0 opacity-60" />
              <span className="flex-1 truncate">{ch.name}</span>
              {ch.unreadCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500/80 px-1 text-[10px] font-bold text-white">
                  {ch.unreadCount}
                </span>
              )}
            </button>
          );
        })}

        {/* Direct Messages */}
        <div className="px-3 pt-4 pb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted/60">
            Direct Messages
          </span>
        </div>
        {filteredDMs.map((dm) => {
          const otherId = dm.participantIds.find((id) => id !== 'tm-you')!;
          const member = memberMap.get(otherId);
          if (!member) return null;

          const isActive =
            activeView.type === 'dm' && activeView.id === dm.id;

          return (
            <button
              key={dm.id}
              onClick={() => setActiveView({ type: 'dm', id: dm.id })}
              className={`flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm transition-colors ${
                isActive
                  ? 'bg-[#5BB8E6]/10 text-text-default'
                  : 'text-text-muted hover:bg-accent-hover hover:text-text-default'
              }`}
            >
              <MemberAvatar name={member.name} status={member.status} size="sm" />
              <span className="flex-1 truncate">{member.name}</span>
              {dm.unreadCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500/80 px-1 text-[10px] font-bold text-white">
                  {dm.unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
