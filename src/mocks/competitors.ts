import type {
  Competitor,
  CompetitorProduct,
  CompetitorAlert,
  CompetitorMetrics,
} from '@/modules/competitors/types';

function getDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// --- Competitors ---
const competitors: Competitor[] = [
  {
    id: 'comp-kush-gardens',
    name: 'Kush Gardens',
    description: 'Flower-focused brand with strong retail presence across WA. Known for premium indoor flower and aggressive budtender incentive programs.',
    categories: ['flower', 'preroll'],
    avgPrice: { flower: 32, preroll: 8 },
    storeCount: 18,
    marketShare: 22,
    trend: 'stable',
  },
  {
    id: 'comp-cloudnine',
    name: 'CloudNine Extracts',
    description: 'Vape and concentrate specialist. Vertically integrated with own extraction lab. Aggressive pricing strategy eating into cart market share.',
    categories: ['vaporizer', 'concentrate'],
    avgPrice: { vaporizer: 28, concentrate: 22 },
    storeCount: 15,
    marketShare: 18,
    trend: 'growing',
  },
  {
    id: 'comp-pacific-roots',
    name: 'Pacific Roots',
    description: 'Broad category mix, reliable mid-tier brand. Strong distribution network but limited brand differentiation.',
    categories: ['flower', 'preroll', 'edible', 'vaporizer'],
    avgPrice: { flower: 28, preroll: 7, edible: 18, vaporizer: 26 },
    storeCount: 12,
    marketShare: 15,
    trend: 'stable',
  },
  {
    id: 'comp-green-state',
    name: 'Green State Co',
    description: 'Edible specialist experiencing rapid growth. Their 25mg gummy line is the #1 seller in Puget Sound. Expanding into beverages.',
    categories: ['edible', 'beverage'],
    avgPrice: { edible: 15, beverage: 8 },
    storeCount: 8,
    marketShare: 8,
    trend: 'growing',
  },
  {
    id: 'comp-mountain-high',
    name: 'Mountain High',
    description: 'Budget brand racing to the bottom on price. High volume, low margin strategy. Losing shelf space at premium stores.',
    categories: ['flower', 'preroll', 'vaporizer'],
    avgPrice: { flower: 22, preroll: 5, vaporizer: 20 },
    storeCount: 20,
    marketShare: 12,
    trend: 'declining',
  },
  {
    id: 'comp-evergreen-premium',
    name: 'Evergreen Premium',
    description: 'New premium entrant targeting high-end flower and concentrate shelf. Small but growing fast. Directly targeting our premium accounts.',
    categories: ['flower', 'concentrate'],
    avgPrice: { flower: 42, concentrate: 35 },
    storeCount: 6,
    marketShare: 5,
    trend: 'growing',
  },
];

