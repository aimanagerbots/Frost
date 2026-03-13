// Sales module shared types — derived from Cultivera Pro data models
// Named SalesOrderStatus to avoid collision with existing Frost OrderStatus in src/modules/orders/types/

export type SalesOrderStatus = 'submitted' | 'sublotted' | 'manifested' | 'quarantined' | 'invoiced' | 'paid' | 'partially-sublotted';
export type AccountStatus = 'active' | 'inactive';
export type FulfillmentPriority = 'fifo' | 'newest-first' | 'highest-qa' | 'lowest-qa';
export type AllocationMode = 'combine' | 'generate-multiple';

export interface SalesAccount {
  id: string;
  clientName: string;
  address: string;
  city: string;
  licenseUBI: string;
  email: string;
  status: AccountStatus;
  deliveryDays: string[];
  amPm: 'am' | 'pm';
  specialInstructions: string;
  labelBarcodePreference: string;
  fulfillmentPriority: FulfillmentPriority;
  assignedSalesRep: string;
  contactCount: number;
  orderCount: number;
  pipelineCode?: string;
}

export interface SalesContact {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  phone: string;
  phoneType: string;
  note: string;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  submittedBy: string;
  submittedDate: string;
  clientName: string;
  city: string;
  status: SalesOrderStatus;
  manifestedDate?: string;
  estDeliveryDate?: string;
  releasedDate?: string;
  orderTotal: number;
}

export interface Cart {
  id: string;
  name: string;
  clientName: string;
  itemCount: number;
  total: number;
  status: 'open' | 'submitted' | 'allocated';
  lineItems: CartLineItem[];
}

export interface CartLineItem {
  id: string;
  productName: string;
  strain: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface BatchAllocation {
  batchId: string;
  batchDate: string;
  doh: number;
  dom: string;
  use: string;
  barcode: string;
  room: string;
  available: number;
  allocated: number;
  needed: number;
  remaining: number;
}

export interface Catalog {
  id: string;
  name: string;
  productCount: number;
  products: CatalogProduct[];
}

export interface CatalogProduct {
  id: string;
  name: string;
  strain: string;
  category: string;
  price: number;
  available: number;
}

export interface SalesInventoryItem {
  id: string;
  name: string;
  strain: string;
  productLine: string;
  subProductLine: string;
  thca: number;
  thc: number;
  cbd: number;
  total: number;
  available: number;
  price: number;
}

export interface AccountGroup {
  id: string;
  name: string;
  type: 'territory' | 'rep' | 'custom';
  accountCount: number;
  assignedRep?: string;
}

export interface SalesRepReport {
  repName: string;
  totalSales: number;
  orderCount: number;
  accountCount: number;
  avgOrderValue: number;
  topAccount: string;
}

export type OrderSummaryRow = SalesOrder & {
  tradeName: string;
};
