// ── View ────────────────────────────────────────────────────
export type PackagingView =
  | 'dashboard'
  | 'work-orders'
  | 'packaging-lines'
  | 'order-tracker'
  | 'equipment';

// ── Packaging Orders ─────────────────────────────────────────
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

// ── Non-Cannabis Inventory ───────────────────────────────────
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

// ── Metrics ──────────────────────────────────────────────────
export interface PackagingMetrics {
  totalOrders: number;
  completedToday: number;
  inProgress: number;
  materialShortages: number;
  avgPackagesPerHour: number;
  topSKU: string;
}

// ── Packaging Lines ──────────────────────────────────────────
export type PackagingLineStatus = 'running' | 'idle' | 'maintenance' | 'down';

export interface PackagingLine {
  id: string;
  name: string;
  category: 'flower' | 'preroll' | 'vaporizer' | 'concentrate' | 'edible' | 'beverage';
  status: PackagingLineStatus;
  currentOrderId: string | null;
  currentOrderProduct: string | null;
  packagesCompletedToday: number;
  packagesTarget: number;
  workers: string[];
  equipmentIds: string[];
  steps: string[];
}

// ── Equipment ────────────────────────────────────────────────
export type PackagingEquipmentStatus = 'operational' | 'needs-maintenance' | 'down' | 'in-maintenance';

export interface PackagingEquipment {
  id: string;
  name: string;
  packagingLineId: string;
  packagingLineName: string;
  status: PackagingEquipmentStatus;
  lastMaintained: string;
  nextMaintenanceDue: string;
  hoursSinceLastMaintenance: number;
  lifetimeHours: number;
  notes?: string;
}

// ── Alerts ───────────────────────────────────────────────────
export interface PackagingAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  relatedId?: string;
}

// ── Throughput ───────────────────────────────────────────────
export interface PackagingThroughputDataPoint {
  date: string;
  units: number;
  target: number;
}
