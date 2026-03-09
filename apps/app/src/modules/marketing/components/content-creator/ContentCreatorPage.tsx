'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Wand2, Send, ChevronLeft, ChevronRight, Sparkles, Image as ImageIcon, MessageSquare, FileText, Copy, Check } from 'lucide-react';
import { SectionHeader, LoadingSkeleton, StatusBadge } from '@/components';
import { useContentTemplates, useContentChat, useContentPieces, useContentLibrary } from '@/modules/marketing/hooks';
import type { AIContentMessage, ContentTemplate, ContentLibraryCategory, ContentPiece } from '@/modules/marketing/types';
import { ACCENT } from '@/design/colors';


const IMAGE_PROVIDERS = ['DALL-E', 'Midjourney', 'Stable Diffusion', 'Flux'] as const;

const IMAGE_STYLES = ['Product Shot', 'Lifestyle', 'Artistic', 'Minimal'] as const;
const ASPECT_RATIOS = ['1:1', '4:5', '16:9'] as const;

const LIBRARY_TABS: { key: ContentLibraryCategory; label: string }[] = [
  { key: 'instagram_caption', label: 'Captions' },
  { key: 'product_description', label: 'Products' },
  { key: 'email_copy', label: 'Emails' },
  { key: 'blog_intro', label: 'Blog' },
  { key: 'image_concept', label: 'Images' },
];

const CONVERSATION_MAP: { title: string; id: string }[] = [
  { title: 'Gelato Instagram Post', id: 'conv-001' },
  { title: 'Live Rosin Cart Email', id: 'conv-002' },
  { title: 'Trim Room Captions', id: 'conv-003' },
];

const COMPLIANCE_WORDS = ['medical', 'health', 'cure', 'treat', 'anxiety', 'pain', 'sleep'];

