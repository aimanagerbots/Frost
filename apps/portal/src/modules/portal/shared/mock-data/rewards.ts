import type {
  RewardsTier,
  PointsTransaction,
  Achievement,
  RewardItem,
  LeaderboardEntry,
  PortalRewardsData,
} from '../types';

// ========================
// TIER DEFINITIONS
// ========================

export const REWARD_TIERS: RewardsTier[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    minPoints: 0,
    discountPercent: 0,
    color: '#CD7F32',
    benefits: [
      'Access to Frost portal & analytics',
      'Standard delivery windows',
      'Basic sell-through reports',
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    minPoints: 2500,
    discountPercent: 2,
    color: '#C0C0C0',
    benefits: [
      'All Bronze benefits',
      '2% quarterly rebate',
      'Early access to new product drops',
      'Priority delivery scheduling',
      'Free POP materials (1 kit/quarter)',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    minPoints: 7500,
    discountPercent: 4,
    color: '#F59E0B',
    benefits: [
      'All Silver benefits',
      '4% quarterly rebate',
      'Exclusive allocation reservations',
      'Dedicated rep hotline',
      'Co-op marketing credits ($200/quarter)',
      'Budtender training kits',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    minPoints: 15000,
    discountPercent: 6,
    color: '#A78BFA',
    benefits: [
      'All Gold benefits',
      '6% quarterly rebate',
      'First access to limited drops',
      'Custom menu asset creation',
      'Quarterly strategy session with regional manager',
      'VIP event invitations',
      'Co-op marketing credits ($500/quarter)',
    ],
  },
];

// ========================
// ACHIEVEMENTS
// ========================

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-order',
    name: 'First Frost',
    description: 'Place your first wholesale order',
    icon: 'Snowflake',
    category: 'ordering',
    unlockedAt: '2025-06-15T10:00:00Z',
    progress: 1,
    target: 1,
  },
  {
    id: 'ach-5-sku',
    name: '5-SKU Club',
    description: 'Carry 5 or more Frost SKUs simultaneously',
    icon: 'Package',
    category: 'ordering',
    unlockedAt: '2025-08-22T14:00:00Z',
    progress: 5,
    target: 5,
  },
  {
    id: 'ach-10-sku',
    name: 'Full Lineup',
    description: 'Carry 10 or more Frost SKUs simultaneously',
    icon: 'Layers',
    category: 'ordering',
    progress: 7,
    target: 10,
  },
  {
    id: 'ach-early-payer',
    name: 'Early Bird',
    description: 'Pay 3 invoices before the due date',
    icon: 'Clock',
    category: 'loyalty',
    unlockedAt: '2025-09-10T09:00:00Z',
    progress: 3,
    target: 3,
  },
  {
    id: 'ach-streak-5',
    name: 'On a Roll',
    description: 'Place orders 5 consecutive weeks',
    icon: 'Flame',
    category: 'loyalty',
    progress: 3,
    target: 5,
  },
  {
    id: 'ach-training-1',
    name: 'Budtender Basics',
    description: 'Complete your first staff training module',
    icon: 'GraduationCap',
    category: 'engagement',
    progress: 0,
    target: 1,
  },
  {
    id: 'ach-training-all',
    name: 'Frost Scholar',
    description: 'Complete all available training modules',
    icon: 'Award',
    category: 'engagement',
    progress: 0,
    target: 6,
  },
  {
    id: 'ach-velocity-leader',
    name: 'Velocity Leader',
    description: 'Achieve 3x category average sell-through on any SKU',
    icon: 'TrendingUp',
    category: 'performance',
    unlockedAt: '2025-11-05T16:00:00Z',
    progress: 1,
    target: 1,
  },
  {
    id: 'ach-category-complete',
    name: 'Category Conqueror',
    description: 'Carry Frost products in all 6 categories',
    icon: 'Crown',
    category: 'performance',
    progress: 4,
    target: 6,
  },
  {
    id: 'ach-referral',
    name: 'Frost Ambassador',
    description: 'Refer another dispensary that places their first order',
    icon: 'Users',
    category: 'engagement',
    progress: 0,
    target: 1,
  },
];

// ========================
// REWARDS CATALOG
// ========================

const REWARDS_CATALOG: RewardItem[] = [
  {
    id: 'rw-credit-50',
    name: '$50 Account Credit',
    description: 'Applied to your next invoice automatically',
    pointsCost: 500,
    category: 'credit',
    available: true,
  },
  {
    id: 'rw-credit-200',
    name: '$200 Account Credit',
    description: 'Applied to your next invoice automatically',
    pointsCost: 1800,
    category: 'credit',
    available: true,
  },
  {
    id: 'rw-exclusive-preroll',
    name: 'Exclusive Strain Pre-Roll Pack',
    description: 'Limited edition 6-pack not available in the regular catalog',
    pointsCost: 1200,
    category: 'product',
    available: true,
    limitedQuantity: 15,
  },
  {
    id: 'rw-early-access',
    name: 'Early Drop Access Pass',
    description: '48-hour early reservation window on the next limited drop',
    pointsCost: 800,
    category: 'access',
    available: true,
  },
  {
    id: 'rw-pop-kit',
    name: 'Premium POP Display Kit',
    description: 'Full in-store display: counter cards, shelf talkers, window clings, table tent',
    pointsCost: 600,
    category: 'merch',
    available: true,
  },
  {
    id: 'rw-strategy-session',
    name: '1-on-1 Strategy Session',
    description: '30-minute call with Frost regional manager to optimize your product mix',
    pointsCost: 2000,
    category: 'service',
    available: true,
  },
  {
    id: 'rw-merch-hat',
    name: 'Frost Branded Cap',
    description: 'Embroidered snapback — great for budtenders',
    pointsCost: 300,
    category: 'merch',
    available: true,
  },
  {
    id: 'rw-priority-delivery',
    name: 'Priority Delivery Upgrade',
    description: 'Next 3 deliveries get first-stop priority on the route',
    pointsCost: 900,
    category: 'service',
    available: true,
  },
];

