'use client';

import { Plus, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import type { ChatConversation, ChatSuggestion } from '@/modules/chat/types';

const ACCENT = '#06B6D4';

const CATEGORY_LABELS: Record<string, string> = {
  sales: 'Sales & CRM',
  operations: 'Operations',
  finance: 'Finance',
  cultivation: 'Cultivation',
  general: 'General',
};

interface ChatSidebarProps {
  conversations: ChatConversation[];
  suggestions: ChatSuggestion[];
  activeConversationId: string | null;
  collapsed: boolean;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onSuggestionClick: (text: string) => void;
  onToggleCollapse: () => void;
}

export function ChatSidebar({
  conversations,
  suggestions,
  activeConversationId,
  collapsed,
  onSelectConversation,
  onNewConversation,
  onSuggestionClick,
  onToggleCollapse,
}: ChatSidebarProps) {
  if (collapsed) {
    return (
      <div className="flex w-12 flex-col items-center border-r border-default bg-base py-3 gap-3">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-text-muted hover:text-text-default transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={onNewConversation}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-default hover:bg-elevated transition-colors"
          aria-label="New conversation"
        >
          <Plus size={16} />
        </button>
      </div>
    );
  }

  const grouped = suggestions.reduce<Record<string, ChatSuggestion[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="flex w-[280px] flex-col border-r border-default bg-base">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-default px-3 py-3">
        <button
          onClick={onNewConversation}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:bg-elevated"
          style={{ color: ACCENT }}
        >
          <Plus size={14} />
          New Conversation
        </button>
        <button
          onClick={onToggleCollapse}
          className="p-1 text-text-muted hover:text-text-default transition-colors"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length > 0 && (
          <div className="px-2 py-2">
            <p className="px-2 pb-1 text-[10px] font-medium uppercase tracking-wider text-text-muted">
              Recent
            </p>
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition-colors ${
                  activeConversationId === conv.id
                    ? 'bg-elevated text-text-bright'
                    : 'text-text-muted hover:bg-elevated/50 hover:text-text-default'
                }`}
              >
                <MessageSquare size={14} className="shrink-0" />
                <span className="truncate">{conv.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Suggestions by category */}
        <div className="border-t border-default px-2 py-2">
          <p className="px-2 pb-1 text-[10px] font-medium uppercase tracking-wider text-text-muted">
            Try asking
          </p>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-2">
              <p className="px-2 py-1 text-[10px] text-text-muted/60">
                {CATEGORY_LABELS[category] ?? category}
              </p>
              {items.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSuggestionClick(s.text)}
                  className="flex w-full rounded-lg px-2 py-1.5 text-left text-xs text-text-muted hover:bg-elevated/50 hover:text-text-default transition-colors"
                >
                  {s.text}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
