import type {
  BlogPost,
  SEOKeyword,
  Event,
  AdCampaign,
  MerchItem,
  SEOMetrics,
  EventMetrics,
  AdMetrics,
} from '@/modules/marketing/types/seo-events';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ─── Blog Posts (10) ───────────────────────────────────────────

const blogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Understanding Terpenes: Your Guide to Cannabis Flavor Profiles',
    slug: 'understanding-terpenes-guide',
    status: 'published',
    author: 'Sarah Chen',
    publishedDate: '2026-01-15',
    content: 'Terpenes are aromatic compounds found in cannabis that give each strain its unique flavor and aroma profile. From the citrusy limonene to the earthy myrcene, understanding terpenes can help consumers make more informed choices about their cannabis experience.',
    seoScore: 85,
    metaTitle: 'Understanding Terpenes: Complete Guide to Cannabis Flavors | Frost',
    metaDescription: 'Learn about cannabis terpenes, their effects, and how they shape your experience. Comprehensive guide to limonene, myrcene, pinene, and more.',
    targetKeyword: 'cannabis terpenes guide',
    wordCount: 2400,
    readTime: 10,
    views: 2400,
    avgTimeOnPage: 245,
  },
  {
    id: 'blog-2',
    title: 'Indica vs Sativa: What the Science Actually Says',
    slug: 'indica-vs-sativa-science',
    status: 'published',
    author: 'Sarah Chen',
    publishedDate: '2026-01-28',
    content: 'The indica vs sativa distinction is one of the most common ways consumers choose cannabis, but modern research suggests the reality is more nuanced. Chemical profiles, not plant morphology, determine effects.',
    seoScore: 78,
    metaTitle: 'Indica vs Sativa: The Science Behind Cannabis Strains | Frost',
    metaDescription: 'Discover what science really says about indica vs sativa cannabis strains. Learn why terpenes and cannabinoids matter more than plant type.',
    targetKeyword: 'indica vs sativa',
    wordCount: 1800,
    readTime: 8,
    views: 1800,
    avgTimeOnPage: 198,
  },
  {
    id: 'blog-3',
    title: 'How to Choose the Right Cannabis Product for You',
    slug: 'choose-right-cannabis-product',
    status: 'published',
    author: 'Marcus Rivera',
    publishedDate: '2026-02-05',
    content: 'With flower, pre-rolls, vaporizers, concentrates, edibles, and beverages all available, choosing the right cannabis product can feel overwhelming. This guide walks you through each category to find your ideal match.',
    seoScore: 92,
    metaTitle: 'How to Choose the Right Cannabis Product | Frost Guide',
    metaDescription: 'Complete guide to choosing between cannabis flower, edibles, vapes, concentrates, and more. Find the perfect product for your needs.',
    targetKeyword: 'choose cannabis product',
    wordCount: 3200,
    readTime: 13,
    views: 1450,
    avgTimeOnPage: 312,
  },
  {
    id: 'blog-4',
    title: 'The Art of Live Resin: From Plant to Cart',
    slug: 'art-of-live-resin',
    status: 'draft',
    author: 'Sarah Chen',
    content: 'Live resin has become one of the most popular cannabis concentrate formats. Unlike traditional extracts, live resin is made from fresh-frozen cannabis, preserving the full terpene profile of the living plant.',
    seoScore: 72,
    metaTitle: 'The Art of Live Resin: How Its Made & Why Its Special | Frost',
    metaDescription: 'Explore the live resin production process, from fresh-frozen cannabis to finished cartridge. Learn what makes live resin unique.',
    targetKeyword: 'live resin carts',
    wordCount: 2100,
    readTime: 9,
  },
  {
    id: 'blog-5',
    title: 'Washington State Cannabis Laws: What Consumers Need to Know',
    slug: 'washington-state-cannabis-laws',
    status: 'published',
    author: 'Marcus Rivera',
    publishedDate: '2025-12-10',
    content: 'Washington was one of the first states to legalize recreational cannabis in 2012. Understanding current laws around purchasing, possession, consumption, and driving helps consumers stay compliant.',
    seoScore: 88,
    metaTitle: 'Washington State Cannabis Laws 2026: Consumer Guide | Frost',
    metaDescription: 'Everything you need to know about Washington state cannabis laws in 2026. Purchase limits, consumption rules, and driving regulations.',
    targetKeyword: 'washington cannabis laws',
    wordCount: 2800,
    readTime: 12,
    views: 3100,
    avgTimeOnPage: 267,
  },
  {
    id: 'blog-6',
    title: 'Cannabis Edibles Dosing Guide for Beginners',
    slug: 'edibles-dosing-guide-beginners',
    status: 'idea',
    author: 'Sarah Chen',
    content: '',
    seoScore: 0,
    metaTitle: 'Cannabis Edibles Dosing Guide for Beginners | Frost',
    metaDescription: '',
    targetKeyword: 'cannabis edibles dosing',
    wordCount: 0,
    readTime: 0,
  },
  {
    id: 'blog-7',
    title: 'Top 10 Cannabis Strains for Relaxation',
    slug: 'top-strains-relaxation',
    status: 'idea',
    author: 'Marcus Rivera',
    content: '',
    seoScore: 0,
    metaTitle: 'Top 10 Cannabis Strains for Relaxation | Frost',
    metaDescription: '',
    targetKeyword: 'cannabis strains relaxation',
    wordCount: 0,
    readTime: 0,
  },
  {
    id: 'blog-8',
    title: 'Pre-Rolls vs Flower: Which Is Right for You?',
    slug: 'pre-rolls-vs-flower',
    status: 'draft',
    author: 'Sarah Chen',
    content: 'The convenience of pre-rolls versus the customization of loose flower — its a debate that comes down to lifestyle, occasion, and personal preference. Heres how to decide.',
    seoScore: 65,
    metaTitle: 'Pre-Rolls vs Flower: Complete Comparison Guide | Frost',
    metaDescription: 'Compare cannabis pre-rolls and flower. Pros, cons, cost analysis, and when to choose each format.',
    targetKeyword: 'pre-rolls vs flower',
    wordCount: 1400,
    readTime: 6,
  },
  {
    id: 'blog-9',
    title: 'How Cannabis Beverages Are Changing the Market',
    slug: 'cannabis-beverages-market',
    status: 'draft',
    author: 'Marcus Rivera',
    content: 'Cannabis-infused beverages represent one of the fastest-growing segments in the legal market. From seltzers to mocktails, the category is attracting consumers who never considered traditional cannabis products.',
    seoScore: 70,
    metaTitle: 'Cannabis Beverages: Market Trends & Product Guide | Frost',
    metaDescription: 'Explore the booming cannabis beverage market. THC seltzers, infused mocktails, and why beverages are the next big thing.',
    targetKeyword: 'cannabis beverages',
    wordCount: 1600,
    readTime: 7,
  },
  {
    id: 'blog-10',
    title: 'What Are COAs and Why Should You Care?',
    slug: 'what-are-coas',
    status: 'review',
    author: 'Sarah Chen',
    content: 'Certificates of Analysis (COAs) are third-party lab reports that verify the contents of cannabis products. Understanding COAs empowers consumers to make safer, more informed purchasing decisions.',
    seoScore: 76,
    metaTitle: 'What Are COAs? Cannabis Lab Testing Explained | Frost',
    metaDescription: 'Learn to read cannabis Certificates of Analysis (COAs). Understand potency, terpene profiles, and contaminant testing.',
    targetKeyword: 'cannabis COA explained',
    wordCount: 2000,
    readTime: 8,
  },
];

