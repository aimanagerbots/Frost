export type ProductCategory = 'flower' | 'preroll' | 'vaporizer' | 'concentrate' | 'edible' | 'beverage';
export type StrainType = 'indica' | 'sativa' | 'hybrid' | 'cbd' | 'balanced';
export type Division = 'cultivation' | 'manufacturing' | 'packaging' | 'fulfillment' | 'delivery';

export type FlowerReadiness =
  | 'growing' | 'harvested-dried' | 'bucked' | 'trimmed' | 'bulk-ready'
  | 'coa-pending' | 'coa-passed' | 'packaged' | 'fulfillable';

export type VaporizerReadiness =
  | 'extracted' | 'crude' | 'distillate' | 'flavored' | 'pen-filled'
  | 'loose-filled' | 'packagable' | 'packaged';

export type ConcentrateReadiness =
  | 'processing' | 'clean-bulk' | 'coa-pending' | 'coa-passed' | 'packagable' | 'packaged';

export type PrerollReadiness = 'rolling' | 'loose-rolled' | 'packagable' | 'packaged';

export type EdibleReadiness = 'packaged' | 'fulfillable';

export type BeverageReadiness = 'packaged' | 'fulfillable';

export type ReadinessState =
  | FlowerReadiness
  | VaporizerReadiness
  | ConcentrateReadiness
  | PrerollReadiness
  | EdibleReadiness
  | BeverageReadiness;

export interface InventoryItem {
  [key: string]: unknown;
  id: string;
  sku: string;
  productName: string;
  category: ProductCategory;
  subCategory: string;
  strainName: string;
  strainType: StrainType;
  readinessState: ReadinessState;
  division: Division;
  quantity: number;
  unit: 'units' | 'grams' | 'lbs';
  batchNumber: string;
  harvestDate?: string;
  packagedDate?: string;
  expirationDate?: string;
  thcPercent?: number;
  cbdPercent?: number;
  location: string;
  value: number;
}

export interface InventoryByState {
  state: ReadinessState;
  label: string;
  count: number;
  division: Division;
  color: string;
}

export interface InventoryByCategory {
  category: ProductCategory;
  label: string;
  count: number;
  value: number;
  percentage: number;
}

export interface InventoryMetrics {
  totalItems: number;
  totalValue: number;
  lowStockAlerts: number;
  categoryCounts: Record<string, number>;
  stateDistribution: InventoryByState[];
}

export interface InventoryFilter {
  category?: ProductCategory;
  subCategory?: string;
  strainType?: StrainType;
  readinessState?: ReadinessState;
  division?: Division;
  thcRange?: { min: number; max: number };
  cbdRange?: { min: number; max: number };
  location?: string;
  search?: string;
}

export interface PipelineGroup {
  division: Division;
  label: string;
  color: string;
  states: { state: ReadinessState; label: string; count: number }[];
  totalItems: number;
}
