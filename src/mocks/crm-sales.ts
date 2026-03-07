import type { ReorderProposal, PriceBookEntry, LeaderboardRep } from '@/modules/crm/types';
import { salesReps } from './crm';

// ── Reorder Proposals (20 total) ──

const reorderProposals: ReorderProposal[] = [
  // 8 Pending
  {
    id: 'prop-001',
    accountId: 'acct-greenfield',
    accountName: 'Greenfield Dispensary',
    proposedProducts: [
      { sku: 'FL-BD-8TH', name: 'Blue Dream Premium Flower — Eighth (3.5g)', category: 'flower', qty: 24, unitPrice: 28, lastOrderPrice: 28 },
      { sku: 'FL-WC-8TH', name: 'Wedding Cake Premium Flower — Eighth (3.5g)', category: 'flower', qty: 18, unitPrice: 32, lastOrderPrice: 30 },
      { sku: 'PR-BD-1G', name: 'Blue Dream Preroll — 1g Single', category: 'preroll', qty: 48, unitPrice: 6, lastOrderPrice: 6 },
    ],
    totalValue: 1536,
    confidence: 92,
    source: 'vmi-velocity',
    reasoning: 'This account orders every 10 days. Last order was 14 days ago. VMI shows Blue Dream 3.5g at 2.1 days remaining at current sell-through velocity. Wedding Cake is at 3.5 days. Preroll singles moving 6.8 units/day.',
    daysSinceLastOrder: 14,
    status: 'pending',
    createdAt: '2026-03-04T08:00:00Z',
    modifiedAt: '2026-03-04T08:00:00Z',
    draftEmail: 'Hi Sarah,\n\nHope business is going well at Greenfield! Based on your sell-through data, it looks like your Blue Dream eighths are running low — about 2 days of inventory left at current pace. I\'ve put together a restock suggestion that includes your top movers.\n\nWould love to get this out to you by Thursday. Let me know if you\'d like to adjust anything!\n\nBest,\nJake Morrison',
  },
  {
    id: 'prop-002',
    accountId: 'acct-rainier',
    accountName: 'Rainier Remedies',
    proposedProducts: [
      { sku: 'ED-GUM-10PK', name: 'Hybrid Gummies — 10pk (100mg)', category: 'edible', qty: 12, unitPrice: 14, lastOrderPrice: 14 },
      { sku: 'BV-SPK-4PK', name: 'Sparkling Lemonade — 4pk (40mg)', category: 'beverage', qty: 8, unitPrice: 6, lastOrderPrice: 6 },
    ],
    totalValue: 216,
    confidence: 58,
    source: 'cadence-analysis',
    reasoning: 'Rainier typically reorders edibles every 21 days. Current gap is 28 days — 33% overdue. Edible category is their fastest-growing segment (up 22% last quarter). Beverage sell-through has been inconsistent but trending positive since adding the sparkling line.',
    daysSinceLastOrder: 28,
    status: 'pending',
    createdAt: '2026-03-03T10:30:00Z',
    modifiedAt: '2026-03-03T10:30:00Z',
    draftEmail: 'Hi team at Rainier,\n\nI noticed your edible and beverage inventory might be getting low — it\'s been about 4 weeks since your last restock in those categories. Your gummies have been flying off shelves lately!\n\nI\'ve attached a suggested order. Happy to adjust quantities if you\'d like.\n\nCheers,\nCarlos Ruiz',
  },
  {
    id: 'prop-003',
    accountId: 'acct-olympic',
    accountName: 'Olympic Greens',
    proposedProducts: [
      { sku: 'PR-OGK-6PK', name: 'OG Kush Preroll — 6-Pack', category: 'preroll', qty: 30, unitPrice: 12, lastOrderPrice: 12 },
      { sku: 'PR-GG-1G', name: 'Gorilla Glue Preroll — 1g Single', category: 'preroll', qty: 60, unitPrice: 5, lastOrderPrice: 5 },
      { sku: 'PR-SD-INFUSED', name: 'Sour Diesel Infused Preroll — 1.5g', category: 'preroll', qty: 24, unitPrice: 10, lastOrderPrice: 10 },
      { sku: 'FL-OGK-QTR', name: 'OG Kush Premium Flower — Quarter (7g)', category: 'flower', qty: 12, unitPrice: 45, lastOrderPrice: 42 },
    ],
    totalValue: 1500,
    confidence: 85,
    source: 'vmi-velocity',
    reasoning: 'Olympic Greens is a preroll-heavy account (42% of revenue). VMI shows OG Kush 6-packs at 1.8 days remaining. Gorilla Glue singles are their #1 SKU by volume. Infused prerolls are a new addition — selling 3.2 units/day since intro. Added OG Kush flower as upsell based on preroll preference.',
    daysSinceLastOrder: 11,
    status: 'pending',
    createdAt: '2026-03-04T06:15:00Z',
    modifiedAt: '2026-03-04T06:15:00Z',
    draftEmail: 'Hey Olympic Greens team,\n\nYour preroll inventory is looking tight! OG Kush 6-packs are almost out and Gorilla Glue singles are moving fast. Also wanted to call out — those new infused Sour Diesel prerolls are selling great at 3+ units/day.\n\nI threw in some OG Kush quarter flower since your customers clearly love that strain. Thoughts?\n\nBest,\nPriya Patel',
  },
  {
    id: 'prop-004',
    accountId: 'acct-cascade',
    accountName: 'Cascade Wellness',
    proposedProducts: [
      { sku: 'VP-DIST-1G', name: 'Distillate Cartridge — 1g (Hybrid)', category: 'vaporizer', qty: 24, unitPrice: 22, lastOrderPrice: 22 },
      { sku: 'VP-LR-05G', name: 'Live Resin Pod — 0.5g (Indica)', category: 'vaporizer', qty: 18, unitPrice: 28, lastOrderPrice: 28 },
    ],
    totalValue: 1032,
    confidence: 78,
    source: 'cadence-analysis',
    reasoning: 'Cascade orders vaporizers bi-weekly. Last vape order was 16 days ago. Distillate carts are their consistent seller. Live resin pods added 6 weeks ago are showing strong repeat purchase at 75% reorder rate from initial trial.',
    daysSinceLastOrder: 16,
    status: 'pending',
    createdAt: '2026-03-04T09:00:00Z',
    modifiedAt: '2026-03-04T09:00:00Z',
    draftEmail: 'Hi Cascade team,\n\nTime for a vape restock? Your distillate carts are due for a refill, and those live resin pods have been performing really well — 75% reorder rate since you added them. Let me know!\n\nJake Morrison',
  },
  {
    id: 'prop-005',
    accountId: 'acct-puget-sound',
    accountName: 'Puget Sound Provisions',
    proposedProducts: [
      { sku: 'CN-SH-1G', name: 'Shatter — 1g (Sativa)', category: 'concentrate', qty: 12, unitPrice: 18, lastOrderPrice: 18 },
      { sku: 'CN-WAX-1G', name: 'Live Resin Wax — 1g (Hybrid)', category: 'concentrate', qty: 12, unitPrice: 24, lastOrderPrice: 22 },
      { sku: 'FL-JH-OZ', name: 'Jack Herer Premium Flower — Ounce (28g)', category: 'flower', qty: 6, unitPrice: 120, lastOrderPrice: 120 },
    ],
    totalValue: 1224,
    confidence: 71,
    source: 'vmi-velocity',
    reasoning: 'Puget Sound\'s concentrate category has grown 35% this quarter. Shatter is at 4.2 days of inventory. Live resin wax sell-through rate has doubled since price adjustment. Jack Herer ounces are their premium anchor SKU with zero stockouts in 6 months.',
    daysSinceLastOrder: 12,
    status: 'pending',
    createdAt: '2026-03-03T14:00:00Z',
    modifiedAt: '2026-03-03T14:00:00Z',
    draftEmail: 'Hi Puget Sound team,\n\nYour concentrate section is thriving — up 35% this quarter! Shatter is getting low and those live resin wax units are flying since the price tweak. I also added Jack Herer ounces to keep your premium shelf stocked.\n\nLet me know if this looks good!\n\nPriya Patel',
  },
  {
    id: 'prop-006',
    accountId: 'acct-summit',
    accountName: 'Summit Cannabis Co.',
    proposedProducts: [
      { sku: 'FL-GSC-8TH', name: 'Girl Scout Cookies Flower — Eighth (3.5g)', category: 'flower', qty: 36, unitPrice: 30, lastOrderPrice: 30 },
      { sku: 'ED-CHOC-BAR', name: 'Dark Chocolate Bar — 100mg', category: 'edible', qty: 20, unitPrice: 16, lastOrderPrice: 16 },
    ],
    totalValue: 1400,
    confidence: 65,
    source: 'cadence-analysis',
    reasoning: 'Summit\'s last order was 18 days ago vs. their typical 14-day cycle. GSC flower is consistently their #2 SKU. Chocolate bars have strong weekend sales pattern — inventory should be low going into the weekend rush.',
    daysSinceLastOrder: 18,
    status: 'pending',
    createdAt: '2026-03-02T11:00:00Z',
    modifiedAt: '2026-03-02T11:00:00Z',
    draftEmail: 'Hi Summit team,\n\nIt\'s been about 18 days since your last restock — a few days past your usual cycle. Wanted to make sure you\'re set for the weekend. GSC eighths and those chocolate bars tend to move fast Fri-Sun.\n\nHere\'s what I\'d suggest. Let me know!\n\nCarlos Ruiz',
  },
  {
    id: 'prop-007',
    accountId: 'acct-spokane-valley',
    accountName: 'Spokane Valley Dispensary',
    proposedProducts: [
      { sku: 'FL-NL-8TH', name: 'Northern Lights Flower — Eighth (3.5g)', category: 'flower', qty: 24, unitPrice: 26, lastOrderPrice: 26 },
      { sku: 'PR-NL-3PK', name: 'Northern Lights Preroll — 3-Pack', category: 'preroll', qty: 36, unitPrice: 8, lastOrderPrice: 8 },
    ],
    totalValue: 912,
    confidence: 55,
    source: 'cadence-analysis',
    reasoning: 'Spokane Valley has an inconsistent ordering pattern (12-22 day range). Currently at 19 days. Northern Lights is their signature strain — both flower and preroll formats. Lower confidence due to ordering variability.',
    daysSinceLastOrder: 19,
    status: 'pending',
    createdAt: '2026-03-03T16:00:00Z',
    modifiedAt: '2026-03-03T16:00:00Z',
    draftEmail: 'Hey Spokane Valley team,\n\nJust checking in — wanted to see if you need a Northern Lights restock. It\'s been about 19 days and I know that\'s your flagship strain. Happy to adjust the quantities.\n\nBest,\nCarlos Ruiz',
  },
  {
    id: 'prop-008',
    accountId: 'acct-capitol-hill',
    accountName: 'Capitol Hill Cannabis',
    proposedProducts: [
      { sku: 'VP-DISP-05G', name: 'Disposable Vape — 0.5g (Sativa)', category: 'vaporizer', qty: 36, unitPrice: 18, lastOrderPrice: 18 },
      { sku: 'ED-GUM-5PK', name: 'Sativa Gummies — 5pk (50mg)', category: 'edible', qty: 24, unitPrice: 10, lastOrderPrice: 10 },
    ],
    totalValue: 888,
    confidence: 74,
    source: 'vmi-velocity',
    reasoning: 'Capitol Hill caters to a younger demographic with strong disposable vape and gummy demand. VMI shows disposables at 3.1 days remaining. Sativa gummies 5-packs outsell indica 3:1 at this location.',
    daysSinceLastOrder: 13,
    status: 'pending',
    createdAt: '2026-03-04T07:30:00Z',
    modifiedAt: '2026-03-04T07:30:00Z',
    draftEmail: 'Hi Capitol Hill team,\n\nYour disposable vapes are running low — about 3 days of inventory left. Also thought you might want to top off those sativa gummies, they\'ve been outselling indica 3 to 1 for you.\n\nLet me know!\n\nJake Morrison',
  },

  // 5 Approved/Sent
  {
    id: 'prop-009',
    accountId: 'acct-pacific-leaf',
    accountName: 'Pacific Leaf',
    proposedProducts: [
      { sku: 'FL-PP-8TH', name: 'Purple Punch Flower — Eighth (3.5g)', category: 'flower', qty: 30, unitPrice: 30, lastOrderPrice: 30 },
      { sku: 'CN-RSN-1G', name: 'Rosin — 1g (Indica)', category: 'concentrate', qty: 12, unitPrice: 30, lastOrderPrice: 30 },
    ],
    totalValue: 1260,
    confidence: 88,
    source: 'vmi-velocity',
    reasoning: 'Pacific Leaf\'s premium customer base drives strong Purple Punch demand. Rosin is their highest-margin concentrate. VMI velocity shows both SKUs at < 3 days.',
    daysSinceLastOrder: 10,
    status: 'approved',
    createdAt: '2026-03-01T09:00:00Z',
    modifiedAt: '2026-03-03T14:00:00Z',
    draftEmail: 'Hi Pacific Leaf team,\n\nYour Purple Punch and rosin are getting low. Here\'s a suggested restock. Already approved on our end — just need your confirmation!\n\nBest,\nJake',
  },
  {
    id: 'prop-010',
    accountId: 'acct-emerald-city',
    accountName: 'Emerald City Cannabis',
    proposedProducts: [
      { sku: 'FL-GG-QTR', name: 'Gorilla Glue Flower — Quarter (7g)', category: 'flower', qty: 18, unitPrice: 42, lastOrderPrice: 42 },
      { sku: 'PR-MX-VARIETY', name: 'Mixed Strain Preroll Variety — 6-Pack', category: 'preroll', qty: 24, unitPrice: 11, lastOrderPrice: 11 },
      { sku: 'BV-TEA-6PK', name: 'Herbal CBD Tea — 6pk', category: 'beverage', qty: 12, unitPrice: 8, lastOrderPrice: 8 },
    ],
    totalValue: 1116,
    confidence: 82,
    source: 'cadence-analysis',
    reasoning: 'Emerald City is a high-volume account ordering every 8-10 days. Their variety-seeking customers drive strong preroll variety pack sales. CBD tea was a new add last month performing well.',
    daysSinceLastOrder: 9,
    status: 'sent',
    createdAt: '2026-02-28T10:00:00Z',
    modifiedAt: '2026-03-04T08:30:00Z',
    draftEmail: 'Hi Emerald City team,\n\nTime for your regular restock! GG quarters, the preroll variety packs, and a top-up on those CBD teas that have been moving well. Let me know!\n\nPriya Patel',
  },
  {
    id: 'prop-011',
    accountId: 'acct-harbor',
    accountName: 'Harbor Cannabis',
    proposedProducts: [
      { sku: 'FL-BD-QTR', name: 'Blue Dream Flower — Quarter (7g)', category: 'flower', qty: 12, unitPrice: 40, lastOrderPrice: 40 },
    ],
    totalValue: 480,
    confidence: 90,
    source: 'vmi-velocity',
    reasoning: 'Simple reorder — Harbor\'s Blue Dream quarters are their bread and butter. VMI shows 1.5 days remaining.',
    daysSinceLastOrder: 7,
    status: 'approved',
    createdAt: '2026-03-02T08:00:00Z',
    modifiedAt: '2026-03-04T10:00:00Z',
    draftEmail: 'Hi Harbor,\n\nBlue Dream quarters are almost out! Quick restock of 12 units — want me to ship tomorrow?\n\nJake',
  },
  {
    id: 'prop-012',
    accountId: 'acct-evergreen',
    accountName: 'Evergreen Wellness',
    proposedProducts: [
      { sku: 'ED-GUM-10PK', name: 'Hybrid Gummies — 10pk (100mg)', category: 'edible', qty: 24, unitPrice: 14, lastOrderPrice: 14 },
      { sku: 'ED-MINT-TIN', name: 'Peppermint Mints — Tin (20ct, 100mg)', category: 'edible', qty: 18, unitPrice: 12, lastOrderPrice: 12 },
    ],
    totalValue: 552,
    confidence: 76,
    source: 'cadence-analysis',
    reasoning: 'Evergreen leans edible-heavy (38% of revenue). Both gummies and mints have consistent reorder cycles. 15 days since last edible order vs. 12-day average.',
    daysSinceLastOrder: 15,
    status: 'sent',
    createdAt: '2026-03-01T11:00:00Z',
    modifiedAt: '2026-03-03T16:00:00Z',
    draftEmail: 'Hi Evergreen team,\n\nYour edibles are due for a restock! Gummies and mints are your top two — here\'s a suggested order to keep you stocked through next week.\n\nCarlos',
  },
  {
    id: 'prop-013',
    accountId: 'acct-cascade',
    accountName: 'Cascade Wellness',
    proposedProducts: [
      { sku: 'FL-WC-8TH', name: 'Wedding Cake Flower — Eighth (3.5g)', category: 'flower', qty: 24, unitPrice: 32, lastOrderPrice: 32 },
    ],
    totalValue: 768,
    confidence: 80,
    source: 'vmi-velocity',
    reasoning: 'Cascade\'s Wedding Cake is their #1 flower SKU. VMI velocity: 2.8 days remaining. This is a supplemental flower order on top of the vape proposal.',
    daysSinceLastOrder: 16,
    status: 'approved',
    createdAt: '2026-03-02T13:00:00Z',
    modifiedAt: '2026-03-04T09:30:00Z',
    draftEmail: 'Hi Cascade,\n\nSeparate from the vape order — your Wedding Cake eighths are getting low. Want to add 24 units to your next delivery?\n\nJake',
  },

  // 4 Ordered (converted)
  {
    id: 'prop-014',
    accountId: 'acct-greenfield',
    accountName: 'Greenfield Dispensary',
    proposedProducts: [
      { sku: 'ED-CHOC-BAR', name: 'Dark Chocolate Bar — 100mg', category: 'edible', qty: 18, unitPrice: 16, lastOrderPrice: 16 },
      { sku: 'BV-LEMON-CAN', name: 'Lemon Sparkling Water — Single (10mg)', category: 'beverage', qty: 48, unitPrice: 4, lastOrderPrice: 4 },
    ],
    totalValue: 480,
    confidence: 87,
    source: 'vmi-velocity',
    reasoning: 'Greenfield\'s edible and beverage categories showed low inventory. Chocolate bars at 2 days remaining. Lemon sparkling water is their highest-velocity beverage SKU at 7 units/day.',
    daysSinceLastOrder: 3,
    status: 'ordered',
    createdAt: '2026-02-25T08:00:00Z',
    modifiedAt: '2026-03-01T10:00:00Z',
    draftEmail: 'Order placed and confirmed.',
  },
  {
    id: 'prop-015',
    accountId: 'acct-pacific-leaf',
    accountName: 'Pacific Leaf',
    proposedProducts: [
      { sku: 'VP-LR-1G', name: 'Live Resin Cartridge — 1g (Sativa)', category: 'vaporizer', qty: 18, unitPrice: 35, lastOrderPrice: 35 },
    ],
    totalValue: 630,
    confidence: 91,
    source: 'vmi-velocity',
    reasoning: 'Pacific Leaf\'s live resin carts are their premium vape offering. Consistent 9-day reorder cycle.',
    daysSinceLastOrder: 5,
    status: 'ordered',
    createdAt: '2026-02-26T09:00:00Z',
    modifiedAt: '2026-03-01T14:00:00Z',
    draftEmail: 'Order placed and confirmed.',
  },
  {
    id: 'prop-016',
    accountId: 'acct-olympic',
    accountName: 'Olympic Greens',
    proposedProducts: [
      { sku: 'PR-BD-1G', name: 'Blue Dream Preroll — 1g Single', category: 'preroll', qty: 72, unitPrice: 6, lastOrderPrice: 6 },
      { sku: 'PR-SD-1G', name: 'Sour Diesel Preroll — 1g Single', category: 'preroll', qty: 48, unitPrice: 5, lastOrderPrice: 5 },
    ],
    totalValue: 672,
    confidence: 89,
    source: 'vmi-velocity',
    reasoning: 'Olympic\'s preroll singles are their volume drivers. Both strains at < 2 days inventory.',
    daysSinceLastOrder: 4,
    status: 'ordered',
    createdAt: '2026-02-24T07:00:00Z',
    modifiedAt: '2026-02-28T11:00:00Z',
    draftEmail: 'Order placed and confirmed.',
  },
  {
    id: 'prop-017',
    accountId: 'acct-puget-sound',
    accountName: 'Puget Sound Provisions',
    proposedProducts: [
      { sku: 'FL-BD-8TH', name: 'Blue Dream Flower — Eighth (3.5g)', category: 'flower', qty: 36, unitPrice: 28, lastOrderPrice: 28 },
      { sku: 'FL-JH-8TH', name: 'Jack Herer Flower — Eighth (3.5g)', category: 'flower', qty: 24, unitPrice: 30, lastOrderPrice: 30 },
    ],
    totalValue: 1728,
    confidence: 83,
    source: 'cadence-analysis',
    reasoning: 'Puget Sound\'s flower reorder is right on schedule at 14 days. Blue Dream and Jack Herer are their top 2 flower SKUs.',
    daysSinceLastOrder: 6,
    status: 'ordered',
    createdAt: '2026-02-23T10:00:00Z',
    modifiedAt: '2026-02-27T09:00:00Z',
    draftEmail: 'Order placed and confirmed.',
  },

  // 3 Rejected
  {
    id: 'prop-018',
    accountId: 'acct-summit',
    accountName: 'Summit Cannabis Co.',
    proposedProducts: [
      { sku: 'BV-COLD-BREW', name: 'Cannabis Cold Brew Coffee — 12oz (20mg)', category: 'beverage', qty: 24, unitPrice: 7, lastOrderPrice: 7 },
    ],
    totalValue: 168,
    confidence: 42,
    source: 'manual',
    reasoning: 'Attempted beverage category expansion. Summit has not previously carried cannabis beverages. Low confidence due to unknown demand.',
    daysSinceLastOrder: 18,
    status: 'rejected',
    createdAt: '2026-02-20T09:00:00Z',
    modifiedAt: '2026-02-22T11:00:00Z',
    draftEmail: 'Rejected — account not interested in beverages at this time.',
  },
  {
    id: 'prop-019',
    accountId: 'acct-rainier',
    accountName: 'Rainier Remedies',
    proposedProducts: [
      { sku: 'CN-BATTER-1G', name: 'Batter — 1g (Hybrid)', category: 'concentrate', qty: 18, unitPrice: 22, lastOrderPrice: 0 },
    ],
    totalValue: 396,
    confidence: 38,
    source: 'manual',
    reasoning: 'Category expansion attempt — Rainier doesn\'t currently carry concentrates. Their customer demo skews older and may not have demand.',
    daysSinceLastOrder: 28,
    status: 'rejected',
    createdAt: '2026-02-18T14:00:00Z',
    modifiedAt: '2026-02-20T10:00:00Z',
    draftEmail: 'Rejected — wrong product fit for customer base.',
  },
  {
    id: 'prop-020',
    accountId: 'acct-spokane-valley',
    accountName: 'Spokane Valley Dispensary',
    proposedProducts: [
      { sku: 'VP-DISP-1G', name: 'Disposable Vape — 1g (Indica)', category: 'vaporizer', qty: 24, unitPrice: 22, lastOrderPrice: 22 },
    ],
    totalValue: 528,
    confidence: 60,
    source: 'cadence-analysis',
    reasoning: 'Spokane Valley\'s vape reorder was flagged but they had already ordered from a competitor. Timing issue.',
    daysSinceLastOrder: 19,
    status: 'rejected',
    createdAt: '2026-02-15T08:00:00Z',
    modifiedAt: '2026-02-17T16:00:00Z',
    draftEmail: 'Rejected — account sourced from competitor.',
  },
];

