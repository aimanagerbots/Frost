import type { CopilotMessage, CopilotSuggestion } from '@/modules/crm/types';

// --- Pre-built Conversations ---

interface CopilotConversation {
  id: string;
  preview: string;
  messages: CopilotMessage[];
}

const now = new Date().toISOString();

const conversations: CopilotConversation[] = [
  {
    id: 'conv-1',
    preview: 'Tell me about Greenfield Dispensary',
    messages: [
      {
        id: 'msg-1a',
        role: 'user',
        content: 'Tell me about Greenfield Dispensary',
        timestamp: now,
      },
      {
        id: 'msg-1b',
        role: 'assistant',
        content: `**Greenfield Dispensary** is one of your top-performing accounts with a health score of **92** (improving trend).

**Purchase History**
Lifetime revenue of **$487.2K** across 136 orders (AOV $3,580). They order every 7-8 days on average, primarily flower (35%), preroll (20%), and vaporizer (18%). Their category diversification is excellent — they carry all 6 product categories.

**VMI Performance**
VMI-enrolled since Q1. Blue Dream 3.5g is their top seller at ~12 units/day. Wedding Cake 3.5g and Gelato Live Resin Carts are also high-velocity SKUs. Current days-on-hand across categories averages 4.2 days.

**Payment Status**
Excellent payment reliability — always pays on time via ACH. No outstanding invoices.

**Recent Activity**
Sarah Chen (buyer, primary contact) met with Jake Morrison last week to discuss the spring flower drop and potential expansion into the new Glacier Extracts Live Rosin line. Mike Rodriguez (owner) expressed interest in hosting a vendor day for Q2 product education.

**Recommended Next Actions**
1. Propose the new Glacier Extracts Live Rosin line — their concentrate mix (12%) has room to grow
2. Schedule a vendor day for Q2 product education with budtenders
3. Review VMI par levels — Blue Dream may need a par increase based on velocity trends`,
        timestamp: now,
        sources: [
          { type: 'crm', label: 'CRM Profile' },
          { type: 'vmi', label: 'VMI Data' },
          { type: 'interaction', label: 'Interaction History' },
          { type: 'inventory', label: 'Inventory' },
        ],
        suggestedActions: [
          { label: 'Draft reorder email', action: 'draft-email' },
          { label: 'View VMI data', action: 'view-vmi' },
          { label: 'Schedule vendor day', action: 'schedule-vendor-day' },
        ],
      },
    ],
  },
  {
    id: 'conv-2',
    preview: 'Compare my top 5 accounts by category mix',
    messages: [
      {
        id: 'msg-2a',
        role: 'user',
        content: 'Compare my top 5 accounts by category mix',
        timestamp: now,
      },
      {
        id: 'msg-2b',
        role: 'assistant',
        content: `Here's a category mix comparison of your top 5 accounts by 30-day revenue:

| Account | Flower | Preroll | Vape | Concentrate | Edible | Beverage |
|---------|--------|---------|------|-------------|--------|----------|
| **Greenfield Dispensary** | 35% | 20% | 18% | 12% | 10% | 5% |
| **Capitol Hill Collective** | 15% | 10% | 30% | 25% | 15% | 5% |
| **Olympic Greens** | 25% | 35% | 10% | 15% | 10% | 5% |
| **Puget Sound Provisions** | 40% | 5% | 10% | 25% | 20% | — |
| **Summit Cannabis Co.** | 45% | 10% | 5% | 30% | 8% | 2% |

**Key Insights:**
- **Capitol Hill Collective** is heavily concentrate/vape focused (55% combined) — they're your best target for premium extract launches
- **Olympic Greens** is preroll-heavy (35%) — consider pitching multi-pack prerolls and infused prerolls
- **Puget Sound Provisions** has zero beverage and strong edible mix — they might be receptive to cannabis beverages as an adjacent category
- **Summit Cannabis Co.** is flower/concentrate dominant with minimal vape — opportunity to introduce the new Glacier Extracts Live Rosin Carts
- **Greenfield** is the most diversified account — a model for what full-category adoption looks like`,
        timestamp: now,
        sources: [
          { type: 'crm', label: 'CRM Profile' },
          { type: 'orders', label: 'Order History' },
        ],
        suggestedActions: [
          { label: 'Pitch edibles to Capitol Hill', action: 'pitch-edibles' },
          { label: 'View Olympic Greens detail', action: 'view-account' },
          { label: 'Export comparison', action: 'export' },
        ],
      },
    ],
  },
  {
    id: 'conv-3',
    preview: 'Draft a check-in email for Pacific Leaf about our new vape line',
    messages: [
      {
        id: 'msg-3a',
        role: 'user',
        content: 'Draft a check-in email for Pacific Leaf about our new vape line',
        timestamp: now,
      },
      {
        id: 'msg-3b',
        role: 'assistant',
        content: `Here's a draft email for David Kim at Pacific Leaf:

---

**Subject:** New Glacier Extracts Live Rosin Carts — Premium Alternative for Your Customers

Hi David,

Hope things are going well at Pacific Leaf. I wanted to reach out because I noticed your vape category has been trending down about 40% over the past few weeks, and I think we have something that could help turn that around.

We just launched the **Glacier Extracts Live Rosin Cart** line — these are solventless, single-source live rosin in 1g 510 carts. Three strains to start: Blueberry Muffin, Tropicana Cookies, and Ice Cream Cake. They're positioned as a premium alternative to the distillate carts that are getting commoditized.

Here's why I think they'd work for your customers:
- Your flower mix is strong (45%), which tells me your customers value quality — live rosin carts appeal to the same quality-conscious buyer
- At $38 wholesale / $65 suggested retail, the margins are better than standard 510 carts
- No direct price comparison to what competitors are offering since it's a different product category

I'd love to send over a sample pack so your team can try them. Want me to include them in your next delivery?

Best,
Priya Patel
Frost Sales — Eastside & Tacoma

---

*Note: Pacific Leaf's health score is currently 58 (declining) and they haven't ordered in 18 days. This email also serves as a re-engagement touchpoint.*`,
        timestamp: now,
        sources: [
          { type: 'crm', label: 'CRM Profile' },
          { type: 'orders', label: 'Order History' },
          { type: 'competitive', label: 'Competitive Intel' },
        ],
        suggestedActions: [
          { label: 'Send via email', action: 'send-email' },
          { label: 'Modify draft', action: 'modify-draft' },
          { label: 'Send to Approvals', action: 'send-approvals' },
        ],
      },
    ],
  },
  {
    id: 'conv-4',
    preview: 'What will Greenfield need to reorder next week?',
    messages: [
      {
        id: 'msg-4a',
        role: 'user',
        content: 'What will Greenfield need to reorder next week?',
        timestamp: now,
      },
      {
        id: 'msg-4b',
        role: 'assistant',
        content: `Based on current sell-through velocity at Greenfield Dispensary, here are the SKUs that will need replenishment by next week:

| SKU | Current Stock | Daily Velocity | Days Remaining | Reorder Qty | Est. Cost |
|-----|--------------|----------------|----------------|-------------|-----------|
| Wedding Cake 3.5g | 18 units | 7.8/day | **2.3 days** | 48 units | $1,440 |
| Blue Dream Preroll 5-pack | 14 units | 4.5/day | **3.1 days** | 24 units | $720 |
| Gelato Live Resin Cart 1g | 8 units | 1.9/day | **4.2 days** | 12 units | $480 |
| OG Kush 3.5g | 22 units | 3.2/day | 6.9 days | — | — |
| Sour Diesel Preroll 3-pack | 30 units | 2.8/day | 10.7 days | — | — |

**Estimated order value: $2,640** (3 SKUs)

The Wedding Cake 3.5g is the most urgent — at current velocity, they'll stock out by Wednesday. I'd recommend sending the reorder proposal today so it can ship tomorrow.

Their typical reorder pattern is every 7-8 days, and the last order was 5 days ago, so this aligns with their cadence.`,
        timestamp: now,
        sources: [
          { type: 'vmi', label: 'VMI Data' },
          { type: 'orders', label: 'Order History' },
        ],
        suggestedActions: [
          { label: 'Generate reorder proposal', action: 'reorder-proposal' },
          { label: 'View VMI dashboard', action: 'view-vmi' },
          { label: 'Draft reorder email', action: 'draft-email' },
        ],
      },
    ],
  },
  {
    id: 'conv-5',
    preview: 'How do I win back Emerald City? They haven\'t ordered in 45 days',
    messages: [
      {
        id: 'msg-5a',
        role: 'user',
        content: "How do I win back Emerald City? They haven't ordered in 45 days",
        timestamp: now,
      },
      {
        id: 'msg-5b',
        role: 'assistant',
        content: `**Emerald City Cannabis** — Win-Back Analysis

**Why They Stopped:**
Based on competitive intel and interaction history, Emerald City shifted to Brand X approximately 6 weeks ago. The primary driver was pricing — Brand X undercut us by ~15% on 510 carts, which was Emerald City's fastest-growing category. Their last order with us was 45 days ago ($2,010 — flower and prerolls only, no vapes).

**Account Context:**
- Health score: **28** (declining) — was 72 three months ago
- Lifetime revenue: $96.4K across 48 orders
- Category mix was 55% flower, 30% preroll, 15% edible — notably no concentrate/vape
- Payment reliability: Poor (COD) — had 2 overdue invoices before going inactive
- Primary contact: Amanda Torres (buyer) — prefers email communication

**Recommended Win-Back Approach:**
1. **Don't compete on price for commodity vapes** — that's a race to the bottom. Brand X will always undercut on distillate.
2. **Lead with the Glacier Extracts Live Rosin line** — premium, solventless, no direct price comparison possible. Position it as a category upgrade, not a replacement.
3. **Reference their historical flower loyalty** — they were strong flower buyers (55% of mix). Our Wedding Cake and Blue Dream are still top-sellers territory-wide.
4. **Offer a sample pack** — 3 Live Rosin Carts + our latest flower drops. Low commitment, high impact.
5. **Note:** Amanda Torres prefers phone calls over email for important conversations. A phone call will feel more personal than yet another vendor email.

**Timing:** Mid-week (Tue-Wed) is best for buyer calls in Seattle. Avoid Mondays and Fridays.`,
        timestamp: now,
        sources: [
          { type: 'crm', label: 'CRM Profile' },
          { type: 'competitive', label: 'Competitive Intel' },
          { type: 'interaction', label: 'Interaction History' },
          { type: 'orders', label: 'Order History' },
        ],
        suggestedActions: [
          { label: 'Start Win-Back Playbook', action: 'win-back' },
          { label: 'Call Amanda Torres', action: 'call' },
          { label: 'Send sample request', action: 'sample-request' },
        ],
      },
    ],
  },
];