// ─── SEO Keywords (15) ─────────────────────────────────────────

const seoKeywords: SEOKeyword[] = [
  { id: 'kw-1', keyword: 'cannabis terpenes', searchVolume: 8100, difficulty: 45, currentRank: 4, targetRank: 1, page: '/blog/understanding-terpenes-guide', trend: 'up' },
  { id: 'kw-2', keyword: 'live resin carts', searchVolume: 12400, difficulty: 62, currentRank: 8, targetRank: 3, page: '/blog/art-of-live-resin', trend: 'up' },
  { id: 'kw-3', keyword: 'washington cannabis dispensary', searchVolume: 22000, difficulty: 78, currentRank: 15, targetRank: 5, trend: 'stable' },
  { id: 'kw-4', keyword: 'indica vs sativa', searchVolume: 33000, difficulty: 82, currentRank: 12, targetRank: 5, page: '/blog/indica-vs-sativa-science', trend: 'stable' },
  { id: 'kw-5', keyword: 'cannabis edibles near me', searchVolume: 18000, difficulty: 71, targetRank: 10, trend: 'up' },
  { id: 'kw-6', keyword: 'choose cannabis product', searchVolume: 6500, difficulty: 38, currentRank: 2, targetRank: 1, page: '/blog/choose-right-cannabis-product', trend: 'up' },
  { id: 'kw-7', keyword: 'washington cannabis laws', searchVolume: 9800, difficulty: 52, currentRank: 6, targetRank: 3, page: '/blog/washington-state-cannabis-laws', trend: 'stable' },
  { id: 'kw-8', keyword: 'cannabis pre-rolls', searchVolume: 14500, difficulty: 58, currentRank: 22, targetRank: 10, trend: 'up' },
  { id: 'kw-9', keyword: 'cannabis beverages', searchVolume: 7200, difficulty: 41, currentRank: 18, targetRank: 8, trend: 'up' },
  { id: 'kw-10', keyword: 'cannabis COA testing', searchVolume: 3400, difficulty: 28, currentRank: 11, targetRank: 3, page: '/blog/what-are-coas', trend: 'stable' },
  { id: 'kw-11', keyword: 'best cannabis concentrates', searchVolume: 11200, difficulty: 65, targetRank: 10, trend: 'up' },
  { id: 'kw-12', keyword: 'cannabis edibles dosing', searchVolume: 8900, difficulty: 48, targetRank: 5, trend: 'stable' },
  { id: 'kw-13', keyword: 'THC seltzers', searchVolume: 5600, difficulty: 35, targetRank: 5, trend: 'up' },
  { id: 'kw-14', keyword: 'cannabis flower strains', searchVolume: 15800, difficulty: 72, currentRank: 28, targetRank: 10, trend: 'down' },
  { id: 'kw-15', keyword: 'recreational cannabis Washington', searchVolume: 4100, difficulty: 44, currentRank: 9, targetRank: 3, page: '/blog/washington-state-cannabis-laws', trend: 'stable' },
];

