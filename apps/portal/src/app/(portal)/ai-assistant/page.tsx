'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components';
import { usePortalAuth, usePortalCart, usePortalProducts } from '@/modules/portal/shared/hooks';
import { getAIConversationsForAccount } from '@/modules/portal/shared/mock-data';
import type { PortalAIConversation, PortalAIMessage, PortalProduct } from '@/modules/portal/shared/types';
import {
  AIConversationList,
  AIChatMessage,
  AIChatInput,
  AIContextPanel,
  AITypingIndicator,
} from '@/modules/portal/ai-assistant/components';

// ---------------------------------------------------------------------------
// Mock AI Response Generator
// ---------------------------------------------------------------------------

function generateAIResponse(
  userMessage: string,
  products: PortalProduct[]
): PortalAIMessage {
  const lower = userMessage.toLowerCase();
  const now = new Date().toISOString();
  const baseMsg: Omit<PortalAIMessage, 'content' | 'cartActions' | 'templateSuggestion'> = {
    id: `ai-msg-${Date.now()}`,
    role: 'assistant',
    timestamp: now,
  };

  // Reorder intent
  if (lower.includes('reorder')) {
    const reorderProducts = products.filter((p) => p.isPopular).slice(0, 4);
    return {
      ...baseMsg,
      content:
        "Based on your recent order history, here are the items I'd recommend reordering:\n\n" +
        reorderProducts
          .map((p) => `- **${p.name}** (${p.packageSize}) — $${p.unitPrice.toFixed(2)}/unit`)
          .join('\n') +
        '\n\nWould you like me to add these to your cart?',
      cartActions: reorderProducts.map((p) => ({
        productId: p.id,
        productName: p.name,
        quantity: 6,
      })),
    };
  }

  // New products
  if (lower.includes('new')) {
    const newProducts = products.filter((p) => p.isNew).slice(0, 3);
    if (newProducts.length === 0) {
      return {
        ...baseMsg,
        content:
          "We don't have any brand-new arrivals right now, but check back soon! Our product team is always working on new drops. Is there a specific category you're interested in?",
      };
    }
    return {
      ...baseMsg,
      content:
        "Here's what just dropped this week:\n\n" +
        newProducts
          .map(
            (p) =>
              `- **${p.name}** — ${p.strainType} ${p.category}, ${p.thcMin}-${p.thcMax}% THC, $${p.unitPrice.toFixed(2)}/unit`
          )
          .join('\n') +
        '\n\nWant me to add any of these to your cart for a trial?',
      cartActions: newProducts.map((p) => ({
        productId: p.id,
        productName: p.name,
        quantity: 4,
      })),
    };
  }

  // Deals / sales
  if (lower.includes('sale') || lower.includes('deal') || lower.includes('promo') || lower.includes('discount')) {
    const promoProducts = products.filter((p) => p.promotionId);
    return {
      ...baseMsg,
      content:
        promoProducts.length > 0
          ? "Here are the products with active promotions right now:\n\n" +
            promoProducts
              .slice(0, 4)
              .map((p) => `- **${p.name}** — $${p.unitPrice.toFixed(2)}/unit`)
              .join('\n') +
            "\n\nYour Tier pricing is applied on top of any promotions. Great time to stock up!"
          : "No active promotions right now, but your tier pricing already gives you the best rates. I'll let you know as soon as new deals go live!",
      cartActions:
        promoProducts.length > 0
          ? promoProducts.slice(0, 4).map((p) => ({
              productId: p.id,
              productName: p.name,
              quantity: 6,
            }))
          : undefined,
    };
  }

  // Popular / top sellers
  if (lower.includes('popular') || lower.includes('top') || lower.includes('best')) {
    const popular = products.filter((p) => p.isPopular).slice(0, 5);
    return {
      ...baseMsg,
      content:
        "Here are the top sellers across all dispensaries this week:\n\n" +
        popular
          .map(
            (p, i) =>
              `${i + 1}. **${p.name}** — ${p.strainType} ${p.category}, $${p.unitPrice.toFixed(2)}/unit`
          )
          .join('\n') +
        '\n\nThese are consistently the fastest-moving SKUs. Want me to add any to your cart?',
      cartActions: popular.map((p) => ({
        productId: p.id,
        productName: p.name,
        quantity: 6,
      })),
    };
  }

  // Search by product name
  const matchedProduct = products.find(
    (p) =>
      lower.includes(p.name.toLowerCase()) ||
      lower.includes(p.strainName.toLowerCase())
  );
  if (matchedProduct) {
    return {
      ...baseMsg,
      content:
        `Here's what I found:\n\n` +
        `**${matchedProduct.name}**\n` +
        `- Brand: ${matchedProduct.brand}\n` +
        `- Category: ${matchedProduct.category} (${matchedProduct.subCategory})\n` +
        `- Strain: ${matchedProduct.strainName} (${matchedProduct.strainType})\n` +
        `- THC: ${matchedProduct.thcMin}-${matchedProduct.thcMax}%\n` +
        `- Package: ${matchedProduct.packageSize}\n` +
        `- Price: $${matchedProduct.unitPrice.toFixed(2)}/unit\n` +
        `- Stock: ${matchedProduct.availableQuantity} available\n\n` +
        (matchedProduct.inStock
          ? 'This is in stock and ready to ship. Want me to add it to your cart?'
          : 'This item is currently out of stock. I can notify you when it becomes available.'),
      cartActions: matchedProduct.inStock
        ? [
            {
              productId: matchedProduct.id,
              productName: matchedProduct.name,
              quantity: 6,
            },
          ]
        : undefined,
    };
  }

  // Build an order
  if (lower.includes('build') || lower.includes('order') || lower.includes('help')) {
    return {
      ...baseMsg,
      content:
        "I'd be happy to help you build an order! Here's what I can do:\n\n" +
        '- **Reorder** your last order or a saved template\n' +
        '- **Recommend** products based on your sales trends\n' +
        '- **Find deals** and volume discount opportunities\n' +
        '- **Search** for specific products or strains\n' +
        '- **Check stock** levels on any product\n\n' +
        "Just tell me what you're looking for and I'll put it together!",
    };
  }

  // Default response
  return {
    ...baseMsg,
    content:
      "I'm here to help with your ordering needs! You can ask me to:\n\n" +
      '- Reorder previous orders\n' +
      "- Show what's new or popular\n" +
      '- Find current deals and promotions\n' +
      '- Search for specific products\n' +
      '- Help build a custom order\n' +
      '- Check volume discounts\n\n' +
      'What would you like to do?',
  };
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function AIAssistantPage() {
  const { currentAccount } = usePortalAuth();
  const cart = usePortalCart();
  const accountId = currentAccount?.id ?? '';
  const { data: products } = usePortalProducts(accountId);

  // Conversation state
  const [conversations, setConversations] = useState<PortalAIConversation[]>(
    () => (accountId ? getAIConversationsForAccount(accountId) : [])
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    () => conversations[0]?.id ?? null
  );
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find((c) => c.id === selectedId) ?? null;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages.length, isTyping]);

  // New chat
  const handleNewChat = useCallback(() => {
    const newConv: PortalAIConversation = {
      id: `ai-conv-${Date.now()}`,
      title: 'New conversation',
      messages: [
        {
          id: `ai-msg-welcome-${Date.now()}`,
          role: 'assistant',
          content:
            "Hey there! I'm Frost AI, your ordering assistant. I can help you reorder, find new products, check deals, or build a custom order. What can I do for you today?",
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setSelectedId(newConv.id);
  }, []);

  // Send message
  const handleSend = useCallback(
    (text: string) => {
      if (!selectedId || !products) return;

      const userMsg: PortalAIMessage = {
        id: `ai-msg-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };

      // Add user message
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? {
                ...c,
                messages: [...c.messages, userMsg],
                title:
                  c.messages.length <= 1 && c.title === 'New conversation'
                    ? text.slice(0, 40) + (text.length > 40 ? '...' : '')
                    : c.title,
              }
            : c
        )
      );

      // Show typing indicator
      setIsTyping(true);

      // Generate AI response after delay
      setTimeout(() => {
        const aiMsg = generateAIResponse(text, products);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedId
              ? { ...c, messages: [...c.messages, aiMsg] }
              : c
          )
        );
        setIsTyping(false);
      }, 1500);
    },
    [selectedId, products]
  );

  // Add to cart from AI message
  const handleAddToCart = useCallback(
    (action: { productId: string; productName: string; quantity: number }) => {
      if (!products) return;
      const product = products.find((p) => p.id === action.productId);
      if (product) {
        cart.addItem(product, action.quantity);
      }
    },
    [products, cart]
  );

  return (
    <div className="flex h-full flex-col">
      <PortalPageHeader
        icon={Sparkles}
        title="AI Assistant"
        subtitle="Get help ordering, reordering, and finding products"
      />

      {/* Three-column layout */}
      <div className="mt-6 flex flex-1 gap-4 overflow-hidden" style={{ minHeight: 0, height: 'calc(100vh - 180px)' }}>
        {/* Left: Conversation List */}
        <div className="hidden w-[20%] min-w-[220px] shrink-0 overflow-hidden rounded-xl border border-border-default bg-card lg:block">
          <AIConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onNewChat={handleNewChat}
          />
        </div>

        {/* Center: Chat */}
        <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-border-default bg-card lg:w-[55%]">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 border-b border-border-default px-5 py-3">
                <Sparkles className="h-4 w-4 text-accent-primary" />
                <h2 className="truncate text-sm font-medium text-text-bright">
                  {selectedConversation.title}
                </h2>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <div className="space-y-5">
                  {selectedConversation.messages.map((msg) => (
                    <AIChatMessage
                      key={msg.id}
                      message={msg}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                  {isTyping && <AITypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-border-default px-5 py-4">
                <AIChatInput onSend={handleSend} isTyping={isTyping} />
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-primary/10">
                <Sparkles className="h-8 w-8 text-accent-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-bright">
                  Frost AI Assistant
                </h2>
                <p className="mt-1 text-sm text-text-muted">
                  Select a conversation or start a new chat
                </p>
              </div>
              <button
                onClick={handleNewChat}
                className="rounded-lg bg-accent-primary/15 px-4 py-2 text-sm font-medium text-accent-primary transition-colors hover:bg-accent-primary/25"
              >
                Start New Chat
              </button>
            </div>
          )}
        </div>

        {/* Right: Context Panel */}
        <div className="hidden w-[25%] min-w-[200px] shrink-0 overflow-y-auto lg:block">
          <AIContextPanel />
        </div>
      </div>

      {/* Mobile: New Chat FAB when no conversation selected */}
      {!selectedConversation && (
        <button
          onClick={handleNewChat}
          className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent-primary shadow-lg lg:hidden"
        >
          <Sparkles className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  );
}
