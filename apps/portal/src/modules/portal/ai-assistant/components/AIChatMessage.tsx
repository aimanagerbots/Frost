'use client';

import { Sparkles, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalAIMessage } from '@/modules/portal/shared/types';
import { AIChatCartAction } from './AIChatCartAction';

interface AIChatMessageProps {
  message: PortalAIMessage;
  onAddToCart?: (action: {
    productId: string;
    productName: string;
    quantity: number;
  }) => void;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function AIChatMessage({ message, onAddToCart }: AIChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-primary/15">
          <Sparkles className="h-4 w-4 text-accent-primary" />
        </div>
      )}

      {/* Message Content */}
      <div
        className={cn(
          'max-w-[80%] space-y-2',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-accent-primary/20 text-text-default'
              : 'bg-elevated text-text-default'
          )}
        >
          {/* Message text — render line breaks and basic markdown bold */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content.split(/(\*\*[^*]+\*\*)/).map((segment, i) => {
              if (segment.startsWith('**') && segment.endsWith('**')) {
                return (
                  <span key={i} className="font-semibold text-text-bright">
                    {segment.slice(2, -2)}
                  </span>
                );
              }
              return <span key={i}>{segment}</span>;
            })}
          </div>
        </div>

        {/* Cart Actions */}
        {message.cartActions && message.cartActions.length > 0 && (
          <div className="space-y-1.5 pl-1">
            {message.cartActions.map((action) => (
              <AIChatCartAction
                key={action.productId}
                action={action}
                onAdd={() => onAddToCart?.(action)}
              />
            ))}
          </div>
        )}

        {/* Template Suggestion */}
        {message.templateSuggestion && (
          <div className="pl-1">
            <button className="flex items-center gap-2 rounded-lg border border-border-default bg-base/50 px-3 py-2 text-xs font-medium text-accent-primary transition-colors hover:bg-accent-primary/10">
              <Bookmark className="h-3.5 w-3.5" />
              Save as Template: {message.templateSuggestion.name}
            </button>
          </div>
        )}

        {/* Timestamp */}
        <p
          className={cn(
            'px-1 text-[11px] text-text-muted',
            isUser ? 'text-right' : 'text-left'
          )}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
