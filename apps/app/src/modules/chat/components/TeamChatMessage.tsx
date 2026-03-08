'use client';

import { Globe } from 'lucide-react';
import { CURRENT_USER_ID } from '@/mocks/team-chat';
import { useTeamChatStore } from '@/modules/chat/store';
import type { TeamChatMessage as MessageType } from '@/modules/chat/types/team-chat';
import { MemberAvatar } from './MemberAvatar';

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

interface TeamChatMessageProps {
  message: MessageType;
  memberStatus?: 'online' | 'away' | 'offline';
}

export function TeamChatMessage({ message, memberStatus }: TeamChatMessageProps) {
  const showOriginal = useTeamChatStore((s) => s.showOriginal);
  const toggleOriginal = useTeamChatStore((s) => s.toggleOriginal);

  const isOwn = message.senderId === CURRENT_USER_ID;
  const hasTranslation = !!message.translatedText;
  const isShowingOriginal = showOriginal.has(message.id);

  const displayText =
    hasTranslation && !isShowingOriginal
      ? message.translatedText!
      : message.originalText;

  const langLabel =
    message.language === 'es' ? 'Translated from Spanish' : 'Translated from English';
  const showOriginalLabel =
    message.language === 'es' ? 'Show original Spanish' : 'Show original English';

  return (
    <div
      className={`group flex gap-3 px-4 py-1.5 hover:bg-card/50 ${
        isOwn ? 'flex-row-reverse' : ''
      }`}
    >
      {!isOwn && (
        <MemberAvatar name={message.senderName} status={memberStatus} />
      )}

      <div className={`max-w-[70%] min-w-0 ${isOwn ? 'items-end' : ''}`}>
        {/* Header: name + timestamp */}
        <div
          className={`mb-0.5 flex items-baseline gap-2 text-xs ${
            isOwn ? 'flex-row-reverse' : ''
          }`}
        >
          <span className="font-semibold text-text-default">
            {isOwn ? 'You' : message.senderName}
          </span>
          <span className="text-text-muted/60">{relativeTime(message.timestamp)}</span>
        </div>

        {/* Message bubble */}
        <div
          className={`rounded-xl px-3.5 py-2 text-sm leading-relaxed ${
            isOwn
              ? 'bg-[#5BB8E6]/15 text-text-default'
              : 'bg-card border border-default text-text-default'
          }`}
        >
          {displayText}
        </div>

        {/* Translation indicator */}
        {hasTranslation && (
          <button
            onClick={() => toggleOriginal(message.id)}
            className="mt-1 flex items-center gap-1 text-[11px] text-text-muted/60 hover:text-text-muted transition-colors"
          >
            <Globe size={11} />
            <span>{isShowingOriginal ? langLabel : showOriginalLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
