'use client';

import type { ChatMessage as ChatMessageType } from '@/modules/chat/types';
import { ACCENT } from '@/design/colors';
import {
  Database, Users, BarChart3, Package, MessageSquare,
  ShieldCheck, Leaf, Factory, DollarSign, Truck, CalendarDays,
} from 'lucide-react';

const SOURCE_ICONS: Record<string, typeof Database> = {
  crm: Users,
  pipeline: BarChart3,
  finance: DollarSign,
  ar: DollarSign,
  manufacturing: Factory,
  cultivation: Leaf,
  coa: ShieldCheck,
  fulfillment: Package,
  operations: BarChart3,
  calendar: CalendarDays,
  marketing: MessageSquare,
  delivery: Truck,
};


interface ChatMessageProps {
  message: ChatMessageType;
  isRevealing?: boolean;
}

export function ChatMessage({ message, isRevealing }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 px-4 py-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isUser ? 'bg-blue-500/20 text-blue-400' : `bg-[${ACCENT}]/20 text-[${ACCENT}]`
        }`}
        style={isUser ? undefined : { backgroundColor: `${ACCENT}20`, color: ACCENT }}
      >
        {isUser ? 'You' : 'AI'}
      </div>

      <div className={`max-w-[80%] space-y-2 ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block rounded-xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-[#5BB8E6]/10 text-text-default'
              : 'bg-card border border-default text-text-default'
          } ${isRevealing ? 'chat-reveal' : ''}`}
        >
          <div className="whitespace-pre-wrap [&_strong]:font-semibold [&_strong]:text-text-bright">
            {message.content.split('\n').map((line, i) => {
              const parts = line.split(/(\*\*[^*]+\*\*)/g);
              return (
                <span key={i}>
                  {i > 0 && <br />}
                  {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={j}>{part.slice(2, -2)}</strong>;
                    }
                    return <span key={j}>{part}</span>;
                  })}
                </span>
              );
            })}
          </div>
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className={`flex flex-wrap gap-1.5 ${isUser ? 'justify-end' : ''}`}>
            {message.sources.map((source) => {
              const Icon = SOURCE_ICONS[source.type] ?? Database;
              return (
                <span
                  key={source.label}
                  className="inline-flex items-center gap-1 rounded-full bg-base border border-default px-2 py-0.5 text-xs text-text-muted"
                >
                  <Icon className="h-3 w-3" />
                  {source.label}
                </span>
              );
            })}
          </div>
        )}

        {message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className={`flex flex-wrap gap-1.5 ${isUser ? 'justify-end' : ''}`}>
            {message.suggestedActions.map((action) => (
              <button
                key={action.route + action.label}
                className="rounded-full border border-[#5BB8E6]/30 bg-[#5BB8E6]/10 px-3 py-1 text-xs font-medium text-[#5BB8E6] transition-colors hover:bg-accent-hover"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes chatReveal {
          from { max-height: 0; opacity: 0; }
          to { max-height: 2000px; opacity: 1; }
        }
        .chat-reveal {
          animation: chatReveal 0.8s ease-out forwards;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
