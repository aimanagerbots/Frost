// Readiness states — unified linear pipeline
export type ReadinessState =
  | 'growing' | 'harvested' | 'dried'
  | 'bucked' | 'trimmed' | 'bulk-ready'
  | 'coa-pending' | 'coa-passed'
  | 'packaged' | 'fulfilled' | 'delivered';

export type ProductCategory = 'flower' | 'preroll' | 'vaporizer' | 'concentrate' | 'edible' | 'beverage';
export type StrainType = 'indica' | 'sativa' | 'hybrid';
export type Brand = 'Frost Farms' | 'Glacier Extracts' | 'Northern Lights Co.';
export type COAStatus = 'not-tested' | 'pending' | 'passed' | 'failed';

export interface CannabisInventoryItem {
  [key: string]: unknown;
  id: string;
  sku: string;
  productName: string;
  category: ProductCategory;
  strain: string;
  strainType: StrainType;
  thc: number;
  cbd: number;
  readinessState: ReadinessState;
  quantity: number;
  unit: 'plants' | 'lbs' | 'units' | 'batches';
  packageSize?: string;
  batchNumber: string;
  lotNumber?: string;
  coaStatus: COAStatus;
  location: string;
  lastUpdated: string;
  brand: Brand;
  value: number;
}

export interface NonCannabisItem {
  [key: string]: unknown;
  id: string;
  name: string;
  category: 'containers' | 'labels' | 'packaging' | 'other';
  sku: string;
  currentStock: number;
  unit: string;
  reorderPoint: number;
  reorderQuantity: number;
  supplier: string;
  lastOrdered: string;
  status: 'in-stock' | 'low' | 'critical' | 'on-order' | 'out-of-stock';
  unitCost: number;
}

export interface COASubmission {
  [key: string]: unknown;
  id: string;
  batchNumber: string;
  productName: string;
  category: string;
  strain: string;
  labName: string;
  dateSubmitted: string;
  dateExpected: string;
  dateReceived?: string;
  status: 'submitted' | 'in-testing' | 'passed' | 'failed';
  results?: {
    thc: number;
    cbd: number;
    totalTerpenes: number;
    moisture: number;
    contaminants: 'pass' | 'fail';
    pesticides: 'pass' | 'fail';
    heavyMetals: 'pass' | 'fail';
    residualSolvents: 'pass' | 'fail';
    failureReasons?: string[];
  };
  expirationDate?: string;
  documentUrl?: string;
}

export interface LabPartner {
  id: string;
  name: string;
  location: string;
  avgTurnaround: number;
  testsThisMonth: number;
  passRate: number;
  contactEmail: string;
  contactPhone: string;
}

export interface InventoryAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  type: 'low-stock' | 'expiring-coa' | 'aging' | 'reconciliation' | 'failed-coa' | 'out-of-stock';
  title: string;
  description: string;
  affectedItems: string[];
  timestamp: string;
  recommendedAction: string;
  actionLabel: string;
  actionLink?: string;
  acknowledged: boolean;
}

export interface ActivityFeedEvent {
  id: string;
  timestamp: string;
  productName: string;
  batchNumber?: string;
  eventType: 'packaged' | 'coa-submitted' | 'coa-passed' | 'coa-failed' | 'harvested' | 'fulfilled' | 'delivered' | 'reorder' | 'alert';
  description: string;
}

export interface PipelineStateNode {
  state: ReadinessState;
  label: string;
  count: number;
  unit: string;
  health: 'healthy' | 'low' | 'critical';
}

export interface InventoryOverviewMetrics {
  totalSKUs: number;
  totalValue: number;
  belowReorderPoint: number;
  coaPending: number;
  avgDaysInPipeline: number;
  expiringCOAs: number;
}

export interface CategoryDistribution {
  category: ProductCategory;
  label: string;
  count: number;
  value: number;
  trend: number;
  lowStock: boolean;
}

export interface InventoryFilter {
  category?: ProductCategory;
  readinessState?: ReadinessState;
  strain?: string;
  brand?: Brand;
  thcMin?: number;
  thcMax?: number;
  packageSize?: string;
  stockLevel?: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
  coaStatus?: COAStatus;
  search?: string;
}
