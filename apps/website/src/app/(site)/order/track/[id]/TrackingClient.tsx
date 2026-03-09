'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useOrderStore } from '@/stores/order-store';
import type { OrderStatus, StoreOrderGroup } from '@/types';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'placed', label: 'Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready for Pickup' },
];

const STEP_DELAYS_MS: Record<OrderStatus, number> = {
  placed: 0,
  confirmed: 3_000,
  preparing: 8_000,
  ready: 20_000,
  'picked-up': 0,
};

/* ------------------------------------------------------------------ */
/*  Chat message types                                                 */
/* ------------------------------------------------------------------ */

interface ChatMessage {
  readonly id: string;
  readonly role: 'assistant' | 'user';
  readonly text: string;
  readonly timestamp: Date;
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/* ------------------------------------------------------------------ */
/*  Status helpers                                                     */
/* ------------------------------------------------------------------ */

function stepIndex(status: OrderStatus): number {
  return STEPS.findIndex((s) => s.key === status);
}

function minutesUntilReady(currentStatus: OrderStatus): number {
  const remaining: Record<OrderStatus, number> = {
    placed: 5,
    confirmed: 4,
    preparing: 2,
    ready: 0,
    'picked-up': 0,
  };
  return remaining[currentStatus];
}

/* ------------------------------------------------------------------ */
/*  Sparkle Icon                                                       */
/* ------------------------------------------------------------------ */

function SparkleIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 text-[#5BB8E6]"
    >
      <path
        d="M8 0L9.79 6.21L16 8L9.79 9.79L8 16L6.21 9.79L0 8L6.21 6.21L8 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline                                                           */
/* ------------------------------------------------------------------ */

function Timeline({ currentStatus }: { currentStatus: OrderStatus }) {
  const current = stepIndex(currentStatus);

  return (
    <div className="w-full">
      {/* Desktop horizontal */}
      <div className="hidden sm:flex items-start justify-between relative">
        {STEPS.map((step, i) => {
          const reached = i <= current;
          const active = i === current;
          return (
            <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500
                  ${reached
                    ? 'bg-[#5BB8E6] border-[#5BB8E6] text-black'
                    : 'bg-transparent border-white/20 text-white/30'}
                  ${active ? 'shadow-[0_0_16px_rgba(91,184,230,0.5)] animate-pulse-subtle' : ''}
                `}
              >
                {reached && i < current ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="text-xs font-semibold">{i + 1}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-medium text-center ${
                  reached ? 'text-white' : 'text-white/30'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
        {/* connecting lines */}
        <div className="absolute top-5 left-0 right-0 flex z-0 px-[12.5%]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex-1 h-0.5 transition-all duration-700 ${
                i < current ? 'bg-[#5BB8E6]' : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Mobile vertical */}
      <div className="flex sm:hidden flex-col gap-0">
        {STEPS.map((step, i) => {
          const reached = i <= current;
          const active = i === current;
          const isLast = i === STEPS.length - 1;
          return (
            <div key={step.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-500
                    ${reached
                      ? 'bg-[#5BB8E6] border-[#5BB8E6] text-black'
                      : 'bg-transparent border-white/20 text-white/30'}
                    ${active ? 'shadow-[0_0_16px_rgba(91,184,230,0.5)] animate-pulse-subtle' : ''}
                  `}
                >
                  {reached && i < current ? (
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-[10px] font-semibold">{i + 1}</span>
                  )}
                </div>
                {!isLast && (
                  <div
                    className={`w-0.5 h-8 transition-all duration-700 ${
                      i < current ? 'bg-[#5BB8E6]' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
              <div className={`pt-1 pb-4 ${reached ? 'text-white' : 'text-white/30'}`}>
                <span className="text-sm font-medium">{step.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Order Details Card                                                 */
/* ------------------------------------------------------------------ */

function OrderDetailsCard({
  group,
}: {
  group: StoreOrderGroup;
}) {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(group.storeName + ' ' + group.storeAddress)}`;

  return (
    <div className="bg-card rounded-xl border border-white/[0.06] p-5 space-y-4">
      <h3 className="font-display text-base font-semibold text-white">Order Details</h3>

      {/* Items */}
      <ul className="space-y-2">
        {group.items.map((item) => (
          <li
            key={`${item.productSlug}-${item.storeId}`}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-white/80">
              {item.productName}
              {item.quantity > 1 && (
                <span className="text-white/40 ml-1">&times;{item.quantity}</span>
              )}
            </span>
            <span className="text-white/60 font-mono">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      {/* Subtotal */}
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
        <span className="text-sm font-medium text-white/60">Subtotal</span>
        <span className="text-sm font-semibold text-white font-mono">
          ${group.subtotal.toFixed(2)}
        </span>
      </div>

      {/* Pickup info */}
      <div className="border-t border-white/[0.06] pt-3 space-y-1.5">
        <p className="text-sm text-white/60">
          Pickup at{' '}
          <span className="text-white font-medium">{group.storeName}</span>
        </p>
        <p className="text-sm text-white/40">
          Estimated ready: {group.pickupTime}
        </p>
      </div>

      {/* Directions */}
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-[#5BB8E6]/10 px-4 py-2.5 text-sm font-medium text-[#5BB8E6] hover:bg-[#5BB8E6]/20 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        Get Directions
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chat Panel                                                         */
/* ------------------------------------------------------------------ */

function ChatPanel({
  messages,
  onSend,
}: {
  messages: readonly ChatMessage[];
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  }

  return (
    <div className="bg-card rounded-xl border border-white/[0.06] flex flex-col h-[420px] lg:h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <SparkleIcon />
        <h3 className="font-display text-sm font-semibold text-white">Frost Concierge</h3>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="mt-1">
                <SparkleIcon />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-white/[0.04] text-white/80'
                  : 'bg-[#5BB8E6]/15 text-white/90'
              }`}
            >
              <p>{msg.text}</p>
              <p className="text-[10px] text-white/25 mt-1">{formatTime(msg.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3 border-t border-white/[0.06]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your order..."
          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#5BB8E6]/40 transition-colors"
        />
        <button
          type="submit"
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-[#5BB8E6] text-black hover:bg-[#5BB8E6]/80 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function TrackingClient({ orderId }: { orderId: string }) {
  const activeOrder = useOrderStore((s) => s.activeOrder);
  const [activeTab, setActiveTab] = useState(0);
  const [statusMap, setStatusMap] = useState<Record<string, OrderStatus>>({});
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  /* ── Initialize status map and timers ── */
  useEffect(() => {
    if (!activeOrder) return;

    const initialStatus: Record<string, OrderStatus> = {};
    const initialChat: Record<string, ChatMessage[]> = {};

    for (const group of activeOrder.storeGroups) {
      initialStatus[group.storeId] = 'placed';
      initialChat[group.storeId] = [
        {
          id: makeId(),
          role: 'assistant',
          text: "Your order has been placed! I'll keep you updated.",
          timestamp: new Date(),
        },
      ];
    }

    setStatusMap(initialStatus);
    setChatMessages(initialChat);

    // Schedule status progressions
    const timers: ReturnType<typeof setTimeout>[] = [];

    for (const group of activeOrder.storeGroups) {
      const sid = group.storeId;
      let cumulativeDelay = 0;

      // confirmed
      cumulativeDelay += STEP_DELAYS_MS.confirmed;
      timers.push(
        setTimeout(() => {
          setStatusMap((prev) => ({ ...prev, [sid]: 'confirmed' }));
          setChatMessages((prev) => ({
            ...prev,
            [sid]: [
              ...(prev[sid] ?? []),
              {
                id: makeId(),
                role: 'assistant' as const,
                text: `Great news \u2014 ${group.storeName} has confirmed your order!`,
                timestamp: new Date(),
              },
            ],
          }));
        }, cumulativeDelay),
      );

      // preparing
      cumulativeDelay += STEP_DELAYS_MS.preparing;
      timers.push(
        setTimeout(() => {
          setStatusMap((prev) => ({ ...prev, [sid]: 'preparing' }));
          setChatMessages((prev) => ({
            ...prev,
            [sid]: [
              ...(prev[sid] ?? []),
              {
                id: makeId(),
                role: 'assistant' as const,
                text: 'Your items are being prepared now. Almost ready!',
                timestamp: new Date(),
              },
            ],
          }));
        }, cumulativeDelay),
      );

      // ready
      cumulativeDelay += STEP_DELAYS_MS.ready;
      timers.push(
        setTimeout(() => {
          setStatusMap((prev) => ({ ...prev, [sid]: 'ready' }));
          setChatMessages((prev) => ({
            ...prev,
            [sid]: [
              ...(prev[sid] ?? []),
              {
                id: makeId(),
                role: 'assistant' as const,
                text: `Your order is ready for pickup! Head to ${group.storeName} whenever you're ready.`,
                timestamp: new Date(),
              },
            ],
          }));
        }, cumulativeDelay),
      );
    }

    timersRef.current = timers;
    return () => timers.forEach(clearTimeout);
  }, [activeOrder]);

  /* ── Handle user chat ── */
  function handleSend(storeId: string, text: string) {
    const userMsg: ChatMessage = {
      id: makeId(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    const currentStatus = statusMap[storeId] ?? 'placed';
    const lowered = text.toLowerCase();

    let responseText: string;
    if (lowered.includes('how long') || lowered.includes('how much longer') || lowered.includes('when')) {
      const mins = minutesUntilReady(currentStatus);
      responseText =
        mins > 0
          ? `Your order should be ready in about ${mins} minute${mins !== 1 ? 's' : ''} based on current prep times.`
          : 'Your order is ready for pickup right now!';
    } else {
      const statusLabel = STEPS.find((s) => s.key === currentStatus)?.label ?? currentStatus;
      responseText = `I'm here if you have questions about your order! Your current status is: ${statusLabel}.`;
    }

    const assistantMsg: ChatMessage = {
      id: makeId(),
      role: 'assistant',
      text: responseText,
      timestamp: new Date(),
    };

    setChatMessages((prev) => ({
      ...prev,
      [storeId]: [...(prev[storeId] ?? []), userMsg, assistantMsg],
    }));
  }

  /* ── No order state ── */
  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="font-display text-2xl font-bold text-white">Order Not Found</h1>
          <p className="text-white/50 text-sm">
            We couldn&apos;t find an active order to track.
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 rounded-lg bg-[#5BB8E6] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#5BB8E6]/80 transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  /* ── Resolve active group ── */
  const isMultiStore = activeOrder.storeGroups.length > 1;
  const currentGroup = activeOrder.storeGroups[activeTab];
  const currentStoreId = currentGroup.storeId;
  const currentStatus = statusMap[currentStoreId] ?? 'placed';
  const currentMessages = chatMessages[currentStoreId] ?? [];

  const formattedOrderId = activeOrder.id.toUpperCase().slice(0, 10).padEnd(10, '0');
  const placedAtStr = formatTime(new Date(activeOrder.placedAt));

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/order"
            className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/60 transition-colors mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19L5 12L12 5" />
            </svg>
            Back to menu
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Order {formattedOrderId}
          </h1>
          <p className="text-sm text-white/40 mt-1">Placed at {placedAtStr}</p>
        </div>

        {/* Multi-store tabs */}
        {isMultiStore && (
          <div className="flex gap-1 bg-white/[0.03] rounded-lg p-1 border border-white/[0.06]">
            {activeOrder.storeGroups.map((group, i) => (
              <button
                key={group.storeId}
                onClick={() => setActiveTab(i)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  i === activeTab
                    ? 'bg-[#5BB8E6]/15 text-[#5BB8E6]'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {group.storeName}
              </button>
            ))}
          </div>
        )}

        {/* Timeline */}
        <div className="bg-card rounded-xl border border-white/[0.06] p-5 sm:p-6">
          <Timeline currentStatus={currentStatus} />
        </div>

        {/* Two-column layout: details + chat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <OrderDetailsCard group={currentGroup} />
          <ChatPanel
            messages={currentMessages}
            onSend={(text) => handleSend(currentStoreId, text)}
          />
        </div>
      </div>

      {/* Pulse animation */}
      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% { box-shadow: 0 0 8px rgba(91, 184, 230, 0.3); }
          50% { box-shadow: 0 0 20px rgba(91, 184, 230, 0.6); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