// ─── Events (12) ───────────────────────────────────────────────

const events: Event[] = [
  {
    id: 'evt-1',
    name: 'Vendor Day — Greenfield Dispensary',
    type: 'vendor-day',
    status: 'completed',
    date: '2026-01-18',
    location: 'Greenfield Dispensary, Capitol Hill, Seattle',
    description: 'Full-day vendor activation with product sampling, staff education, and customer engagement.',
    attendees: 85,
    budget: 1200,
    actualSpend: 1050,
    roiMeasured: { preEventRevenue: 8200, postEventRevenue: 12400, lift: 51.2 },
  },
  {
    id: 'evt-2',
    name: 'Vendor Day — Pacific Leaf',
    type: 'vendor-day',
    status: 'completed',
    date: '2026-01-25',
    location: 'Pacific Leaf, Fremont, Seattle',
    description: 'Afternoon vendor session focused on new vaporizer line introduction.',
    attendees: 62,
    budget: 1000,
    actualSpend: 980,
    roiMeasured: { preEventRevenue: 6800, postEventRevenue: 9200, lift: 35.3 },
  },
  {
    id: 'evt-3',
    name: 'Vendor Day — Cascade Wellness',
    type: 'vendor-day',
    status: 'completed',
    date: '2026-02-08',
    location: 'Cascade Wellness, Bellevue',
    description: 'Terpene education session with budtenders followed by customer-facing vendor day.',
    attendees: 45,
    budget: 800,
    actualSpend: 820,
    roiMeasured: { preEventRevenue: 4500, postEventRevenue: 6100, lift: 35.6 },
  },
  {
    id: 'evt-4',
    name: 'Vendor Day — Capitol Hill Cannabis',
    type: 'vendor-day',
    status: 'completed',
    date: '2026-02-15',
    location: 'Capitol Hill Cannabis, Seattle',
    description: 'Evening vendor activation targeting after-work crowd. High foot traffic location.',
    attendees: 110,
    budget: 1500,
    actualSpend: 1420,
    roiMeasured: { preEventRevenue: 11200, postEventRevenue: 16800, lift: 50.0 },
  },
  {
    id: 'evt-5',
    name: 'Vendor Day — Olympic Greens',
    type: 'vendor-day',
    status: 'completed',
    date: '2026-02-22',
    location: 'Olympic Greens, Olympia',
    description: 'Full-day vendor activation with concentrate focus. Drove significant dab mat and merch distribution.',
    attendees: 38,
    budget: 900,
    actualSpend: 870,
    roiMeasured: { preEventRevenue: 3200, postEventRevenue: 4800, lift: 50.0 },
  },
  {
    id: 'evt-6',
    name: 'Vendor Day — Emerald City Collective',
    type: 'vendor-day',
    status: 'confirmed',
    date: getDateOffset(8),
    location: 'Emerald City Collective, Ballard, Seattle',
    description: 'Afternoon session — new edible line launch with sampling and budtender education.',
    budget: 1100,
  },
  {
    id: 'evt-7',
    name: 'Vendor Day — Puget Sound Dispensary',
    type: 'vendor-day',
    status: 'confirmed',
    date: getDateOffset(15),
    location: 'Puget Sound Dispensary, Tacoma',
    description: 'Full-day activation. First vendor day at this location — category expansion focus.',
    budget: 1300,
  },
  {
    id: 'evt-8',
    name: 'Vendor Day — Rainier Buds',
    type: 'vendor-day',
    status: 'planned',
    date: getDateOffset(22),
    location: 'Rainier Buds, Renton',
    description: 'Beverage and edible focus. New account — first vendor day to build relationship.',
    budget: 800,
  },
  {
    id: 'evt-9',
    name: 'Cannabis Conference NW — Seattle',
    type: 'trade-show',
    status: 'confirmed',
    date: '2026-06-12',
    location: 'Washington State Convention Center, Seattle',
    description: 'Major industry trade show. 2-day event with booth, speaking panel, and networking reception. Key opportunity for brand visibility and B2B connections.',
    attendees: 2500,
    budget: 8000,
  },
  {
    id: 'evt-10',
    name: '4/20 Event at Greenfield Dispensary',
    type: 'pop-up',
    status: 'planned',
    date: '2026-04-20',
    location: 'Greenfield Dispensary, Capitol Hill, Seattle',
    description: 'Annual 4/20 celebration pop-up. Product showcases, giveaways (compliant), DJ, food truck partnership.',
    budget: 2500,
  },
  {
    id: 'evt-11',
    name: 'Terpene Education for Budtenders',
    type: 'webinar',
    status: 'completed',
    date: '2026-02-20',
    location: 'Virtual (Zoom)',
    description: 'Online education session for budtenders across partner dispensaries. Covered terpene profiles, effects, and selling techniques.',
    attendees: 45,
    budget: 200,
    actualSpend: 150,
    roiMeasured: { preEventRevenue: 28000, postEventRevenue: 31500, lift: 12.5 },
  },
  {
    id: 'evt-12',
    name: 'Spokane Cannabis Expo',
    type: 'industry-event',
    status: 'cancelled',
    date: '2026-03-28',
    location: 'Spokane Convention Center, Spokane',
    description: 'Cancelled due to low vendor registration. Deposit partially refunded.',
    budget: 3000,
    actualSpend: 500,
  },
];

