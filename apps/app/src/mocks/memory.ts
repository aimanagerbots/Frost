import type { MemoryFact, MemoryPattern, MemoryLayer } from '@/modules/memory/types';

const memoryLayers: MemoryLayer[] = [
  {
    name: 'system-identity',
    displayName: 'System Identity',
    description: 'Core company identity, mission, and operating parameters',
    factCount: 12,
    lastUpdated: '2026-03-07T08:00:00Z',
  },
  {
    name: 'structured-facts',
    displayName: 'Structured Facts',
    description: 'Account data, product specs, process rules, and relationships',
    factCount: 156,
    lastUpdated: '2026-03-07T11:42:00Z',
  },
  {
    name: 'semantic-search',
    displayName: 'Semantic Search',
    description: 'Full-text search across all documents and interactions',
    factCount: 2400,
    lastUpdated: '2026-03-07T12:15:00Z',
  },
];

const memoryFacts: MemoryFact[] = [
  // === ACCOUNT (10) ===
  {
    id: 'fact-a01',
    content: 'Greenfield Dispensary orders every 7-8 days on average',
    source: 'Order History',
    sourceModule: 'Orders',
    confidence: 94,
    category: 'account',
    learnedAt: '2026-01-15T10:00:00Z',
    lastReferenced: '2026-03-06T14:22:00Z',
    verified: true,
  },
  {
    id: 'fact-a02',
    content: "Pacific Leaf's buyer Sarah prefers phone calls over email",
    source: 'Interaction Analysis',
    sourceModule: 'CRM',
    confidence: 78,
    category: 'account',
    learnedAt: '2026-02-03T09:30:00Z',
    lastReferenced: '2026-03-04T11:00:00Z',
    verified: false,
  },
  {
    id: 'fact-a03',
    content: 'Olympic Greens converted to VMI program 3 months ago',
    source: 'CRM',
    sourceModule: 'CRM',
    confidence: 99,
    category: 'account',
    learnedAt: '2025-12-07T16:00:00Z',
    lastReferenced: '2026-03-05T09:15:00Z',
    verified: true,
  },
  {
    id: 'fact-a04',
    content: 'Summit Cannabis average order is $2,800',
    source: 'Orders',
    sourceModule: 'Orders',
    confidence: 91,
    category: 'account',
    learnedAt: '2026-01-20T12:00:00Z',
    lastReferenced: '2026-03-02T10:00:00Z',
    verified: true,
  },
  {
    id: 'fact-a05',
    content: 'Emerald City Cannabis is at risk of churn',
    source: 'Health Model',
    sourceModule: 'CRM',
    confidence: 72,
    category: 'account',
    learnedAt: '2026-02-28T15:00:00Z',
    lastReferenced: '2026-03-06T08:30:00Z',
    verified: false,
  },
  {
    id: 'fact-a06',
    content: 'Cascade Wellness prefers Friday deliveries',
    source: 'Delivery',
    sourceModule: 'Delivery',
    confidence: 88,
    category: 'account',
    learnedAt: '2026-01-10T11:00:00Z',
    lastReferenced: '2026-03-05T16:00:00Z',
    verified: true,
  },
  {
    id: 'fact-a07',
    content: 'Rainier Remedies has a history of late payments',
    source: 'Payments',
    sourceModule: 'Finance',
    confidence: 95,
    category: 'account',
    learnedAt: '2025-11-22T14:00:00Z',
    lastReferenced: '2026-03-03T09:45:00Z',
    verified: true,
  },
  {
    id: 'fact-a08',
    content: 'Capitol Hill Collective is our largest edible buyer',
    source: 'Sales Data',
    sourceModule: 'Orders',
    confidence: 93,
    category: 'account',
    learnedAt: '2026-01-05T10:30:00Z',
    lastReferenced: '2026-03-06T13:00:00Z',
    verified: true,
  },
  {
    id: 'fact-a09',
    content: 'Greenfield reorders Blue Dream 3.5g most frequently',
    source: 'VMI',
    sourceModule: 'VMI',
    confidence: 90,
    category: 'account',
    learnedAt: '2026-02-10T08:00:00Z',
    lastReferenced: '2026-03-07T07:30:00Z',
    verified: true,
  },
  {
    id: 'fact-a10',
    content: 'Pacific Leaf account health score is 62/100',
    source: 'Health Model',
    sourceModule: 'CRM',
    confidence: 85,
    category: 'account',
    learnedAt: '2026-03-01T12:00:00Z',
    lastReferenced: '2026-03-06T15:00:00Z',
    verified: true,
  },

  // === PRODUCT (8) ===
  {
    id: 'fact-p01',
    content: 'Wedding Cake averages 28.5% THC across last 5 batches',
    source: 'COA Data',
    sourceModule: 'COA',
    confidence: 96,
    category: 'product',
    learnedAt: '2026-02-15T09:00:00Z',
    lastReferenced: '2026-03-05T14:00:00Z',
    verified: true,
  },
  {
    id: 'fact-p02',
    content: 'Blue Dream 3.5g is our highest velocity SKU at VMI stores',
    source: 'VMI Data',
    sourceModule: 'VMI',
    confidence: 91,
    category: 'product',
    learnedAt: '2026-01-28T11:00:00Z',
    lastReferenced: '2026-03-06T10:00:00Z',
    verified: true,
  },
  {
    id: 'fact-p03',
    content: 'Gelato yields average 2.1 lbs per room harvest',
    source: 'Cultivation',
    sourceModule: 'Cultivation',
    confidence: 87,
    category: 'product',
    learnedAt: '2026-01-12T16:00:00Z',
    lastReferenced: '2026-02-28T09:00:00Z',
    verified: true,
  },
  {
    id: 'fact-p04',
    content: 'OG Kush requires 14-day dry room cycle',
    source: 'SOPs',
    sourceModule: 'Docs',
    confidence: 94,
    category: 'product',
    learnedAt: '2025-10-05T08:00:00Z',
    lastReferenced: '2026-03-04T12:00:00Z',
    verified: true,
  },
  {
    id: 'fact-p05',
    content: 'Vape cart margins average 45% gross',
    source: 'Finance',
    sourceModule: 'Finance',
    confidence: 89,
    category: 'product',
    learnedAt: '2026-02-01T14:30:00Z',
    lastReferenced: '2026-03-03T11:00:00Z',
    verified: true,
  },
  {
    id: 'fact-p06',
    content: 'Preroll multi-packs have 3x velocity of singles',
    source: 'Sales',
    sourceModule: 'Orders',
    confidence: 92,
    category: 'product',
    learnedAt: '2026-01-18T10:00:00Z',
    lastReferenced: '2026-03-05T08:00:00Z',
    verified: true,
  },
  {
    id: 'fact-p07',
    content: 'Edible gummies have longest shelf life at 12 months',
    source: 'Products',
    sourceModule: 'Products',
    confidence: 97,
    category: 'product',
    learnedAt: '2025-09-20T09:00:00Z',
    lastReferenced: '2026-02-22T13:00:00Z',
    verified: true,
  },
  {
    id: 'fact-p08',
    content: 'Concentrate SKUs require COA per batch',
    source: 'Compliance',
    sourceModule: 'COA',
    confidence: 99,
    category: 'product',
    learnedAt: '2025-08-15T10:00:00Z',
    lastReferenced: '2026-03-07T09:00:00Z',
    verified: true,
  },

  // === PROCESS (6) ===
  {
    id: 'fact-pr01',
    content: 'Average trim time per pound is 45 minutes for machine trim',
    source: 'Work Orders',
    sourceModule: 'Manufacturing',
    confidence: 85,
    category: 'process',
    learnedAt: '2026-01-25T13:00:00Z',
    lastReferenced: '2026-03-02T10:30:00Z',
    verified: true,
  },
  {
    id: 'fact-pr02',
    content: 'Order-to-delivery cycle averages 2.3 business days',
    source: 'Fulfillment',
    sourceModule: 'Fulfillment',
    confidence: 88,
    category: 'process',
    learnedAt: '2026-02-05T11:00:00Z',
    lastReferenced: '2026-03-06T16:30:00Z',
    verified: true,
  },
  {
    id: 'fact-pr03',
    content: 'CCRS reports must be filed by 11:59 PM daily',
    source: 'Compliance',
    sourceModule: 'System',
    confidence: 99,
    category: 'process',
    learnedAt: '2025-06-01T08:00:00Z',
    lastReferenced: '2026-03-07T07:00:00Z',
    verified: true,
  },
  {
    id: 'fact-pr04',
    content: 'Room turnaround between harvests is 5-7 days',
    source: 'Cultivation',
    sourceModule: 'Cultivation',
    confidence: 83,
    category: 'process',
    learnedAt: '2025-11-10T15:00:00Z',
    lastReferenced: '2026-02-20T12:00:00Z',
    verified: true,
  },
  {
    id: 'fact-pr05',
    content: 'Packaging line processes 200 units per hour',
    source: 'Manufacturing',
    sourceModule: 'Packaging',
    confidence: 86,
    category: 'process',
    learnedAt: '2026-01-08T14:00:00Z',
    lastReferenced: '2026-03-01T11:00:00Z',
    verified: true,
  },
  {
    id: 'fact-pr06',
    content: 'Quality check adds 30 minutes per batch',
    source: 'QA Logs',
    sourceModule: 'Manufacturing',
    confidence: 80,
    category: 'process',
    learnedAt: '2026-02-12T10:00:00Z',
    lastReferenced: '2026-02-28T14:00:00Z',
    verified: false,
  },

  // === MARKET (6) ===
  {
    id: 'fact-mk01',
    content: 'CloudNine is primary competitor in Seattle vape market',
    source: 'Competitive Intel',
    sourceModule: 'Competitors',
    confidence: 88,
    category: 'market',
    learnedAt: '2026-01-20T09:00:00Z',
    lastReferenced: '2026-03-05T10:00:00Z',
    verified: true,
  },
  {
    id: 'fact-mk02',
    content: 'Washington cannabis market growing 8% annually',
    source: 'Market Research',
    sourceModule: 'Reports',
    confidence: 82,
    category: 'market',
    learnedAt: '2026-02-10T11:00:00Z',
    lastReferenced: '2026-03-01T09:00:00Z',
    verified: false,
  },
  {
    id: 'fact-mk03',
    content: 'Seattle metro accounts for 62% of our revenue',
    source: 'Sales Data',
    sourceModule: 'Finance',
    confidence: 94,
    category: 'market',
    learnedAt: '2026-01-30T14:00:00Z',
    lastReferenced: '2026-03-06T11:30:00Z',
    verified: true,
  },
  {
    id: 'fact-mk04',
    content: 'Spokane market is underserved — 3 accounts vs potential 12',
    source: 'Territory Analysis',
    sourceModule: 'CRM',
    confidence: 76,
    category: 'market',
    learnedAt: '2026-02-18T10:00:00Z',
    lastReferenced: '2026-03-03T15:00:00Z',
    verified: false,
  },
  {
    id: 'fact-mk05',
    content: 'Average industry payment terms are Net 7',
    source: 'Industry Data',
    sourceModule: 'Finance',
    confidence: 85,
    category: 'market',
    learnedAt: '2025-12-15T09:00:00Z',
    lastReferenced: '2026-02-25T10:00:00Z',
    verified: true,
  },
  {
    id: 'fact-mk06',
    content: 'Edible category growing fastest at 22% YoY',
    source: 'Market Data',
    sourceModule: 'Reports',
    confidence: 80,
    category: 'market',
    learnedAt: '2026-02-22T13:00:00Z',
    lastReferenced: '2026-03-04T08:00:00Z',
    verified: false,
  },

  // === TEAM (4) ===
  {
    id: 'fact-t01',
    content: 'Quinn handles all Tier 1 accounts',
    source: 'CRM',
    sourceModule: 'CRM',
    confidence: 95,
    category: 'team',
    learnedAt: '2025-09-01T08:00:00Z',
    lastReferenced: '2026-03-07T10:00:00Z',
    verified: true,
  },
  {
    id: 'fact-t02',
    content: 'Sales team meets Tuesday and Thursday',
    source: 'Calendar',
    sourceModule: 'Calendar',
    confidence: 99,
    category: 'team',
    learnedAt: '2025-10-15T09:00:00Z',
    lastReferenced: '2026-03-06T08:00:00Z',
    verified: true,
  },
  {
    id: 'fact-t03',
    content: 'Cultivation team lead is Marcus',
    source: 'Team',
    sourceModule: 'Team',
    confidence: 99,
    category: 'team',
    learnedAt: '2025-07-01T10:00:00Z',
    lastReferenced: '2026-03-05T11:00:00Z',
    verified: true,
  },
  {
    id: 'fact-t04',
    content: 'Delivery driver rotation is Mon-Wed-Fri',
    source: 'Schedule',
    sourceModule: 'Delivery',
    confidence: 90,
    category: 'team',
    learnedAt: '2025-11-01T08:00:00Z',
    lastReferenced: '2026-03-07T06:30:00Z',
    verified: true,
  },

  // === COMPLIANCE (6) ===
  {
    id: 'fact-c01',
    content: 'WSLCB requires payment within 5 business days of delivery',
    source: 'Compliance KB',
    sourceModule: 'System',
    confidence: 99,
    category: 'compliance',
    learnedAt: '2025-06-15T10:00:00Z',
    lastReferenced: '2026-03-06T09:00:00Z',
    verified: true,
  },
  {
    id: 'fact-c02',
    content: 'License #412789 expires September 2026',
    source: 'Licensing',
    sourceModule: 'System',
    confidence: 99,
    category: 'compliance',
    learnedAt: '2025-09-15T12:00:00Z',
    lastReferenced: '2026-03-01T10:00:00Z',
    verified: true,
  },
  {
    id: 'fact-c03',
    content: 'All flower must test below 0.3% moisture for transport',
    source: 'Regulations',
    sourceModule: 'COA',
    confidence: 97,
    category: 'compliance',
    learnedAt: '2025-08-01T09:00:00Z',
    lastReferenced: '2026-03-04T14:00:00Z',
    verified: true,
  },
  {
    id: 'fact-c04',
    content: 'Manifest required for all inter-facility transfers',
    source: 'Compliance',
    sourceModule: 'Delivery',
    confidence: 99,
    category: 'compliance',
    learnedAt: '2025-06-01T08:00:00Z',
    lastReferenced: '2026-03-07T08:00:00Z',
    verified: true,
  },
  {
    id: 'fact-c05',
    content: 'Pesticide testing required for every harvest batch',
    source: 'Compliance',
    sourceModule: 'Cultivation',
    confidence: 98,
    category: 'compliance',
    learnedAt: '2025-07-10T10:00:00Z',
    lastReferenced: '2026-03-05T12:00:00Z',
    verified: true,
  },
  {
    id: 'fact-c06',
    content: 'CCRS traceability ID required on all packages',
    source: 'Compliance',
    sourceModule: 'Packaging',
    confidence: 99,
    category: 'compliance',
    learnedAt: '2025-06-20T11:00:00Z',
    lastReferenced: '2026-03-06T07:30:00Z',
    verified: true,
  },
];

