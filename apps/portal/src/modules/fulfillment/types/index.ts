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
  pickListId?: string;
  batchNumber?: string;
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

export interface FulfillmentProgress {
  stages: { status: FulfillmentStatus; count: number; label: string }[];
  totalUnitsToday: number;
  unitsPicked: number;
  unitsPacked: number;
  unitsReady: number;
  throughputTarget: number;
}

export interface PackingOperation {
  id: string;
  orderId: string;
  orderNumber: string;
  accountName: string;
  status: 'verifying' | 'boxing' | 'labeling' | 'sealed';
  itemsPacked: number;
  totalItems: number;
  boxCount: number;
  weight: string;
  packerName: string;
  startedAt: string;
}

export interface QCChecklist {
  id: string;
  label: string;
  checked: boolean;
}
