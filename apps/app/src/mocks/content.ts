import type { ContentPost, Campaign, ContentFilter } from '@/modules/content/types';

const CONTENT_POSTS: ContentPost[] = [
  // Published Instagram (5)
  {
    id: 'cp-001',
    title: 'Spring Flower Collection — Wedding Cake Spotlight',
    type: 'social',
    platform: 'instagram',
    status: 'published',
    publishedDate: '2026-03-01',
    content:
      'Introducing our Spring Flower Collection, starring Wedding Cake. This indica-dominant hybrid delivers a rich, tangy flavor with subtle vanilla undertones. Available now at select dispensaries. #WeddingCake #SpringFlower #PremiumCannabis',
    performance: { impressions: 2400, engagement: 8.2, clicks: 197, conversions: 34 },
  },
  {
    id: 'cp-002',
    title: 'Behind the Scenes: Extraction Lab Tour',
    type: 'social',
    platform: 'instagram',
    status: 'published',
    publishedDate: '2026-02-25',
    content:
      'Take a peek inside our state-of-the-art extraction lab. From fresh-frozen flower to premium live resin, every step is precision-controlled for maximum terpene retention. Swipe for the full tour. #ExtractionLab #LiveResin #BehindTheScenes',
    performance: { impressions: 3100, engagement: 6.8, clicks: 211, conversions: 28 },
  },
  {
    id: 'cp-003',
    title: 'New Drop: Gelato Live Resin Carts',
    type: 'social',
    platform: 'instagram',
    status: 'published',
    publishedDate: '2026-02-20',
    content:
      'The wait is over. Gelato Live Resin Carts are here — creamy, sweet, and loaded with 89% THC. Crafted from single-source indoor flower. Now available through your rep. #GelatoLiveResin #NewDrop #Vaporizer',
    performance: { impressions: 4200, engagement: 9.1, clicks: 382, conversions: 67 },
  },
  {
    id: 'cp-004',
    title: 'Strain Education: Terpene Profiles Explained',
    type: 'social',
    platform: 'instagram',
    status: 'published',
    publishedDate: '2026-02-15',
    content:
      'What makes each strain unique? It all comes down to terpenes. Myrcene for relaxation, limonene for uplift, caryophyllene for relief. Educate your budtenders with our terpene guide. #TerpeneEducation #StrainScience #CannabisKnowledge',
    performance: { impressions: 1800, engagement: 5.4, clicks: 97, conversions: 12 },
  },
  {
    id: 'cp-005',
    title: 'Customer Spotlight: Greenfield Dispensary',
    type: 'social',
    platform: 'instagram',
    status: 'published',
    publishedDate: '2026-02-10',
    content:
      'Shoutout to our partners at Greenfield Dispensary! Since onboarding last quarter, they have seen a 40% increase in concentrate sales. Hear their story in our latest spotlight. #CustomerSpotlight #GreenfieldDispensary #Partnership',
    performance: { impressions: 2800, engagement: 7.3, clicks: 204, conversions: 41 },
  },

  // Scheduled (4)
  {
    id: 'cp-006',
    title: 'Blue Dream 2g Disposable Launch',
    type: 'social',
    platform: 'instagram',
    status: 'scheduled',
    scheduledDate: '2026-03-10',
    content:
      'Get ready for the Blue Dream 2g Disposable — our biggest format yet. Smooth, uplifting, and perfect for on-the-go. Dropping March 10. Pre-orders open now. #BlueDream #Disposable #NewProduct',
  },
  {
    id: 'cp-007',
    title: 'March Promo: Bundle Deals for Dispensaries',
    type: 'email',
    platform: 'email',
    status: 'scheduled',
    scheduledDate: '2026-03-08',
    content:
      'Subject: Exclusive March Bundle Deals — Up to 15% Off\n\nHey {{first_name}},\n\nThis March, we are rolling out exclusive bundle pricing for our top-selling SKUs. Mix and match flower, carts, and edibles to build the perfect assortment for your spring menu.\n\nHighlights:\n- Buy 10+ units, get 10% off\n- Buy 25+ units, get 15% off\n- Free shipping on orders over $2,500\n\nContact your rep or reply to this email to lock in pricing.',
  },
  {
    id: 'cp-008',
    title: 'Solventless Series Part 1: What is Live Rosin?',
    type: 'blog',
    platform: 'website',
    status: 'scheduled',
    scheduledDate: '2026-03-12',
    content:
      'Live rosin represents the pinnacle of solventless extraction. Unlike BHO concentrates, live rosin uses only heat and pressure to extract cannabinoids and terpenes from fresh-frozen flower. The result is a clean, full-spectrum product that preserves the plant\'s natural profile.\n\nIn this first installment of our Solventless Series, we break down the process, compare live rosin to live resin, and explain why solventless is the future of premium concentrates.',
  },
  {
    id: 'cp-009',
    title: 'Weekend Vibes: Premium Preroll Collection',
    type: 'social',
    platform: 'instagram',
    status: 'scheduled',
    scheduledDate: '2026-03-14',
    content:
      'Your weekend lineup is set. Our Premium Preroll Collection features hand-rolled joints with top-shelf flower and glass tips. Choose from Gelato, Wedding Cake, or Blue Dream. #WeekendVibes #PremiumPrerolls #Preroll',
  },

  // Drafts (3)
  {
    id: 'cp-010',
    title: 'Q2 Product Catalog Email',
    type: 'email',
    platform: 'email',
    status: 'draft',
    content:
      'Subject: Your Q2 Product Catalog is Here\n\nHi {{first_name}},\n\nOur Q2 catalog is packed with new products, updated pricing, and seasonal promotions. Download the full PDF or browse online.\n\n[DRAFT — need final product photos and pricing from ops team]',
  },
  {
    id: 'cp-011',
    title: 'Sustainability in Cannabis Packaging',
    type: 'blog',
    platform: 'website',
    status: 'draft',
    content:
      'As the cannabis industry matures, so does our responsibility to the environment. In this post, we explore how Frost is transitioning to recyclable child-resistant packaging, reducing plastic use by 30% across our product lines.\n\n[DRAFT — waiting on sustainability metrics from packaging team]',
  },
  {
    id: 'cp-012',
    title: 'Zkittlez Gummies Product Description',
    type: 'product-description',
    platform: 'website',
    status: 'draft',
    content:
      'Zkittlez Gummies — 10-pack, 100mg total THC (10mg per piece). Bursting with fruity rainbow flavor, these gummies deliver a balanced, euphoric experience. Made with natural fruit juice and full-spectrum cannabis extract.\n\n[DRAFT — confirm final dosage and ingredient list with manufacturing]',
  },

  // Email campaigns (3)
  {
    id: 'cp-013',
    title: 'February Newsletter: New Products & Updates',
    type: 'email',
    platform: 'email',
    status: 'published',
    publishedDate: '2026-02-28',
    content:
      'Subject: February Wrap-Up — New Products, Industry News & More\n\nHi {{first_name}},\n\nHere is what happened this month at Frost:\n- Launched Gelato Live Resin Carts (already our #2 SKU)\n- Added 3 new dispensary partners in the metro area\n- Published our 2025 Terpene Education Guide\n\nPlus, get early access to our upcoming solventless line. Reply to your rep to reserve allocation.',
    performance: { impressions: 1200, engagement: 24.0, clicks: 288, conversions: 52 },
  },
  {
    id: 'cp-014',
    title: 'Exclusive: Early Access Solventless Line',
    type: 'email',
    platform: 'email',
    status: 'scheduled',
    scheduledDate: '2026-03-15',
    content:
      'Subject: You are on the Early Access List\n\nHi {{first_name}},\n\nAs one of our preferred partners, you get first access to the Frost Solventless line. Live rosin, hash rosin carts, and pressed temple balls — all crafted from single-source, indoor-grown flower.\n\nReply to lock in your allocation before public launch on April 1.',
  },
  {
    id: 'cp-015',
    title: 'Re-engagement: We Miss You Campaign',
    type: 'email',
    platform: 'email',
    status: 'draft',
    content:
      'Subject: It has been a while — let us catch up\n\nHi {{first_name}},\n\nWe noticed it has been a few months since your last order. A lot has changed at Frost — new products, better pricing, and faster fulfillment.\n\nLet us schedule a quick call to walk you through what is new. Reply here or book a time: [LINK]\n\n[DRAFT — need re-engagement discount approved by finance]',
  },
];

const CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-001',
    name: 'Spring Product Launch',
    posts: ['cp-001', 'cp-003', 'cp-006', 'cp-009'],
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    status: 'active',
    goal: 'Drive awareness and pre-orders for spring product lineup across social and email channels',
  },
  {
    id: 'cmp-002',
    name: 'Solventless Line Introduction',
    posts: ['cp-008', 'cp-014', 'cp-015'],
    startDate: '2026-03-10',
    endDate: '2026-04-10',
    status: 'planned',
    goal: 'Educate dispensary partners on solventless products and secure early allocations before public launch',
  },
];

function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getContentPosts(filters?: ContentFilter): Promise<ContentPost[]> {
  await delay();
  let result = [...CONTENT_POSTS];

  if (filters?.type) {
    result = result.filter((p) => p.type === filters.type);
  }
  if (filters?.status) {
    result = result.filter((p) => p.status === filters.status);
  }
  if (filters?.platform) {
    result = result.filter((p) => p.platform === filters.platform);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
    );
  }

  return result;
}

export async function getContentMetrics(): Promise<{
  postsThisMonth: number;
  avgEngagement: string;
  emailOpenRate: string;
  scheduledCount: number;
}> {
  await delay();
  const now = '2026-03';
  const thisMonth = CONTENT_POSTS.filter(
    (p) =>
      (p.publishedDate && p.publishedDate.startsWith(now)) ||
      (p.scheduledDate && p.scheduledDate.startsWith(now))
  );
  const published = CONTENT_POSTS.filter(
    (p) => p.status === 'published' && p.performance
  );
  const socialPublished = published.filter((p) => p.platform === 'instagram');
  const avgEng =
    socialPublished.length > 0
      ? (
          socialPublished.reduce(
            (sum, p) => sum + (p.performance?.engagement ?? 0),
            0
          ) / socialPublished.length
        ).toFixed(1)
      : '0';
  const emailPublished = published.filter((p) => p.platform === 'email');
  const avgOpen =
    emailPublished.length > 0
      ? (
          emailPublished.reduce(
            (sum, p) => sum + (p.performance?.engagement ?? 0),
            0
          ) / emailPublished.length
        ).toFixed(1)
      : '0';
  const scheduled = CONTENT_POSTS.filter((p) => p.status === 'scheduled');

  return {
    postsThisMonth: thisMonth.length,
    avgEngagement: `${avgEng}%`,
    emailOpenRate: `${avgOpen}%`,
    scheduledCount: scheduled.length,
  };
}

export async function getCampaigns(): Promise<Campaign[]> {
  await delay();
  return [...CAMPAIGNS];
}
