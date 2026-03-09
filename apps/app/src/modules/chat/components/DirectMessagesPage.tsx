'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  MessageSquarePlus,
  Send,
  Paperclip,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react';
import { useTeamDMs, useTeamMembers, useDMMessages } from '@/modules/chat/hooks/useTeamChat';
import { useTeamChatStore } from '@/modules/chat/store';
import { CURRENT_USER_ID, getTeamMemberById } from '@/mocks/team-chat';
import type { TeamChatMessage as MessageType } from '@/modules/chat/types/team-chat';
import { TeamChatMessage } from './TeamChatMessage';
import { MemberAvatar } from './MemberAvatar';
import { TeamChatContextPanel } from './TeamChatContextPanel';

export function DirectMessagesPage() {
  const activeView = useTeamChatStore((s) => s.activeView);
  const setActiveView = useTeamChatStore((s) => s.setActiveView);
  const contextPanelOpen = useTeamChatStore((s) => s.contextPanelOpen);
  const toggleContextPanel = useTeamChatStore((s) => s.toggleContextPanel);

  const { data: dms } = useTeamDMs();
  const { data: members } = useTeamMembers();
  const { data: dmMessages } = useDMMessages(
    activeView.type === 'dm' ? activeView.id : '',
  );

  const [search, setSearch] = useState('');
  const [localMessages, setLocalMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const memberMap = new Map(members?.map((m) => [m.id, m]));
  const memberStatusMap = new Map(members?.map((m) => [m.id, m.status]));

  const filteredDMs = (dms ?? []).filter((dm) => {
    const other = dm.participantIds.find((id) => id !== 'tm-you');
    const member = other ? memberMap.get(other) : undefined;
    return member?.name.toLowerCase().includes(search.toLowerCase()) ?? false;
  });

  // Ensure activeView is a DM on mount
  useEffect(() => {
    if (activeView.type !== 'dm' && dms && dms.length > 0) {
      setActiveView({ type: 'dm', id: dms[0].id });
    }
  }, [activeView.type, dms, setActiveView]);

  const allMessages = [...(dmMessages ?? []), ...localMessages];

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeView.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [allMessages.length]);

  // Header info
  const dm = dms?.find((d) => d.id === activeView.id);
  const otherId = dm?.participantIds.find((id) => id !== 'tm-you');
  const otherMember = otherId ? getTeamMemberById(otherId) : undefined;

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;

    const msg: MessageType = {
      id: `local-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      senderName: 'You',
      dmId: activeView.id,
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
      {/* DM Sidebar */}
      <div className="flex w-[280px] shrink-0 flex-col border-r border-default bg-card">
        <div className="flex items-center justify-between border-b border-default px-4 py-3">
          <h3 className="text-sm font-semibold text-text-default">Direct Messages</h3>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-accent-hover hover:text-text-default transition-colors"
            title="New message"
          >
            <MessageSquarePlus size={16} />
          </button>
        </div>

        <div className="px-3 py-2">
          <div className="flex items-center gap-2 rounded-lg bg-base px-3 py-1.5">
            <Search size={14} className="text-text-muted/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people..."
              className="flex-1 bg-transparent text-xs text-text-default placeholder:text-text-muted/50 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredDMs.map((dm) => {
            const otherId = dm.participantIds.find((id) => id !== 'tm-you')!;
            const member = memberMap.get(otherId);
            if (!member) return null;

            const isActive = activeView.type === 'dm' && activeView.id === dm.id;

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

      {/* Thread */}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center justify-between border-b border-default px-4 py-2.5">
          <div className="flex items-center gap-2">
            {otherMember && <MemberAvatar name={otherMember.name} status={otherMember.status} size="sm" />}
            <div>
              <div className="text-sm font-semibold text-text-default">
                {otherMember?.name ?? ''}
              </div>
              <div className="text-[11px] text-text-muted">{otherMember?.role ?? ''}</div>
            </div>
          </div>
          <button
            onClick={toggleContextPanel}
            className="flex h-7 w-7 items-center justify-center rounded text-text-muted hover:text-text-default transition-colors"
            title={contextPanelOpen ? 'Hide details' : 'Show details'}
          >
            {contextPanelOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
          </button>
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
              placeholder={`Message ${otherMember?.name ?? ''}`}
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
