import type { PortalOrder, PortalOrderItem } from '../types';

// ── Helpers ──────────────────────────────────────────────────────────

const ACCT_1 = 'acct-1'; // Greenfield
const ACCT_2 = 'acct-2'; // Pacific Leaf
const ACCT_3 = 'acct-3'; // Cascade Wellness

function item(
  productId: string,
  productName: string,
  category: string,
  quantity: number,
  unitPrice: number,
): PortalOrderItem {
  return { productId, productName, category, quantity, unitPrice, lineTotal: quantity * unitPrice };
}

function delivered(
  id: string,
  orderNumber: string,
  accountId: string,
  orderDate: string,
  items: PortalOrderItem[],
  opts: { paymentStatus?: 'paid' | 'overdue'; discount?: number; notes?: string } = {},
): PortalOrder {
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const discount = opts.discount ?? 0;
  const tax = Math.round((subtotal - discount) * 0.2 * 100) / 100; // 20% cannabis tax
  const total = Math.round((subtotal - discount + tax) * 100) / 100;
  const paymentStatus = opts.paymentStatus ?? 'paid';
  return {
    id,
    orderNumber,
    accountId,
    orderDate,
    status: 'delivered',
    paymentStatus,
    paymentMethod: 'ach',
    items,
    subtotal,
    discount,
    tax,
    total,
    notes: opts.notes,
    statusHistory: [
      { status: 'confirmed', timestamp: `${orderDate}T09:00:00Z` },
      { status: 'in-production', timestamp: `${orderDate}T14:00:00Z` },
      { status: 'packaged', timestamp: addDays(orderDate, 2) + 'T10:00:00Z' },
      { status: 'shipped', timestamp: addDays(orderDate, 3) + 'T08:00:00Z' },
      { status: 'delivered', timestamp: addDays(orderDate, 4) + 'T11:30:00Z' },
      ...(paymentStatus === 'paid'
        ? [{ status: 'paid', timestamp: addDays(orderDate, 11) + 'T16:00:00Z' }]
        : []),
    ],
  };
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ── Product item presets ─────────────────────────────────────────────

const FLOWER_WEDDING_CAKE = (qty: number) =>
  item('prod-001', 'Wedding Cake 3.5g', 'flower', qty, 28);
const FLOWER_OG_KUSH = (qty: number) =>
  item('prod-002', 'OG Kush 7g', 'flower', qty, 48);
const FLOWER_BLUE_DREAM = (qty: number) =>
  item('prod-003', 'Blue Dream 3.5g', 'flower', qty, 26);
const FLOWER_GELATO = (qty: number) =>
  item('prod-004', 'Gelato 3.5g', 'flower', qty, 30);
const FLOWER_ZKITTLEZ = (qty: number) =>
  item('prod-005', 'Zkittlez 3.5g', 'flower', qty, 27);
const PREROLL_BLUE_DREAM = (qty: number) =>
  item('prod-010', 'Blue Dream Preroll 3-pack', 'prerolls', qty, 18);
const PREROLL_OG_KUSH = (qty: number) =>
  item('prod-011', 'OG Kush Preroll 6-pack', 'prerolls', qty, 32);
const PREROLL_WEDDING_CAKE = (qty: number) =>
  item('prod-012', 'Wedding Cake Preroll 1g', 'prerolls', qty, 9);
const VAPE_GELATO = (qty: number) =>
  item('prod-020', 'Gelato Cart 1g', 'vaporizers', qty, 35);
const VAPE_BLUE_DREAM = (qty: number) =>
  item('prod-021', 'Blue Dream Cart 0.5g', 'vaporizers', qty, 22);
const VAPE_OG_KUSH = (qty: number) =>
  item('prod-022', 'OG Kush Disposable 0.3g', 'vaporizers', qty, 18);
const CONC_LIVE_RESIN = (qty: number) =>
  item('prod-030', 'Wedding Cake Live Resin 1g', 'concentrates', qty, 40);
const CONC_SHATTER = (qty: number) =>
  item('prod-031', 'Blue Dream Shatter 1g', 'concentrates', qty, 35);
const EDIBLE_GUMMIES = (qty: number) =>
  item('prod-040', 'Tropical Gummies 10-pack', 'edibles', qty, 22);
const EDIBLE_CHOCO = (qty: number) =>
  item('prod-041', 'Dark Chocolate Bar 100mg', 'edibles', qty, 24);
const EDIBLE_MINTS = (qty: number) =>
  item('prod-042', 'Frost Mints 20-pack', 'edibles', qty, 15);

// ══════════════════════════════════════════════════════════════════════
// GREENFIELD — 45 orders (ORD-2025-0801 .. ORD-2026-0845)
// ══════════════════════════════════════════════════════════════════════

const greenfieldOrders: PortalOrder[] = [
  // ── Active orders ──────────────────────────────────────────────────
  {
    id: 'order-gf-45',
    orderNumber: 'ORD-2026-0845',
    accountId: ACCT_1,
    orderDate: '2026-03-08',
    status: 'in-production',
    paymentStatus: 'pending',
    paymentMethod: 'ach',
    items: [
      FLOWER_WEDDING_CAKE(24),
      PREROLL_BLUE_DREAM(20),
      VAPE_GELATO(15),
      EDIBLE_GUMMIES(18),
    ],
    subtotal: 24 * 28 + 20 * 18 + 15 * 35 + 18 * 22,
    discount: 0,
    tax: Math.round((24 * 28 + 20 * 18 + 15 * 35 + 18 * 22) * 0.2 * 100) / 100,
    total: Math.round((24 * 28 + 20 * 18 + 15 * 35 + 18 * 22) * 1.2 * 100) / 100,
    notes: 'Rush order — restock before weekend',
    statusHistory: [
      { status: 'confirmed', timestamp: '2026-03-08T08:15:00Z' },
      { status: 'in-production', timestamp: '2026-03-08T10:30:00Z' },
    ],
  },
  {
    id: 'order-gf-44',
    orderNumber: 'ORD-2026-0844',
    accountId: ACCT_1,
    orderDate: '2026-03-06',
    status: 'confirmed',
    paymentStatus: 'pending',
    paymentMethod: 'ach',
    items: [
      FLOWER_OG_KUSH(18),
      PREROLL_OG_KUSH(12),
      VAPE_BLUE_DREAM(20),
      CONC_LIVE_RESIN(10),
      EDIBLE_CHOCO(15),
    ],
    subtotal: 18 * 48 + 12 * 32 + 20 * 22 + 10 * 40 + 15 * 24,
    discount: 0,
    tax: Math.round((18 * 48 + 12 * 32 + 20 * 22 + 10 * 40 + 15 * 24) * 0.2 * 100) / 100,
    total: Math.round((18 * 48 + 12 * 32 + 20 * 22 + 10 * 40 + 15 * 24) * 1.2 * 100) / 100,
    statusHistory: [
      { status: 'confirmed', timestamp: '2026-03-06T14:22:00Z' },
    ],
  },
  {
    id: 'order-gf-43',
    orderNumber: 'ORD-2026-0843',
    accountId: ACCT_1,
    orderDate: '2026-03-04',
    status: 'shipped',
    paymentStatus: 'pending',
    paymentMethod: 'ach',
    items: [
      FLOWER_BLUE_DREAM(15),
      VAPE_OG_KUSH(12),
      EDIBLE_MINTS(10),
    ],
    subtotal: 15 * 26 + 12 * 18 + 10 * 15,
    discount: 0,
    tax: Math.round((15 * 26 + 12 * 18 + 10 * 15) * 0.2 * 100) / 100,
    total: Math.round((15 * 26 + 12 * 18 + 10 * 15) * 1.2 * 100) / 100,
    deliveryId: 'del-gf-03',
    statusHistory: [
      { status: 'confirmed', timestamp: '2026-03-04T09:00:00Z' },
      { status: 'in-production', timestamp: '2026-03-04T13:45:00Z' },
      { status: 'packaged', timestamp: '2026-03-06T10:15:00Z' },
      { status: 'shipped', timestamp: '2026-03-07T08:00:00Z' },
    ],
  },

  // ── Recent delivered (full detail) ─────────────────────────────────
  delivered('order-gf-42', 'ORD-2026-0842', ACCT_1, '2026-02-27', [
    FLOWER_GELATO(20), PREROLL_WEDDING_CAKE(30), VAPE_GELATO(10),
    CONC_SHATTER(8), EDIBLE_GUMMIES(15), FLOWER_WEDDING_CAKE(18),
  ]),
  delivered('order-gf-41', 'ORD-2026-0841', ACCT_1, '2026-02-20', [
    FLOWER_OG_KUSH(22), PREROLL_BLUE_DREAM(16), VAPE_BLUE_DREAM(14),
    EDIBLE_CHOCO(10),
  ]),
  delivered('order-gf-40', 'ORD-2026-0840', ACCT_1, '2026-02-13', [
    FLOWER_ZKITTLEZ(24), CONC_LIVE_RESIN(12), EDIBLE_MINTS(20),
    PREROLL_OG_KUSH(8), VAPE_OG_KUSH(15),
  ]),
  delivered('order-gf-39', 'ORD-2026-0839', ACCT_1, '2026-02-06', [
    FLOWER_BLUE_DREAM(20), FLOWER_WEDDING_CAKE(16), PREROLL_BLUE_DREAM(18),
    VAPE_GELATO(12),
  ]),
  delivered('order-gf-38', 'ORD-2026-0838', ACCT_1, '2026-01-30', [
    FLOWER_GELATO(18), EDIBLE_GUMMIES(24), CONC_SHATTER(10),
    PREROLL_WEDDING_CAKE(20), VAPE_BLUE_DREAM(8),
  ]),

  // ── Summarized delivered orders (3-5 items each) ───────────────────
  ...[
    { id: 'order-gf-37', num: 'ORD-2026-0837', date: '2026-01-23', items: [FLOWER_OG_KUSH(16), PREROLL_OG_KUSH(10), EDIBLE_CHOCO(8)] },
    { id: 'order-gf-36', num: 'ORD-2026-0836', date: '2026-01-16', items: [FLOWER_WEDDING_CAKE(20), VAPE_GELATO(14), CONC_LIVE_RESIN(6)] },
    { id: 'order-gf-35', num: 'ORD-2026-0835', date: '2026-01-09', items: [FLOWER_ZKITTLEZ(18), PREROLL_BLUE_DREAM(12), EDIBLE_MINTS(10)] },
    { id: 'order-gf-34', num: 'ORD-2026-0834', date: '2026-01-02', items: [FLOWER_BLUE_DREAM(22), VAPE_OG_KUSH(10), EDIBLE_GUMMIES(16)] },
    { id: 'order-gf-33', num: 'ORD-2025-0833', date: '2025-12-26', items: [FLOWER_GELATO(14), CONC_SHATTER(8), PREROLL_WEDDING_CAKE(18)] },
    { id: 'order-gf-32', num: 'ORD-2025-0832', date: '2025-12-19', items: [FLOWER_OG_KUSH(20), EDIBLE_CHOCO(12), VAPE_BLUE_DREAM(10)] },
    { id: 'order-gf-31', num: 'ORD-2025-0831', date: '2025-12-12', items: [FLOWER_WEDDING_CAKE(16), PREROLL_BLUE_DREAM(14), CONC_LIVE_RESIN(8)] },
    { id: 'order-gf-30', num: 'ORD-2025-0830', date: '2025-12-05', items: [FLOWER_ZKITTLEZ(20), VAPE_GELATO(12), EDIBLE_MINTS(14)] },
    { id: 'order-gf-29', num: 'ORD-2025-0829', date: '2025-11-28', items: [FLOWER_BLUE_DREAM(18), PREROLL_OG_KUSH(10), EDIBLE_GUMMIES(12)] },
    { id: 'order-gf-28', num: 'ORD-2025-0828', date: '2025-11-21', items: [FLOWER_GELATO(22), VAPE_OG_KUSH(8), CONC_SHATTER(10)] },
    { id: 'order-gf-27', num: 'ORD-2025-0827', date: '2025-11-14', items: [FLOWER_OG_KUSH(14), PREROLL_WEDDING_CAKE(16), EDIBLE_CHOCO(10)] },
    { id: 'order-gf-26', num: 'ORD-2025-0826', date: '2025-11-07', items: [FLOWER_WEDDING_CAKE(18), VAPE_BLUE_DREAM(12), CONC_LIVE_RESIN(6)] },
    { id: 'order-gf-25', num: 'ORD-2025-0825', date: '2025-10-31', items: [FLOWER_ZKITTLEZ(16), PREROLL_BLUE_DREAM(10), EDIBLE_MINTS(8)] },
    { id: 'order-gf-24', num: 'ORD-2025-0824', date: '2025-10-24', items: [FLOWER_BLUE_DREAM(20), EDIBLE_GUMMIES(14), VAPE_GELATO(10)] },
    { id: 'order-gf-23', num: 'ORD-2025-0823', date: '2025-10-17', items: [FLOWER_GELATO(12), PREROLL_OG_KUSH(8), CONC_SHATTER(6)] },
    { id: 'order-gf-22', num: 'ORD-2025-0822', date: '2025-10-10', items: [FLOWER_OG_KUSH(18), VAPE_OG_KUSH(10), EDIBLE_CHOCO(8)] },
    { id: 'order-gf-21', num: 'ORD-2025-0821', date: '2025-10-03', items: [FLOWER_WEDDING_CAKE(14), PREROLL_BLUE_DREAM(12), CONC_LIVE_RESIN(8)] },
    { id: 'order-gf-20', num: 'ORD-2025-0820', date: '2025-09-26', items: [FLOWER_ZKITTLEZ(16), EDIBLE_MINTS(10), VAPE_BLUE_DREAM(6)] },
    { id: 'order-gf-19', num: 'ORD-2025-0819', date: '2025-09-19', items: [FLOWER_BLUE_DREAM(20), PREROLL_WEDDING_CAKE(14), EDIBLE_GUMMIES(10)] },
    { id: 'order-gf-18', num: 'ORD-2025-0818', date: '2025-09-12', items: [FLOWER_GELATO(18), VAPE_GELATO(8), CONC_SHATTER(6)] },
    { id: 'order-gf-17', num: 'ORD-2025-0817', date: '2025-09-05', items: [FLOWER_OG_KUSH(12), PREROLL_OG_KUSH(10), EDIBLE_CHOCO(8)] },
    { id: 'order-gf-16', num: 'ORD-2025-0816', date: '2025-08-29', items: [FLOWER_WEDDING_CAKE(16), VAPE_OG_KUSH(10), CONC_LIVE_RESIN(6)] },
    { id: 'order-gf-15', num: 'ORD-2025-0815', date: '2025-08-22', items: [FLOWER_ZKITTLEZ(14), PREROLL_BLUE_DREAM(8), EDIBLE_MINTS(12)] },
    { id: 'order-gf-14', num: 'ORD-2025-0814', date: '2025-08-15', items: [FLOWER_BLUE_DREAM(18), EDIBLE_GUMMIES(10), VAPE_BLUE_DREAM(8)] },
    { id: 'order-gf-13', num: 'ORD-2025-0813', date: '2025-08-08', items: [FLOWER_GELATO(20), PREROLL_WEDDING_CAKE(12), CONC_SHATTER(8)] },
    { id: 'order-gf-12', num: 'ORD-2025-0812', date: '2025-08-01', items: [FLOWER_OG_KUSH(14), VAPE_GELATO(10), EDIBLE_CHOCO(6)] },
    { id: 'order-gf-11', num: 'ORD-2025-0811', date: '2025-07-25', items: [FLOWER_WEDDING_CAKE(12), PREROLL_OG_KUSH(8), CONC_LIVE_RESIN(6)] },
    { id: 'order-gf-10', num: 'ORD-2025-0810', date: '2025-07-18', items: [FLOWER_ZKITTLEZ(16), EDIBLE_MINTS(10), VAPE_OG_KUSH(8)] },
    { id: 'order-gf-09', num: 'ORD-2025-0809', date: '2025-07-11', items: [FLOWER_BLUE_DREAM(14), PREROLL_BLUE_DREAM(10), EDIBLE_GUMMIES(8)] },
    { id: 'order-gf-08', num: 'ORD-2025-0808', date: '2025-07-08', items: [FLOWER_GELATO(10), VAPE_BLUE_DREAM(8), CONC_SHATTER(4)] },
    { id: 'order-gf-07', num: 'ORD-2025-0807', date: '2025-07-06', items: [FLOWER_OG_KUSH(12), PREROLL_WEDDING_CAKE(10), EDIBLE_CHOCO(6)] },
    { id: 'order-gf-06', num: 'ORD-2025-0806', date: '2025-07-05', items: [FLOWER_WEDDING_CAKE(14), VAPE_GELATO(6), CONC_LIVE_RESIN(4)] },
    { id: 'order-gf-05', num: 'ORD-2025-0805', date: '2025-07-04', items: [FLOWER_ZKITTLEZ(10), EDIBLE_MINTS(8), PREROLL_BLUE_DREAM(6)] },
    { id: 'order-gf-04', num: 'ORD-2025-0804', date: '2025-07-03', items: [FLOWER_BLUE_DREAM(12), VAPE_OG_KUSH(6), EDIBLE_GUMMIES(8)] },
    { id: 'order-gf-03', num: 'ORD-2025-0803', date: '2025-07-02', items: [FLOWER_GELATO(8), PREROLL_OG_KUSH(6), CONC_SHATTER(4)] },
    { id: 'order-gf-02', num: 'ORD-2025-0802', date: '2025-07-01', items: [FLOWER_OG_KUSH(10), EDIBLE_CHOCO(6), VAPE_BLUE_DREAM(4)] },
    { id: 'order-gf-01', num: 'ORD-2025-0801', date: '2025-07-01', items: [FLOWER_WEDDING_CAKE(8), PREROLL_WEDDING_CAKE(6), CONC_LIVE_RESIN(4)] },
  ].map((o) => delivered(o.id, o.num, ACCT_1, o.date, o.items)),
];

// ══════════════════════════════════════════════════════════════════════
// PACIFIC LEAF — 22 orders (ORD-2025-0846 .. ORD-2026-0867)
// ══════════════════════════════════════════════════════════════════════

const pacificLeafOrders: PortalOrder[] = [
  // ── Active ─────────────────────────────────────────────────────────
  {
    id: 'order-pl-22',
    orderNumber: 'ORD-2026-0867',
    accountId: ACCT_2,
    orderDate: '2026-03-07',
    status: 'confirmed',
    paymentStatus: 'pending',
    paymentMethod: 'ach',
    items: [
      FLOWER_WEDDING_CAKE(12),
      PREROLL_BLUE_DREAM(8),
      EDIBLE_GUMMIES(10),
    ],
    subtotal: 12 * 28 + 8 * 18 + 10 * 22,
    discount: 0,
    tax: Math.round((12 * 28 + 8 * 18 + 10 * 22) * 0.2 * 100) / 100,
    total: Math.round((12 * 28 + 8 * 18 + 10 * 22) * 1.2 * 100) / 100,
    statusHistory: [
      { status: 'confirmed', timestamp: '2026-03-07T11:45:00Z' },
    ],
  },

  // ── Overdue payment ────────────────────────────────────────────────
  delivered('order-pl-21', 'ORD-2026-0866', ACCT_2, '2026-02-18', [
    FLOWER_OG_KUSH(10), PREROLL_OG_KUSH(6), VAPE_GELATO(8),
  ], { paymentStatus: 'overdue' }),
  delivered('order-pl-20', 'ORD-2026-0865', ACCT_2, '2026-02-10', [
    FLOWER_BLUE_DREAM(8), EDIBLE_CHOCO(6),
  ], { paymentStatus: 'overdue' }),

  // ── Recent delivered (full detail) ─────────────────────────────────
  delivered('order-pl-19', 'ORD-2026-0864', ACCT_2, '2026-02-03', [
    FLOWER_GELATO(10), PREROLL_BLUE_DREAM(6), VAPE_BLUE_DREAM(4),
  ]),
  delivered('order-pl-18', 'ORD-2026-0863', ACCT_2, '2026-01-27', [
    FLOWER_ZKITTLEZ(8), EDIBLE_GUMMIES(6),
  ]),
  delivered('order-pl-17', 'ORD-2026-0862', ACCT_2, '2026-01-20', [
    FLOWER_OG_KUSH(12), CONC_LIVE_RESIN(4),
  ]),
  delivered('order-pl-16', 'ORD-2026-0861', ACCT_2, '2026-01-13', [
    FLOWER_WEDDING_CAKE(10), PREROLL_WEDDING_CAKE(8), VAPE_OG_KUSH(6),
  ]),
  delivered('order-pl-15', 'ORD-2026-0860', ACCT_2, '2026-01-06', [
    FLOWER_BLUE_DREAM(8), EDIBLE_MINTS(6),
  ]),

  // ── Summarized delivered orders ────────────────────────────────────
  ...[
    { id: 'order-pl-14', num: 'ORD-2025-0859', date: '2025-12-30', items: [FLOWER_GELATO(8), PREROLL_OG_KUSH(4)] },
    { id: 'order-pl-13', num: 'ORD-2025-0858', date: '2025-12-16', items: [FLOWER_OG_KUSH(10), VAPE_GELATO(4)] },
    { id: 'order-pl-12', num: 'ORD-2025-0857', date: '2025-12-02', items: [FLOWER_WEDDING_CAKE(8), EDIBLE_CHOCO(4)] },
    { id: 'order-pl-11', num: 'ORD-2025-0856', date: '2025-11-18', items: [FLOWER_ZKITTLEZ(6), PREROLL_BLUE_DREAM(4)] },
    { id: 'order-pl-10', num: 'ORD-2025-0855', date: '2025-11-04', items: [FLOWER_BLUE_DREAM(10), VAPE_BLUE_DREAM(4)] },
    { id: 'order-pl-09', num: 'ORD-2025-0854', date: '2025-10-21', items: [FLOWER_GELATO(8), CONC_SHATTER(4)] },
    { id: 'order-pl-08', num: 'ORD-2025-0853', date: '2025-10-07', items: [FLOWER_OG_KUSH(6), EDIBLE_GUMMIES(4)] },
    { id: 'order-pl-07', num: 'ORD-2025-0852', date: '2025-09-23', items: [FLOWER_WEDDING_CAKE(8), PREROLL_WEDDING_CAKE(4)] },
    { id: 'order-pl-06', num: 'ORD-2025-0851', date: '2025-09-16', items: [FLOWER_ZKITTLEZ(6), VAPE_OG_KUSH(4)] },
    { id: 'order-pl-05', num: 'ORD-2025-0850', date: '2025-09-09', items: [FLOWER_BLUE_DREAM(8), EDIBLE_MINTS(4)] },
    { id: 'order-pl-04', num: 'ORD-2025-0849', date: '2025-09-08', items: [FLOWER_OG_KUSH(6), PREROLL_OG_KUSH(4)] },
    { id: 'order-pl-03', num: 'ORD-2025-0848', date: '2025-09-05', items: [FLOWER_GELATO(8), CONC_LIVE_RESIN(2)] },
    { id: 'order-pl-02', num: 'ORD-2025-0847', date: '2025-09-03', items: [FLOWER_WEDDING_CAKE(6), VAPE_GELATO(4)] },
    { id: 'order-pl-01', num: 'ORD-2025-0846', date: '2025-09-01', items: [FLOWER_ZKITTLEZ(8), EDIBLE_CHOCO(4)] },
  ].map((o) => delivered(o.id, o.num, ACCT_2, o.date, o.items)),
];

// ══════════════════════════════════════════════════════════════════════
// CASCADE WELLNESS — 4 orders (ORD-2026-0868 .. ORD-2026-0871)
// ══════════════════════════════════════════════════════════════════════

const cascadeOrders: PortalOrder[] = [
  // ── Active ─────────────────────────────────────────────────────────
  {
    id: 'order-cw-04',
    orderNumber: 'ORD-2026-0871',
    accountId: ACCT_3,
    orderDate: '2026-03-06',
    status: 'shipped',
    paymentStatus: 'pending',
    paymentMethod: 'echeck',
    items: [
      FLOWER_WEDDING_CAKE(6),
      EDIBLE_GUMMIES(8),
    ],
    subtotal: 6 * 28 + 8 * 22,
    discount: 0,
    tax: Math.round((6 * 28 + 8 * 22) * 0.2 * 100) / 100,
    total: Math.round((6 * 28 + 8 * 22) * 1.2 * 100) / 100,
    deliveryId: 'del-cw-02',
    statusHistory: [
      { status: 'confirmed', timestamp: '2026-03-06T10:00:00Z' },
      { status: 'in-production', timestamp: '2026-03-06T14:30:00Z' },
      { status: 'packaged', timestamp: '2026-03-07T11:00:00Z' },
      { status: 'shipped', timestamp: '2026-03-08T08:45:00Z' },
    ],
  },

  // ── Delivered ──────────────────────────────────────────────────────
  delivered('order-cw-03', 'ORD-2026-0870', ACCT_3, '2026-02-20', [
    FLOWER_OG_KUSH(4), PREROLL_BLUE_DREAM(4),
  ]),
  delivered('order-cw-02', 'ORD-2026-0869', ACCT_3, '2026-02-05', [
    FLOWER_BLUE_DREAM(6),
  ]),
  delivered('order-cw-01', 'ORD-2026-0868', ACCT_3, '2026-01-15', [
    FLOWER_WEDDING_CAKE(4), EDIBLE_MINTS(4),
  ]),
];

// ══════════════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════════════

const ordersByAccount: Record<string, PortalOrder[]> = {
  [ACCT_1]: greenfieldOrders,
  [ACCT_2]: pacificLeafOrders,
  [ACCT_3]: cascadeOrders,
};

export function getOrdersForAccount(accountId: string): PortalOrder[] {
  return ordersByAccount[accountId] ?? [];
}
