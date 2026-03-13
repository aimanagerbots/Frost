// ─── WA State LCB METRC Inventory Type Codes ─────────────────────────────────
export type InventoryTypeCode =
  | 5 | 6 | 7 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16
  | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30
  | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40;

export const INVENTORY_TYPE_LABELS: Record<InventoryTypeCode, string> = {
  5:  'Kief',
  6:  'Flower',
  7:  'Clone',
  9:  'Other Plant Material',
  10: 'Seed',
  11: 'Plant Tissue',
  12: 'Mature Plant',
  13: 'Flower Lot',
  14: 'Other Plant Material Lot',
  15: 'Bubble Hash',
  16: 'Hash',
  17: 'Hydrocarbon Wax',
  18: 'CO2 Hash Oil',
  19: 'Food Grade Solvent Extract',
  20: 'Infused Dairy Butter',
  21: 'Infused Cooking Oil',
  22: 'Solid Infused Edible',
  23: 'Liquid Infused Edible',
  24: 'Marijuana Extract for Inhalation',
  25: 'Infused Topicals',
  26: 'Sample Jar (Sniffer)',
  27: 'Waste',
  28: 'Usable Marijuana',
  29: 'Wet Flower',
  30: 'Marijuana Mix',
  31: 'Marijuana Mix Packaged',
  32: 'Marijuana Mix Infused',
  33: 'Non-Mandatory QA Sample',
  34: 'Capsule',
  35: 'Tincture',
  36: 'Transdermal Patch',
  37: 'Suppository',
  38: 'Non-Solvent Concentrate',
  39: 'Hemp-CBD',
  40: 'Ethanol Concentrate',
};

// ─── Shared Domain Enums ──────────────────────────────────────────────────────
export type ProductCategory = 'flower' | 'preroll' | 'vaporizer' | 'concentrate' | 'edible' | 'beverage';
export type StrainType = 'indica' | 'sativa' | 'hybrid';
export type Brand = 'Frost Farms' | 'Glacier Extracts' | 'Northern Lights Co.';
export type QAStatus = 'passed' | 'failed' | 'pending' | null;
export type ProductStatus = 'active' | 'discontinued' | 'not-for-sale';
export type BatchStatus = 'available' | 'not-for-sale' | 'excluded';
export type FulfillmentPriority = 'fifo' | 'newest-first' | 'highest-qa' | 'lowest-qa';
export type DisposalReason = 'waste' | 'overstock' | 'damage' | 'compliance' | 'expiration';
export type DiscountType = 'percent' | 'amount';
export type DiscountStatus = 'active' | 'expired' | 'upcoming';
export type RoomType = 'grow' | 'dry' | 'cure' | 'storage' | 'staging';
export type SamplePurpose = 'education' | 'quality-control' | 'demo';
export type BackorderStatus = 'pending' | 'partial' | 'fulfilled';

// ─── Product ─────────────────────────────────────────────────────────────────
export interface Product {
  [key: string]: unknown;
  id: string;
  sku: string;
  name: string;
  labelName: string;
  inventoryType: InventoryTypeCode;
  productLine: string;
  subProductLine: string;
  packageSize: string;
  labelTemplate: string;
  strain: string;
  unitPrice: number;
  expiryMonths: number;
  catalogGroup: string;
  catalogName: string;
  category: ProductCategory;
  subCategory: string;
  minOrderLimit: number;
  marketIncrementQuantity: number;
  showAsDOHCompliant: boolean;
  productDescription: string;
  productDisclaimer: string;
  images: string[];
  overrideQaValues: boolean;
  qaValues: { cbd: number; cbda: number; thc: number; thca: number; total: number };
  availableForSale: number;
  allocated: number;
  onHold: number;
  totalInStock: number;
  status: ProductStatus;
}

// ─── Batch ────────────────────────────────────────────────────────────────────
export interface Batch {
  [key: string]: unknown;
  id: string;
  barcode: string;
  productName: string;
  room: string;
  batchDate: string;
  qaStatus: QAStatus;
  available: number;
  unitsForSale: number;
  unitsOnHold: number;
  unitsAllocated: number;
  unitsInStock: number;
  status: BatchStatus;
}

// ─── Strain ───────────────────────────────────────────────────────────────────
export interface Strain {
  id: string;
  name: string;
  image: string | null;
  isActive: boolean;
}

// ─── QA Result ────────────────────────────────────────────────────────────────
export interface QAResult {
  [key: string]: unknown;
  id: string;
  qaLot: string;
  subLot: string;
  status: 'passed' | 'failed' | 'pending';
  inventoryType: InventoryTypeCode;
  strain: string;
  dateOfManufacture: string;
  dateOfHarvest: string;
  cbd: number;
  cbda: number;
  thc: number;
  thca: number;
  total: number;
  pdfUrl: string | null;
  changedBy: string;
  dateChanged: string;
}