// ── Price Book (40 products) ──

const priceBook: PriceBookEntry[] = [
  // Flower (10)
  { id: 'pb-001', productName: 'Blue Dream Premium Flower', category: 'flower', subCategory: 'sativa-dominant', packageSize: 'Eighth (3.5g)', defaultPrice: 28, cost: 14, margin: 50, tier1Price: 25.20, tier2Price: 28, tier3Price: 29.40 },
  { id: 'pb-002', productName: 'Wedding Cake Premium Flower', category: 'flower', subCategory: 'hybrid', packageSize: 'Eighth (3.5g)', defaultPrice: 32, cost: 16, margin: 50, tier1Price: 28.80, tier2Price: 32, tier3Price: 33.60 },
  { id: 'pb-003', productName: 'OG Kush Premium Flower', category: 'flower', subCategory: 'indica', packageSize: 'Quarter (7g)', defaultPrice: 45, cost: 22, margin: 51, tier1Price: 40.50, tier2Price: 45, tier3Price: 47.25 },
  { id: 'pb-004', productName: 'Girl Scout Cookies Flower', category: 'flower', subCategory: 'hybrid', packageSize: 'Eighth (3.5g)', defaultPrice: 30, cost: 15, margin: 50, tier1Price: 27, tier2Price: 30, tier3Price: 31.50 },
  { id: 'pb-005', productName: 'Jack Herer Premium Flower', category: 'flower', subCategory: 'sativa', packageSize: 'Ounce (28g)', defaultPrice: 120, cost: 55, margin: 54, tier1Price: 108, tier2Price: 120, tier3Price: 126 },
  { id: 'pb-006', productName: 'Northern Lights Flower', category: 'flower', subCategory: 'indica', packageSize: 'Eighth (3.5g)', defaultPrice: 26, cost: 13, margin: 50, tier1Price: 23.40, tier2Price: 26, tier3Price: 27.30 },
  { id: 'pb-007', productName: 'Purple Punch Flower', category: 'flower', subCategory: 'indica', packageSize: 'Eighth (3.5g)', defaultPrice: 30, cost: 14, margin: 53, tier1Price: 27, tier2Price: 30, tier3Price: 31.50 },
  { id: 'pb-008', productName: 'Gorilla Glue Flower', category: 'flower', subCategory: 'hybrid', packageSize: 'Quarter (7g)', defaultPrice: 42, cost: 20, margin: 52, tier1Price: 37.80, tier2Price: 42, tier3Price: 44.10 },
  { id: 'pb-009', productName: 'Blue Dream Flower', category: 'flower', subCategory: 'sativa-dominant', packageSize: 'Quarter (7g)', defaultPrice: 40, cost: 20, margin: 50, tier1Price: 36, tier2Price: 40, tier3Price: 42 },
  { id: 'pb-010', productName: 'Sour Diesel Flower', category: 'flower', subCategory: 'sativa', packageSize: 'Eighth (3.5g)', defaultPrice: 28, cost: 13, margin: 54, tier1Price: 25.20, tier2Price: 28, tier3Price: 29.40 },

  // Prerolls (7)
  { id: 'pb-011', productName: 'Blue Dream Preroll Single', category: 'preroll', subCategory: 'classic', packageSize: '1g Single', defaultPrice: 6, cost: 2.50, margin: 58, tier1Price: 5.40, tier2Price: 6, tier3Price: 6.30 },
  { id: 'pb-012', productName: 'Gorilla Glue Preroll Single', category: 'preroll', subCategory: 'classic', packageSize: '1g Single', defaultPrice: 5, cost: 2, margin: 60, tier1Price: 4.50, tier2Price: 5, tier3Price: 5.25 },
  { id: 'pb-013', productName: 'OG Kush Preroll 6-Pack', category: 'preroll', subCategory: 'classic', packageSize: '6-Pack (6g)', defaultPrice: 12, cost: 5, margin: 58, tier1Price: 10.80, tier2Price: 12, tier3Price: 12.60 },
  { id: 'pb-014', productName: 'Sour Diesel Infused Preroll', category: 'preroll', subCategory: 'infused', packageSize: '1.5g Single', defaultPrice: 10, cost: 4, margin: 60, tier1Price: 9, tier2Price: 10, tier3Price: 10.50 },
  { id: 'pb-015', productName: 'Northern Lights Preroll 3-Pack', category: 'preroll', subCategory: 'classic', packageSize: '3-Pack (3g)', defaultPrice: 8, cost: 3.50, margin: 56, tier1Price: 7.20, tier2Price: 8, tier3Price: 8.40 },
  { id: 'pb-016', productName: 'Mixed Strain Variety 6-Pack', category: 'preroll', subCategory: 'variety', packageSize: '6-Pack (6g)', defaultPrice: 11, cost: 4.50, margin: 59, tier1Price: 9.90, tier2Price: 11, tier3Price: 11.55 },
  { id: 'pb-017', productName: 'Sour Diesel Preroll Single', category: 'preroll', subCategory: 'classic', packageSize: '1g Single', defaultPrice: 5, cost: 2, margin: 60, tier1Price: 4.50, tier2Price: 5, tier3Price: 5.25 },

  // Vaporizers (7)
  { id: 'pb-018', productName: 'Distillate Cartridge (Hybrid)', category: 'vaporizer', subCategory: 'distillate', packageSize: '1g Cart', defaultPrice: 22, cost: 10, margin: 55, tier1Price: 19.80, tier2Price: 22, tier3Price: 23.10 },
  { id: 'pb-019', productName: 'Live Resin Pod (Indica)', category: 'vaporizer', subCategory: 'live-resin', packageSize: '0.5g Pod', defaultPrice: 28, cost: 14, margin: 50, tier1Price: 25.20, tier2Price: 28, tier3Price: 29.40 },
  { id: 'pb-020', productName: 'Live Resin Cartridge (Sativa)', category: 'vaporizer', subCategory: 'live-resin', packageSize: '1g Cart', defaultPrice: 35, cost: 16, margin: 54, tier1Price: 31.50, tier2Price: 35, tier3Price: 36.75 },
  { id: 'pb-021', productName: 'Disposable Vape (Sativa)', category: 'vaporizer', subCategory: 'disposable', packageSize: '0.5g Disp', defaultPrice: 18, cost: 8, margin: 56, tier1Price: 16.20, tier2Price: 18, tier3Price: 18.90 },
  { id: 'pb-022', productName: 'Disposable Vape (Indica)', category: 'vaporizer', subCategory: 'disposable', packageSize: '1g Disp', defaultPrice: 22, cost: 10, margin: 55, tier1Price: 19.80, tier2Price: 22, tier3Price: 23.10 },
  { id: 'pb-023', productName: 'Distillate Cartridge (Sativa)', category: 'vaporizer', subCategory: 'distillate', packageSize: '0.5g Cart', defaultPrice: 18, cost: 8, margin: 56, tier1Price: 16.20, tier2Price: 18, tier3Price: 18.90 },
  { id: 'pb-024', productName: 'Rosin Pod (Hybrid)', category: 'vaporizer', subCategory: 'rosin', packageSize: '0.5g Pod', defaultPrice: 32, cost: 16, margin: 50, tier1Price: 28.80, tier2Price: 32, tier3Price: 33.60 },

  // Concentrates (6)
  { id: 'pb-025', productName: 'Shatter (Sativa)', category: 'concentrate', subCategory: 'shatter', packageSize: '1g', defaultPrice: 18, cost: 8, margin: 56, tier1Price: 16.20, tier2Price: 18, tier3Price: 18.90 },
  { id: 'pb-026', productName: 'Live Resin Wax (Hybrid)', category: 'concentrate', subCategory: 'wax', packageSize: '1g', defaultPrice: 24, cost: 11, margin: 54, tier1Price: 21.60, tier2Price: 24, tier3Price: 25.20 },
  { id: 'pb-027', productName: 'Rosin (Indica)', category: 'concentrate', subCategory: 'rosin', packageSize: '1g', defaultPrice: 30, cost: 14, margin: 53, tier1Price: 27, tier2Price: 30, tier3Price: 31.50 },
  { id: 'pb-028', productName: 'Batter (Hybrid)', category: 'concentrate', subCategory: 'batter', packageSize: '1g', defaultPrice: 22, cost: 10, margin: 55, tier1Price: 19.80, tier2Price: 22, tier3Price: 23.10 },
  { id: 'pb-029', productName: 'Crumble (Sativa)', category: 'concentrate', subCategory: 'crumble', packageSize: '1g', defaultPrice: 20, cost: 9, margin: 55, tier1Price: 18, tier2Price: 20, tier3Price: 21 },
  { id: 'pb-030', productName: 'Diamonds & Sauce', category: 'concentrate', subCategory: 'diamonds', packageSize: '1g', defaultPrice: 28, cost: 13, margin: 54, tier1Price: 25.20, tier2Price: 28, tier3Price: 29.40 },

  // Edibles (6)
  { id: 'pb-031', productName: 'Hybrid Gummies 10pk', category: 'edible', subCategory: 'gummies', packageSize: '10pk (100mg)', defaultPrice: 14, cost: 6, margin: 57, tier1Price: 12.60, tier2Price: 14, tier3Price: 14.70 },
  { id: 'pb-032', productName: 'Sativa Gummies 5pk', category: 'edible', subCategory: 'gummies', packageSize: '5pk (50mg)', defaultPrice: 10, cost: 4, margin: 60, tier1Price: 9, tier2Price: 10, tier3Price: 10.50 },
  { id: 'pb-033', productName: 'Dark Chocolate Bar', category: 'edible', subCategory: 'chocolate', packageSize: 'Bar (100mg)', defaultPrice: 16, cost: 7, margin: 56, tier1Price: 14.40, tier2Price: 16, tier3Price: 16.80 },
  { id: 'pb-034', productName: 'Peppermint Mints Tin', category: 'edible', subCategory: 'mints', packageSize: 'Tin 20ct (100mg)', defaultPrice: 12, cost: 5, margin: 58, tier1Price: 10.80, tier2Price: 12, tier3Price: 12.60 },
  { id: 'pb-035', productName: 'Indica Caramels 10pk', category: 'edible', subCategory: 'caramels', packageSize: '10pk (100mg)', defaultPrice: 15, cost: 6.50, margin: 57, tier1Price: 13.50, tier2Price: 15, tier3Price: 15.75 },
  { id: 'pb-036', productName: 'CBD:THC Gummies 1:1', category: 'edible', subCategory: 'gummies', packageSize: '10pk (50:50mg)', defaultPrice: 18, cost: 8, margin: 56, tier1Price: 16.20, tier2Price: 18, tier3Price: 18.90 },

  // Beverages (4)
  { id: 'pb-037', productName: 'Sparkling Lemonade 4pk', category: 'beverage', subCategory: 'sparkling', packageSize: '4pk (40mg)', defaultPrice: 6, cost: 2.50, margin: 58, tier1Price: 5.40, tier2Price: 6, tier3Price: 6.30 },
  { id: 'pb-038', productName: 'Lemon Sparkling Water Single', category: 'beverage', subCategory: 'sparkling', packageSize: 'Can (10mg)', defaultPrice: 4, cost: 1.80, margin: 55, tier1Price: 3.60, tier2Price: 4, tier3Price: 4.20 },
  { id: 'pb-039', productName: 'Cannabis Cold Brew Coffee', category: 'beverage', subCategory: 'coffee', packageSize: '12oz (20mg)', defaultPrice: 7, cost: 3, margin: 57, tier1Price: 6.30, tier2Price: 7, tier3Price: 7.35 },
  { id: 'pb-040', productName: 'Herbal CBD Tea 6pk', category: 'beverage', subCategory: 'tea', packageSize: '6pk', defaultPrice: 8, cost: 3.50, margin: 56, tier1Price: 7.20, tier2Price: 8, tier3Price: 8.40 },
];

