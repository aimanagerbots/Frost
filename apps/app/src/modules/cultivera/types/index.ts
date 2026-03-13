// ── View ─────────────────────────────────────────────────────────────
export type CultiveraView =
  | 'dashboard'
  | 'menu-sync'
  | 'order-intake'
  | 'marketing'
  | 'marketplace';

// ── Menu Sync ────────────────────────────────────────────────────────
export interface SyncRun {
  id: string;
  timestamp: string;
  status: 'success' | 'partial' | 'failed';
  itemsSynced: number;
  itemsFailed: number;
  duration: number; // seconds
  errorMessage?: string;
}

export interface SyncLogEntry {
  product: string;
  sku: string;
  action: 'updated' | 'created' | 'unchanged' | 'failed';
  cultiveraSku?: string;
  error?: string;
}

export interface SyncStatus {
  lastRun: SyncRun;
  nextScheduled: string;
  consecutiveFailures: number;
  totalLifetimeSyncs: number;
  isRunning: boolean;
}

// ── Order Intake ─────────────────────────────────────────────────────
export interface OrderLineItem {
  product: string;
  sku: string;
  qty: number;
  unitPrice: number;
}

export interface OrderImport {
  id: string;
  cultiveraPONumber: string;
  retailerName: string;
  retailerLicense: string;
  lineItems: OrderLineItem[];
  subtotal: number;
  importedAt: string;
  pdfUrl: string;
  status: 'new' | 'reviewed' | 'pushed-to-orders';
}

export interface BotStatus {
  state: 'idle' | 'running' | 'error';
  lastRun: string;
  nextRun: string;
  runsToday: number;
  ordersImportedToday: number;
  ordersImportedThisWeek: number;
  pendingReview: number;
}

// ── Marketing ────────────────────────────────────────────────────────
export interface AdCampaign {
  id: string;
  type: 'sponsored-brand' | 'banner';
  status: 'active' | 'upcoming' | 'completed';
  startDate: string;
  endDate: string;
  spend: number;
  budget: number;
  impressions: number;
  clicks: number;
  notes: string;
}

// ── Marketplace ──────────────────────────────────────────────────────
export interface MarketplaceStats {
  totalWALicensedRetailers: number;
  cultiveraManagedRetailers: number;
  frozenSupplierRank: number;
  activeListings: number;
  avgOrderValue: number;
  repeatBuyerRate: number;
}
