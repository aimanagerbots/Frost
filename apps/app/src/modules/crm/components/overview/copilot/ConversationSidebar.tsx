'use client';

import { Plus, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CopilotSuggestion } from '@/modules/crm/types';
import type { CopilotConversation } from '@/mocks/crm-copilot';

const CATEGORY_LABELS: Record<string, string> = {
  'account-briefing': 'Account Briefings',
  comparative: 'Comparisons',
  communication: 'Communications',
  forecasting: 'Forecasting',
  strategy: 'Strategy',
  'data-query': 'Data Queries',
};

interface ConversationSidebarProps {
  conversations: CopilotConversation[];
  suggestions: CopilotSuggestion[];
  activeConversationId: string | null;
  collapsed: boolean;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onSuggestionClick: (text: string) => void;
  onToggleCollapse: () => void;
}

export function ConversationSidebar({
  conversations,
  suggestions,
  activeConversationId,
  collapsed,
  onSelectConversation,
  onNewConversation,
  onSuggestionClick,
  onToggleCollapse,
}: ConversationSidebarProps) {
  // Group suggestions by category
  const grouped = suggestions.reduce<Record<string, CopilotSuggestion[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  if (collapsed) {
    return (
      <div className="flex w-10 flex-col items-center border-r border-default bg-base py-3">
        <button
          onClick={onToggleCollapse}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-card hover:text-text-default transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-[280px] shrink-0 flex-col border-r border-default bg-base">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-default px-3 py-3">
        <button
          onClick={onNewConversation}
          className="flex items-center gap-2 rounded-lg bg-[#5BB8E6] px-3 py-1.5 text-xs font-medium text-black hover:opacity-90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New Chat
        </button>
        <button
          onClick={onToggleCollapse}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:bg-card hover:text-text-default transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Recent Conversations
          </p>
          <div className="space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                  activeConversationId === conv.id
                    ? 'bg-[#5BB8E6]/10 text-[#5BB8E6]'
                    : 'text-text-muted hover:bg-card hover:text-text-default'
                }`}
              >
                <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-2">{conv.preview}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Prompts */}
        <div className="border-t border-default px-3 py-2">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Suggested Prompts
          </p>
          <div className="space-y-3">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="mb-1 text-[10px] font-medium text-text-muted/70">
                  {CATEGORY_LABELS[category] ?? category}
                </p>
                <div className="space-y-0.5">
                  {items.slice(0, 2).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onSuggestionClick(s.text)}
                      className="w-full rounded-md px-2 py-1 text-left text-[11px] text-text-muted hover:bg-card hover:text-text-default transition-colors"
                    >
                      {s.text}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