// ─── Ad Campaigns (6) ──────────────────────────────────────────

const adCampaigns: AdCampaign[] = [
  {
    id: 'ad-1',
    name: 'Brand Awareness — Programmatic',
    platform: 'programmatic',
    status: 'active',
    budget: 2000,
    spent: 1340,
    impressions: 145000,
    clicks: 1160,
    cpc: 1.16,
    conversions: 18,
    startDate: '2026-02-01',
    complianceStatus: 'approved',
  },
  {
    id: 'ad-2',
    name: 'Dispensary Finder — Google',
    platform: 'google',
    status: 'active',
    budget: 1500,
    spent: 1020,
    impressions: 22000,
    clicks: 704,
    cpc: 1.45,
    conversions: 42,
    startDate: '2026-01-15',
    complianceStatus: 'approved',
  },
  {
    id: 'ad-3',
    name: 'New Product Launch — Cannabis Network',
    platform: 'cannabis-specific',
    status: 'completed',
    budget: 800,
    spent: 800,
    impressions: 35000,
    clicks: 420,
    cpc: 1.90,
    conversions: 15,
    startDate: '2026-01-20',
    endDate: '2026-02-20',
    complianceStatus: 'approved',
  },
  {
    id: 'ad-4',
    name: 'Retargeting — Website Visitors',
    platform: 'programmatic',
    status: 'paused',
    budget: 600,
    spent: 285,
    impressions: 18000,
    clicks: 162,
    cpc: 1.76,
    conversions: 5,
    startDate: '2026-02-10',
    complianceStatus: 'flagged',
    complianceNote: 'Imagery too close to consumption depiction. Creative revision required before reactivation.',
  },
  {
    id: 'ad-5',
    name: 'Educational Content Promotion',
    platform: 'google',
    status: 'draft',
    budget: 500,
    spent: 0,
    impressions: 0,
    clicks: 0,
    cpc: 0,
    conversions: 0,
    startDate: getDateOffset(7),
    complianceStatus: 'pending-review',
  },
  {
    id: 'ad-6',
    name: 'Holiday Gift Guide',
    platform: 'programmatic',
    status: 'completed',
    budget: 1200,
    spent: 1200,
    impressions: 62000,
    clicks: 1302,
    cpc: 0.92,
    conversions: 28,
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    complianceStatus: 'approved',
  },
];

