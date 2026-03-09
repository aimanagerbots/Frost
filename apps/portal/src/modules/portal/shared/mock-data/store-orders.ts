import type { StoreOrder, StoreOrderItem, StoreOrderStats } from '../types';

// ── Helpers ──────────────────────────────────────────────────────────

const ACCT_1 = 'acct-1'; // Greenfield
const ACCT_2 = 'acct-2'; // Pacific Leaf
const ACCT_3 = 'acct-3'; // Cascade Wellness

const TODAY = '2026-03-08';

function storeItem(
  productId: string,
  productName: string,
  category: string,
  strainName: string,
  packageSize: string,
  quantity: number,
): StoreOrderItem {
  return { productId, productName, category, strainName, packageSize, quantity };
}

function completedOrder(
  id: string,
  orderNumber: string,
  storeId: string,
  customerName: string,
  phone: string,
  items: StoreOrderItem[],
  source: StoreOrder['source'],
  placedMinutesAgo: number,
  prepMinutes: number,
): StoreOrder {
  const now = new Date(`${TODAY}T17:30:00Z`);
  const placedAt = new Date(now.getTime() - placedMinutesAgo * 60_000);
  const acceptedAt = new Date(placedAt.getTime() + 60_000);
  const preparingAt = new Date(acceptedAt.getTime() + 60_000);
  const readyAt = new Date(preparingAt.getTime() + prepMinutes * 60_000);
  const completedAt = new Date(readyAt.getTime() + 5 * 60_000);

  return {
    id,
    orderNumber,
    storeId,
    customerName,
    customerPhone: phone,
    items,
    status: 'picked-up',
    source,
    placedAt: placedAt.toISOString(),
    acceptedAt: acceptedAt.toISOString(),
    preparingAt: preparingAt.toISOString(),
    readyAt: readyAt.toISOString(),
    completedAt: completedAt.toISOString(),
    pickupPreference: 'asap',
    statusHistory: [
      { status: 'new', timestamp: placedAt.toISOString() },
      { status: 'accepted', timestamp: acceptedAt.toISOString() },
      { status: 'preparing', timestamp: preparingAt.toISOString() },
      { status: 'ready', timestamp: readyAt.toISOString() },
      { status: 'picked-up', timestamp: completedAt.toISOString() },
    ],
  };
}

// ── Shared product items ─────────────────────────────────────────────

const WEDDING_CAKE_35 = (qty: number) =>
  storeItem('prod-001', 'Wedding Cake 3.5g', 'flower', 'Wedding Cake', '3.5g', qty);
const BLUE_DREAM_PREROLL = (qty: number) =>
  storeItem('prod-010', 'Blue Dream Preroll 3-pack', 'prerolls', 'Blue Dream', '3-pack', qty);
const OG_KUSH_7G = (qty: number) =>
  storeItem('prod-002', 'OG Kush 7g', 'flower', 'OG Kush', '7g', qty);
const GELATO_CART = (qty: number) =>
  storeItem('prod-020', 'Gelato Cart 1g', 'vaporizers', 'Gelato', '1g', qty);
const ZKITTLEZ_35 = (qty: number) =>
  storeItem('prod-005', 'Zkittlez 3.5g', 'flower', 'Zkittlez', '3.5g', qty);
const BLUE_DREAM_35 = (qty: number) =>
  storeItem('prod-003', 'Blue Dream 3.5g', 'flower', 'Blue Dream', '3.5g', qty);
const TROPICAL_GUMMIES = (qty: number) =>
  storeItem('prod-040', 'Tropical Gummies 10-pack', 'edibles', 'Hybrid Blend', '10-pack', qty);
const GELATO_35 = (qty: number) =>
  storeItem('prod-004', 'Gelato 3.5g', 'flower', 'Gelato', '3.5g', qty);
const OG_KUSH_PREROLL = (qty: number) =>
  storeItem('prod-011', 'OG Kush Preroll 6-pack', 'prerolls', 'OG Kush', '6-pack', qty);
const FROST_MINTS = (qty: number) =>
  storeItem('prod-042', 'Frost Mints 20-pack', 'edibles', 'Hybrid Blend', '20-pack', qty);
