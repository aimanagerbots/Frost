'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Leaf, Languages, Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSkeleton } from '@/components';
import { matchCultivationChat, getCultivationFallback, getCultivationChat } from '@/mocks/cultivation';
import type { CultivationMessage } from '../../types';
import { useCultivationStore } from '../../store';

// ─── Accent ────────────────────────────────────────────────────
const ACCENT = '#22C55E';

// ─── Suggested Prompts ────────────────────────────────────────
const advisorPrompts = [
  "What's the feeding schedule for Bloom A this week?",
  'Room 2 humidity is high, what should I do?',
  'When should we harvest Room 3?',
  'What strains should we consider for next quarter?',
  'Show me environment trends for Bloom A',
];

const translatorPrompts = [
  { en: 'The plants in Room 2 need more nitrogen', es: 'Las plantas del cuarto 2 necesitan más nitrógeno' },
  { en: 'Increase airflow — humidity is too high', es: 'Aumenta la circulación — la humedad está muy alta' },
  { en: 'Harvest Room 3 on Friday', es: 'Cosechar el cuarto 3 el viernes' },
  { en: 'Check the trichomes before cutting', es: 'Revisa los tricomas antes de cortar' },
];

// ─── Markdown-lite renderer ───────────────────────────────────
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

// ─── Message Bubble ───────────────────────────────────────────
interface MessageBubbleProps {
  message: CultivationMessage;
  isTranslator: boolean;
  isRevealing: boolean;
}