// ─── Merchandise (15) ──────────────────────────────────────────

const merchItems: MerchItem[] = [
  {
    id: 'merch-1',
    name: 'Frost Logo Dad Hat — Black',
    category: 'apparel',
    stock: 48,
    distributed: 120,
    costPerUnit: 14.50,
    imageDescription: 'Black dad hat with embroidered Frost logo in white/purple gradient',
    distributedTo: [
      { event: 'Vendor Day — Greenfield', date: '2026-01-18', quantity: 15 },
      { event: 'Vendor Day — Capitol Hill', date: '2026-02-15', quantity: 20 },
      { accountName: 'Pacific Leaf', date: '2026-01-25', quantity: 10 },
      { event: 'Cannabis Conference NW', date: '2025-09-15', quantity: 25 },
      { accountName: 'Cascade Wellness', date: '2026-02-08', quantity: 8 },
      { event: 'Internal team', date: '2026-01-01', quantity: 42 },
    ],
  },
  {
    id: 'merch-2',
    name: 'Frost Logo Dad Hat — Green',
    category: 'apparel',
    stock: 36,
    distributed: 85,
    costPerUnit: 14.50,
    imageDescription: 'Forest green dad hat with embroidered Frost logo in white',
    distributedTo: [
      { event: 'Vendor Day — Olympic Greens', date: '2026-02-22', quantity: 12 },
      { event: 'Vendor Day — Pacific Leaf', date: '2026-01-25', quantity: 15 },
      { event: '4/20 Event 2025', date: '2025-04-20', quantity: 30 },
      { event: 'Internal team', date: '2026-01-01', quantity: 28 },
    ],
  },
  {
    id: 'merch-3',
    name: 'Frost Team T-Shirt — Black',
    category: 'apparel',
    stock: 60,
    distributed: 40,
    costPerUnit: 18.00,
    imageDescription: 'Black crew-neck tee with Frost gradient logo on chest, tagline on back',
    distributedTo: [
      { event: 'Internal team', date: '2026-01-01', quantity: 30 },
      { event: 'New hire kits', date: '2026-02-01', quantity: 10 },
    ],
  },
  {
    id: 'merch-4',
    name: 'Frost Sticker Pack (5 designs)',
    category: 'stickers',
    stock: 200,
    distributed: 450,
    costPerUnit: 2.25,
    imageDescription: 'Set of 5 die-cut vinyl stickers: Frost logo, terpene wheel, strain badges, leaf pattern, tagline',
    distributedTo: [
      { event: 'Vendor Day — Greenfield', date: '2026-01-18', quantity: 50 },
      { event: 'Vendor Day — Capitol Hill', date: '2026-02-15', quantity: 60 },
      { event: 'Vendor Day — Pacific Leaf', date: '2026-01-25', quantity: 40 },
      { event: 'Vendor Day — Cascade', date: '2026-02-08', quantity: 30 },
      { event: 'Vendor Day — Olympic Greens', date: '2026-02-22', quantity: 25 },
      { accountName: 'Greenfield Dispensary', date: '2026-02-01', quantity: 100 },
      { event: 'Internal/misc', date: '2026-01-01', quantity: 145 },
    ],
  },
  {
    id: 'merch-5',
    name: 'Frost Rolling Tray — Bamboo',
    category: 'accessories',
    stock: 24,
    distributed: 40,
    costPerUnit: 22.00,
    imageDescription: 'Bamboo rolling tray with laser-etched Frost logo and terpene chart',
    distributedTo: [
      { event: 'Vendor Day — Capitol Hill', date: '2026-02-15', quantity: 10 },
      { event: 'Cannabis Conference NW', date: '2025-09-15', quantity: 15 },
      { accountName: 'Greenfield Dispensary', date: '2026-01-18', quantity: 5 },
      { event: 'Internal team', date: '2026-01-01', quantity: 10 },
    ],
  },
  {
    id: 'merch-6',
    name: 'Frost Lighter — Matte Black',
    category: 'accessories',
    stock: 0,
    distributed: 200,
    costPerUnit: 4.50,
    imageDescription: 'Matte black refillable lighter with Frost logo in metallic purple',
    distributedTo: [
      { event: 'Vendor Day — Greenfield', date: '2026-01-18', quantity: 30 },
      { event: 'Vendor Day — Capitol Hill', date: '2026-02-15', quantity: 40 },
      { event: 'Vendor Day — Pacific Leaf', date: '2026-01-25', quantity: 25 },
      { event: 'Vendor Day — Cascade', date: '2026-02-08', quantity: 20 },
      { event: 'Vendor Day — Olympic Greens', date: '2026-02-22', quantity: 15 },
      { event: '4/20 Event 2025', date: '2025-04-20', quantity: 50 },
      { event: 'Internal/misc', date: '2026-01-01', quantity: 20 },
    ],
  },
  {
    id: 'merch-7',
    name: 'Frost Dab Mat',
    category: 'accessories',
    stock: 15,
    distributed: 30,
    costPerUnit: 12.00,
    imageDescription: 'Silicone dab mat with Frost brand gradient and terpene flavor wheel design',
    distributedTo: [
      { event: 'Vendor Day — Olympic Greens', date: '2026-02-22', quantity: 10 },
      { event: 'Cannabis Conference NW', date: '2025-09-15', quantity: 10 },
      { event: 'Internal team', date: '2026-01-01', quantity: 10 },
    ],
  },
  {
    id: 'merch-8',
    name: 'Frost Tote Bag — Canvas',
    category: 'apparel',
    stock: 30,
    distributed: 50,
    costPerUnit: 8.50,
    imageDescription: 'Natural canvas tote bag with Frost logo and leaf pattern print',
    distributedTo: [
      { event: 'Vendor Day — Greenfield', date: '2026-01-18', quantity: 10 },
      { event: 'Terpene Webinar', date: '2026-02-20', quantity: 5 },
      { event: 'Cannabis Conference NW', date: '2025-09-15', quantity: 20 },
      { event: 'Internal team', date: '2026-01-01', quantity: 15 },
    ],
  },
  {
    id: 'merch-9',
    name: 'Frost Branded Jar — UV Glass',
    category: 'containers',
    stock: 75,
    distributed: 25,
    costPerUnit: 6.75,
    imageDescription: 'UV-protective black glass jar with Frost logo label, 2oz capacity',
    distributedTo: [
      { accountName: 'Greenfield Dispensary', date: '2026-02-01', quantity: 10 },
      { accountName: 'Capitol Hill Cannabis', date: '2026-02-15', quantity: 10 },
      { event: 'Internal samples', date: '2026-01-01', quantity: 5 },
    ],
  },
  {
    id: 'merch-10',
    name: 'Frost Pen — Matte Purple',
    category: 'misc',
    stock: 150,
    distributed: 100,
    costPerUnit: 1.80,
    imageDescription: 'Matte purple ballpoint pen with Frost logo and website URL',
    distributedTo: [
      { event: 'Cannabis Conference NW', date: '2025-09-15', quantity: 50 },
      { event: 'All vendor days Q1', date: '2026-02-28', quantity: 30 },
      { event: 'Internal team', date: '2026-01-01', quantity: 20 },
    ],
  },
  {
    id: 'merch-11',
    name: 'Frost Lanyard — Purple/Black',
    category: 'accessories',
    stock: 40,
    distributed: 60,
    costPerUnit: 3.25,
    imageDescription: 'Woven lanyard with Frost gradient pattern and detachable clip',
    distributedTo: [
      { event: 'Cannabis Conference NW', date: '2025-09-15', quantity: 30 },
      { event: 'Internal team', date: '2026-01-01', quantity: 20 },
      { event: 'Terpene Webinar prizes', date: '2026-02-20', quantity: 10 },
    ],
  },
  {
    id: 'merch-12',
    name: 'Frost Hoodie — Black',
    category: 'apparel',
    stock: 22,
    distributed: 18,
    costPerUnit: 35.00,
    imageDescription: 'Black pullover hoodie with embroidered Frost gradient logo on chest',
    distributedTo: [
      { event: 'Internal team', date: '2026-01-01', quantity: 15 },
      { event: 'Raffle prizes', date: '2026-02-15', quantity: 3 },
    ],
  },
  {
    id: 'merch-13',
    name: 'Frost Grinder — Matte Black',
    category: 'accessories',
    stock: 8,
    distributed: 42,
    costPerUnit: 16.00,
    imageDescription: '4-piece aluminum grinder with laser-etched Frost logo on lid',
    distributedTo: [
      { event: 'Vendor Day — Capitol Hill', date: '2026-02-15', quantity: 12 },
      { event: 'Vendor Day — Greenfield', date: '2026-01-18', quantity: 10 },
      { event: 'Cannabis Conference NW', date: '2025-09-15', quantity: 10 },
      { event: 'Internal team', date: '2026-01-01', quantity: 10 },
    ],
  },
  {
    id: 'merch-14',
    name: 'Frost Smell-Proof Pouch',
    category: 'containers',
    stock: 55,
    distributed: 45,
    costPerUnit: 9.00,
    imageDescription: 'Carbon-lined smell-proof pouch with zipper and Frost logo tag',
    distributedTo: [
      { event: 'Vendor Day — Pacific Leaf', date: '2026-01-25', quantity: 15 },
      { event: 'Vendor Day — Cascade', date: '2026-02-08', quantity: 10 },
      { event: '4/20 Event 2025', date: '2025-04-20', quantity: 15 },
      { event: 'Internal team', date: '2026-01-01', quantity: 5 },
    ],
  },
  {
    id: 'merch-15',
    name: 'Frost Coaster Set (4-pack)',
    category: 'misc',
    stock: 18,
    distributed: 22,
    costPerUnit: 10.00,
    imageDescription: 'Set of 4 cork coasters with different Frost brand designs',
    distributedTo: [
      { accountName: 'Greenfield Dispensary', date: '2026-01-18', quantity: 4 },
      { accountName: 'Pacific Leaf', date: '2026-01-25', quantity: 4 },
      { event: 'Internal team', date: '2026-01-01', quantity: 10 },
      { event: 'Cannabis Conference NW', date: '2025-09-15', quantity: 4 },
    ],
  },
];

