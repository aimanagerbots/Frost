// VMI (Vendor Managed Inventory) Domain Types

export interface VMIAccount {
  accountId: string;
  accountName: string;
  enrolled: boolean;
  enrolledDate: string;
  skuCount: number;
  totalVelocity: number; // units/day
  reorderAlerts: number;
  lastRestockDate: string;
}

export interface VMISellThrough {
  accountId: string;
  sku: string;
  productName: string;
  category: string;
  dailyAvg: number;
  weeklyTotal: number;
  currentStock: number;
  parLevel: number;
  daysOnHand: number;
  reorderRecommended: boolean;
  reorderQty?: number;
}

export interface VMIMarketShare {
  accountId: string;
  category: string;
  ourShare: number; // percentage
  ourRevenue: number;
  topCompetitor: string;
  competitorShare: number;
}

export interface VMIMetrics {
  enrolledAccounts: number;
  totalSKUs: number;
  reorderAlerts: number;
  avgDailyVelocity: number;
  avgMarketShare: number;
  fillRate: number;
}

export interface VMIDailyEmail {
  accountId: string;
  accountName: string;
  repName: string;
  reorderItems: VMISellThrough[];
  competitiveAlerts: string[];
  generatedAt: string;
}