function MessageBubble({ message, isTranslator, isRevealing }: MessageBubbleProps) {
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
      {/* Avatar */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
          isUser
            ? 'bg-[#22C55E]/20 text-[#22C55E]'
            : 'bg-white/10 text-text-muted',
        )}
      >
        {isUser ? (isTranslator ? 'W' : 'U') : (isTranslator ? 'M' : <Bot className="h-4 w-4" />)}
      </div>

      {/* Bubble */}
      <div className={cn('max-w-[75%] space-y-1', isUser ? 'text-right' : 'text-left')}>
        {/* Role label */}
        <div className="flex items-center gap-2 text-[11px] text-text-muted">
          {isUser
            ? <span>{isTranslator ? 'Worker' : 'You'}</span>
            : <span>{isTranslator ? 'Manager' : 'Grow Advisor'}</span>
          }
          {isTranslator && (
            <span
              className={cn(
                'rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase',
                message.language === 'en'
                  ? 'bg-blue-500/15 text-blue-400'
                  : 'bg-orange-500/15 text-orange-400',
              )}
            >
              {message.language === 'en' ? 'EN' : 'ES'}
            </span>
          )}
          <span>{timeStr}</span>
        </div>

        {/* Content */}
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

        {/* Translated content (translator mode only) */}
        {isTranslator && message.translatedContent && (
          <div className="mt-1">
            <span
              className={cn(
                'mb-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase',
                message.language === 'en'
                  ? 'bg-orange-500/15 text-orange-400'
                  : 'bg-blue-500/15 text-blue-400',
              )}
            >
              {message.language === 'en' ? 'ES' : 'EN'}
            </span>
            <div
              className={cn(
                'inline-block rounded-xl px-4 py-2.5 text-sm leading-relaxed',
                'bg-white/[0.03] text-text-muted italic',
              )}
            >
              {renderContent(message.translatedContent)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────
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

// ─── Chat Input ───────────────────────────────────────────────
interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder: string;
}

function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
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
          placeholder={placeholder}
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

// ─── Main Component ───────────────────────────────────────────
export function CultivationChat() {
  const { chatMode, setChatMode } = useCultivationStore();
  const isTranslator = chatMode === 'translator';

  const [messages, setMessages] = useState<CultivationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [revealingId, setRevealingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Load initial data when mode changes
  const loadChat = useCallback((mode: typeof chatMode) => {
    setIsLoading(true);
    setMessages([]);

    getCultivationChat(mode).then((data) => {
      // Only pre-fill messages in translator mode (demo conversation)
      if (mode === 'translator') {
        setMessages(data.messages);
      }
      setIsLoading(false);
    });
  }, []);

  // Trigger load on mount and mode change
  const prevModeRef = useRef(chatMode);
  useEffect(() => {
    if (prevModeRef.current !== chatMode || messages.length === 0) {
      prevModeRef.current = chatMode;
      loadChat(chatMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMode]);

  // ── Send handler ────────────────────────────────────────────
  const handleSend = useCallback(
    (text: string) => {
      const detectLanguage = (input: string): 'en' | 'es' => {
        const esIndicators = /[áéíóúñ¿¡]|(\b(el|la|los|las|de|del|en|que|por|para|con|una|uno|es|está|son|cuarto|plantas|alimentación)\b)/i;
        return esIndicators.test(input) ? 'es' : 'en';
      };

      const userLang = detectLanguage(text);
      const userMessage: CultivationMessage = {
        id: `msg-user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
        language: userLang,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      setTimeout(() => {
        let response: CultivationMessage;

        if (isTranslator) {
          // In translator mode, respond with a "translation"
          const responseLang: 'en' | 'es' = userLang === 'en' ? 'es' : 'en';
          const fallback = getCultivationFallback(text);
          response = {
            ...fallback,
            id: `msg-assistant-${Date.now()}`,
            timestamp: new Date().toISOString(),
            language: responseLang,
            content: responseLang === 'es'
              ? `Traducción: "${text}"\n\nEl mensaje ha sido traducido y enviado al equipo de cultivo.`
              : `Translation: "${text}"\n\nThe message has been translated and sent to the grow team.`,
            translatedContent: text,
          };
        } else {
          // Grow advisor: try match first, then fallback
          const matched = matchCultivationChat(text);
          response = matched
            ? { ...matched, id: `msg-assistant-${Date.now()}`, timestamp: new Date().toISOString() }
            : { ...getCultivationFallback(text), id: `msg-assistant-${Date.now()}` };
        }

        setIsTyping(false);
        setRevealingId(response.id);
        setMessages((prev) => [...prev, response]);

        setTimeout(() => setRevealingId(null), 800);
      }, 1500);
    },
    [isTranslator],
  );

  const handleSuggestionClick = useCallback(
    (text: string) => handleSend(text),
    [handleSend],
  );

  // ── Loading state ───────────────────────────────────────────
  if (isLoading) {
    return <LoadingSkeleton variant="card" count={3} />;
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[500px] flex-col rounded-xl border border-default bg-card overflow-hidden">
      {/* ── Mode Toggle ───────────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-default p-3">
        <button
          onClick={() => setChatMode('cultivation-ai')}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            !isTranslator
              ? 'bg-[#22C55E]/15 text-[#22C55E]'
              : 'text-text-muted hover:text-text-default hover:bg-white/5',
          )}
        >
          <Leaf className="h-4 w-4" />
          Grow Advisor
        </button>
        <button
          onClick={() => setChatMode('translator')}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            isTranslator
              ? 'bg-[#22C55E]/15 text-[#22C55E]'
              : 'text-text-muted hover:text-text-default hover:bg-white/5',
          )}
        >
          <Languages className="h-4 w-4" />
          Translator
        </button>
      </div>

      {/* ── Messages ──────────────────────────────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
            {/* Empty state icon */}
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${ACCENT}15` }}
            >
              {isTranslator
                ? <Languages className="h-8 w-8" style={{ color: ACCENT }} />
                : <Leaf className="h-8 w-8" style={{ color: ACCENT }} />
              }
            </div>

            {/* Description */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-text-bright">
                {isTranslator ? 'Cultivation Translator' : 'Grow Advisor'}
              </h3>
              <p className="mt-1 max-w-md text-sm text-text-muted">
                {isTranslator
                  ? 'Bridge the language gap between managers and grow staff. Type in English or Spanish and get instant translations with cultivation context.'
                  : 'Ask me about feeding schedules, environment troubleshooting, harvest timing, pest management, or strain recommendations.'}
              </p>
            </div>

            {/* Suggested prompts */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {isTranslator
                ? translatorPrompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(p.en)}
                      className="rounded-full border border-default bg-base px-3 py-1.5 text-xs text-text-muted hover:border-[#22C55E]/30 hover:text-text-default transition-colors"
                    >
                      {p.en}
                      <span className="mx-1.5 text-text-muted/40">|</span>
                      <span className="italic">{p.es}</span>
                    </button>
                  ))
                : advisorPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(prompt)}
                      className="rounded-full border border-default bg-base px-3 py-1.5 text-xs text-text-muted hover:border-[#22C55E]/30 hover:text-text-default transition-colors"
                    >
                      {prompt}
                    </button>
                  ))
              }
            </div>
          </div>
        ) : (
          <div className="py-2">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isTranslator={isTranslator}
                isRevealing={msg.id === revealingId}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* ── Input ─────────────────────────────────────────────── */}
      <ChatInput
        onSend={handleSend}
        disabled={isTyping}
        placeholder={
          isTranslator
            ? 'Type in English or Spanish...'
            : 'Ask about feeding, environment, harvest timing...'
        }
      />
    </div>
  );
}