// ── Leaderboard (4 reps) ──

const leaderboardData: LeaderboardRep[] = [
  {
    ...salesReps[0], // Jake Morrison
    rank: 1,
    periodRevenue: 485200,
    periodOrders: 156,
    newAccounts: 3,
    healthImprovement: 8,
    proposalAcceptRate: 82,
    trend: 'up',
    streakDays: 14,
    goalProgress: 94,
    topAccounts: [
      { name: 'Greenfield Dispensary', revenue: 89400 },
      { name: 'Pacific Leaf', revenue: 72100 },
      { name: 'Capitol Hill Cannabis', revenue: 58300 },
      { name: 'Harbor Cannabis', revenue: 45200 },
      { name: 'Cascade Wellness', revenue: 41800 },
    ],
  },
  {
    ...salesReps[1], // Priya Patel
    rank: 2,
    periodRevenue: 362400,
    periodOrders: 118,
    newAccounts: 2,
    healthImprovement: 5,
    proposalAcceptRate: 75,
    trend: 'up',
    streakDays: 8,
    goalProgress: 81,
    topAccounts: [
      { name: 'Emerald City Cannabis', revenue: 68200 },
      { name: 'Olympic Greens', revenue: 54800 },
      { name: 'Puget Sound Provisions', revenue: 48100 },
      { name: 'Evergreen Wellness', revenue: 38600 },
      { name: 'Summit Cannabis Co.', revenue: 32200 },
    ],
  },
  {
    ...salesReps[2], // Carlos Ruiz
    rank: 3,
    periodRevenue: 198700,
    periodOrders: 72,
    newAccounts: 4,
    healthImprovement: 12,
    proposalAcceptRate: 68,
    trend: 'down',
    streakDays: 3,
    goalProgress: 58,
    topAccounts: [
      { name: 'Spokane Valley Dispensary', revenue: 42100 },
      { name: 'Rainier Remedies', revenue: 35800 },
      { name: 'Cascade Wellness', revenue: 28400 },
      { name: 'Summit Cannabis Co.', revenue: 22100 },
      { name: 'Harbor Cannabis', revenue: 18600 },
    ],
  },
  {
    ...salesReps[3], // Dana Whitfield (manager — not ranked)
    rank: 0,
    periodRevenue: 1046300,
    periodOrders: 346,
    newAccounts: 9,
    healthImprovement: 25,
    proposalAcceptRate: 76,
    trend: 'up',
    streakDays: 0,
    goalProgress: 82,
    topAccounts: [
      { name: 'Greenfield Dispensary', revenue: 89400 },
      { name: 'Pacific Leaf', revenue: 72100 },
      { name: 'Emerald City Cannabis', revenue: 68200 },
      { name: 'Olympic Greens', revenue: 54800 },
      { name: 'Puget Sound Provisions', revenue: 48100 },
    ],
  },
];

// ── Async Factory Functions ──

export async function getReorderProposals(filters?: {
  status?: string;
  source?: string;
}): Promise<ReorderProposal[]> {
  await new Promise((r) => setTimeout(r, 300));
  let result = [...reorderProposals];
  if (filters?.status) {
    result = result.filter((p) => p.status === filters.status);
  }
  if (filters?.source) {
    result = result.filter((p) => p.source === filters.source);
  }
  return result;
}

export async function getPriceBook(filters?: {
  category?: string;
  search?: string;
}): Promise<PriceBookEntry[]> {
  await new Promise((r) => setTimeout(r, 300));
  let result = [...priceBook];
  if (filters?.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.productName.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q),
    );
  }
  return result;
}

export async function getLeaderboardData(
  period?: string,
): Promise<LeaderboardRep[]> {
  void period;
  await new Promise((r) => setTimeout(r, 300));
  return [...leaderboardData];
}
