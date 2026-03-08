'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, PanelRightOpen, PanelRightClose, Hash, Users, Paperclip } from 'lucide-react';
import { useTeamChatStore } from '@/modules/chat/store';
import {
  useChannelMessages,
  useDMMessages,
  useTeamChannels,
  useTeamDMs,
  useTeamMembers,
} from '@/modules/chat/hooks/useTeamChat';
import { CURRENT_USER_ID, getTeamMemberById } from '@/mocks/team-chat';
import type { TeamChatMessage as MessageType } from '@/modules/chat/types/team-chat';
import { TeamChatMessage } from './TeamChatMessage';

export function TeamChatThread() {
  const activeView = useTeamChatStore((s) => s.activeView);
  const contextPanelOpen = useTeamChatStore((s) => s.contextPanelOpen);
  const toggleContextPanel = useTeamChatStore((s) => s.toggleContextPanel);

  const { data: channels } = useTeamChannels();
  const { data: dms } = useTeamDMs();
  const { data: members } = useTeamMembers();

  const { data: channelMessages } = useChannelMessages(
    activeView.type === 'channel' ? activeView.id : '',
  );
  const { data: dmMessages } = useDMMessages(
    activeView.type === 'dm' ? activeView.id : '',
  );

  const [localMessages, setLocalMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // The source messages from the query
  const sourceMessages =
    activeView.type === 'channel' ? channelMessages : dmMessages;

  // All messages = source + locally sent
  const allMessages = [...(sourceMessages ?? []), ...localMessages];

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allMessages.length]);

  // Build member status lookup
  const memberStatusMap = new Map(members?.map((m) => [m.id, m.status]));

  // Header info
  let headerTitle = '';
  let headerSub = '';

  if (activeView.type === 'channel') {
    const ch = channels?.find((c) => c.id === activeView.id);
    headerTitle = ch?.displayName ?? '';
    headerSub = `${ch?.memberIds.length ?? 0} members`;
  } else {
    const dm = dms?.find((d) => d.id === activeView.id);
    const otherId = dm?.participantIds.find((id) => id !== 'tm-you');
    const other = otherId ? getTeamMemberById(otherId) : undefined;
    headerTitle = other?.name ?? '';
    headerSub = other?.role ?? '';
  }

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;

    const msg: MessageType = {
      id: `local-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      senderName: 'You',
      channelId: activeView.type === 'channel' ? activeView.id : undefined,
      dmId: activeView.type === 'dm' ? activeView.id : undefined,
      originalText: text,
      language: 'en',
      timestamp: new Date().toISOString(),
    };

    setLocalMessages((prev) => [...prev, msg]);
    setInputValue('');
    inputRef.current?.focus();
  }, [inputValue, activeView]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-1 flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-default px-4 py-2.5">
        <div className="flex items-center gap-2">
          {activeView.type === 'channel' ? (
            <Hash size={16} className="text-text-muted" />
          ) : null}
          <div>
            <div className="text-sm font-semibold text-text-default">
              {headerTitle}
            </div>
            <div className="text-[11px] text-text-muted">{headerSub}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {activeView.type === 'channel' && (
            <button
              className="flex h-7 w-7 items-center justify-center rounded text-text-muted hover:text-text-default transition-colors"
              title="Members"
            >
              <Users size={15} />
            </button>
          )}
          <button
            onClick={toggleContextPanel}
            className="flex h-7 w-7 items-center justify-center rounded text-text-muted hover:text-text-default transition-colors"
            title={contextPanelOpen ? 'Hide details' : 'Show details'}
          >
            {contextPanelOpen ? (
              <PanelRightClose size={15} />
            ) : (
              <PanelRightOpen size={15} />
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-2">
        {allMessages.map((msg) => (
          <TeamChatMessage
            key={msg.id}
            message={msg}
            memberStatus={memberStatusMap.get(msg.senderId)}
          />
        ))}
      </div>

      {/* Input */}
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
            placeholder={
              activeView.type === 'channel'
                ? `Message ${headerTitle}`
                : `Message ${headerTitle}`
            }
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
  );
}
