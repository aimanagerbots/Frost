import type {
  SyncRun,
  SyncStatus,
  SyncLogEntry,
  BotStatus,
  OrderImport,
  AdCampaign,
  MarketplaceStats,
} from '@/modules/cultivera/types';

// ── Helpers ──────────────────────────────────────────────────────────
function daysAgo(n: number, hour = 6, minute = 5): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}
function hoursAgo(n: number): string {
  return new Date(Date.now() - n * 3_600_000).toISOString();
}
function daysFromNow(n: number, hour = 6, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// ── Sync Runs ────────────────────────────────────────────────────────
export const SYNC_RUNS: SyncRun[] = [
  { id: 'sr-001', timestamp: daysAgo(0), status: 'success', itemsSynced: 47, itemsFailed: 0, duration: 18 },
  { id: 'sr-002', timestamp: daysAgo(1), status: 'success', itemsSynced: 47, itemsFailed: 0, duration: 16 },
  { id: 'sr-003', timestamp: daysAgo(2), status: 'partial', itemsSynced: 44, itemsFailed: 3, duration: 21, errorMessage: '3 items rejected: price format mismatch on SKUs FLW-OG-3.5, FLW-OG-7, CON-RES-1' },
  { id: 'sr-004', timestamp: daysAgo(3), status: 'success', itemsSynced: 46, itemsFailed: 0, duration: 17 },
  { id: 'sr-005', timestamp: daysAgo(4), status: 'success', itemsSynced: 46, itemsFailed: 0, duration: 15 },
  { id: 'sr-006', timestamp: daysAgo(5), status: 'failed', itemsSynced: 0, itemsFailed: 47, duration: 4, errorMessage: 'Authentication timeout — Cultivera session expired. Re-auth required.' },
  { id: 'sr-007', timestamp: daysAgo(6), status: 'success', itemsSynced: 45, itemsFailed: 0, duration: 19 },
  { id: 'sr-008', timestamp: daysAgo(7), status: 'success', itemsSynced: 45, itemsFailed: 0, duration: 20 },
  { id: 'sr-009', timestamp: daysAgo(8), status: 'partial', itemsSynced: 43, itemsFailed: 2, duration: 18, errorMessage: '2 items rejected: missing unit weight on new preroll SKUs' },
  { id: 'sr-010', timestamp: daysAgo(9), status: 'success', itemsSynced: 44, itemsFailed: 0, duration: 16 },
];

export const SYNC_STATUS: SyncStatus = {
  lastRun: SYNC_RUNS[0],
  nextScheduled: daysFromNow(1),
  consecutiveFailures: 0,
  totalLifetimeSyncs: 847,
  isRunning: false,
};

// ── Sync Log Entries (for SyncLogModal) ──────────────────────────────
export const SYNC_LOG_ENTRIES: Record<string, SyncLogEntry[]> = {
  'sr-001': [
    { product: 'OG Kush — 3.5g', sku: 'FLW-OG-3.5', action: 'updated', cultiveraSku: 'CV-10421' },
    { product: 'OG Kush — 7g', sku: 'FLW-OG-7', action: 'updated', cultiveraSku: 'CV-10422' },
    { product: 'Gelato #33 — 3.5g', sku: 'FLW-GEL-3.5', action: 'unchanged', cultiveraSku: 'CV-10440' },
    { product: 'Blue Dream — 1g', sku: 'FLW-BD-1', action: 'updated', cultiveraSku: 'CV-10451' },
    { product: 'Wedding Cake Pre-Roll — 1g', sku: 'PRE-WC-1', action: 'created', cultiveraSku: 'CV-10899' },
    { product: 'Sour Diesel Pre-Roll 5-Pack', sku: 'PRE-SD-5PK', action: 'updated', cultiveraSku: 'CV-10512' },
    { product: 'Live Resin — Gelato #33', sku: 'CON-LR-GEL', action: 'unchanged', cultiveraSku: 'CV-10601' },
    { product: 'RSO — Full Spectrum 1g', sku: 'CON-RSO-1', action: 'updated', cultiveraSku: 'CV-10630' },
  ],
  'sr-003': [
    { product: 'OG Kush — 3.5g', sku: 'FLW-OG-3.5', action: 'failed', error: 'Price format: expected float, got "28.00/unit"' },
    { product: 'OG Kush — 7g', sku: 'FLW-OG-7', action: 'failed', error: 'Price format: expected float, got "52.00/unit"' },
    { product: 'Live Resin — Cured Resin', sku: 'CON-RES-1', action: 'failed', error: 'Price format: expected float, got "45.00/unit"' },
    { product: 'Blue Dream — 3.5g', sku: 'FLW-BD-3.5', action: 'updated', cultiveraSku: 'CV-10452' },
  ],
};

// ── Bot Status ───────────────────────────────────────────────────────
export const BOT_STATUS: BotStatus = {
  state: 'idle',
  lastRun: hoursAgo(0.5),
  nextRun: daysFromNow(0, 18, 0),
  runsToday: 2,
  ordersImportedToday: 3,
  ordersImportedThisWeek: 11,
  pendingReview: 5,
};

// ── Imported Orders ──────────────────────────────────────────────────
export const IMPORTED_ORDERS: OrderImport[] = [
  {
    id: 'oi-001',
    cultiveraPONumber: 'PO-2026-03-12-0041',
    retailerName: 'Herbs House',
    retailerLicense: '412-HERBS-2019',
    lineItems: [
      { product: 'OG Kush — 3.5g', sku: 'FLW-OG-3.5', qty: 24, unitPrice: 14.00 },
      { product: 'Gelato #33 — 3.5g', sku: 'FLW-GEL-3.5', qty: 12, unitPrice: 14.00 },
      { product: 'Wedding Cake Pre-Roll — 1g', sku: 'PRE-WC-1', qty: 30, unitPrice: 7.50 },
    ],
    subtotal: 729.00,
    importedAt: hoursAgo(0.5),
    pdfUrl: '#',
    status: 'new',
  },
  {
    id: 'oi-002',
    cultiveraPONumber: 'PO-2026-03-12-0039',
    retailerName: 'Cannabis & Glass',
    retailerLicense: '412-CAG-2018',
    lineItems: [
      { product: 'Blue Dream — 3.5g', sku: 'FLW-BD-3.5', qty: 20, unitPrice: 14.00 },
      { product: 'Live Resin — Gelato #33', sku: 'CON-LR-GEL', qty: 10, unitPrice: 32.00 },
    ],
    subtotal: 600.00,
    importedAt: hoursAgo(1.2),
    pdfUrl: '#',
    status: 'new',
  },
  {
    id: 'oi-003',
    cultiveraPONumber: 'PO-2026-03-12-0037',
    retailerName: 'Diego Pellicer',
    retailerLicense: '412-DP-2014',
    lineItems: [
      { product: 'OG Kush — 7g', sku: 'FLW-OG-7', qty: 10, unitPrice: 26.00 },
      { product: 'Sour Diesel Pre-Roll 5-Pack', sku: 'PRE-SD-5PK', qty: 12, unitPrice: 32.00 },
      { product: 'RSO — Full Spectrum 1g', sku: 'CON-RSO-1', qty: 8, unitPrice: 28.00 },
      { product: 'Blue Dream — 1g', sku: 'FLW-BD-1', qty: 48, unitPrice: 5.50 },
    ],
    subtotal: 1_128.00,
    importedAt: hoursAgo(2.0),
    pdfUrl: '#',
    status: 'new',
  },
  {
    id: 'oi-004',
    cultiveraPONumber: 'PO-2026-03-11-0031',
    retailerName: 'Vela Cannabis',
    retailerLicense: '412-VEL-2021',
    lineItems: [
      { product: 'Gelato #33 — 7g', sku: 'FLW-GEL-7', qty: 8, unitPrice: 26.00 },
      { product: 'Live Resin — Cured Resin', sku: 'CON-RES-1', qty: 6, unitPrice: 45.00 },
    ],
    subtotal: 478.00,
    importedAt: daysAgo(0, 8, 15),
    pdfUrl: '#',
    status: 'new',
  },
  {
    id: 'oi-005',
    cultiveraPONumber: 'PO-2026-03-11-0028',
    retailerName: 'Ponder',
    retailerLicense: '412-PON-2020',
    lineItems: [
      { product: 'Blue Dream — 3.5g', sku: 'FLW-BD-3.5', qty: 16, unitPrice: 14.00 },
      { product: 'OG Kush — 3.5g', sku: 'FLW-OG-3.5', qty: 16, unitPrice: 14.00 },
    ],
    subtotal: 448.00,
    importedAt: daysAgo(0, 8, 10),
    pdfUrl: '#',
    status: 'new',
  },
  {
    id: 'oi-006',
    cultiveraPONumber: 'PO-2026-03-11-0022',
    retailerName: 'The Green Door',
    retailerLicense: '412-TGD-2017',
    lineItems: [
      { product: 'Wedding Cake Pre-Roll — 1g', sku: 'PRE-WC-1', qty: 48, unitPrice: 7.50 },
      { product: 'Sour Diesel Pre-Roll 5-Pack', sku: 'PRE-SD-5PK', qty: 8, unitPrice: 32.00 },
    ],
    subtotal: 616.00,
    importedAt: daysAgo(1, 6, 8),
    pdfUrl: '#',
    status: 'reviewed',
  },
  {
    id: 'oi-007',
    cultiveraPONumber: 'PO-2026-03-11-0019',
    retailerName: 'Ruckus',
    retailerLicense: '412-RUC-2019',
    lineItems: [
      { product: 'Live Resin — Gelato #33', sku: 'CON-LR-GEL', qty: 14, unitPrice: 32.00 },
      { product: 'RSO — Full Spectrum 1g', sku: 'CON-RSO-1', qty: 10, unitPrice: 28.00 },
    ],
    subtotal: 728.00,
    importedAt: daysAgo(1, 6, 6),
    pdfUrl: '#',
    status: 'reviewed',
  },
  {
    id: 'oi-008',
    cultiveraPONumber: 'PO-2026-03-10-0017',
    retailerName: 'Have a Heart',
    retailerLicense: '412-HAH-2015',
    lineItems: [
      { product: 'OG Kush — 3.5g', sku: 'FLW-OG-3.5', qty: 36, unitPrice: 14.00 },
      { product: 'Gelato #33 — 3.5g', sku: 'FLW-GEL-3.5', qty: 24, unitPrice: 14.00 },
      { product: 'Blue Dream — 1g', sku: 'FLW-BD-1', qty: 72, unitPrice: 5.50 },
    ],
    subtotal: 1_332.00,
    importedAt: daysAgo(2, 6, 7),
    pdfUrl: '#',
    status: 'reviewed',
  },
  {
    id: 'oi-009',
    cultiveraPONumber: 'PO-2026-03-10-0014',
    retailerName: 'Fahrenheit Cannabis',
    retailerLicense: '412-FAH-2020',
    lineItems: [
      { product: 'Live Resin — Cured Resin', sku: 'CON-RES-1', qty: 12, unitPrice: 45.00 },
    ],
    subtotal: 540.00,
    importedAt: daysAgo(2, 6, 5),
    pdfUrl: '#',
    status: 'reviewed',
  },
  {
    id: 'oi-010',
    cultiveraPONumber: 'PO-2026-03-10-0011',
    retailerName: 'Oleum Extracts Dispensary',
    retailerLicense: '412-OLE-2018',
    lineItems: [
      { product: 'OG Kush — 7g', sku: 'FLW-OG-7', qty: 14, unitPrice: 26.00 },
      { product: 'Sour Diesel Pre-Roll 5-Pack', sku: 'PRE-SD-5PK', qty: 10, unitPrice: 32.00 },
    ],
    subtotal: 684.00,
    importedAt: daysAgo(2, 6, 4),
    pdfUrl: '#',
    status: 'reviewed',
  },
  {
    id: 'oi-011',
    cultiveraPONumber: 'PO-2026-03-09-0008',
    retailerName: 'Primal Dispensary',
    retailerLicense: '412-PRI-2022',
    lineItems: [
      { product: 'Blue Dream — 3.5g', sku: 'FLW-BD-3.5', qty: 18, unitPrice: 14.00 },
      { product: 'Wedding Cake Pre-Roll — 1g', sku: 'PRE-WC-1', qty: 24, unitPrice: 7.50 },
    ],
    subtotal: 432.00,
    importedAt: daysAgo(3, 6, 6),
    pdfUrl: '#',
    status: 'pushed-to-orders',
  },
  {
    id: 'oi-012',
    cultiveraPONumber: 'PO-2026-03-09-0006',
    retailerName: 'Cinder',
    retailerLicense: '412-CIN-2019',
    lineItems: [
      { product: 'Live Resin — Gelato #33', sku: 'CON-LR-GEL', qty: 20, unitPrice: 32.00 },
      { product: 'RSO — Full Spectrum 1g', sku: 'CON-RSO-1', qty: 12, unitPrice: 28.00 },
      { product: 'OG Kush — 3.5g', sku: 'FLW-OG-3.5', qty: 20, unitPrice: 14.00 },
    ],
    subtotal: 1_216.00,
    importedAt: daysAgo(3, 6, 5),
    pdfUrl: '#',
    status: 'pushed-to-orders',
  },
  {
    id: 'oi-013',
    cultiveraPONumber: 'PO-2026-03-08-0004',
    retailerName: 'Green Theory',
    retailerLicense: '412-GT-2016',
    lineItems: [
      { product: 'Gelato #33 — 7g', sku: 'FLW-GEL-7', qty: 10, unitPrice: 26.00 },
      { product: 'Blue Dream — 1g', sku: 'FLW-BD-1', qty: 60, unitPrice: 5.50 },
    ],
    subtotal: 590.00,
    importedAt: daysAgo(4, 6, 7),
    pdfUrl: '#',
    status: 'pushed-to-orders',
  },
  {
    id: 'oi-014',
    cultiveraPONumber: 'PO-2026-03-08-0002',
    retailerName: 'Altitude Cannabis',
    retailerLicense: '412-ALT-2020',
    lineItems: [
      { product: 'OG Kush — 3.5g', sku: 'FLW-OG-3.5', qty: 24, unitPrice: 14.00 },
      { product: 'Live Resin — Cured Resin', sku: 'CON-RES-1', qty: 8, unitPrice: 45.00 },
    ],
    subtotal: 696.00,
    importedAt: daysAgo(4, 6, 5),
    pdfUrl: '#',
    status: 'pushed-to-orders',
  },
  {
    id: 'oi-015',
    cultiveraPONumber: 'PO-2026-03-07-0001',
    retailerName: 'Top Shelf Cannabis',
    retailerLicense: '412-TSC-2017',
    lineItems: [
      { product: 'Wedding Cake Pre-Roll — 1g', sku: 'PRE-WC-1', qty: 60, unitPrice: 7.50 },
      { product: 'Sour Diesel Pre-Roll 5-Pack', sku: 'PRE-SD-5PK', qty: 14, unitPrice: 32.00 },
      { product: 'OG Kush — 7g', sku: 'FLW-OG-7', qty: 8, unitPrice: 26.00 },
    ],
    subtotal: 1_106.00,
    importedAt: daysAgo(5, 6, 6),
    pdfUrl: '#',
    status: 'pushed-to-orders',
  },
];

// ── Ad Campaigns ─────────────────────────────────────────────────────
export const AD_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'ad-001',
    type: 'sponsored-brand',
    status: 'active',
    startDate: daysAgo(3, 0, 0),
    endDate: daysFromNow(4, 23, 59),
    spend: 612.50,
    budget: 850.00,
    impressions: 18_420,
    clicks: 394,
    notes: 'Week 11 sponsored brand slot. Featuring OG Kush and Gelato #33. Coordinated with Herbs House and Cannabis & Glass reorder cycles.',
  },
  {
    id: 'ad-002',
    type: 'banner',
    status: 'upcoming',
    startDate: daysFromNow(19, 0, 0),
    endDate: daysFromNow(33, 23, 59),
    spend: 0,
    budget: 400.00,
    impressions: 0,
    clicks: 0,
    notes: 'Spring banner placement on the Cultivera marketplace homepage. Creative TBD — coordinate with marketing on 420 campaign assets.',
  },
  {
    id: 'ad-003',
    type: 'sponsored-brand',
    status: 'completed',
    startDate: daysAgo(17, 0, 0),
    endDate: daysAgo(10, 23, 59),
    spend: 800.00,
    budget: 800.00,
    impressions: 12_840,
    clicks: 287,
    notes: 'Week 8 sponsored brand. Focused on concentrate line launch (Live Resin SKUs). Strong pickup from Diego Pellicer and Have a Heart.',
  },
];

// ── Marketplace Stats ────────────────────────────────────────────────
export const MARKETPLACE_STATS: MarketplaceStats = {
  totalWALicensedRetailers: 512,
  cultiveraManagedRetailers: 431,
  frozenSupplierRank: 14,
  activeListings: 47,
  avgOrderValue: 1_840,
  repeatBuyerRate: 0.73,
};
