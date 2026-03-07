'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Leaf, Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSkeleton } from '@/components';
import { matchCultivationChat, getCultivationFallback, getCultivationChat } from '@/mocks/cultivation';
import type { CultivationMessage } from '../../types';

const ACCENT = '#22C55E';

const advisorPrompts = [
  "What's the optimal VPD for Week 6 of flower?",
  'Room 3 humidity is trending high, what should I adjust?',
  'When should I switch Room 4 from veg to flower?',
  'What strains should we consider for next quarter?',
  'How do I optimize DLI for our flowering rooms?',
];

function renderContent(text: string) {
  return text.split('\n').map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={li} className={li > 0 ? 'mt-1.5' : ''}>
        {parts.map((part, pi) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pi} className="font-semibold text-text-bright">{part.slice(2, -2)}</strong>;
          }
          return <span key={pi}>{part}</span>;
        })}
      </p>
    );
  });
}

interface MessageBubbleProps {
  message: CultivationMessage;
  isRevealing: boolean;
}

function MessageBubble({ message, isRevealing }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const timeStr = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={cn(
        'flex gap-3 px-4 py-3 transition-opacity duration-500',
        isUser ? 'flex-row-reverse' : 'flex-row',
        isRevealing && 'animate-in fade-in duration-500',
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
          isUser
            ? 'bg-[#22C55E]/20 text-[#22C55E]'
            : 'bg-white/10 text-text-muted',
        )}
      >
        {isUser ? 'U' : <Bot className="h-4 w-4" />}
      </div>

      <div className={cn('max-w-[75%] space-y-1', isUser ? 'text-right' : 'text-left')}>
        <div className="flex items-center gap-2 text-[11px] text-text-muted">
          <span>{isUser ? 'You' : 'Grow Advisor'}</span>
          <span>{timeStr}</span>
        </div>

        <div
          className={cn(
            'inline-block rounded-xl px-4 py-2.5 text-sm leading-relaxed',
            isUser
              ? 'bg-[#22C55E]/15 text-text-bright'
              : 'bg-white/5 text-text-default',
          )}
        >
          {renderContent(message.content)}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
        <Bot className="h-4 w-4 text-text-muted" />
      </div>
      <div className="flex items-center gap-1 rounded-xl bg-white/5 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block h-2 w-2 rounded-full bg-text-muted"
            style={{
              animation: 'pulse 1.4s infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <div className="border-t border-default p-3">
      <div className="flex items-end gap-2 rounded-xl border border-default bg-base px-3 py-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about feeding, environment, harvest timing..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-text-default placeholder:text-text-muted outline-none disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
            value.trim() && !disabled
              ? 'bg-[#22C55E] text-white hover:bg-[#22C55E]/80'
              : 'bg-white/5 text-text-muted',
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function CultivationChat() {
  const [messages, setMessages] = useState<CultivationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [revealingId, setRevealingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    getCultivationChat().then(() => {
      setIsLoading(false);
    });
  }, []);

  const handleSend = useCallback((text: string) => {
    const userMessage: CultivationMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const matched = matchCultivationChat(text);
      const response = matched
        ? { ...matched, id: `msg-assistant-${Date.now()}`, timestamp: new Date().toISOString() }
        : { ...getCultivationFallback(text), id: `msg-assistant-${Date.now()}` };

      setIsTyping(false);
      setRevealingId(response.id);
      setMessages((prev) => [...prev, response]);

      setTimeout(() => setRevealingId(null), 800);
    }, 1500);
  }, []);

  const handleSuggestionClick = useCallback(
    (text: string) => handleSend(text),
    [handleSend],
  );

  if (isLoading) {
    return <LoadingSkeleton variant="card" count={3} />;
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[500px] flex-col rounded-xl border border-default bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-default p-3">
        <div className="flex items-center gap-2 rounded-lg bg-[#22C55E]/15 px-4 py-2 text-sm font-medium text-[#22C55E]">
          <Leaf className="h-4 w-4" />
          Grow Advisor
        </div>
        <span className="text-xs text-text-muted">Ask AI about cultivation</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${ACCENT}15` }}
            >
              <Leaf className="h-8 w-8" style={{ color: ACCENT }} />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-text-bright">Grow Advisor</h3>
              <p className="mt-1 max-w-md text-sm text-text-muted">
                Ask me about feeding schedules, environment troubleshooting, harvest timing, pest management, or strain recommendations.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {advisorPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(prompt)}
                  className="rounded-full border border-default bg-base px-3 py-1.5 text-xs text-text-muted hover:border-[#22C55E]/30 hover:text-text-default transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-2">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isRevealing={msg.id === revealingId}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        )}
      </div>

      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
}