// --- Suggested Prompts ---

const suggestions: CopilotSuggestion[] = [
  { id: 'sug-1', text: 'Tell me about Greenfield Dispensary', category: 'account-briefing' },
  { id: 'sug-2', text: "What's the health status of my territory?", category: 'account-briefing' },
  { id: 'sug-3', text: 'Summarize Puget Sound Provisions', category: 'account-briefing' },
  { id: 'sug-4', text: 'Compare my top 5 accounts by category mix', category: 'comparative' },
  { id: 'sug-5', text: 'Which accounts are most similar to Greenfield?', category: 'comparative' },
  { id: 'sug-6', text: 'Draft a check-in email for Pacific Leaf', category: 'communication' },
  { id: 'sug-7', text: 'Write a re-engagement message for inactive accounts', category: 'communication' },
  { id: 'sug-8', text: 'What will Greenfield need to reorder next week?', category: 'forecasting' },
  { id: 'sug-9', text: 'Forecast my revenue for next month', category: 'forecasting' },
  { id: 'sug-10', text: "How do I win back Emerald City?", category: 'strategy' },
  { id: 'sug-11', text: 'Which accounts should I prioritize this week?', category: 'strategy' },
  { id: 'sug-12', text: "Which accounts in Seattle haven't ordered edibles?", category: 'data-query' },
  { id: 'sug-13', text: 'Show me accounts with declining health scores', category: 'data-query' },
  { id: 'sug-14', text: 'List VMI-enrolled accounts and their sell-through rates', category: 'data-query' },
  { id: 'sug-15', text: 'Which reps have the most at-risk accounts?', category: 'data-query' },
];

