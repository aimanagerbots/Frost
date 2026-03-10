'use client';

import { useState, useCallback, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIChatInputProps {
  onSend: (message: string) => void;
  isTyping: boolean;
}

const SUGGESTED_PROMPTS = [
  'Reorder my last order',
  "What's new this week?",
  'Show me current deals',
  "What's popular right now?",
  'Help me build an order',
];

export function AIChatInput({ onSend, isTyping }: AIChatInputProps) {
  const [value, setValue] = useState('');

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isTyping) return;
    onSend(trimmed);
    setValue('');
  }, [value, isTyping, onSend]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handlePromptClick(prompt: string) {
    if (isTyping) return;
    onSend(prompt);
  }

  const showSuggestions = value.trim().length === 0;

  return (
    <div className="space-y-3">
      {/* Suggested Prompts */}
      {showSuggestions && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handlePromptClick(prompt)}
              disabled={isTyping}
              className="rounded-full border border-border-default bg-elevated px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-accent-primary/40 hover:text-accent-primary disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2 rounded-xl border border-border-default bg-elevated p-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Frost AI anything..."
          rows={1}
          disabled={isTyping}
          className={cn(
            'flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-text-default',
            'placeholder:text-text-muted focus:outline-none disabled:opacity-50',
            'max-h-32 min-h-[36px]'
          )}
          style={{ fieldSizing: 'content' } as React.CSSProperties}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isTyping}
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
            value.trim() && !isTyping
              ? 'bg-accent-primary text-black hover:bg-accent-primary/80'
              : 'bg-elevated text-text-muted cursor-not-allowed'
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
