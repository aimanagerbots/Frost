'use client';

import { useEffect, useCallback } from 'react';
import type { ChatMessage, ConversationState } from '@/lib/concierge-flow';
import { ConciergeChat } from './ConciergeChat';
import { ConciergeInput } from './ConciergeInput';

interface OrderConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  conversationState: ConversationState;
  isTyping: boolean;
  isDone: boolean;
  quickReplies: string[];
  onSend: (message: string) => void;
  onBounceToSms: () => void;
}

export function OrderConcierge({
  isOpen,
  onClose,
  messages,
  conversationState,
  isTyping,
  isDone,
  quickReplies,
  onSend,
  onBounceToSms,
}: OrderConciergeProps) {
  // Escape key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when drawer is open
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer — desktop: right panel, mobile: bottom sheet */}
      <div
        role="dialog"
        aria-label="Frost Concierge"
        aria-modal="true"
        className={`
          fixed z-[70] bg-[#050508] border-white/[0.06] flex flex-col
          transition-transform duration-300 ease-out

          /* Mobile: bottom sheet */
          inset-x-0 bottom-0 h-[85vh] rounded-t-2xl border-t border-x

          /* Desktop: right panel */
          md:inset-x-auto md:right-0 md:top-0 md:bottom-0 md:h-full
          md:w-[440px] md:rounded-t-none md:rounded-l-2xl md:border-t-0 md:border-l md:border-r-0

          ${
            isOpen
              ? 'translate-y-0 md:translate-y-0 md:translate-x-0'
              : 'translate-y-full md:translate-y-0 md:translate-x-full'
          }
        `}
      >
        {/* Mobile drag handle */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5BB8E6] to-[#4A8DB8] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white font-[family-name:var(--font-display)]">
                Frost Concierge
              </h2>
              <p className="text-[10px] text-[#5BB8E6]">
                {isTyping ? 'typing...' : 'online'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {conversationState.phoneNumber && (
              <button
                type="button"
                onClick={onBounceToSms}
                className="text-xs text-[var(--text-muted)] hover:text-[#5BB8E6] transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] cursor-pointer"
              >
                Bounce to SMS 💬
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
              aria-label="Close concierge"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat area */}
        <ConciergeChat
          messages={messages}
          isTyping={isTyping}
          conversationState={conversationState}
        />

        {/* Input */}
        <ConciergeInput
          onSend={onSend}
          quickReplies={quickReplies}
          disabled={isDone}
          placeholder={
            conversationState.step === 'ask-phone'
              ? 'Enter your phone number...'
              : 'Type a message...'
          }
        />
      </div>
    </>
  );
}
