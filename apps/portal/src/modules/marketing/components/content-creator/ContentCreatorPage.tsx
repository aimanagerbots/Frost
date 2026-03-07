'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Wand2, Send, ChevronLeft, ChevronRight, Sparkles, Image, MessageSquare, FileText } from 'lucide-react';
import { SectionHeader, LoadingSkeleton, StatusBadge } from '@/components';
import { useContentTemplates, useContentChat, useContentPieces } from '@/modules/marketing/hooks';
import type { AIContentMessage, ContentTemplate } from '@/modules/marketing/types';

const ACCENT = '#EC4899';

const IMAGE_PROVIDERS = ['DALL-E', 'Midjourney', 'Stable Diffusion', 'Flux'] as const;

export function ContentCreatorPage() {
  const { data: templates, isLoading: templatesLoading } = useContentTemplates();
  const { data: chatHistory } = useContentChat('conv-001');
  const { data: recentPieces, isLoading: piecesLoading } = useContentPieces({ status: 'published' });

  const [messages, setMessages] = useState<AIContentMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('DALL-E');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load demo conversation on mount
  useEffect(() => {
    if (chatHistory && messages.length === 0) {
      setMessages(chatHistory);
    }
  }, [chatHistory, messages.length]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMsg: AIContentMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: AIContentMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: generateResponse(text),
        timestamp: new Date().toISOString(),
        imagePrompt: text.toLowerCase().includes('image') || text.toLowerCase().includes('photo')
          ? `Professional cannabis product photography inspired by: "${text}". Dark moody background, dramatic studio lighting, shallow depth of field.`
          : undefined,
        imageProvider: selectedProvider,
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  }, [inputValue, isTyping, selectedProvider]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTemplateClick = (template: ContentTemplate) => {
    setInputValue(template.promptTemplate);
    inputRef.current?.focus();
  };

  const handleNewChat = () => {
    setMessages([]);
    setInputValue('');
    setIsTyping(false);
  };

  if (templatesLoading || piecesLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  const recentPublished = (recentPieces ?? []).slice(0, 5);

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={Wand2}
        title="Content Creator"
        subtitle="AI-powered creative studio for marketing content"
        accentColor={ACCENT}
        stats={[
          { label: 'Templates', value: templates?.length ?? 0 },
          { label: 'Created Today', value: 3 },
        ]}
      />

      {/* Chat Interface */}
      <div className="flex rounded-xl border border-default bg-card overflow-hidden" style={{ height: 'calc(100vh - 340px)', minHeight: 480 }}>
        {/* Sidebar */}
        <div
          className={`border-r border-default bg-base transition-all duration-200 flex flex-col ${sidebarCollapsed ? 'w-10' : 'w-64'}`}
        >
          {sidebarCollapsed ? (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="p-2 text-text-muted hover:text-text-default"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-default p-3">
                <button
                  onClick={handleNewChat}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  New Chat
                </button>
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="text-text-muted hover:text-text-default"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>

              {/* Template Quick-Select */}
              <div className="flex-1 overflow-y-auto p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Templates</p>
                <div className="space-y-1">
                  {(templates ?? []).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTemplateClick(t)}
                      className="w-full rounded-lg px-2.5 py-2 text-left text-sm text-text-muted hover:bg-card-hover hover:text-text-default transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {t.type === 'email' ? <FileText className="h-3.5 w-3.5 flex-shrink-0" /> : <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" />}
                        <span className="truncate">{t.name}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Conversation History */}
                <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Recent Chats</p>
                <div className="space-y-1">
                  {['Gelato Instagram Post', 'Live Rosin Cart Email', 'Trim Room Captions'].map((title, i) => (
                    <button
                      key={i}
                      className="w-full rounded-lg px-2.5 py-2 text-left text-sm text-text-muted hover:bg-card-hover hover:text-text-default transition-colors"
                    >
                      <span className="truncate">{title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex flex-1 flex-col">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full p-4" style={{ backgroundColor: `${ACCENT}15` }}>
                  <Wand2 className="h-8 w-8" style={{ color: ACCENT }} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-text-default">Content Creator AI</h3>
                <p className="mb-6 max-w-md text-sm text-text-muted">
                  Describe what you need — Instagram captions, email copy, product descriptions, or image prompts. Select a template from the sidebar to get started.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Write a strain spotlight for Blue Dream', 'Create an email for our spring launch', 'Generate 5 caption options for a product photo'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => { setInputValue(suggestion); inputRef.current?.focus(); }}
                      className="rounded-full border border-default px-3 py-1.5 text-xs text-text-muted hover:border-[#EC4899]/50 hover:text-text-default transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] rounded-xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-[#EC4899]/10 text-text-default'
                        : 'border border-default bg-card text-text-default'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    {msg.imagePrompt && (
                      <div className="mt-3 rounded-lg border border-default bg-base p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Image className="h-4 w-4" style={{ color: ACCENT }} />
                          <span className="text-xs font-semibold text-text-muted">Suggested Image Prompt</span>
                        </div>
                        <p className="mb-2 text-xs italic text-text-muted">{msg.imagePrompt}</p>
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value)}
                            className="rounded-md border border-default bg-elevated px-2 py-1 text-xs text-text-default"
                          >
                            {IMAGE_PROVIDERS.map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                          <button
                            className="rounded-md px-3 py-1 text-xs font-medium text-white transition-colors hover:opacity-90"
                            style={{ backgroundColor: ACCENT }}
                          >
                            Generate Image
                          </button>
                        </div>
                      </div>
                    )}
                    <p className="mt-1 text-[10px] text-text-muted">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-xl border border-default bg-card px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 animate-bounce rounded-full" style={{ backgroundColor: ACCENT, animationDelay: '0ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full" style={{ backgroundColor: ACCENT, animationDelay: '150ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full" style={{ backgroundColor: ACCENT, animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-default p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what you want to create..."
                className="flex-1 resize-none rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-[#EC4899]/50 focus:outline-none"
                rows={2}
                style={{ maxHeight: 120 }}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="rounded-lg p-2.5 text-white transition-colors disabled:opacity-40"
                style={{ backgroundColor: ACCENT }}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Creations */}
      {recentPublished.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-default">Recent Creations</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {recentPublished.map((piece) => (
              <div key={piece.id} className="rounded-xl border border-default bg-card p-3">
                <div className="mb-2 flex items-center justify-between">
                  <StatusBadge label={piece.platform} variant="info" size="sm" />
                  {piece.aiGenerated && (
                    <Sparkles className="h-3 w-3" style={{ color: ACCENT }} />
                  )}
                </div>
                <p className="mb-1 text-xs font-medium text-text-default truncate">{piece.title}</p>
                <p className="text-[10px] text-text-muted line-clamp-2">{piece.content.slice(0, 80)}...</p>
                {piece.performance && (
                  <p className="mt-1.5 text-[10px] text-text-muted">
                    {piece.performance.impressions.toLocaleString()} impressions · {piece.performance.engagementRate}% eng
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function generateResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('strain') || lower.includes('flower')) {
    return `Here's a strain spotlight post:\n\n**Frost Farms Presents**\n\nPremium flower, grown with care. Our latest harvest brings out the best terpene profiles — complex aromas, smooth smoke, and a clean finish every time.\n\nAvailable at select WA retailers.\n\n#FrostFarms #CraftCannabis #WACannabis #PremiumFlower #StrainSpotlight`;
  }
  if (lower.includes('email') || lower.includes('newsletter')) {
    return `Here's a draft email:\n\n**Subject:** Fresh drops from Frost Farms\n\n**Preview:** New strains, new formats — same quality your customers trust.\n\nHi {{contact_name}},\n\nWe've been busy. This month we're releasing three new strains and expanding our live resin cart lineup. Here's what's new:\n\n1. **Frost Cake** — Our new flagship hybrid (27.4% THC)\n2. **Lemon Haze** — A citrus-forward sativa for daytime\n3. **Purple Punch** — Classic indica, grape-forward\n\nReady to order? Reply to this email or reach out to {{rep_name}}.\n\nStay frosty,\nThe Frost Team`;
  }
  if (lower.includes('caption') || lower.includes('instagram') || lower.includes('social')) {
    return `Here are some caption options:\n\n**Option 1 — Clean & Professional:**\n"Crafted with intention. Every batch, every bud — Frost quality." #FrostFarms #CraftCannabis\n\n**Option 2 — Engaging & Casual:**\n"That new-batch glow up is REAL. Fresh drop landing this week — stay tuned." #NewDrop #FrostFarms\n\n**Option 3 — Educational:**\n"What makes craft cannabis different? Smaller batches, hand-trimmed, and slow-cured for maximum terpene preservation." #CannabisEducation #FrostFarms`;
  }
  return `Here's what I came up with:\n\nFrost Farms is where quality meets consistency. Whether it's flower, pre-rolls, or concentrates — every product carries our commitment to craft cannabis.\n\nI can help refine this further. Want me to:\n- Adjust the tone (more casual, more professional)?\n- Target a specific platform (Instagram, email, website)?\n- Add hashtags or personalization tokens?`;
}
