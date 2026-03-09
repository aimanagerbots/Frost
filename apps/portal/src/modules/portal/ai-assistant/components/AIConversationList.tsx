'use client';

import { Plus, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalAIConversation } from '@/modules/portal/shared/types';

interface AIConversationListProps {
  conversations: PortalAIConversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function AIConversationList({
  conversations,
  selectedId,
  onSelect,
  onNewChat,
}: AIConversationListProps) {
  return (
    <div className="flex h-full flex-col">
      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary/15 px-4 py-2.5 text-sm font-medium text-accent-primary transition-colors hover:bg-accent-primary/25"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {conversations.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-text-muted">
            No conversations yet. Start a new chat!
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => {
              const isSelected = conversation.id === selectedId;
              const messageCount = conversation.messages.length;

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelect(conversation.id)}
                  className={cn(
                    'group relative w-full rounded-lg px-3 py-3 text-left transition-colors',
                    isSelected
                      ? 'bg-accent-primary/10'
                      : 'hover:bg-elevated'
                  )}
                >
                  {/* Accent left border for selected */}
                  {isSelected && (
                    <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-accent-primary" />
                  )}

                  <div className="flex items-start gap-2.5">
                    <MessageSquare
                      className={cn(
                        'mt-0.5 h-4 w-4 shrink-0',
                        isSelected ? 'text-accent-primary' : 'text-text-muted'
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'truncate text-sm font-medium',
                          isSelected ? 'text-text-bright' : 'text-text-default'
                        )}
                      >
                        {conversation.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                        <span>{formatDate(conversation.createdAt)}</span>
                        <span className="text-text-muted/50">·</span>
                        <span>
                          {messageCount} {messageCount === 1 ? 'message' : 'messages'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
