'use client';

import { useState, useRef, useCallback } from 'react';

interface ConciergeInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  quickReplies?: string[];
  disabled?: boolean;
}

export function ConciergeInput({
  onSend,
  placeholder = 'Type a message...',
  quickReplies = [],
  disabled = false,
}: ConciergeInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    inputRef.current?.focus();
  }, [value, disabled, onSend]);

  const handleQuickReply = useCallback(
    (reply: string) => {
      if (disabled) return;
      onSend(reply);
    },
    [disabled, onSend],
  );

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
    <div className="border-t border-white/[0.06] bg-[#0A0A0F]/80 backdrop-blur-sm">
      {/* Quick replies */}
      {quickReplies.length > 0 && !disabled && (
        <div className="flex gap-2 px-4 pt-3 pb-1 overflow-x-auto scrollbar-none">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => handleQuickReply(reply)}
              className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium border border-[#5BB8E6]/30 text-[#5BB8E6] bg-[#5BB8E6]/[0.06] hover:bg-[#5BB8E6]/15 hover:border-[#5BB8E6]/50 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2 px-4 py-3">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Conversation ended' : placeholder}
          disabled={disabled}
          className="flex-1 bg-[#111118] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-[var(--text-default)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#5BB8E6]/40 focus:ring-1 focus:ring-[#5BB8E6]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="w-10 h-10 rounded-xl bg-[#5BB8E6] flex items-center justify-center shrink-0 hover:bg-[#4AA8D6] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12H19M19 12L13 6M19 12L13 18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