const LIVE_RESIN = (qty: number) =>
  storeItem('prod-030', 'Wedding Cake Live Resin 1g', 'concentrates', 'Wedding Cake', '1g', qty);
const CHOCO_BAR = (qty: number) =>
  storeItem('prod-041', 'Dark Chocolate Bar 100mg', 'edibles', 'Hybrid Blend', '100mg', qty);

// ══════════════════════════════════════════════════════════════════════
// GREENFIELD — high volume, Dutchie + Jane
// ══════════════════════════════════════════════════════════════════════

const greenfieldActive: StoreOrder[] = [
  {
    id: 'so-gf-042',
    orderNumber: 'FO-2026-0042',
    storeId: ACCT_1,
    customerName: 'Maria L.',
    customerPhone: '(206) ***-**18',
    items: [WEDDING_CAKE_35(1), BLUE_DREAM_PREROLL(1)],
    status: 'new',
    source: 'frost-website',
    placedAt: '2026-03-08T17:28:00Z',
    pickupPreference: 'asap',
    statusHistory: [
      { status: 'new', timestamp: '2026-03-08T17:28:00Z' },
    ],
  },
  {
    id: 'so-gf-041',
    orderNumber: 'FO-2026-0041',
    storeId: ACCT_1,
    customerName: 'David K.',
    customerPhone: '(206) ***-**44',
    items: [OG_KUSH_7G(1)],
    status: 'preparing',
    source: 'dutchie',
    placedAt: '2026-03-08T17:22:00Z',
    acceptedAt: '2026-03-08T17:23:00Z',
    preparingAt: '2026-03-08T17:24:00Z',
    pickupPreference: 'asap',
    preparedBy: 'Sarah',
    statusHistory: [
      { status: 'new', timestamp: '2026-03-08T17:22:00Z' },
      { status: 'accepted', timestamp: '2026-03-08T17:23:00Z' },
      { status: 'preparing', timestamp: '2026-03-08T17:24:00Z' },
    ],
  },
  {
    id: 'so-gf-040',
    orderNumber: 'FO-2026-0040',
    storeId: ACCT_1,
    customerName: 'Tyler R.',
    customerPhone: '(206) ***-**71',
    items: [GELATO_CART(1), ZKITTLEZ_35(1)],
    status: 'ready',
    source: 'jane',
    placedAt: '2026-03-08T17:14:00Z',
    acceptedAt: '2026-03-08T17:15:00Z',
    preparingAt: '2026-03-08T17:16:00Z',
    readyAt: '2026-03-08T17:22:00Z',
    estimatedPickupTime: '2026-03-08T17:45:00Z',
    pickupPreference: 'asap',
    preparedBy: 'Mike',
    statusHistory: [
      { status: 'new', timestamp: '2026-03-08T17:14:00Z' },
      { status: 'accepted', timestamp: '2026-03-08T17:15:00Z' },
      { status: 'preparing', timestamp: '2026-03-08T17:16:00Z' },
      { status: 'ready', timestamp: '2026-03-08T17:22:00Z' },
    ],
  },
];