// --- Generic Fallback Response ---

function generateFallbackResponse(userMessage: string): CopilotMessage {
  const accountNames = ['Greenfield Dispensary', 'Pacific Leaf', 'Summit Cannabis Co.', 'Olympic Greens', 'Puget Sound Provisions'];
  const randomAccount = accountNames[Math.floor(Math.random() * accountNames.length)];

  return {
    id: `msg-fallback-${Date.now()}`,
    role: 'assistant',
    content: `I can help with that. Let me analyze the data...

Based on your current portfolio of 28 accounts, here's what I found related to your question:

Your territory is performing well overall — total 30-day revenue is $142.8K across active accounts. ${randomAccount} continues to be a standout performer. There are currently 6 at-risk accounts that may need attention, and 3 accounts with overdue payments totaling $12,400.

I'd recommend focusing on accounts with declining health scores first, as early intervention has a 73% success rate in our data.

*This is a demo response. In production, I would query the full RAG knowledge base for a precise answer to: "${userMessage}"*`,
    timestamp: new Date().toISOString(),
    sources: [
      { type: 'crm', label: 'CRM Data' },
      { type: 'analytics', label: 'Analytics' },
    ],
    suggestedActions: [
      { label: 'View at-risk accounts', action: 'view-at-risk' },
      { label: 'Show territory overview', action: 'territory-overview' },
    ],
  };
}

// --- Exports ---

export function getCopilotConversations(): CopilotConversation[] {
  return conversations;
}

export function getCopilotSuggestions(): CopilotSuggestion[] {
  return suggestions;
}

export function getCopilotConversation(id: string): CopilotConversation | undefined {
  return conversations.find((c) => c.id === id);
}

export function matchConversation(userMessage: string): CopilotMessage | null {
  const lower = userMessage.toLowerCase();
  for (const conv of conversations) {
    const firstUserMsg = conv.messages.find((m) => m.role === 'user');
    if (firstUserMsg && lower.includes(firstUserMsg.content.toLowerCase().slice(0, 20))) {
      const response = conv.messages.find((m) => m.role === 'assistant');
      return response ?? null;
    }
  }
  return null;
}

export function getFallbackResponse(userMessage: string): CopilotMessage {
  return generateFallbackResponse(userMessage);
}

export type { CopilotConversation };
