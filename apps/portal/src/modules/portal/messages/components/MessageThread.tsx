'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { PortalMessage } from '@/modules/portal/shared/types';
import { MessageBubble } from './MessageBubble';

interface MessageThreadProps {
  messages: PortalMessage[];
  className?: string;
}

function formatDateSeparator(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  const stripTime = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = stripTime(now);
  const target = stripTime(date);
  const diffDays = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function groupByDate(
  messages: PortalMessage[]
): { label: string; messages: PortalMessage[] }[] {
  const groups: Map<string, PortalMessage[]> = new Map();

  for (const msg of messages) {
    const dateKey = new Date(msg.timestamp).toDateString();
    const existing = groups.get(dateKey);
    if (existing) {
      existing.push(msg);
    } else {
      groups.set(dateKey, [msg]);
    }
  }

  return Array.from(groups.entries()).map(([dateKey, msgs]) => ({
    label: formatDateSeparator(dateKey),
    messages: msgs,
  }));
}

export function MessageThread({ messages, className }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const dateGroups = groupByDate(messages);

  return (
    <div className={cn('overflow-y-auto px-5 py-4', className)}>
      {dateGroups.map((group) => (
        <div key={group.label}>
          {/* Date separator */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border-default" />
            <span className="text-xs font-medium text-text-muted">
              {group.label}
            </span>
            <div className="h-px flex-1 bg-border-default" />
          </div>

          {/* Messages in this date group */}
          <div className="space-y-3">
            {group.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        </div>
      ))}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
