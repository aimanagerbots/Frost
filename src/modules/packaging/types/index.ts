export interface PackagingOrder {
  id: string;
  status: 'queued' | 'in-progress' | 'completed' | 'blocked-material';
  priority: 'critical' | 'high' | 'medium' | 'low';
  product: string;
  sku: string;
  category: string;
  quantity: number;
  cannabisMaterials: {
    name: string;
    required: number;
    available: number;
    unit: string;
  }[];
  nonCannabisMaterials: {
    name: string;
    required: number;
    available: number;
    unit: string;
    inStock: boolean;
  }[];
  estimatedMinutes: number;
  assignee: string;
  linkedOrderId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface NonCannabisInventory {
  id: string;
  name: string;
  type:
    | 'jar'
    | 'tube'
    | 'box'
    | 'bag'
    | 'label'
    | 'vape-packaging'
    | 'concentrate-container'
    | 'edible-packaging'
    | 'beverage-packaging'
    | 'shrink-wrap'
    | 'humidity-pack';
  size: string;
  currentStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastOrderDate?: string;
  status: 'in-stock' | 'low' | 'critical' | 'out-of-stock';
}

export interface PackagingMetrics {
  totalOrders: number;
  completedToday: number;
  inProgress: number;
  materialShortages: number;
  avgPackagesPerHour: number;
  topSKU: string;
}
