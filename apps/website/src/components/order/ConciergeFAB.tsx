'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useOrderStore, useCartItemCount } from '@/stores/order-store';

/* ------------------------------------------------------------------ */
/*  Canned responses for browse mode                                   */
/* ------------------------------------------------------------------ */

const BROWSE_RESPONSES: Record<string, string> = {
  relax:
    "For relaxation, I'd recommend our **indica** strains — Wedding Cake and Granddaddy Purple are popular picks. Check the Indica filter to browse them all!",
  energy:
    "Looking for energy? Our **sativa** strains like Blue Dream and Jack Herer are great for daytime use. Filter by Sativa to see what's near you.",
  sleep:
    "For sleep, try our **indica** options — Northern Lights and Granddaddy Purple are customer favorites. They're usually available at most partner stores.",
  edible:
    "Our edibles range from gummies to chocolates, with doses starting at 5mg THC. Great for beginners! Check the Edibles category in the filter.",
  beginner:
    "Welcome! I'd suggest starting with a **hybrid** strain or a low-dose edible (5-10mg). Hybrids give you a balanced experience without being too intense.",
  deal: "Check out our partner stores — many have exclusive Frost deals! Switch to 'Browse by Store' to see featured deals at each location.",
};

function getBrowseResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('relax') || lower.includes('calm') || lower.includes('chill'))
    return BROWSE_RESPONSES.relax;
  if (lower.includes('energy') || lower.includes('energi') || lower.includes('uplift') || lower.includes('focus'))
    return BROWSE_RESPONSES.energy;
  if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('night'))
    return BROWSE_RESPONSES.sleep;
  if (lower.includes('edible') || lower.includes('gumm') || lower.includes('chocolate'))
    return BROWSE_RESPONSES.edible;
  if (lower.includes('beginner') || lower.includes('first time') || lower.includes('new to'))
    return BROWSE_RESPONSES.beginner;
  if (lower.includes('deal') || lower.includes('discount') || lower.includes('sale'))
    return BROWSE_RESPONSES.deal;
  return "I can help you find the perfect product! Try asking about relaxation, energy, sleep, edibles, or deals. You can also use the filters above to narrow down by category and strain type.";
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Message {
  readonly id: string;
  readonly role: 'assistant' | 'user';
  readonly content: string;
  readonly timestamp: Date;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ConciergeFAB() {
  const { isConciergeOpen, setConciergeOpen } = useOrderStore();
  const cartCount = useCartItemCount();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content:
        "Hey! I'm your Frost concierge. Looking for something specific? I can help you find the right product.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate response delay
    setTimeout(() => {
      const response = getBrowseResponse(userMsg.content);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        },
      ]);
    }, 600 + Math.random() * 600);
  }, [input]);

  const quickReplies = [
    'Best for relaxation',
    'Something energizing',
    'Edibles for beginners',
    'Any deals?',
  ];

  return (
    <>
      {/* Floating button */}
      {!isConciergeOpen && (
        <button
          onClick={() => setConciergeOpen(true)}
          className={`fixed z-40 flex items-center gap-2.5 bg-[#0A0A0F] border border-white/[0.1] text-text-default rounded-full pl-4 pr-5 py-3 shadow-xl hover:border-[#5BB8E6]/30 transition-all duration-300 hover:shadow-[#5BB8E6]/10 font-sans text-sm ${
            cartCount > 0 ? 'bottom-20 right-6' : 'bottom-6 right-6'
          }`}
        >
          <span className="relative flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5BB8E6]/30" />
            <svg
              className="relative w-5 h-5 text-[#5BB8E6]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
              />
            </svg>
          </span>
          Need help?
        </button>
      )}

      {/* Chat drawer */}
      {isConciergeOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 md:bg-transparent md:pointer-events-none"
            onClick={() => setConciergeOpen(false)}
          />

          {/* Panel */}
          <div className="fixed z-50 bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[400px] md:max-h-[600px] h-[85vh] md:h-auto md:rounded-2xl bg-[#0A0A0F] border border-white/[0.08] shadow-2xl flex flex-col overflow-hidden md:animate-none">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#5BB8E6]/15 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#5BB8E6]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-base text-text-bright">Frost Concierge</h3>
                  <p className="text-xs text-text-muted font-sans">AI shopping assistant</p>
                </div>
              </div>
              <button
                onClick={() => setConciergeOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-default hover:bg-white/[0.06] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-sans leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#5BB8E6] text-black rounded-br-md'
                        : 'bg-white/[0.04] text-text-default rounded-bl-md border border-white/[0.06]'
                    }`}
                  >
                    {msg.content.split('**').map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className={msg.role === 'user' ? 'font-bold' : 'text-[#5BB8E6] font-semibold'}>
                          {part}
                        </strong>
                      ) : (
                        <span key={i}>{part}</span>
                      ),
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick replies */}
            {messages.length <= 2 && (
              <div className="px-5 pb-2 flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => {
                      setInput(reply);
                      setTimeout(() => {
                        const userMsg: Message = {
                          id: `u-${Date.now()}`,
                          role: 'user',
                          content: reply,
                          timestamp: new Date(),
                        };
                        setMessages((prev) => [...prev, userMsg]);
                        setTimeout(() => {
                          const response = getBrowseResponse(reply);
                          setMessages((prev) => [
                            ...prev,
                            {
                              id: `a-${Date.now()}`,
                              role: 'assistant',
                              content: response,
                              timestamp: new Date(),
                            },
                          ]);
                        }, 600 + Math.random() * 600);
                        setInput('');
                      }, 50);
                    }}
                    className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full text-xs text-text-muted font-sans hover:bg-white/[0.08] hover:text-text-default transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-5 py-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about products, strains, effects..."
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-text-default font-sans placeholder:text-text-muted focus:outline-none focus:border-[#5BB8E6]/40 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-lg bg-[#5BB8E6] text-black flex items-center justify-center hover:bg-[#6DC4F0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