const greenfieldCompleted: StoreOrder[] = [
  completedOrder('so-gf-039', 'FO-2026-0039', ACCT_1, 'Jessica M.', '(206) ***-**33', [WEDDING_CAKE_35(1), TROPICAL_GUMMIES(1)], 'frost-website', 35, 7),
  completedOrder('so-gf-038', 'FO-2026-0038', ACCT_1, 'Brian T.', '(206) ***-**56', [OG_KUSH_7G(1)], 'dutchie', 50, 6),
  completedOrder('so-gf-037', 'FO-2026-0037', ACCT_1, 'Amanda S.', '(206) ***-**92', [BLUE_DREAM_35(1), BLUE_DREAM_PREROLL(1)], 'frost-website', 65, 8),
  completedOrder('so-gf-036', 'FO-2026-0036', ACCT_1, 'Kevin W.', '(206) ***-**10', [GELATO_CART(2)], 'jane', 80, 5),
  completedOrder('so-gf-035', 'FO-2026-0035', ACCT_1, 'Rachel P.', '(206) ***-**87', [WEDDING_CAKE_35(1), LIVE_RESIN(1)], 'frost-website', 100, 9),
  completedOrder('so-gf-034', 'FO-2026-0034', ACCT_1, 'Marcus J.', '(206) ***-**25', [OG_KUSH_PREROLL(1)], 'dutchie', 120, 6),
  completedOrder('so-gf-033', 'FO-2026-0033', ACCT_1, 'Lisa H.', '(206) ***-**63', [ZKITTLEZ_35(1), FROST_MINTS(1)], 'frost-website', 140, 10),
  completedOrder('so-gf-032', 'FO-2026-0032', ACCT_1, 'Ryan C.', '(206) ***-**48', [GELATO_35(1)], 'frost-website', 160, 7),
  completedOrder('so-gf-031', 'FO-2026-0031', ACCT_1, 'Sarah N.', '(206) ***-**77', [CHOCO_BAR(1), BLUE_DREAM_PREROLL(1)], 'jane', 185, 8),
  completedOrder('so-gf-030', 'FO-2026-0030', ACCT_1, 'James D.', '(206) ***-**15', [WEDDING_CAKE_35(2)], 'frost-website', 210, 7),
  completedOrder('so-gf-029', 'FO-2026-0029', ACCT_1, 'Emily F.', '(206) ***-**39', [OG_KUSH_7G(1), TROPICAL_GUMMIES(1)], 'dutchie', 240, 9),
  completedOrder('so-gf-028', 'FO-2026-0028', ACCT_1, 'Alex B.', '(206) ***-**81', [GELATO_CART(1)], 'frost-website', 270, 5),
];

// ══════════════════════════════════════════════════════════════════════
// PACIFIC LEAF — medium volume, frost-website only
// ══════════════════════════════════════════════════════════════════════

const pacificLeafActive: StoreOrder[] = [
  {
    id: 'so-pl-055',
    orderNumber: 'FO-2026-0055',
    storeId: ACCT_2,
    customerName: 'Chris M.',
    customerPhone: '(253) ***-**22',
    items: [WEDDING_CAKE_35(1)],
    status: 'new',
    source: 'frost-website',
    placedAt: '2026-03-08T17:26:00Z',
    pickupPreference: 'asap',
    statusHistory: [
      { status: 'new', timestamp: '2026-03-08T17:26:00Z' },
    ],
  },
];

const pacificLeafCompleted: StoreOrder[] = [
  completedOrder('so-pl-054', 'FO-2026-0054', ACCT_2, 'Nicole R.', '(253) ***-**67', [OG_KUSH_7G(1)], 'frost-website', 45, 12),
  completedOrder('so-pl-053', 'FO-2026-0053', ACCT_2, 'Derek L.', '(253) ***-**41', [BLUE_DREAM_35(1), TROPICAL_GUMMIES(1)], 'frost-website', 90, 15),
  completedOrder('so-pl-052', 'FO-2026-0052', ACCT_2, 'Samantha W.', '(253) ***-**93', [GELATO_CART(1)], 'frost-website', 150, 13),
  completedOrder('so-pl-051', 'FO-2026-0051', ACCT_2, 'Jason K.', '(253) ***-**58', [WEDDING_CAKE_35(1), FROST_MINTS(1)], 'frost-website', 210, 14),
  completedOrder('so-pl-050', 'FO-2026-0050', ACCT_2, 'Megan T.', '(253) ***-**36', [ZKITTLEZ_35(1)], 'frost-website', 280, 16),
  completedOrder('so-pl-049', 'FO-2026-0049', ACCT_2, 'Patrick H.', '(253) ***-**74', [OG_KUSH_PREROLL(1)], 'frost-website', 350, 12),
];

// ══════════════════════════════════════════════════════════════════════
// CASCADE WELLNESS — low volume, auto-accept
// ══════════════════════════════════════════════════════════════════════

const cascadeCompleted: StoreOrder[] = [
  completedOrder('so-cw-012', 'FO-2026-0012', ACCT_3, 'Hannah B.', '(360) ***-**51', [WEDDING_CAKE_35(1)], 'frost-website', 180, 5),
  completedOrder('so-cw-011', 'FO-2026-0011', ACCT_3, 'Oliver S.', '(360) ***-**29', [BLUE_DREAM_PREROLL(1)], 'frost-website', 320, 6),
];

// ══════════════════════════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════════════════════════

