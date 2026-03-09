import type { PortalAIConversation } from '../types';

const GREENFIELD_CONVERSATIONS: PortalAIConversation[] = [
  {
    id: 'ai-conv-001',
    title: 'Weekly restock help',
    createdAt: '2026-03-06T10:00:00Z',
    messages: [
      {
        id: 'ai-msg-001',
        role: 'user',
        content: 'Hey, can you help me figure out what I should reorder this week? I want to make sure we don\'t run out of anything before our Tuesday delivery.',
        timestamp: '2026-03-06T10:00:00Z',
      },
      {
        id: 'ai-msg-002',
        role: 'assistant',
        content: 'Of course! I looked at your sales data from the past two weeks and your current inventory levels. Here are my recommendations:\n\n- **Wedding Cake 3.5g**: You\'ve sold 14 units in 10 days and have 4 left. I\'d suggest ordering 18 to stay ahead.\n- **Blue Dream 3.5g**: Sold 10 units, 6 remaining. Order 12 to maintain buffer.\n- **Gelato 3.5g**: This is your newest SKU and it\'s moving fast — 8 sold in 5 days, 2 left. I\'d order 12.\n- **Preroll 5-Packs**: You\'re low on Wedding Cake and Blue Dream packs. Order 6 of each.',
        timestamp: '2026-03-06T10:01:00Z',
        cartActions: [
          { productId: 'prod-wc-35', productName: 'Wedding Cake 3.5g', quantity: 18 },
          { productId: 'prod-bd-35', productName: 'Blue Dream 3.5g', quantity: 12 },
          { productId: 'prod-gl-35', productName: 'Gelato 3.5g', quantity: 12 },
          { productId: 'prod-wc-pr5', productName: 'Wedding Cake Preroll 5-Pack', quantity: 6 },
          { productId: 'prod-bd-pr5', productName: 'Blue Dream Preroll 5-Pack', quantity: 6 },
        ],
      },
      {
        id: 'ai-msg-003',
        role: 'user',
        content: 'That looks right. Can you also check if any concentrates are running low? We\'ve been pushing the Zkittlez live resin pretty hard.',
        timestamp: '2026-03-06T10:03:00Z',
      },
      {
        id: 'ai-msg-004',
        role: 'assistant',
        content: 'Good call — you\'re down to 3 units of the Zkittlez Live Resin 1g. Based on your sell-through rate, you\'ll be out by Friday. I\'d recommend 8 units. Also, the Wedding Cake Badder is at 5 units which should last through the week, but with Concentrate Week starting (10% off), you might want to stock up. Want me to add 6 of those too?',
        timestamp: '2026-03-06T10:04:00Z',
        cartActions: [
          { productId: 'prod-zk-lr', productName: 'Zkittlez Live Resin 1g', quantity: 8 },
        ],
      },
      {
        id: 'ai-msg-005',
        role: 'user',
        content: 'Yeah add the Zkittlez for sure. Hold off on the badder for now — let me see how the promo goes first. Can you total this up?',
        timestamp: '2026-03-06T10:05:00Z',
      },
      {
        id: 'ai-msg-006',
        role: 'assistant',
        content: 'Here\'s your order summary:\n\n| Product | Qty | Unit Price | Line Total |\n|---------|-----|-----------|------------|\n| Wedding Cake 3.5g | 18 | $18.00 | $324.00 |\n| Blue Dream 3.5g | 12 | $16.00 | $192.00 |\n| Gelato 3.5g | 12 | $19.00 | $228.00 |\n| WC Preroll 5-Pack | 6 | $22.00 | $132.00 |\n| BD Preroll 5-Pack | 6 | $20.00 | $120.00 |\n| Zkittlez Live Resin 1g | 8 | $28.00 | $224.00 |\n\n**Subtotal: $1,220.00**\nYour Tier 1 pricing is already applied. The Zkittlez gets the 10% Concentrate Week discount too, saving you $22.40. Want me to add this to your cart?',
        timestamp: '2026-03-06T10:06:00Z',
      },
    ],
  },
  {
    id: 'ai-conv-002',
    title: 'New product recommendations',
    createdAt: '2026-03-04T14:00:00Z',
    messages: [
      {
        id: 'ai-msg-007',
        role: 'user',
        content: 'I keep hearing about the new Gelato line. What products do you have and would they be a good fit for our store?',
        timestamp: '2026-03-04T14:00:00Z',
      },
      {
        id: 'ai-msg-008',
        role: 'assistant',
        content: 'The Gelato line is one of our strongest launches this quarter. Here\'s what\'s available:\n\n- **Gelato 3.5g Flower** ($19/unit) — 28.4% THC, dominant myrcene and limonene. Creamy, dessert-like flavor profile. This is the hero product.\n- **Gelato Live Resin Cart 1g** ($32/unit) — 85.2% THC, full-spectrum extract. Selling really well with the cart crowd.\n- **Gelato Live Resin 1g** ($28/unit) — 80.2% THC concentrate in a jar. Great for the dabbing enthusiast.\n\nBased on your customer mix at Greenfield, I think the 3.5g flower and the 1g cart would be your best bets. Your flower customers tend to prefer premium strains and your cart sales have been growing 15% month-over-month.',
        timestamp: '2026-03-04T14:01:00Z',
      },
      {
        id: 'ai-msg-009',
        role: 'user',
        content: 'That sounds great. Let\'s start with a small trial — maybe 6 of the flower and 4 of the cart. Can I see the lab results first?',
        timestamp: '2026-03-04T14:03:00Z',
      },
      {
        id: 'ai-msg-010',
        role: 'assistant',
        content: 'Absolutely! The COAs are available in your Lab Results section:\n\n- **Gelato 3.5g** (BATCH-2026-1005): 28.4% THC, 0.06% CBD. Terpenes: Myrcene 1.65%, Limonene 1.42%, Caryophyllene 0.88%. Tested by Confidence Analytics — all pass.\n- **Gelato Live Resin Cart 1g** (BATCH-2026-1012): 85.2% THC, 0.30% CBD. Terpenes: Myrcene 2.25%, Limonene 1.80%. Also Confidence Analytics — all pass.\n\nBoth batches have stellar terpene profiles. I\'ve added 6 Gelato 3.5g and 4 Gelato carts to your cart. You can check out whenever you\'re ready.',
        timestamp: '2026-03-04T14:04:00Z',
        cartActions: [
          { productId: 'prod-gl-35', productName: 'Gelato 3.5g', quantity: 6 },
          { productId: 'prod-gl-cart', productName: 'Gelato Live Resin Cart 1g', quantity: 4 },
        ],
      },
    ],
  },
  {
    id: 'ai-conv-003',
    title: 'Volume discount check',
    createdAt: '2026-03-02T11:00:00Z',
    messages: [
      {
        id: 'ai-msg-011',
        role: 'user',
        content: 'We\'re thinking about doing a big concentrate order for our 420 event. What kind of volume discounts can I get if I order a large quantity?',
        timestamp: '2026-03-02T11:00:00Z',
      },
      {
        id: 'ai-msg-012',
        role: 'assistant',
        content: 'Great timing — here are the volume breaks for concentrates:\n\n**Live Resin 1g** (base: $28/unit)\n- 12+ units: 5% off → $26.60/unit\n- 24+ units: 10% off → $25.20/unit\n- 48+ units: 15% off → $23.80/unit\n\n**Badder 1g** (base: $26/unit)\n- 12+ units: 5% off → $24.70/unit\n- 24+ units: 10% off → $23.40/unit\n- 48+ units: 15% off → $22.10/unit\n\nPlus you\'re on Tier 1 pricing which is already the best base rate. What quantities are you thinking?',
        timestamp: '2026-03-02T11:01:00Z',
      },
      {
        id: 'ai-msg-013',
        role: 'user',
        content: 'What if I did 24 Zkittlez Live Resin and 24 Wedding Cake Badder? What\'s the total savings compared to buying at base price?',
        timestamp: '2026-03-02T11:03:00Z',
      },
      {
        id: 'ai-msg-014',
        role: 'assistant',
        content: 'Here\'s the breakdown:\n\n**Zkittlez Live Resin 1g × 24**\n- Base price: 24 × $28.00 = $672.00\n- With 10% volume discount: 24 × $25.20 = $604.80\n- **Savings: $67.20**\n\n**Wedding Cake Badder 1g × 24**\n- Base price: 24 × $26.00 = $624.00\n- With 10% volume discount: 24 × $23.40 = $561.60\n- **Savings: $62.40**\n\n**Total order: $1,166.40** (vs. $1,296.00 at base price)\n**Total savings: $129.60 (10%)**\n\nIf you bumped each to 48 units, you\'d unlock the 15% tier and save $194.40 total instead. Want me to add either option to your cart?',
        timestamp: '2026-03-02T11:04:00Z',
        cartActions: [
          { productId: 'prod-zk-lr', productName: 'Zkittlez Live Resin 1g', quantity: 24 },
          { productId: 'prod-wc-badder', productName: 'Wedding Cake Badder 1g', quantity: 24 },
        ],
      },
    ],
  },
];

const CONVERSATIONS_BY_ACCOUNT: Record<string, PortalAIConversation[]> = {
  'acct-1': GREENFIELD_CONVERSATIONS,
};

export function getAIConversationsForAccount(accountId: string): PortalAIConversation[] {
  return CONVERSATIONS_BY_ACCOUNT[accountId] ?? [];
}
