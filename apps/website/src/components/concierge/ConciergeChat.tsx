'use client';

import { useEffect, useRef } from 'react';
import type { ChatMessage, ConversationState } from '@/lib/concierge-flow';
import { ConciergeBubble } from './ConciergeBubble';

interface ConciergeChatProps {
  messages: ChatMessage[];
  isTyping: boolean;
  conversationState: ConversationState;
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5 px-4 py-1 justify-start">
      {/* Avatar */}
      <div className="w-6 h-6 rounded-full bg-[#5BB8E6]/15 border border-[#5BB8E6]/30 flex items-center justify-center shrink-0 mt-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#5BB8E6]">
          <path
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      </div>

      <div className="bg-[#111118] border border-white/[0.06] border-l-[#5BB8E6]/50 border-l-2 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#5BB8E6]/60"
            style={{
              animation: 'concierge-bounce 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ConciergeChat({
  messages,
  isTyping,
  conversationState,
}: ConciergeChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages, isTyping]);

  return (
    <>
      {/* Keyframes injected inline — scoped to this component */}
      <style>{`
        @keyframes concierge-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-4 space-y-1 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.08) transparent',
        }}
      >
        {/* Greeting spacer */}
        <div className="h-2" />

        {messages.map((msg) => (
          <ConciergeBubble
            key={msg.id}
            message={msg}
            storeName={conversationState.storeName}
            productName={conversationState.productName}
            productPrice={conversationState.productPrice}
            pickupTime={conversationState.pickupTime}
            phoneNumber={conversationState.phoneNumber}
          />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Bottom spacer */}
        <div className="h-2" />
      </div>
    </>
  );
}