// --- Competitor Products ---
const competitorProducts: CompetitorProduct[] = [
  // Kush Gardens (5)
  { id: 'cp-kg-1', competitorId: 'comp-kush-gardens', competitorName: 'Kush Gardens', name: 'Reserve Flower Eighth', category: 'flower', subCategory: 'Indoor Premium', price: 35, ourComparable: 'Wedding Cake 3.5g', ourPrice: 38, stores: 18 },
  { id: 'cp-kg-2', competitorId: 'comp-kush-gardens', competitorName: 'Kush Gardens', name: 'Garden Select Eighth', category: 'flower', subCategory: 'Indoor Mid', price: 28, ourComparable: 'Blue Dream 3.5g', ourPrice: 32, stores: 18 },
  { id: 'cp-kg-3', competitorId: 'comp-kush-gardens', competitorName: 'Kush Gardens', name: 'Daily Roller 1g Pre-Roll', category: 'preroll', subCategory: 'Single', price: 8, ourComparable: 'OG Kush Pre-Roll 1g', ourPrice: 9, stores: 16 },
  { id: 'cp-kg-4', competitorId: 'comp-kush-gardens', competitorName: 'Kush Gardens', name: 'Party Pack 5-Pre-Rolls', category: 'preroll', subCategory: 'Multi-Pack', price: 30, ourComparable: 'Wedding Cake 5-Pack', ourPrice: 35, stores: 14 },
  { id: 'cp-kg-5', competitorId: 'comp-kush-gardens', competitorName: 'Kush Gardens', name: 'Kush Kones Infused 1g', category: 'preroll', subCategory: 'Infused', price: 15, stores: 10 },

  // CloudNine (6)
  { id: 'cp-cn-1', competitorId: 'comp-cloudnine', competitorName: 'CloudNine Extracts', name: 'Nimbus Live Resin Cart 1g', category: 'vaporizer', subCategory: 'Live Resin Cart', price: 28, ourComparable: 'Blue Dream Disposable 1g', ourPrice: 32, stores: 15 },
  { id: 'cp-cn-2', competitorId: 'comp-cloudnine', competitorName: 'CloudNine Extracts', name: 'Stratus 510 Cart 0.5g', category: 'vaporizer', subCategory: 'Distillate Cart', price: 18, ourComparable: 'Gelato 510 Cart 0.5g', ourPrice: 24, stores: 15 },
  { id: 'cp-cn-3', competitorId: 'comp-cloudnine', competitorName: 'CloudNine Extracts', name: 'Thunderhead Badder 1g', category: 'concentrate', subCategory: 'Badder', price: 22, ourComparable: 'Live Resin Badder 1g', ourPrice: 28, stores: 14 },
  { id: 'cp-cn-4', competitorId: 'comp-cloudnine', competitorName: 'CloudNine Extracts', name: 'Crystal Clear Shatter 1g', category: 'concentrate', subCategory: 'Shatter', price: 18, ourComparable: 'Shatter 1g', ourPrice: 22, stores: 12 },
  { id: 'cp-cn-5', competitorId: 'comp-cloudnine', competitorName: 'CloudNine Extracts', name: 'Cirrus Disposable 0.5g', category: 'vaporizer', subCategory: 'Disposable', price: 15, stores: 13 },
  { id: 'cp-cn-6', competitorId: 'comp-cloudnine', competitorName: 'CloudNine Extracts', name: 'Live Rosin 1g', category: 'concentrate', subCategory: 'Rosin', price: 35, stores: 8 },

  // Pacific Roots (5)
  { id: 'cp-pr-1', competitorId: 'comp-pacific-roots', competitorName: 'Pacific Roots', name: 'Roots Flower Eighth', category: 'flower', subCategory: 'Indoor', price: 28, ourComparable: 'GSC 3.5g', ourPrice: 32, stores: 12 },
  { id: 'cp-pr-2', competitorId: 'comp-pacific-roots', competitorName: 'Pacific Roots', name: 'Trail Mix Pre-Roll 1g', category: 'preroll', subCategory: 'Single', price: 7, ourComparable: 'Blue Dream Pre-Roll 1g', ourPrice: 9, stores: 12 },
  { id: 'cp-pr-3', competitorId: 'comp-pacific-roots', competitorName: 'Pacific Roots', name: 'Forest Fruit Gummies 10pk', category: 'edible', subCategory: 'Gummy', price: 18, ourComparable: 'Gummy 10-Pack 100mg', ourPrice: 20, stores: 10 },
  { id: 'cp-pr-4', competitorId: 'comp-pacific-roots', competitorName: 'Pacific Roots', name: 'Horizon 510 Cart 0.5g', category: 'vaporizer', subCategory: 'Distillate Cart', price: 22, ourComparable: 'Sour Diesel 510 Cart', ourPrice: 24, stores: 10 },
  { id: 'cp-pr-5', competitorId: 'comp-pacific-roots', competitorName: 'Pacific Roots', name: 'Campfire Chocolate Bar', category: 'edible', subCategory: 'Chocolate', price: 16, ourComparable: 'Chocolate Bar 4-Pack', ourPrice: 18, stores: 8 },

  // Green State (5)
  { id: 'cp-gs-1', competitorId: 'comp-green-state', competitorName: 'Green State Co', name: 'State Fair Gummies 25mg 10pk', category: 'edible', subCategory: 'Gummy', price: 15, ourComparable: 'Gummy 10-Pack 100mg', ourPrice: 20, stores: 8 },
  { id: 'cp-gs-2', competitorId: 'comp-green-state', competitorName: 'Green State Co', name: 'Peach Rings 10pk', category: 'edible', subCategory: 'Gummy', price: 15, stores: 8 },
  { id: 'cp-gs-3', competitorId: 'comp-green-state', competitorName: 'Green State Co', name: 'State Sips Lemonade', category: 'beverage', subCategory: 'Infused Drink', price: 8, ourComparable: 'Lemon Sparkling 4-Pack', ourPrice: 12, stores: 6 },
  { id: 'cp-gs-4', competitorId: 'comp-green-state', competitorName: 'Green State Co', name: 'Nano Gummies Fast-Acting 5pk', category: 'edible', subCategory: 'Nano', price: 18, stores: 5 },
  { id: 'cp-gs-5', competitorId: 'comp-green-state', competitorName: 'Green State Co', name: 'Mango Passion Seltzer', category: 'beverage', subCategory: 'Seltzer', price: 7, stores: 4 },

  // Mountain High (5)
  { id: 'cp-mh-1', competitorId: 'comp-mountain-high', competitorName: 'Mountain High', name: 'Value Eighth', category: 'flower', subCategory: 'Greenhouse', price: 22, stores: 20 },
  { id: 'cp-mh-2', competitorId: 'comp-mountain-high', competitorName: 'Mountain High', name: 'Quickie Pre-Roll 0.5g', category: 'preroll', subCategory: 'Half-Gram', price: 3, stores: 20 },
  { id: 'cp-mh-3', competitorId: 'comp-mountain-high', competitorName: 'Mountain High', name: 'Budget Cart 0.5g', category: 'vaporizer', subCategory: 'Distillate', price: 15, stores: 18 },
  { id: 'cp-mh-4', competitorId: 'comp-mountain-high', competitorName: 'Mountain High', name: 'Peak Pack 7-Pre-Rolls', category: 'preroll', subCategory: 'Value Pack', price: 18, stores: 16 },
  { id: 'cp-mh-5', competitorId: 'comp-mountain-high', competitorName: 'Mountain High', name: 'Summit Flower Quarter', category: 'flower', subCategory: 'Greenhouse', price: 45, stores: 14 },

  // Evergreen Premium (4)
  { id: 'cp-ep-1', competitorId: 'comp-evergreen-premium', competitorName: 'Evergreen Premium', name: 'Pinnacle Reserve Eighth', category: 'flower', subCategory: 'Ultra-Premium', price: 42, ourComparable: 'Wedding Cake 3.5g', ourPrice: 38, stores: 6 },
  { id: 'cp-ep-2', competitorId: 'comp-evergreen-premium', competitorName: 'Evergreen Premium', name: 'Single Origin Live Rosin 1g', category: 'concentrate', subCategory: 'Live Rosin', price: 45, ourComparable: 'Live Resin Badder 1g', ourPrice: 28, stores: 5 },
  { id: 'cp-ep-3', competitorId: 'comp-evergreen-premium', competitorName: 'Evergreen Premium', name: 'Artisan Flower Quarter', category: 'flower', subCategory: 'Ultra-Premium', price: 110, stores: 4 },
  { id: 'cp-ep-4', competitorId: 'comp-evergreen-premium', competitorName: 'Evergreen Premium', name: 'Heritage Hash Rosin 0.5g', category: 'concentrate', subCategory: 'Hash Rosin', price: 32, stores: 3 },
];