// ─── Discount ─────────────────────────────────────────────────────────────────
export interface Discount {
  [key: string]: unknown;
  id: string;
  name: string;
  fromDate: string;
  toDate: string;
  discountType: DiscountType;
  discountAmount: number;
  description: string;
  appliesToAllProducts: boolean;
  appliesToAllClients: boolean;
  status: DiscountStatus;
}

// ─── Inventory Room ───────────────────────────────────────────────────────────
export interface InventoryRoom {
  [key: string]: unknown;
  id: string;
  name: string;
  roomType: RoomType;
  capacity: number;
  currentOccupancy: number;
  assignedBatches: number;
}

// ─── Product Line ─────────────────────────────────────────────────────────────
export interface ProductLine {
  id: string;
  name: string;
  subLines: string[];
  activeProducts: number;
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface InventoryCategory {
  id: string;
  name: string;
  inventoryType: InventoryTypeCode;
  activeProducts: number;
}

// ─── Catalog Group ────────────────────────────────────────────────────────────
export interface CatalogGroup {
  id: string;
  groupName: string;
  catalogName: string;
  productCount: number;
  active: boolean;
}

// ─── Backorder ────────────────────────────────────────────────────────────────
export interface Backorder {
  [key: string]: unknown;
  id: string;
  orderNumber: string;
  clientName: string;
  productName: string;
  qtyOrdered: number;
  qtyAvailable: number;
  fulfillmentPriority: FulfillmentPriority;
  dateCreated: string;
  expectedFulfillment: string;
  qaStatus: QAStatus;
  status: BackorderStatus;
}

// ─── QA Lot ───────────────────────────────────────────────────────────────────
export interface QALot {
  [key: string]: unknown;
  id: string;
  lotNumber: string;
  assignedBatches: number;
  testLab: string;
  submittedDate: string;
  resultStatus: 'passed' | 'failed' | 'pending';
  expirationDate: string;
}

// ─── QA Sample ────────────────────────────────────────────────────────────────
export interface QASample {
  [key: string]: unknown;
  id: string;
  sampleId: string;
  productName: string;
  batchNumber: string;
  lab: string;
  submissionDate: string;
  expectedReturn: string;
  status: 'submitted' | 'in-testing' | 'passed' | 'failed';
}

// ─── Employee Sample ──────────────────────────────────────────────────────────
export interface EmployeeSample {
  [key: string]: unknown;
  id: string;
  employeeName: string;
  productSampled: string;
  date: string;
  quantity: number;
  purpose: SamplePurpose;
  approvedBy: string;
}

// ─── Disposal ─────────────────────────────────────────────────────────────────
export interface Disposal {
  [key: string]: unknown;
  id: string;
  disposalId: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  disposalReason: DisposalReason;
  disposalMethod: string;
  date: string;
  employee: string;
  witness: string;
}

// ─── Product Tag ──────────────────────────────────────────────────────────────
export interface ProductTag {
  id: string;
  name: string;
  color: string;
  assignedProducts: number;
}

// ─── Conversion Rule ──────────────────────────────────────────────────────────
export interface ConversionRule {
  id: string;
  fromProduct: string;
  toProduct: string;
  conversionRatio: number;
  unit: string;
  active: boolean;
}

// ─── Production Run ───────────────────────────────────────────────────────────
export interface ProductionRun {
  [key: string]: unknown;
  id: string;
  runId: string;
  productName: string;
  bomComponents: string[];
  quantityProduced: number;
  date: string;
  status: 'planned' | 'in-progress' | 'complete' | 'cancelled';
}

// ─── Non-Cannabis Item (kept from previous) ───────────────────────────────────
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

// ─── Manage Menu Row ──────────────────────────────────────────────────────────
export interface ManageMenuRow {
  [key: string]: unknown;
  id: string;
  productName: string;
  inventoryType: InventoryTypeCode;
  availableForSale: number;
  allocated: number;
  unitsOnBackorder: number;
  onHold: number;
  totalInStock: number;
  unitPrice: number;
  status: ProductStatus;
  lastAdjusted: string;
  availableOnPortal: boolean;
}

// ─── Filter / Tab Types ───────────────────────────────────────────────────────
export type ManageMenuFilterTab = 'all' | 'available-for-sale' | 'not-for-sale' | 'available-on-portal' | 'more-categories' | 'active' | 'discontinued';
export type ProductFilterTab = 'all' | 'available-for-sale' | 'not-for-sale' | 'available-on-portal' | 'active' | 'discontinued';
export type BatchFilterTab = 'all' | 'available-for-sale' | 'not-for-sale' | 'excluded';
export type QAFilterTab = 'all' | 'passed' | 'failed' | 'pending';

export interface ProductFilter {
  tab: ProductFilterTab;
  search?: string;
  productLine?: string;
  inventoryType?: InventoryTypeCode;
}
