'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { LoadingSkeleton } from '@/components';
import { useChatConversations, useChatSuggestions } from '@/modules/chat/hooks';
import { matchConversation, getChatFallbackResponse } from '@/mocks/chat';
import { ChatMessage } from './ChatMessage';
import { ChatSidebar } from './ChatSidebar';
import type { ChatMessage as ChatMessageType } from '@/modules/chat/types';
import { ACCENT } from '@/design/colors';


function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}
      >
        AI
      </div>
      <div className="flex items-center gap-1 rounded-xl bg-card border border-default px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-text-muted animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-text-muted animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-text-muted animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export function ChatPage() {
  const { data: conversations, isLoading: convLoading } = useChatConversations();
  const { data: suggestions } = useChatSuggestions();

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [revealingId, setRevealingId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    setInputValue('');
    textareaRef.current?.focus();
  }, []);

  const handleSend = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessageType = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setInputValue('');

    setTimeout(() => {
      const matched = matchConversation(text);
      const response = matched ?? getChatFallbackResponse(text);
      const responseWithId: ChatMessageType = {
        ...response,
        id: `msg-assistant-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      setIsTyping(false);
      setRevealingId(responseWithId.id);
      setMessages((prev) => [...prev, responseWithId]);

      setTimeout(() => setRevealingId(null), 800);
    }, 1500);
  }, []);

  const handleSuggestionClick = useCallback(
    (text: string) => handleSend(text),
    [handleSend],
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  }

  if (convLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
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
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${ACCENT}15` }}
              >
                <MessageSquare className="h-8 w-8" style={{ color: ACCENT }} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-text-bright">Frost AI</h3>
                <p className="mt-1 max-w-md text-sm text-text-muted">
                  Ask me anything about your business — accounts, production, finance,
                  cultivation, deliveries, or strategy. I pull data from every module.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {(suggestions ?? []).slice(0, 8).map((s) => (
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
        <div className="border-t border-default p-4">
          <div className="flex items-end gap-3 rounded-xl border border-default bg-base px-4 py-3 focus-within:border-[#5BB8E6]/40 transition-colors">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your business..."
              disabled={isTyping}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-text-default placeholder:text-text-muted/50 outline-none disabled:opacity-50"
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={isTyping || !inputValue.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-30"
              style={{ backgroundColor: ACCENT, color: '#000' }}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