// --- Alerts ---
const competitorAlerts: CompetitorAlert[] = [
  { id: 'alert-1', type: 'gained-placement', competitorName: 'CloudNine Extracts', accountName: 'Pacific Leaf', details: 'Replaced our Gelato 510 Cart on the vape shelf — budtender says price was the deciding factor ($18 vs $24)', date: getDateOffset(-1), severity: 'high' },
  { id: 'alert-2', type: 'price-change', competitorName: 'Kush Gardens', accountName: '5 stores', details: 'Dropped flower eighth price by 12% across the board — $35 → $31. May trigger price pressure at shared accounts.', date: getDateOffset(-2), severity: 'medium' },
  { id: 'alert-3', type: 'new-product', competitorName: 'Green State Co', accountName: '8 stores', details: 'Launched new 25mg fast-acting nano gummy line. Premium positioning at $18/5pk. Targeting health-conscious consumers.', date: getDateOffset(-3), severity: 'medium' },
  { id: 'alert-4', type: 'gained-placement', competitorName: 'Evergreen Premium', accountName: 'Capitol Hill Collective', details: 'Now stocking concentrate shelf with Single Origin Live Rosin ($45/g). Targeting our premium concentrate buyers.', date: getDateOffset(-2), severity: 'high' },
  { id: 'alert-5', type: 'lost-placement', competitorName: 'Mountain High', accountName: 'Greenfield Dispensary', details: 'Lost pre-roll shelf space — Greenfield says budget pre-rolls weren\'t moving. Good news for our velocity.', date: getDateOffset(-4), severity: 'low' },
  { id: 'alert-6', type: 'price-change', competitorName: 'CloudNine Extracts', accountName: 'All stores', details: 'Introduced "Cirrus" disposable at $15/0.5g — undercutting category by 25%. Volume play.', date: getDateOffset(-5), severity: 'high' },
  { id: 'alert-7', type: 'gained-placement', competitorName: 'Pacific Roots', accountName: 'Emerald City Cannabis', details: 'New edible placement — Forest Fruit Gummies now on shelf alongside our Gummy 10-Pack', date: getDateOffset(-6), severity: 'medium' },
  { id: 'alert-8', type: 'new-product', competitorName: 'Evergreen Premium', accountName: '3 stores', details: 'Heritage Hash Rosin 0.5g at $32 — positioned as artisan/craft. Testing at 3 premium accounts.', date: getDateOffset(-7), severity: 'medium' },
  { id: 'alert-9', type: 'lost-placement', competitorName: 'Kush Gardens', accountName: 'Summit Collective', details: 'Lost one flower SKU to make room for our GSC 3.5g. Summit buyer cited better sell-through.', date: getDateOffset(-8), severity: 'low' },
  { id: 'alert-10', type: 'price-change', competitorName: 'Pacific Roots', accountName: '10 stores', details: 'Edible line now at $18 (was $20). Matching our price point. Focus on flavor variety as differentiator.', date: getDateOffset(-9), severity: 'medium' },
  { id: 'alert-11', type: 'gained-placement', competitorName: 'Green State Co', accountName: 'Summit Collective', details: 'Peach Rings gummies now featured in store endcap display. High visibility placement.', date: getDateOffset(-10), severity: 'medium' },
  { id: 'alert-12', type: 'new-product', competitorName: 'CloudNine Extracts', accountName: '8 stores', details: 'Live Rosin 1g at $35 — their first rosin product. Lab-tested at 82% THC. Competing with Evergreen at lower price.', date: getDateOffset(-12), severity: 'medium' },
  { id: 'alert-13', type: 'lost-placement', competitorName: 'CloudNine Extracts', accountName: 'Rainier Remedies', details: 'Lost our Sour Diesel 510 Cart placement. CloudNine Stratus cart took the spot at $18 vs our $24.', date: getDateOffset(-14), severity: 'high' },
  { id: 'alert-14', type: 'price-change', competitorName: 'Mountain High', accountName: '20 stores', details: 'Further reduced Value Eighth to $20 (was $22). Race to bottom continues. Not affecting our segment.', date: getDateOffset(-15), severity: 'low' },
  { id: 'alert-15', type: 'new-product', competitorName: 'Kush Gardens', accountName: '10 stores', details: 'Kush Kones Infused 1g pre-roll at $15. Live resin-infused. New premium pre-roll sub-category for them.', date: getDateOffset(-18), severity: 'medium' },
];