export function ContentCreatorPage() {
  const { data: templates, isLoading: templatesLoading } = useContentTemplates();
  const { data: recentPieces, isLoading: piecesLoading } = useContentPieces({ status: 'published' });
  const { data: libraryData } = useContentLibrary();

  const [activeConversationId, setActiveConversationId] = useState('conv-001');
  const { data: chatHistory } = useContentChat(activeConversationId);

  const [messages, setMessages] = useState<AIContentMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('DALL-E');
  const [selectedStyle, setSelectedStyle] = useState<string>('Product Shot');
  const [selectedRatio, setSelectedRatio] = useState<string>('1:1');
  const [activeLibraryTab, setActiveLibraryTab] = useState<ContentLibraryCategory>('instagram_caption');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [needsLoad, setNeedsLoad] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load initial chat history on mount, and when conversation switches
  if (chatHistory && needsLoad) {
    setMessages(chatHistory);
    setNeedsLoad(false);
  }

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleConversationSwitch = useCallback((convId: string) => {
    setActiveConversationId(convId);
    setMessages([]);
    setIsTyping(false);
    setNeedsLoad(true);
  }, []);

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
    setActiveConversationId('');
  };

  const handleCopy = (piece: ContentPiece) => {
    navigator.clipboard.writeText(piece.content).catch(() => {});
    setCopiedId(piece.id);
    setTimeout(() => setCopiedId(null), 2000);
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
  const libraryItems = libraryData ?? {
    instagram_caption: [],
    product_description: [],
    email_copy: [],
    blog_intro: [],
    image_concept: [],
  };

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

      {/* Two-panel layout: Chat + Content Library */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
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
                        className="w-full rounded-lg px-2.5 py-2 text-left text-sm text-text-muted hover:bg-accent-hover hover:text-text-default transition-colors"
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
                    {CONVERSATION_MAP.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => handleConversationSwitch(conv.id)}
                        className={`w-full rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                          activeConversationId === conv.id
                            ? 'bg-card-hover text-text-default'
                            : 'text-text-muted hover:bg-accent-hover hover:text-text-default'
                        }`}
                      >
                        <span className="truncate">{conv.title}</span>
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
                        className="rounded-full border border-default px-3 py-1.5 text-xs text-text-muted hover:border-[#5BB8E6]/50 hover:text-text-default transition-colors"
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
                          ? 'bg-[#5BB8E6]/10 text-text-default'
                          : 'border border-default bg-card text-text-default'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                      {msg.imagePrompt && (
                        <div className="mt-3 rounded-lg border border-default bg-base p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" style={{ color: ACCENT }} />
                            <span className="text-xs font-semibold text-text-muted">Suggested Image Prompt</span>
                          </div>
                          <p className="mb-3 text-xs italic text-text-muted">{msg.imagePrompt}</p>

                          {/* Style Selector */}
                          <div className="mb-2">
                            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Style</p>
                            <div className="flex flex-wrap gap-1.5">
                              {IMAGE_STYLES.map((style) => (
                                <button
                                  key={style}
                                  onClick={() => setSelectedStyle(style)}
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                                    selectedStyle === style
                                      ? 'text-white'
                                      : 'border border-default bg-elevated text-text-muted hover:text-text-default'
                                  }`}
                                  style={selectedStyle === style ? { backgroundColor: ACCENT } : undefined}
                                >
                                  {style}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Aspect Ratio */}
                          <div className="mb-3">
                            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Aspect Ratio</p>
                            <div className="flex gap-1.5">
                              {ASPECT_RATIOS.map((ratio) => (
                                <button
                                  key={ratio}
                                  onClick={() => setSelectedRatio(ratio)}
                                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                                    selectedRatio === ratio
                                      ? 'text-white'
                                      : 'border border-default bg-elevated text-text-muted hover:text-text-default'
                                  }`}
                                  style={selectedRatio === ratio ? { backgroundColor: ACCENT } : undefined}
                                >
                                  {ratio}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Provider + Generate */}
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
                  className="flex-1 resize-none rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-[#5BB8E6]/50 focus:outline-none"
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

        {/* Content Library Panel */}
        <div className="rounded-xl border border-default bg-card overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 340px)', minHeight: 480 }}>
          <div className="border-b border-default px-4 py-3">
            <h3 className="text-sm font-semibold text-text-default">Content Library</h3>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-default overflow-x-auto">
            {LIBRARY_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveLibraryTab(tab.key)}
                className={`flex-shrink-0 px-3 py-2.5 text-xs font-medium transition-colors relative ${
                  activeLibraryTab === tab.key
                    ? 'text-text-default'
                    : 'text-text-muted hover:text-text-default'
                }`}
              >
                {tab.label}
                {activeLibraryTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: ACCENT }} />
                )}
              </button>
            ))}
          </div>

          {/* Library Items */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {libraryItems[activeLibraryTab].length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center px-4">
                <FileText className="mb-2 h-6 w-6 text-text-muted" />
                <p className="text-xs text-text-muted">No content in this category yet</p>
              </div>
            ) : (
              libraryItems[activeLibraryTab].map((piece) => (
                <div key={piece.id} className="rounded-lg border border-default bg-base p-3 group">
                  {activeLibraryTab === 'image_concept' ? (
                    <>
                      <div
                        className="mb-2 h-20 rounded-md"
                        style={{ backgroundColor: `${ACCENT}20` }}
                      />
                      <p className="text-xs font-medium text-text-default truncate">{piece.title}</p>
                      <p className="mt-0.5 text-[10px] text-text-muted line-clamp-2">
                        {piece.imagePrompt ?? piece.content.slice(0, 100)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-medium text-text-default truncate">{piece.title}</p>
                      <p className="mt-1 text-[10px] text-text-muted line-clamp-3">{piece.content.slice(0, 140)}</p>
                    </>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-text-muted">
                      {piece.publishedDate
                        ? new Date(piece.publishedDate).toLocaleDateString()
                        : piece.scheduledDate
                          ? new Date(piece.scheduledDate).toLocaleDateString()
                          : 'Draft'}
                    </span>
                    <button
                      onClick={() => handleCopy(piece)}
                      className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-text-muted opacity-0 transition-all group-hover:opacity-100 hover:bg-accent-hover hover:text-text-default"
                    >
                      {copiedId === piece.id ? (
                        <>
                          <Check className="h-3 w-3" style={{ color: ACCENT }} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
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

  let response: string;

  if (lower.includes('strain') || lower.includes('flower')) {
    response = `Here's a strain spotlight post:\n\n**Frost Farms Presents**\n\nPremium flower, grown with care. Our latest harvest brings out the best terpene profiles — complex aromas, smooth smoke, and a clean finish every time.\n\nAvailable at select WA retailers.\n\n#FrostFarms #CraftCannabis #WACannabis #PremiumFlower #StrainSpotlight`;
  } else if (lower.includes('email') || lower.includes('newsletter')) {
    response = `Here's a draft email:\n\n**Subject:** Fresh drops from Frost Farms\n\n**Preview:** New strains, new formats — same quality your customers trust.\n\nHi {{contact_name}},\n\nWe've been busy. This month we're releasing three new strains and expanding our live resin cart lineup. Here's what's new:\n\n1. **Frost Cake** — Our new flagship hybrid (27.4% THC)\n2. **Lemon Haze** — A citrus-forward sativa for daytime\n3. **Purple Punch** — Classic indica, grape-forward\n\nReady to order? Reply to this email or reach out to {{rep_name}}.\n\nStay frosty,\nThe Frost Team`;
  } else if (lower.includes('caption') || lower.includes('instagram') || lower.includes('social')) {
    response = `Here are some caption options:\n\n**Option 1 — Clean & Professional:**\n"Crafted with intention. Every batch, every bud — Frost quality." #FrostFarms #CraftCannabis\n\n**Option 2 — Engaging & Casual:**\n"That new-batch glow up is REAL. Fresh drop landing this week — stay tuned." #NewDrop #FrostFarms\n\n**Option 3 — Educational:**\n"What makes craft cannabis different? Smaller batches, hand-trimmed, and slow-cured for maximum terpene preservation." #CannabisEducation #FrostFarms`;
  } else {
    response = `Here's what I came up with:\n\nFrost Farms is where quality meets consistency. Whether it's flower, pre-rolls, or concentrates — every product carries our commitment to craft cannabis.\n\nI can help refine this further. Want me to:\n- Adjust the tone (more casual, more professional)?\n- Target a specific platform (Instagram, email, website)?\n- Add hashtags or personalization tokens?`;
  }

  // WSLCB compliance check
  const hasComplianceTrigger = COMPLIANCE_WORDS.some((word) => lower.includes(word));
  if (hasComplianceTrigger) {
    response += `\n\n\u26A0\uFE0F WSLCB Compliance Note: I can't include medical claims per Washington State regulations. The copy above focuses on flavor, aroma, and experience instead.`;
  }

  return response;
}