// ─── Async Export Functions ────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPost[]> {
  await delay(300);
  return blogPosts;
}

export async function getSEOKeywords(): Promise<SEOKeyword[]> {
  await delay(300);
  return seoKeywords;
}

export async function getEvents(): Promise<Event[]> {
  await delay(300);
  return events;
}

export async function getAdCampaigns(): Promise<AdCampaign[]> {
  await delay(300);
  return adCampaigns;
}

export async function getMerchItems(): Promise<MerchItem[]> {
  await delay(300);
  return merchItems;
}

export async function getSEOMetrics(): Promise<SEOMetrics> {
  await delay(300);
  const published = blogPosts.filter((p) => p.status === 'published');
  const totalViews = published.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const avgScore = Math.round(published.reduce((sum, p) => sum + p.seoScore, 0) / published.length);
  const topKw = seoKeywords.filter((k) => k.currentRank).sort((a, b) => (a.currentRank ?? 999) - (b.currentRank ?? 999))[0];
  return {
    publishedPosts: published.length,
    totalViews,
    avgSeoScore: avgScore,
    organicTraffic: Math.round(totalViews * 0.72),
    topKeyword: topKw?.keyword ?? '',
    topKeywordRank: topKw?.currentRank ?? 0,
  };
}

export async function getEventMetrics(): Promise<EventMetrics> {
  await delay(300);
  const completed = events.filter((e) => e.status === 'completed');
  const upcoming = events.filter((e) => e.status === 'planned' || e.status === 'confirmed');
  const withROI = completed.filter((e) => e.roiMeasured);
  const avgROI = withROI.length > 0
    ? Math.round(withROI.reduce((sum, e) => sum + (e.roiMeasured?.lift ?? 0), 0) / withROI.length * 10) / 10
    : 0;
  const totalBudget = events.filter((e) => e.status !== 'cancelled').reduce((sum, e) => sum + e.budget, 0);
  return {
    upcoming: upcoming.length,
    completedThisQuarter: completed.length,
    totalBudget,
    avgROI,
  };
}

export async function getAdMetrics(): Promise<AdMetrics> {
  await delay(300);
  const active = adCampaigns.filter((c) => c.status === 'active');
  const allSpent = adCampaigns.reduce((sum, c) => sum + c.spent, 0);
  const allImpressions = adCampaigns.reduce((sum, c) => sum + c.impressions, 0);
  const allClicks = adCampaigns.reduce((sum, c) => sum + c.clicks, 0);
  const allConversions = adCampaigns.reduce((sum, c) => sum + c.conversions, 0);
  const flagged = adCampaigns.filter((c) => c.complianceStatus === 'flagged');
  return {
    activeCampaigns: active.length,
    totalSpendMTD: allSpent,
    totalImpressions: allImpressions,
    avgCPC: allClicks > 0 ? Math.round((allSpent / allClicks) * 100) / 100 : 0,
    totalConversions: allConversions,
    flaggedCampaigns: flagged.length,
  };
}