// --- Export Functions ---
export function getCompetitors(): Competitor[] {
  return competitors;
}

export function getCompetitorProducts(competitorId?: string): CompetitorProduct[] {
  if (competitorId) return competitorProducts.filter((p) => p.competitorId === competitorId);
  return competitorProducts;
}

export function getCompetitorAlerts(): CompetitorAlert[] {
  return competitorAlerts.sort((a, b) => b.date.localeCompare(a.date));
}

export function getCompetitorMetrics(): CompetitorMetrics {
  const highAlerts = competitorAlerts.filter((a) => {
    const daysAgo = (Date.now() - new Date(a.date).getTime()) / 86400000;
    return daysAgo <= 30;
  });
  const productsWithOurs = competitorProducts.filter((p) => p.ourPrice);
  const priceAdvantages = productsWithOurs.map((p) => ((p.ourPrice! - p.price) / p.ourPrice!) * -100);
  const avgAdvantage = priceAdvantages.length ? Math.round(priceAdvantages.reduce((s, v) => s + v, 0) / priceAdvantages.length) : 0;
  const lostThisMonth = competitorAlerts.filter((a) => {
    const daysAgo = (Date.now() - new Date(a.date).getTime()) / 86400000;
    return a.type === 'lost-placement' && daysAgo <= 30;
  }).length;

  return {
    competitorsTracked: competitors.length,
    ourMarketShare: 25,
    topThreat: 'CloudNine Extracts',
    recentAlerts: highAlerts.length,
    avgPriceAdvantage: avgAdvantage,
    placementsLostThisMonth: lostThisMonth,
  };
}
