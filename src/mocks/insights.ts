import type { Insight, InsightQueryResult } from '@/modules/insights/types';

function getDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const insights: Insight[] = [
  // --- Trends (4) ---
  {
    id: 'ins-trend-1',
    type: 'trend',
    title: 'Vape sales in Seattle metro up 15% MoM',
    description: 'Vaporizer category revenue across 12 Seattle metro accounts increased from $42K to $48.3K month-over-month. Growth is concentrated in live resin carts and disposables. Three accounts increased their vape order frequency from bi-weekly to weekly.',
    severity: 'medium',
    module: 'Orders',
    confidence: 92,
    createdAt: getDateOffset(-1),
    actionable: true,
    action: 'Increase live resin cart production allocation for Seattle route',
  },
  {
    id: 'ins-trend-2',
    type: 'trend',
    title: 'Preroll multi-packs outselling singles 3:1',
    description: 'Across all accounts, preroll multi-pack SKUs (5-packs and 7-packs) are outselling individual prerolls at a 3:1 ratio by revenue. This trend has accelerated over the past 60 days, up from a 2:1 ratio in January. Singles are increasingly seen as trial purchases only.',
    severity: 'medium',
    module: 'Products',
    confidence: 95,
    createdAt: getDateOffset(-2),
    actionable: true,
    action: 'Shift preroll production mix to 70% multi-packs, 30% singles',
  },
  {
    id: 'ins-trend-3',
    type: 'trend',
    title: 'Edible category revenue grew 22% in Q1',
    description: 'Total edible revenue reached $186K in Q1, up from $152K in Q4. Growth driven primarily by gummy products (68% of edible revenue). Chocolate bars remain flat. New nano-emulsion gummies from competitors are driving overall category interest.',
    severity: 'low',
    module: 'Finance',
    confidence: 98,
    createdAt: getDateOffset(-3),
    actionable: false,
  },
  {
    id: 'ins-trend-4',
    type: 'trend',
    title: 'Average order size increased $180 to $220 over last 60 days',
    description: 'Mean order value across all active accounts rose 22% from $180 to $220. This correlates with successful category expansion efforts — accounts carrying 3+ product categories from us order 35% more per transaction than single-category accounts.',
    severity: 'low',
    module: 'Orders',
    confidence: 94,
    createdAt: getDateOffset(-4),
    actionable: false,
  },

  // --- Anomalies (4) ---
  {
    id: 'ins-anom-1',
    type: 'anomaly',
    title: 'Greenfield order frequency dropped from 7-day to 12-day cadence',
    description: 'Greenfield Dispensary has increased their average time between orders from 7 days to 12 days over the past 3 weeks. No communication from the buyer explains the change. Historical pattern shows this type of frequency drop precedes account churn 60% of the time.',
    severity: 'high',
    module: 'CRM',
    confidence: 88,
    createdAt: getDateOffset(-1),
    actionable: true,
    action: 'Schedule immediate check-in call with Greenfield buyer',
  },
  {
    id: 'ins-anom-2',
    type: 'anomaly',
    title: 'Extraction yield for Gelato batches down 8%',
    description: 'The last three Gelato extraction runs yielded 14.2% average, down from the historical 15.4% for this strain. Input material tested at expected potency (26% THC). The variance appears to be process-related rather than material quality. Equipment calibration should be checked.',
    severity: 'medium',
    module: 'Manufacturing',
    confidence: 82,
    createdAt: getDateOffset(-2),
    actionable: true,
    action: 'Schedule extraction equipment calibration check',
  },
  {
    id: 'ins-anom-3',
    type: 'anomaly',
    title: 'Spokane delivery route time increased 25% this week',
    description: 'The Spokane delivery route averaged 6.2 hours this week, up from the 4.9 hour historical average. Analysis shows the increase is concentrated in the last 3 stops. Construction on Division Street may be causing routing inefficiencies. Driver confirmed detours.',
    severity: 'medium',
    module: 'Delivery',
    confidence: 76,
    createdAt: getDateOffset(-3),
    actionable: true,
    action: 'Optimize Spokane route to avoid Division Street construction',
  },
  {
    id: 'ins-anom-4',
    type: 'anomaly',
    title: 'Capitol Hill Collective skipped regular Tuesday order',
    description: 'Capitol Hill Collective has placed a Tuesday order every week for the past 14 weeks. This Tuesday, no order was placed and no communication was received. This is the first missed order in their history with us. Their payment history is current.',
    severity: 'high',
    module: 'CRM',
    confidence: 90,
    createdAt: getDateOffset(-1),
    actionable: true,
    action: 'Contact Capitol Hill Collective to check on missed order',
  },

  // --- Predictions (4) ---
  {
    id: 'ins-pred-1',
    type: 'prediction',
    title: 'Summit Cannabis reorder by March 12',
    description: 'Based on Summit Cannabis\'s historical order cadence (every 8-9 days) and current inventory sell-through rate, they are projected to need a restock by March 12. Their typical order includes Wedding Cake 3.5g (4 units), Blue Dream Pre-Roll 5-Pack (6 units), and Gummy 10-Pack (3 units).',
    severity: 'low',
    module: 'Orders',
    confidence: 91,
    createdAt: getDateOffset(-1),
    actionable: true,
    action: 'Pre-stage Summit Cannabis order for March 12 delivery',
  },
  {
    id: 'ins-pred-2',
    type: 'prediction',
    title: 'Q2 revenue projected at $3.8M (up 12%)',
    description: 'Based on current pipeline, seasonal trends, new account onboarding velocity, and product launch schedule, Q2 revenue is projected at $3.8M. This represents a 12% increase over Q1 ($3.39M). Key drivers: beverage pilot launch, 4 new accounts in onboarding, and continued edible category growth.',
    severity: 'low',
    module: 'Finance',
    confidence: 78,
    createdAt: getDateOffset(-2),
    actionable: false,
  },
  {
    id: 'ins-pred-3',
    type: 'prediction',
    title: 'Wedding Cake harvest yield estimated at 2.4 lbs in Room 3',
    description: 'Room 3 Wedding Cake crop (24 plants, day 62 of flower) is tracking toward an estimated 2.4 lbs dry yield based on current plant size, canopy density, and historical strain performance. This is within the expected range of 2.2-2.6 lbs for this room configuration.',
    severity: 'low',
    module: 'Cultivation',
    confidence: 85,
    createdAt: getDateOffset(-1),
    actionable: false,
  },
  {
    id: 'ins-pred-4',
    type: 'prediction',
    title: 'Pacific Leaf likely to churn within 30 days without intervention',
    description: 'Pacific Leaf shows three churn indicators: order frequency dropped 40% over 8 weeks, last two orders were smaller than average, and CloudNine gained a placement at their store last week. Accounts matching this pattern have churned 72% of the time historically.',
    severity: 'high',
    module: 'CRM',
    confidence: 72,
    createdAt: getDateOffset(-1),
    actionable: true,
    action: 'Escalate Pacific Leaf to sales manager for retention outreach',
  },

  // --- Correlations (4) ---
  {
    id: 'ins-corr-1',
    type: 'correlation',
    title: 'Vendor days within 30 days of onboarding boost retention 40%',
    description: 'Analysis of 28 accounts onboarded in the past 12 months shows that accounts receiving a vendor day within 30 days of their first order have a 40% higher retention rate at 6 months (85% vs 61%). The vendor day appears to cement the relationship and educate budtenders on our product differentiation.',
    severity: 'medium',
    module: 'CRM',
    confidence: 87,
    createdAt: getDateOffset(-5),
    actionable: true,
    action: 'Mandate vendor day scheduling within 30 days for all new accounts',
  },
  {
    id: 'ins-corr-2',
    type: 'correlation',
    title: 'Tuesday deliveries correlate with 12% faster reorder cadence',
    description: 'Accounts receiving deliveries on Tuesdays reorder an average of 12% sooner than those receiving Thursday or Friday deliveries. Hypothesis: Tuesday deliveries give stores time to stock shelves before the weekend rush, leading to faster sell-through and earlier restock needs.',
    severity: 'low',
    module: 'Delivery',
    confidence: 74,
    createdAt: getDateOffset(-7),
    actionable: true,
    action: 'Prioritize Tuesday delivery slots for high-value accounts',
  },
  {
    id: 'ins-corr-3',
    type: 'correlation',
    title: 'VMI accounts order 35% more frequently',
    description: 'The 8 accounts enrolled in our Vendor Managed Inventory program place orders 35% more frequently than comparable non-VMI accounts. Average order size is 15% smaller, but total monthly revenue per account is 22% higher. VMI also reduces stockout incidents by 80%.',
    severity: 'medium',
    module: 'VMI',
    confidence: 91,
    createdAt: getDateOffset(-4),
    actionable: true,
    action: 'Expand VMI enrollment target to 5 additional accounts this quarter',
  },
  {
    id: 'ins-corr-4',
    type: 'correlation',
    title: 'Phone interactions convert 2.5x better than email for reorders',
    description: 'Outreach attempts via phone result in a confirmed reorder 62% of the time, compared to 25% for email outreach. The gap is most pronounced for accounts that have been inactive for 10+ days. Text messages fall in between at 44% conversion.',
    severity: 'low',
    module: 'CRM',
    confidence: 83,
    createdAt: getDateOffset(-6),
    actionable: true,
    action: 'Update outreach SOP to prioritize phone calls over email',
  },

  // --- Recommendations (4) ---
  {
    id: 'ins-rec-1',
    type: 'recommendation',
    title: 'Expand edibles to Capitol Hill Collective',
    description: 'Capitol Hill Collective currently carries only our flower and preroll SKUs. Their neighborhood has the highest edible demand density in Seattle (32% of category sales). Competitor Green State Co\'s gummies were recently placed in their store. Adding our gummy line would protect against further competitor encroachment and increase our revenue per account by an estimated $1,200/month.',
    severity: 'medium',
    module: 'CRM',
    confidence: 88,
    createdAt: getDateOffset(-2),
    actionable: true,
    action: 'Schedule category expansion pitch with Capitol Hill Collective buyer',
  },
  {
    id: 'ins-rec-2',
    type: 'recommendation',
    title: 'Move Rainier Remedies to prepay-only',
    description: 'Rainier Remedies has triggered the 3-day payment warning 4 times in the past 6 months and required a 4th-day escalation twice. Their payment pattern shows consistent delays of 4-5 days. Moving them to prepay-only terms reduces our compliance risk under the WSLCB 5-day rule and eliminates the administrative overhead of constant payment follow-ups.',
    severity: 'high',
    module: 'Finance',
    confidence: 93,
    createdAt: getDateOffset(-1),
    actionable: true,
    action: 'Notify sales rep and initiate prepay-only terms conversation',
  },
  {
    id: 'ins-rec-3',
    type: 'recommendation',
    title: 'Schedule vendor day at Summit Cannabis to boost retention',
    description: 'Summit Cannabis has been an active account for 45 days but has not yet received a vendor day. Based on our correlation data, scheduling a vendor day now could improve their 6-month retention probability from 61% to 85%. Their buyer, David Kim, has expressed interest in learning more about our cultivation process.',
    severity: 'medium',
    module: 'CRM',
    confidence: 86,
    createdAt: getDateOffset(-3),
    actionable: true,
    action: 'Schedule vendor day at Summit Cannabis within 2 weeks',
  },
  {
    id: 'ins-rec-4',
    type: 'recommendation',
    title: 'Increase Blue Dream production — projected stockout in 2 weeks',
    description: 'Current Blue Dream inventory (flower and preroll input) will be depleted in approximately 14 days at the current sell-through rate. Blue Dream is our #2 SKU by revenue and is stocked at 18 of 24 active accounts. Room 1 harvest (Blue Dream) is 28 days away. Consider sourcing from backup cultivar or expediting Room 2 planting.',
    severity: 'high',
    module: 'Inventory',
    confidence: 90,
    createdAt: getDateOffset(-1),
    actionable: true,
    action: 'Alert cultivation lead and evaluate expedited planting schedule',
  },
];