const greenfieldStats: StoreOrderStats = {
  ordersToday: 25,
  ordersThisWeek: 142,
  ordersThisMonth: 580,
  avgPrepTimeMinutes: 8,
  fillRate: 97,
  noShowRate: 3,
  ordersBySource: [
    { source: 'frost-website', count: 15 },
    { source: 'dutchie', count: 6 },
    { source: 'jane', count: 4 },
  ],
  ordersByHour: [
    { hour: 8, count: 0 },
    { hour: 9, count: 1 },
    { hour: 10, count: 2 },
    { hour: 11, count: 4 },
    { hour: 12, count: 5 },
    { hour: 13, count: 3 },
    { hour: 14, count: 1 },
    { hour: 15, count: 1 },
    { hour: 16, count: 2 },
    { hour: 17, count: 3 },
    { hour: 18, count: 2 },
    { hour: 19, count: 1 },
    { hour: 20, count: 0 },
  ],
  popularProducts: [
    { productName: 'Wedding Cake 3.5g', orderCount: 8 },
    { productName: 'Blue Dream Preroll 3-pack', orderCount: 6 },
    { productName: 'OG Kush 7g', orderCount: 5 },
    { productName: 'Gelato Cart 1g', orderCount: 4 },
    { productName: 'Zkittlez 3.5g', orderCount: 3 },
  ],
};

const pacificLeafStats: StoreOrderStats = {
  ordersToday: 7,
  ordersThisWeek: 38,
  ordersThisMonth: 145,
  avgPrepTimeMinutes: 14,
  fillRate: 88,
  noShowRate: 5,
  ordersBySource: [
    { source: 'frost-website', count: 7 },
  ],
  ordersByHour: [
    { hour: 9, count: 0 },
    { hour: 10, count: 1 },
    { hour: 11, count: 1 },
    { hour: 12, count: 2 },
    { hour: 13, count: 1 },
    { hour: 14, count: 0 },
    { hour: 15, count: 0 },
    { hour: 16, count: 1 },
    { hour: 17, count: 1 },
    { hour: 18, count: 0 },
  ],
  popularProducts: [
    { productName: 'Wedding Cake 3.5g', orderCount: 3 },
    { productName: 'OG Kush 7g', orderCount: 2 },
    { productName: 'Blue Dream 3.5g', orderCount: 1 },
    { productName: 'Gelato Cart 1g', orderCount: 1 },
  ],
};

const cascadeStats: StoreOrderStats = {
  ordersToday: 2,
  ordersThisWeek: 12,
  ordersThisMonth: 48,
  avgPrepTimeMinutes: 6,
  fillRate: 100,
  noShowRate: 0,
  ordersBySource: [
    { source: 'frost-website', count: 2 },
  ],
  ordersByHour: [
    { hour: 10, count: 1 },
    { hour: 11, count: 0 },
    { hour: 12, count: 0 },
    { hour: 13, count: 0 },
    { hour: 14, count: 1 },
  ],
  popularProducts: [
    { productName: 'Wedding Cake 3.5g', orderCount: 1 },
    { productName: 'Blue Dream Preroll 3-pack', orderCount: 1 },
  ],
};

// ══════════════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════════════

const ordersByAccount: Record<string, StoreOrder[]> = {
  [ACCT_1]: [...greenfieldActive, ...greenfieldCompleted],
  [ACCT_2]: [...pacificLeafActive, ...pacificLeafCompleted],
  [ACCT_3]: [...cascadeCompleted],
};

const statsByAccount: Record<string, StoreOrderStats> = {
  [ACCT_1]: greenfieldStats,
  [ACCT_2]: pacificLeafStats,
  [ACCT_3]: cascadeStats,
};

export function getStoreOrdersForAccount(accountId: string): StoreOrder[] {
  return ordersByAccount[accountId] ?? [];
}

export function getStoreOrderStatsForAccount(accountId: string): StoreOrderStats {
  return statsByAccount[accountId] ?? {
    ordersToday: 0,
    ordersThisWeek: 0,
    ordersThisMonth: 0,
    avgPrepTimeMinutes: 0,
    fillRate: 0,
    noShowRate: 0,
    ordersBySource: [],
    ordersByHour: [],
    popularProducts: [],
  };
}
