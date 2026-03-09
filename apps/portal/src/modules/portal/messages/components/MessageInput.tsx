'use client';

import { useState, useCallback, type KeyboardEvent } from 'react';
import { SendHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend: (content: string) => void;
  isTyping?: boolean;
}

export function MessageInput({ onSend, isTyping = false }: MessageInputProps) {
  const [value, setValue] = useState('');

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isTyping) return;
    onSend(trimmed);
    setValue('');
  }, [value, isTyping, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="border-t border-border-default bg-card px-5 py-4">
      {/* Typing indicator */}
      {isTyping && (
        <div className="mb-2 flex items-center gap-1.5 text-xs text-text-muted">
          <span>Rep is typing</span>
          <span className="inline-flex gap-0.5">
            <span className="h-1 w-1 animate-bounce rounded-full bg-text-muted [animation-delay:0ms]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-text-muted [animation-delay:150ms]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-text-muted [animation-delay:300ms]" />
          </span>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isTyping ? 'Wait for reply...' : 'Type a message...'}
          disabled={isTyping}
          rows={1}
          className={cn(
            'max-h-32 min-h-[40px] flex-1 resize-none rounded-xl border border-border-default bg-elevated px-4 py-2.5 text-sm text-text-default placeholder:text-text-muted focus:border-accent-primary focus:outline-none focus:ring-1 focus:ring-accent-primary/50',
            isTyping && 'cursor-not-allowed opacity-50'
          )}
        />

        <button
          onClick={handleSend}
          disabled={!value.trim() || isTyping}
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors',
            value.trim() && !isTyping
              ? 'bg-accent-primary text-white hover:bg-accent-primary/80'
              : 'bg-elevated text-text-muted'
          )}
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
