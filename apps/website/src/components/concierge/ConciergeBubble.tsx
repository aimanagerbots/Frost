'use client';

import { useEffect, useRef } from 'react';
import type { ChatMessage } from '@/lib/concierge-flow';
import { ConciergeOrderSummary } from './ConciergeOrderSummary';

interface ConciergeBubbleProps {
  message: ChatMessage;
  storeName?: string;
  productName?: string;
  productPrice?: number;
  pickupTime?: string;
  phoneNumber?: string;
}

function formatTimestamp(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function ConciergeBubble({
  message,
  storeName = '',
  productName = '',
  productPrice = 0,
  pickupTime = '',
  phoneNumber = '',
}: ConciergeBubbleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = message.role === 'user' ? 'translateX(12px)' : 'translateX(-12px)';
    const frame = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.35s ease-out, transform 0.35s ease-out';
      el.style.opacity = '1';
      el.style.transform = 'translateX(0)';
    });
    return () => cancelAnimationFrame(frame);
  }, [message.role]);

  if (message.role === 'system') {
    return (
      <div ref={ref} className="flex justify-center py-3 px-4">
        <span className="text-xs text-[var(--text-muted)] bg-white/[0.03] rounded-full px-4 py-1.5 border border-white/[0.06]">
          {message.content}
        </span>
      </div>
    );
  }

  if (message.component === 'order-summary') {
    return (
      <div ref={ref} className="flex gap-2.5 px-4 py-1">
        <div className="w-6 shrink-0" />
        <ConciergeOrderSummary
          storeName={storeName}
          productName={productName}
          price={productPrice}
          pickupTime={pickupTime}
          phoneNumber={phoneNumber}
        />
      </div>
    );
  }

  const isAssistant = message.role === 'assistant';

  return (
    <div
      ref={ref}
      className={`flex gap-2.5 px-4 py-1 ${isAssistant ? 'justify-start' : 'justify-end'}`}
    >
      {isAssistant && (
        <div className="w-6 h-6 rounded-full bg-[#5BB8E6]/15 border border-[#5BB8E6]/30 flex items-center justify-center shrink-0 mt-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#5BB8E6]">
            <path
              d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
              fill="currentColor"
              opacity="0.9"
            />
          </svg>
        </div>
      )}

      <div className="flex flex-col gap-0.5 max-w-[80%]">
        <div
          className={
            isAssistant
              ? 'bg-[#111118] border border-white/[0.06] border-l-[#5BB8E6]/50 border-l-2 rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed text-[var(--text-default)]'
              : 'bg-[#5BB8E6]/[0.12] border border-[#5BB8E6]/20 rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed text-[var(--text-default)]'
          }
          dangerouslySetInnerHTML={{
            __html: message.content
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-medium">$1</strong>'),
          }}
        />
        <span
          className={`text-[10px] text-[var(--text-muted)] opacity-60 ${isAssistant ? 'ml-1' : 'mr-1 text-right'}`}
        >
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