// ========================
// MOCK DATA GENERATORS
// ========================

function generateTransactions(): PointsTransaction[] {
  return [
    { id: 'pt-1', date: '2026-03-07T14:00:00Z', type: 'earn', amount: 180, source: 'order', description: 'Order #FW-2847 — $1,800 wholesale', orderId: 'ord-1' },
    { id: 'pt-2', date: '2026-03-05T10:00:00Z', type: 'earn', amount: 50, source: 'early-payment', description: 'Early payment bonus — Invoice #INV-4521' },
    { id: 'pt-3', date: '2026-03-01T09:00:00Z', type: 'redeem', amount: -500, source: 'redemption', description: 'Redeemed: $50 Account Credit' },
    { id: 'pt-4', date: '2026-02-25T16:00:00Z', type: 'earn', amount: 220, source: 'order', description: 'Order #FW-2831 — $2,200 wholesale', orderId: 'ord-2' },
    { id: 'pt-5', date: '2026-02-20T11:00:00Z', type: 'earn', amount: 100, source: 'achievement', description: 'Achievement unlocked: Velocity Leader' },
    { id: 'pt-6', date: '2026-02-15T13:00:00Z', type: 'earn', amount: 150, source: 'order', description: 'Order #FW-2819 — $1,500 wholesale', orderId: 'ord-3' },
    { id: 'pt-7', date: '2026-02-10T08:00:00Z', type: 'earn', amount: 75, source: 'training', description: 'Completed: Frost Product Knowledge 101' },
    { id: 'pt-8', date: '2026-02-01T10:00:00Z', type: 'earn', amount: 190, source: 'order', description: 'Order #FW-2805 — $1,900 wholesale', orderId: 'ord-4' },
    { id: 'pt-9', date: '2026-01-28T14:00:00Z', type: 'earn', amount: 250, source: 'referral', description: 'Referral bonus — Green Valley Dispensary placed first order' },
    { id: 'pt-10', date: '2026-01-20T09:00:00Z', type: 'earn', amount: 160, source: 'order', description: 'Order #FW-2792 — $1,600 wholesale', orderId: 'ord-5' },
    { id: 'pt-11', date: '2026-01-15T11:00:00Z', type: 'redeem', amount: -300, source: 'redemption', description: 'Redeemed: Frost Branded Cap' },
    { id: 'pt-12', date: '2026-01-10T10:00:00Z', type: 'earn', amount: 140, source: 'order', description: 'Order #FW-2780 — $1,400 wholesale', orderId: 'ord-6' },
  ];
}

function generateLeaderboard(): LeaderboardEntry[] {
  return [
    { rank: 1, displayName: 'Emerald City Cannabis', tier: 'Platinum', points: 18420, isCurrentUser: false },
    { rank: 2, displayName: 'Peak Dispensary', tier: 'Platinum', points: 16890, isCurrentUser: false },
    { rank: 3, displayName: 'Mountain High Collective', tier: 'Gold', points: 14200, isCurrentUser: false },
    { rank: 4, displayName: 'Sunrise Wellness', tier: 'Gold', points: 12750, isCurrentUser: false },
    { rank: 5, displayName: 'Cloud 9 Dispensary', tier: 'Gold', points: 11300, isCurrentUser: false },
    { rank: 6, displayName: 'Green Leaf Co.', tier: 'Gold', points: 9840, isCurrentUser: false },
    { rank: 7, displayName: 'Frosty\'s Garden', tier: 'Gold', points: 8650, isCurrentUser: true },
    { rank: 8, displayName: 'Pacific Roots', tier: 'Silver', points: 7200, isCurrentUser: false },
    { rank: 9, displayName: 'Verdant Bud', tier: 'Silver', points: 6100, isCurrentUser: false },
    { rank: 10, displayName: 'Cannabliss', tier: 'Silver', points: 5400, isCurrentUser: false },
  ];
}

export function getRewardsForAccount(accountId: string): PortalRewardsData {
  const pointsByAccount: Record<string, number> = {
    'acct-1': 8650,
    'acct-2': 3200,
    'acct-3': 900,
  };

  const totalPoints = pointsByAccount[accountId] ?? 2000;
  const currentTier = [...REWARD_TIERS].reverse().find((t) => totalPoints >= t.minPoints) ?? REWARD_TIERS[0];
  const currentIdx = REWARD_TIERS.findIndex((t) => t.id === currentTier.id);
  const nextTier = currentIdx < REWARD_TIERS.length - 1 ? REWARD_TIERS[currentIdx + 1] : null;
  const pointsToNextTier = nextTier ? nextTier.minPoints - totalPoints : 0;

  const leaderboard = generateLeaderboard();
  if (accountId !== 'acct-1') {
    const currentEntry = leaderboard.find((e) => e.isCurrentUser);
    if (currentEntry) {
      currentEntry.points = totalPoints;
      currentEntry.tier = currentTier.name;
    }
  }

  return {
    currentTier,
    nextTier,
    totalPoints,
    pointsToNextTier,
    lifetimePoints: totalPoints + 800,
    transactions: generateTransactions(),
    achievements: ACHIEVEMENTS,
    catalog: REWARDS_CATALOG,
    leaderboard,
    quarterlyRebate: totalPoints > 7500 ? 847 : totalPoints > 2500 ? 420 : 0,
    totalSavings: accountId === 'acct-1' ? 4280 : accountId === 'acct-2' ? 1650 : 340,
  };
}