const memoryPatterns: MemoryPattern[] = [
  {
    id: 'pat-01',
    title: 'Q4 orders increase ~20% driven by holiday demand',
    description:
      'Consistent year-over-year pattern showing elevated order volume from October through December, peaking in the week before Thanksgiving and again before Christmas.',
    confidence: 82,
    evidence: [
      'Q4 2024 orders: 1,240 vs Q3 average of 1,033',
      'Q4 2025 orders: 1,380 vs Q3 average of 1,148',
      'Top SKUs during Q4: edibles, preroll multi-packs, vape carts',
      'Holiday gift sets introduced in 2025 drove 8% of Q4 revenue',
    ],
    discoveredAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'pat-02',
    title: 'Accounts with VMI enrollment order 35% more frequently',
    description:
      'Vendor-managed inventory accounts place orders 35% more frequently than non-VMI accounts, with higher average order values and lower churn rates.',
    confidence: 89,
    evidence: [
      'VMI accounts average 5.2 orders/month vs 3.8 for non-VMI',
      'VMI account churn rate: 4% vs 12% for non-VMI',
      'Average VMI order value: $3,100 vs $2,600 non-VMI',
      '8 of top 10 accounts by revenue are on VMI',
    ],
    discoveredAt: '2026-01-22T14:00:00Z',
  },
  {
    id: 'pat-03',
    title: 'Phone interactions convert 2.5x better than email for reorders',
    description:
      'Outreach via phone results in 2.5x higher conversion rate for reorder placement compared to email outreach, particularly for accounts that have gone quiet.',
    confidence: 84,
    evidence: [
      'Phone reorder conversion: 62% vs email at 25%',
      'Average time to reorder after phone call: 1.2 days',
      'Average time to reorder after email: 3.8 days',
      'Accounts contacted by phone have 18% higher satisfaction scores',
    ],
    discoveredAt: '2026-02-05T11:00:00Z',
  },
  {
    id: 'pat-04',
    title: 'New accounts onboarded with vendor days have 40% higher retention',
    description:
      'Accounts that receive an in-person vendor day within the first 30 days of onboarding show significantly higher 6-month retention compared to standard onboarding.',
    confidence: 79,
    evidence: [
      '6-month retention with vendor day: 88% vs 63% without',
      'Vendor day accounts place first reorder 5 days sooner on average',
      'NPS score 22 points higher for vendor-day-onboarded accounts',
      'Sample size: 34 accounts with vendor day vs 51 without',
    ],
    discoveredAt: '2026-02-12T10:00:00Z',
  },
  {
    id: 'pat-05',
    title: 'Tuesday deliveries correlate with faster reorder cadence',
    description:
      'Accounts that receive deliveries on Tuesdays tend to reorder 1.5 days sooner than accounts on other delivery days, possibly due to mid-week restocking behavior.',
    confidence: 75,
    evidence: [
      'Tuesday delivery accounts reorder every 6.2 days on average',
      'Friday delivery accounts reorder every 7.7 days on average',
      'Monday delivery accounts reorder every 7.1 days on average',
      'Hypothesis: Tuesday allows shelf evaluation before weekend rush',
    ],
    discoveredAt: '2026-02-18T16:00:00Z',
  },
  {
    id: 'pat-06',
    title: 'Extraction yields decline 5-8% in summer months',
    description:
      'Concentrate extraction yields consistently drop during June-August, likely due to temperature and humidity effects on source material quality.',
    confidence: 71,
    evidence: [
      'Summer 2025 average yield: 18.2% vs winter 2025 average: 19.7%',
      'Highest yield month: January at 20.1%',
      'Lowest yield month: July at 17.8%',
      'HVAC upgrade in Room 3 reduced summer decline by 2%',
    ],
    discoveredAt: '2026-02-25T09:00:00Z',
  },
  {
    id: 'pat-07',
    title: 'Accounts that don\'t order for 14+ days have 60% churn risk',
    description:
      'When an active account goes more than 14 days without placing an order, there is a 60% probability they will churn within 90 days if not proactively contacted.',
    confidence: 86,
    evidence: [
      '14-day gap accounts that churned: 58 of 97 (60%)',
      'Proactive outreach reduced churn to 22% in intervention group',
      'Average days before churn after 14-day gap: 47 days',
      'Most common churn reason: switched to competitor pricing',
    ],
    discoveredAt: '2026-03-01T13:00:00Z',
  },
  {
    id: 'pat-08',
    title: 'Preroll demand peaks on Fridays and before holidays',
    description:
      'Preroll category shows strong day-of-week seasonality with Friday orders 40% above daily average, and 2-3x spikes in the 48 hours before major holidays.',
    confidence: 83,
    evidence: [
      'Friday preroll orders: 142% of daily average',
      'Pre-4/20 preroll orders: 310% of daily average',
      'Pre-Labor Day spike: 220% of daily average',
      'Multi-pack prerolls drive 65% of Friday volume increase',
    ],
    discoveredAt: '2026-03-03T10:00:00Z',
  },
];

// --- Helpers ---
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Export functions ---

export async function getMemoryLayers(): Promise<MemoryLayer[]> {
  await delay(300);
  return memoryLayers;
}

export async function getMemoryFacts(filters?: {
  category?: string;
  verifiedOnly?: boolean;
  minConfidence?: number;
  search?: string;
}): Promise<MemoryFact[]> {
  await delay(300);
  let result = [...memoryFacts];

  if (filters?.category) {
    result = result.filter((f) => f.category === filters.category);
  }
  if (filters?.verifiedOnly) {
    result = result.filter((f) => f.verified);
  }
  if (filters?.minConfidence !== undefined) {
    const min = filters.minConfidence;
    result = result.filter((f) => f.confidence >= min);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (f) =>
        f.content.toLowerCase().includes(q) ||
        f.source.toLowerCase().includes(q) ||
        f.sourceModule.toLowerCase().includes(q)
    );
  }

  return result;
}

export async function getMemoryPatterns(): Promise<MemoryPattern[]> {
  await delay(300);
  return memoryPatterns;
}
