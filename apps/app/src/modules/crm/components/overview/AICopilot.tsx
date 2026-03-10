'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { LoadingSkeleton } from '@/components';
import type { CopilotMessage } from '@/modules/crm/types';
import { useCopilotConversations, useCopilotSuggestions } from '@/modules/crm/hooks/copilot-territory-hooks';
import { matchConversation, getFallbackResponse } from '@/mocks/crm-copilot';
import { ChatMessage } from './copilot/ChatMessage';
import { ChatInput } from './copilot/ChatInput';
import { ConversationSidebar } from './copilot/ConversationSidebar';
import { TypingIndicator } from './copilot/TypingIndicator';

export function AICopilot() {
  const { data: conversations, isLoading: convLoading } = useCopilotConversations();
  const { data: suggestions } = useCopilotSuggestions();

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [revealingId, setRevealingId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      const conv = conversations?.find((c) => c.id === id);
      if (conv) {
        setActiveConversationId(id);
        setMessages([...conv.messages]);
        setIsTyping(false);
        setRevealingId(null);
      }
    },
    [conversations],
  );

  const handleNewConversation = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
    setIsTyping(false);
    setRevealingId(null);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      const userMessage: CopilotMessage = {
        id: `msg-user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      // Simulate AI response after delay
      setTimeout(() => {
        const matched = matchConversation(text);
        const response = matched ?? getFallbackResponse(text);
        const responseWithId: CopilotMessage = {
          ...response,
          id: `msg-assistant-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };

        setIsTyping(false);
        setRevealingId(responseWithId.id);
        setMessages((prev) => [...prev, responseWithId]);

        // Clear reveal animation after it plays
        setTimeout(() => setRevealingId(null), 800);
      }, 1500);
    },
    [],
  );

  const handleSuggestionClick = useCallback(
    (text: string) => {
      handleSend(text);
    },
    [handleSend],
  );

  if (convLoading) {
    return <LoadingSkeleton variant="card" count={3} />;
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[500px] rounded-xl bg-card overflow-hidden">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations ?? []}
        suggestions={suggestions ?? []}
        activeConversationId={activeConversationId}
        collapsed={sidebarCollapsed}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onSuggestionClick={handleSuggestionClick}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5BB8E6]/10">
                <Bot className="h-8 w-8 text-[#5BB8E6]" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-text-bright">Frost AI Copilot</h3>
                <p className="mt-1 max-w-md text-sm text-text-muted">
                  Ask me about any account, product, or market trend. I can draft emails,
                  forecast reorders, compare accounts, and suggest strategies.
                </p>
              </div>
              {/* Quick suggestions */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {(suggestions ?? []).slice(0, 6).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSuggestionClick(s.text)}
                    className="rounded-full border border-default bg-base px-3 py-1.5 text-xs text-text-muted hover:border-[#5BB8E6]/30 hover:text-text-default transition-colors"
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-2">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isRevealing={msg.id === revealingId}
                />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
}
