'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Hash,
  Search,
  Plus,
  Send,
  Paperclip,
  Users,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react';
import { useTeamChannels, useTeamMembers, useChannelMessages } from '@/modules/chat/hooks/useTeamChat';
import { useTeamChatStore } from '@/modules/chat/store';
import { CURRENT_USER_ID } from '@/mocks/team-chat';
import type { TeamChatMessage as MessageType } from '@/modules/chat/types/team-chat';
import { TeamChatMessage } from './TeamChatMessage';
import { TeamChatContextPanel } from './TeamChatContextPanel';

export function ChatRoomPage() {
  const activeView = useTeamChatStore((s) => s.activeView);
  const setActiveView = useTeamChatStore((s) => s.setActiveView);
  const contextPanelOpen = useTeamChatStore((s) => s.contextPanelOpen);
  const toggleContextPanel = useTeamChatStore((s) => s.toggleContextPanel);

  const { data: channels } = useTeamChannels();
  const { data: members } = useTeamMembers();
  const { data: channelMessages } = useChannelMessages(
    activeView.type === 'channel' ? activeView.id : '',
  );

  const [search, setSearch] = useState('');
  const [localMessages, setLocalMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const memberStatusMap = new Map(members?.map((m) => [m.id, m.status]));

  const filteredChannels = (channels ?? []).filter((ch) =>
    ch.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Ensure activeView is a channel on mount
  useEffect(() => {
    if (activeView.type !== 'channel' && channels && channels.length > 0) {
      setActiveView({ type: 'channel', id: channels[0].id });
    }
  }, [activeView.type, channels, setActiveView]);

  const allMessages = [...(channelMessages ?? []), ...localMessages];

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeView.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allMessages.length]);

  // Header info
  const channel = channels?.find((c) => c.id === activeView.id);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;

    const msg: MessageType = {
      id: `local-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      senderName: 'You',
      channelId: activeView.id,
      originalText: text,
      language: 'en',
      timestamp: new Date().toISOString(),
    };

    setLocalMessages((prev) => [...prev, msg]);
    setInputValue('');
    inputRef.current?.focus();
  }, [inputValue, activeView.id]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-1 min-h-0">
      {/* Channel Sidebar */}
      <div className="flex w-[280px] shrink-0 flex-col border-r border-default bg-card">
        <div className="flex items-center justify-between border-b border-default px-4 py-3">
          <h3 className="text-sm font-semibold text-text-default">Chat Rooms</h3>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-accent-hover hover:text-text-default transition-colors"
            title="New room"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="px-3 py-2">
          <div className="flex items-center gap-2 rounded-lg bg-base px-3 py-1.5">
            <Search size={14} className="text-text-muted/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rooms..."
              className="flex-1 bg-transparent text-xs text-text-default placeholder:text-text-muted/50 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChannels.map((ch) => {
            const isActive = activeView.type === 'channel' && activeView.id === ch.id;
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
        </div>
      </div>

      {/* Thread */}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center justify-between border-b border-default px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-text-muted" />
            <div>
              <div className="text-sm font-semibold text-text-default">
                {channel?.displayName ?? ''}
              </div>
              <div className="text-[11px] text-text-muted">
                {channel?.memberIds.length ?? 0} members
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="flex h-7 w-7 items-center justify-center rounded text-text-muted hover:text-text-default transition-colors"
              title="Members"
            >
              <Users size={15} />
            </button>
            <button
              onClick={toggleContextPanel}
              className="flex h-7 w-7 items-center justify-center rounded text-text-muted hover:text-text-default transition-colors"
              title={contextPanelOpen ? 'Hide details' : 'Show details'}
            >
              {contextPanelOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto py-2">
          {allMessages.map((msg) => (
            <TeamChatMessage
              key={msg.id}
              message={msg}
              memberStatus={memberStatusMap.get(msg.senderId)}
            />
          ))}
        </div>

        <div className="border-t border-default p-3">
          <div className="flex items-end gap-2 rounded-xl border border-default bg-base px-3 py-2.5 focus-within:border-[#5BB8E6]/40 transition-colors">
            <button
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-text-muted/40 hover:text-text-muted transition-colors"
              title="Attach file"
            >
              <Paperclip size={15} />
            </button>
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${channel?.displayName ?? ''}`}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-text-default placeholder:text-text-muted/50 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-30"
              style={{ backgroundColor: '#5BB8E6', color: '#000' }}
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Context Panel */}
      {contextPanelOpen && <TeamChatContextPanel />}
    </div>
  );
}