const demoQueries: InsightQueryResult[] = [
  {
    query: 'Which accounts are at risk of churning?',
    results: 'Two accounts show elevated churn risk: **Pacific Leaf** (72% churn probability — order frequency down 40%, smaller orders, competitor gained placement) and **Greenfield Dispensary** (moderate risk — order cadence slowed from 7 to 12 days with no explanation). Recommend immediate outreach to both accounts this week. Pacific Leaf should be escalated to the sales manager for a retention conversation.',
    timestamp: getDateOffset(0),
  },
  {
    query: 'What is our best performing product category?',
    results: 'By revenue, **Flower** remains the top category at $1.42M in Q1 (42% of total revenue). However, **Edibles** showed the strongest growth at 22% QoQ. By margin, **Concentrates** lead at 64% gross margin. Preroll multi-packs are the fastest-growing SKU format, outselling singles 3:1. Vaporizer category is growing 15% MoM in Seattle metro specifically.',
    timestamp: getDateOffset(0),
  },
  {
    query: 'How are we doing against CloudNine?',
    results: 'CloudNine Extracts is our primary competitive threat in the vaporizer and concentrate categories. They recently dropped 510 cart prices to $18 (vs our $24) and launched a $15 disposable. We\'ve lost placements at **Pacific Leaf** and **Rainier Remedies** due to price. However, our live resin quality testing consistently scores higher, and accounts that receive vendor day education show 80% resistance to CloudNine displacement. Recommended strategy: value differentiation, not price matching.',
    timestamp: getDateOffset(0),
  },
  {
    query: 'What should I focus on this week?',
    results: 'Priority actions for this week: 1) **Contact Capitol Hill Collective** about their missed Tuesday order (high urgency). 2) **Call Greenfield Dispensary** to investigate order frequency drop. 3) **Schedule vendor day at Summit Cannabis** (45 days since onboarding, no vendor day yet). 4) **Escalate Pacific Leaf** to sales manager for retention outreach. 5) **Review Spokane delivery route** — construction-related delays need routing fix.',
    timestamp: getDateOffset(0),
  },
  {
    query: 'What is our projected revenue for Q2?',
    results: 'Q2 revenue is projected at **$3.8M**, representing a 12% increase over Q1 ($3.39M). Key growth drivers: beverage pilot launch (est. $45K contribution), 4 new accounts in onboarding pipeline, continued edible category momentum (+22% QoQ), and seasonal demand increase. Confidence level: 78%. Downside risk: competitive pressure in vaporizer category could reduce projection by $120-180K if not addressed.',
    timestamp: getDateOffset(0),
  },
];

