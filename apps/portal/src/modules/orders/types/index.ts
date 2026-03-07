export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in-production'
  | 'packaged'
  | 'fulfilled'
  | 'shipped'
  | 'delivered'
  | 'paid';

export type PaymentMethod = 'cod' | 'ach' | 'check';
export type PaymentStatus = 'pending' | 'received' | 'overdue';

export interface OrderItem {
  [key: string]: unknown;
  id: string;
  sku: string;
  productName: string;
  category: string;
  subCategory: string;
  packageSize: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  batchNumber?: string;
}

export interface Order {
  [key: string]: unknown;
  id: string;
  orderNumber: string;
  accountId: string;
  accountName: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  createdAt: string;
  confirmedAt?: string;
  fulfilledAt?: string;
  deliveredAt?: string;
  paidAt?: string;
  assignedRep: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  priority?: OrderPriority;
  dueDate?: string;
  notes?: string;
}

export interface OrderMetrics {
  totalOrders: number;
  pendingCount: number;
  avgFulfillmentDays: number;
  onTimeRate: number;
  avgOrderValue: number;
  revenueThisMonth: number;
}

export interface OrderFilter {
  status?: OrderStatus;
  accountId?: string;
  dateRange?: { start: string; end: string };
  paymentStatus?: PaymentStatus;
  category?: string;
  search?: string;
}

export interface OrderPipelineStage {
  status: OrderStatus;
  label: string;
  count: number;
  color: string;
}

export type OrderPriority = 'standard' | 'rush';

export interface OrderVolumeWeek {
  week: string;
  pending: number;
  confirmed: number;
  inProduction: number;
  fulfilled: number;
  delivered: number;
  paid: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  percentage: number;
  color: string;
}

export interface TopAccount {
  accountId: string;
  accountName: string;
  orderCount: number;
  totalRevenue: number;
  avgOrderValue: number;
}
