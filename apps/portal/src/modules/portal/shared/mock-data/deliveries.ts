import type { PortalDelivery, PortalOrderItem } from '../types';

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

const DRIVER_JAKE = { name: 'Jake Wilson', phone: '(206) 555-0199' };
const DRIVER_MARIA = { name: 'Maria Santos', phone: '(253) 555-0211' };

// ══════════════════════════════════════════════════════════════════════
// GREENFIELD — 5 deliveries
// ══════════════════════════════════════════════════════════════════════

const greenfieldDeliveries: PortalDelivery[] = [
  // Delivered last week
  {
    id: 'del-gf-01',
    orderId: 'order-gf-42',
    orderNumber: 'ORD-2026-0842',
    scheduledDate: '2026-03-03',
    scheduledWindow: { start: '09:00', end: '12:00' },
    status: 'delivered',
    driver: DRIVER_JAKE,
    deliveredAt: '2026-03-03T10:22:00Z',
    signature: 'J. Chen',
    items: [
      item('prod-004', 'Gelato 3.5g', 'flower', 20, 30),
      item('prod-012', 'Wedding Cake Preroll 1g', 'prerolls', 30, 9),
      item('prod-020', 'Gelato Cart 1g', 'vaporizers', 10, 35),
      item('prod-031', 'Blue Dream Shatter 1g', 'concentrates', 8, 35),
      item('prod-040', 'Tropical Gummies 10-pack', 'edibles', 15, 22),
      item('prod-001', 'Wedding Cake 3.5g', 'flower', 18, 28),
    ],
    notes: 'Delivered to back entrance per instructions',
  },
  {
    id: 'del-gf-02',
    orderId: 'order-gf-41',
    orderNumber: 'ORD-2026-0841',
    scheduledDate: '2026-02-26',
    scheduledWindow: { start: '13:00', end: '16:00' },
    status: 'delivered',
    driver: DRIVER_MARIA,
    deliveredAt: '2026-02-26T14:05:00Z',
    signature: 'J. Chen',
    items: [
      item('prod-002', 'OG Kush 7g', 'flower', 22, 48),
      item('prod-010', 'Blue Dream Preroll 3-pack', 'prerolls', 16, 18),
      item('prod-021', 'Blue Dream Cart 0.5g', 'vaporizers', 14, 22),
      item('prod-041', 'Dark Chocolate Bar 100mg', 'edibles', 10, 24),
    ],
  },
  // In-transit today
  {
    id: 'del-gf-03',
    orderId: 'order-gf-43',
    orderNumber: 'ORD-2026-0843',
    scheduledDate: '2026-03-08',
    scheduledWindow: { start: '14:00', end: '17:00' },
    status: 'in-transit',
    driver: DRIVER_JAKE,
    eta: '2026-03-08T15:30:00Z',
    items: [
      item('prod-003', 'Blue Dream 3.5g', 'flower', 15, 26),
      item('prod-022', 'OG Kush Disposable 0.3g', 'vaporizers', 12, 18),
      item('prod-042', 'Frost Mints 20-pack', 'edibles', 10, 15),
    ],
    trackingLocation: {
      lat: 47.5912,
      lng: -122.3340,
      lastUpdated: '2026-03-08T14:45:00Z',
    },
  },
  // Scheduled next week
  {
    id: 'del-gf-04',
    orderId: 'order-gf-44',
    orderNumber: 'ORD-2026-0844',
    scheduledDate: '2026-03-12',
    scheduledWindow: { start: '09:00', end: '12:00' },
    status: 'scheduled',
    driver: DRIVER_MARIA,
    items: [
      item('prod-002', 'OG Kush 7g', 'flower', 18, 48),
      item('prod-011', 'OG Kush Preroll 6-pack', 'prerolls', 12, 32),
      item('prod-021', 'Blue Dream Cart 0.5g', 'vaporizers', 20, 22),
      item('prod-030', 'Wedding Cake Live Resin 1g', 'concentrates', 10, 40),
      item('prod-041', 'Dark Chocolate Bar 100mg', 'edibles', 15, 24),
    ],
  },
  {
    id: 'del-gf-05',
    orderId: 'order-gf-45',
    orderNumber: 'ORD-2026-0845',
    scheduledDate: '2026-03-14',
    scheduledWindow: { start: '13:00', end: '16:00' },
    status: 'scheduled',
    driver: DRIVER_JAKE,
    items: [
      item('prod-001', 'Wedding Cake 3.5g', 'flower', 24, 28),
      item('prod-010', 'Blue Dream Preroll 3-pack', 'prerolls', 20, 18),
      item('prod-020', 'Gelato Cart 1g', 'vaporizers', 15, 35),
      item('prod-040', 'Tropical Gummies 10-pack', 'edibles', 18, 22),
    ],
    notes: 'Pending production completion — date may shift',
  },
];

