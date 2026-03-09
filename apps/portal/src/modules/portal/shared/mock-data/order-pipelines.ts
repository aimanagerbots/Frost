import type {
  PortalOrderWithPipeline,
  PortalOrder,
  OrderLineItemStatus,
  OrderPipelineStep,
} from '../types';

// ── Helpers ──────────────────────────────────────────────────────────

export type PipelineExtension = Omit<PortalOrderWithPipeline, keyof PortalOrder>;

function lineItem(
  productId: string,
  productName: string,
  category: string,
  strainName: string,
  packageSize: string,
  quantityOrdered: number,
  opts: {
    ready?: number;
    inProgress?: number;
    pending?: number;
    state: OrderLineItemStatus['currentState'];
    detail: string;
    estimatedReadyDate?: string;
    isBottleneck?: boolean;
  },
): OrderLineItemStatus {
  return {
    productId,
    productName,
    category,
    strainName,
    packageSize,
    quantityOrdered,
    quantityReady: opts.ready ?? 0,
    quantityInProgress: opts.inProgress ?? 0,
    quantityPending: opts.pending ?? 0,
    currentState: opts.state,
    stateDetail: opts.detail,
    estimatedReadyDate: opts.estimatedReadyDate,
    isBottleneck: opts.isBottleneck ?? false,
  };
}

function timestamp(step: OrderPipelineStep, ts: string, note?: string) {
  return { step, timestamp: ts, ...(note ? { note } : {}) };
}

// ══════════════════════════════════════════════════════════════════════
// PIPELINE DATA — keyed by order ID
// ══════════════════════════════════════════════════════════════════════