export function getInsights(filters?: {
  type?: string;
  severity?: string;
  module?: string;
  actionable?: boolean;
}): Insight[] {
  let filtered = [...insights];

  if (filters?.type && filters.type !== 'all') {
    filtered = filtered.filter((i) => i.type === filters.type);
  }
  if (filters?.severity && filters.severity !== 'all') {
    filtered = filtered.filter((i) => i.severity === filters.severity);
  }
  if (filters?.module && filters.module !== 'all') {
    filtered = filtered.filter((i) => i.module === filters.module);
  }
  if (filters?.actionable !== undefined) {
    filtered = filtered.filter((i) => i.actionable === filters.actionable);
  }

  // Sort by severity (high > medium > low) then by date
  const severityOrder = { high: 0, medium: 1, low: 2 };
  return filtered.sort((a, b) => {
    const sevDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (sevDiff !== 0) return sevDiff;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function getDemoQueryResponse(query: string): InsightQueryResult | null {
  const lower = query.toLowerCase();
  const match = demoQueries.find((dq) => {
    const keywords = dq.query.toLowerCase().split(' ');
    const matchCount = keywords.filter((kw) => lower.includes(kw)).length;
    return matchCount >= 3;
  });
  return match ?? demoQueries[3]; // Default to "What should I focus on" if no match
}