// ══════════════════════════════════════════════════════════════════════
// PACIFIC LEAF — 3 deliveries
// ══════════════════════════════════════════════════════════════════════

const pacificLeafDeliveries: PortalDelivery[] = [
  // Delivered
  {
    id: 'del-pl-01',
    orderId: 'order-pl-19',
    orderNumber: 'ORD-2026-0864',
    scheduledDate: '2026-02-07',
    scheduledWindow: { start: '10:00', end: '13:00' },
    status: 'delivered',
    driver: DRIVER_MARIA,
    deliveredAt: '2026-02-07T11:40:00Z',
    signature: 'T. Nguyen',
    items: [
      item('prod-004', 'Gelato 3.5g', 'flower', 10, 30),
      item('prod-010', 'Blue Dream Preroll 3-pack', 'prerolls', 6, 18),
      item('prod-021', 'Blue Dream Cart 0.5g', 'vaporizers', 4, 22),
    ],
  },
  // Scheduled
  {
    id: 'del-pl-02',
    orderId: 'order-pl-22',
    orderNumber: 'ORD-2026-0867',
    scheduledDate: '2026-03-13',
    scheduledWindow: { start: '10:00', end: '13:00' },
    status: 'scheduled',
    driver: DRIVER_JAKE,
    items: [
      item('prod-001', 'Wedding Cake 3.5g', 'flower', 12, 28),
      item('prod-010', 'Blue Dream Preroll 3-pack', 'prerolls', 8, 18),
      item('prod-040', 'Tropical Gummies 10-pack', 'edibles', 10, 22),
    ],
  },
  // Rescheduled
  {
    id: 'del-pl-03',
    orderId: 'order-pl-21',
    orderNumber: 'ORD-2026-0866',
    scheduledDate: '2026-03-10',
    scheduledWindow: { start: '14:00', end: '17:00' },
    status: 'rescheduled',
    driver: DRIVER_MARIA,
    items: [
      item('prod-002', 'OG Kush 7g', 'flower', 10, 48),
      item('prod-011', 'OG Kush Preroll 6-pack', 'prerolls', 6, 32),
      item('prod-020', 'Gelato Cart 1g', 'vaporizers', 8, 35),
    ],
    notes: 'Rescheduled from 2026-03-05 — store closed for renovations',
  },
];

// ══════════════════════════════════════════════════════════════════════
// CASCADE WELLNESS — 2 deliveries
// ══════════════════════════════════════════════════════════════════════

const cascadeDeliveries: PortalDelivery[] = [
  // Delivered
  {
    id: 'del-cw-01',
    orderId: 'order-cw-03',
    orderNumber: 'ORD-2026-0870',
    scheduledDate: '2026-02-25',
    scheduledWindow: { start: '10:00', end: '13:00' },
    status: 'delivered',
    driver: DRIVER_JAKE,
    deliveredAt: '2026-02-25T11:15:00Z',
    signature: 'K. Park',
    items: [
      item('prod-002', 'OG Kush 7g', 'flower', 4, 48),
      item('prod-010', 'Blue Dream Preroll 3-pack', 'prerolls', 4, 18),
    ],
  },
  // Scheduled
  {
    id: 'del-cw-02',
    orderId: 'order-cw-04',
    orderNumber: 'ORD-2026-0871',
    scheduledDate: '2026-03-10',
    scheduledWindow: { start: '09:00', end: '12:00' },
    status: 'scheduled',
    driver: DRIVER_MARIA,
    items: [
      item('prod-001', 'Wedding Cake 3.5g', 'flower', 6, 28),
      item('prod-040', 'Tropical Gummies 10-pack', 'edibles', 8, 22),
    ],
  },
];

// ══════════════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════════════

const deliveriesByAccount: Record<string, PortalDelivery[]> = {
  [ACCT_1]: greenfieldDeliveries,
  [ACCT_2]: pacificLeafDeliveries,
  [ACCT_3]: cascadeDeliveries,
};

export function getDeliveriesForAccount(accountId: string): PortalDelivery[] {
  return deliveriesByAccount[accountId] ?? [];
}