const pipelineData: Record<string, PipelineExtension> = {
  // ────────────────────────────────────────────────────────────────────
  // GREENFIELD (acct-1) — 3 active orders
  // ────────────────────────────────────────────────────────────────────

  // order-gf-45 — being-prepared, Gelato Cart is the bottleneck
  'order-gf-45': {
    pipelineStep: 'being-prepared',
    pipelineStepTimestamps: [
      timestamp('order-placed', '2026-03-08T08:15:00Z', 'Order confirmed via portal'),
      timestamp('being-prepared', '2026-03-08T10:30:00Z', 'Production team notified'),
    ],
    lineItemStatuses: [
      lineItem('prod-001', 'Wedding Cake 3.5g', 'flower', 'Wedding Cake', '3.5g', 24, {
        ready: 16,
        inProgress: 8,
        state: 'in-production',
        detail: 'Curing room B, day 4 of 7',
        estimatedReadyDate: '2026-03-11',
      }),
      lineItem('prod-010', 'Blue Dream Preroll 3-pack', 'prerolls', 'Blue Dream', '3-pack', 20, {
        ready: 12,
        inProgress: 8,
        state: 'packaging',
        detail: 'Pre-roll machine batch #2',
        estimatedReadyDate: '2026-03-09',
      }),
      lineItem('prod-020', 'Gelato Cart 1g', 'vaporizers', 'Gelato', '1g', 15, {
        ready: 0,
        inProgress: 15,
        state: 'lab-testing',
        detail: 'Batch potency testing, day 2 of 3',
        estimatedReadyDate: '2026-03-10',
        isBottleneck: true,
      }),
      lineItem('prod-040', 'Tropical Gummies 10-pack', 'edibles', 'N/A', '10-pack', 18, {
        ready: 18,
        state: 'ready-to-ship',
        detail: 'Packaged and labeled',
      }),
    ],
    bottleneckItem: {
      productName: 'Gelato Cart 1g',
      reason: 'Waiting for lab potency results — batch testing day 2 of 3',
      estimatedReady: '2026-03-10',
    },
    estimatedShipDate: '2026-03-11',
  },

  // order-gf-44 — just placed, all items awaiting materials
  'order-gf-44': {
    pipelineStep: 'order-placed',
    pipelineStepTimestamps: [
      timestamp('order-placed', '2026-03-06T14:22:00Z', 'Order confirmed via portal'),
    ],
    lineItemStatuses: [
      lineItem('prod-002', 'OG Kush 7g', 'flower', 'OG Kush', '7g', 18, {
        pending: 18,
        state: 'awaiting-materials',
        detail: 'Flower harvest scheduled, trim queue pending',
        estimatedReadyDate: '2026-03-11',
      }),
      lineItem('prod-011', 'OG Kush Preroll 6-pack', 'prerolls', 'OG Kush', '6-pack', 12, {
        pending: 12,
        state: 'awaiting-materials',
        detail: 'Awaiting trimmed flower from cultivation',
        estimatedReadyDate: '2026-03-11',
      }),
      lineItem('prod-021', 'Blue Dream Cart 0.5g', 'vaporizers', 'Blue Dream', '0.5g', 20, {
        pending: 20,
        state: 'awaiting-materials',
        detail: 'Distillate extraction batch queued',
        estimatedReadyDate: '2026-03-10',
      }),
      lineItem('prod-030', 'Wedding Cake Live Resin 1g', 'concentrates', 'Wedding Cake', '1g', 10, {
        pending: 10,
        state: 'awaiting-materials',
        detail: 'Fresh-frozen material in cold storage, press scheduled',
        estimatedReadyDate: '2026-03-11',
      }),
      lineItem('prod-041', 'Dark Chocolate Bar 100mg', 'edibles', 'N/A', '100mg bar', 15, {
        pending: 15,
        state: 'awaiting-materials',
        detail: 'Infusion batch scheduled for tomorrow',
        estimatedReadyDate: '2026-03-09',
      }),
    ],
    estimatedShipDate: '2026-03-12',
  },

  // order-gf-43 — out for delivery, all items ready
  'order-gf-43': {
    pipelineStep: 'out-for-delivery',
    pipelineStepTimestamps: [
      timestamp('order-placed', '2026-03-04T09:00:00Z', 'Order confirmed via portal'),
      timestamp('being-prepared', '2026-03-04T13:45:00Z', 'Production started'),
      timestamp('packaging', '2026-03-06T09:00:00Z', 'All items entering final packaging'),
      timestamp('ready-to-ship', '2026-03-06T10:15:00Z', 'QA passed, staged for pickup'),
      timestamp('picked-packed', '2026-03-07T07:30:00Z', 'Manifest created, loaded on van'),
      timestamp('out-for-delivery', '2026-03-07T08:00:00Z', 'Driver departed warehouse'),
    ],
    lineItemStatuses: [
      lineItem('prod-003', 'Blue Dream 3.5g', 'flower', 'Blue Dream', '3.5g', 15, {
        ready: 15,
        state: 'ready-to-ship',
        detail: 'Packaged and on delivery vehicle',
      }),
      lineItem('prod-022', 'OG Kush Disposable 0.3g', 'vaporizers', 'OG Kush', '0.3g', 12, {
        ready: 12,
        state: 'ready-to-ship',
        detail: 'Packaged and on delivery vehicle',
      }),
      lineItem('prod-042', 'Frost Mints 20-pack', 'edibles', 'N/A', '20-pack', 10, {
        ready: 10,
        state: 'ready-to-ship',
        detail: 'Packaged and on delivery vehicle',
      }),
    ],
    assignedDriver: {
      name: 'Tommy Nguyen',
      phone: '(503) 555-0147',
    },
    manifestNumber: 'MAN-2026-0843',
    estimatedDeliveryDate: '2026-03-09',
  },

  // ────────────────────────────────────────────────────────────────────
  // PACIFIC LEAF (acct-2) — 1 active order
  // ────────────────────────────────────────────────────────────────────

  // order-pl-22 — just placed, all items awaiting materials
  'order-pl-22': {
    pipelineStep: 'order-placed',
    pipelineStepTimestamps: [
      timestamp('order-placed', '2026-03-07T11:45:00Z', 'Order confirmed via portal'),
    ],
    lineItemStatuses: [
      lineItem('prod-001', 'Wedding Cake 3.5g', 'flower', 'Wedding Cake', '3.5g', 12, {
        pending: 12,
        state: 'awaiting-materials',
        detail: 'Harvest batch assigned, drying room allocation pending',
        estimatedReadyDate: '2026-03-10',
      }),
      lineItem('prod-010', 'Blue Dream Preroll 3-pack', 'prerolls', 'Blue Dream', '3-pack', 8, {
        pending: 8,
        state: 'awaiting-materials',
        detail: 'Pre-roll queue scheduled for Wednesday',
        estimatedReadyDate: '2026-03-11',
      }),
      lineItem('prod-040', 'Tropical Gummies 10-pack', 'edibles', 'N/A', '10-pack', 10, {
        pending: 10,
        state: 'awaiting-materials',
        detail: 'Gummy mold batch queued behind Greenfield order',
        estimatedReadyDate: '2026-03-10',
      }),
    ],
    estimatedShipDate: '2026-03-11',
  },

  // ────────────────────────────────────────────────────────────────────
  // CASCADE WELLNESS (acct-3) — 1 active order
  // ────────────────────────────────────────────────────────────────────

  // order-cw-04 — out for delivery, all items ready
  'order-cw-04': {
    pipelineStep: 'out-for-delivery',
    pipelineStepTimestamps: [
      timestamp('order-placed', '2026-03-06T10:00:00Z', 'Order confirmed via portal'),
      timestamp('being-prepared', '2026-03-06T14:30:00Z', 'Production started'),
      timestamp('packaging', '2026-03-07T09:30:00Z', 'Final packaging underway'),
      timestamp('ready-to-ship', '2026-03-07T11:00:00Z', 'QA passed, staged for pickup'),
      timestamp('picked-packed', '2026-03-08T08:00:00Z', 'Manifest created, loaded on van'),
      timestamp('out-for-delivery', '2026-03-08T08:45:00Z', 'Driver departed warehouse'),
    ],
    lineItemStatuses: [
      lineItem('prod-001', 'Wedding Cake 3.5g', 'flower', 'Wedding Cake', '3.5g', 6, {
        ready: 6,
        state: 'ready-to-ship',
        detail: 'Packaged and on delivery vehicle',
      }),
      lineItem('prod-040', 'Tropical Gummies 10-pack', 'edibles', 'N/A', '10-pack', 8, {
        ready: 8,
        state: 'ready-to-ship',
        detail: 'Packaged and on delivery vehicle',
      }),
    ],
    assignedDriver: {
      name: 'Sarah Chen',
      phone: '(503) 555-0193',
    },
    manifestNumber: 'MAN-2026-0871',
    estimatedDeliveryDate: '2026-03-09',
  },
};

// ══════════════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════════════

export function getPipelineData(orderId: string): PipelineExtension | null {
  return pipelineData[orderId] ?? null;
}

export function getActiveOrderIds(): string[] {
  return Object.keys(pipelineData);
}
