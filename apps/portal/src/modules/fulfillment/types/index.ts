export type FulfillmentStatus =
  | 'queued'
  | 'picking'
  | 'picked'
  | 'packing'
  | 'packed'
  | 'manifested'
  | 'ready-for-driver';

export type FulfillmentPriority = 'urgent' | 'high' | 'normal' | 'low';

export interface PickItem {
  sku: string;
  productName: string;
  category: 'flower' | 'preroll' | 'vaporizer' | 'concentrate' | 'edible' | 'beverage';
  quantity: number;
  shelfLocation: string;
  picked: boolean;
}

export interface FulfillmentOrder {
  [key: string]: unknown;
  id: string;
  orderId: string;
  orderNumber: string;
  accountName: string;
  status: FulfillmentStatus;
  priority: FulfillmentPriority;
  items: PickItem[];
  assignee: string;
  estimatedMinutes: number;
  actualMinutes?: number;
  manifestNumber?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface FulfillmentMetrics {
  totalOrders: number;
  completedToday: number;
  inProgress: number;
  avgPickTime: number;
  accuracyRate: number;
  itemsPerHour: number;
}
