// ── View ────────────────────────────────────────────────────
export type ManufacturingView =
  | 'dashboard'
  | 'work-orders'
  | 'production-lines'
  | 'batch-tracker'
  | 'equipment';

// ── Work Orders ─────────────────────────────────────────────
export interface WorkOrderMaterial {
  name: string;
  type: 'cannabis' | 'non-cannabis' | 'labor';
  quantity: number;
  unit: string;
  available: boolean;
}

export interface WorkOrder {
  id: string;
  type: 'flower' | 'preroll' | 'vaporizer' | 'concentrate' | 'edible' | 'beverage';
  status: 'queued' | 'in-progress' | 'completed' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  assignee: string;
  assigneeRole: string;
  estimatedMinutes: number;
  actualMinutes?: number;
  batchNumber: string;
  inputMaterials: WorkOrderMaterial[];
  outputProduct: string;
  outputQuantity: number;
  outputUnit: string;
  readinessStateFrom: string;
  readinessStateTo: string;
  linkedOrderIds: string[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  // Extended fields
  dueDate: string;
  progress: number; // 0-100
  workers: string[];
  sourceOrderId?: string;
  bomStatus: 'ready' | 'partial' | 'waiting';
  pipelineType: string;
}

// ── Batches ─────────────────────────────────────────────────
export interface ManufacturingBatch {
  id: string;
  batchNumber: string;
  category: 'flower' | 'preroll' | 'vaporizer' | 'concentrate' | 'edible' | 'beverage';
  strainName: string;
  currentState: string;
  previousStates: { state: string; timestamp: string; operator: string }[];
  quantity: number;
  unit: string;
  startDate: string;
  estimatedCompletion?: string;
  location: string;
  // Extended fields
  pipelineStates: string[]; // full ordered state list for this pipeline
  productName: string;
  yieldInput?: number;
  yieldInputUnit?: string;
  yieldOutput?: number;
  yieldOutputUnit?: string;
  yieldPercent?: number;
  coaStatus: 'not-required' | 'pending' | 'submitted' | 'passed' | 'failed';
  notes?: string;
}

// ── Metrics ─────────────────────────────────────────────────
export interface ManufacturingMetrics {
  totalWorkOrders: number;
  completedToday: number;
  inProgress: number;
  avgCompletionTime: number;
  throughputRate: number;
  bottleneckState: string;
  capacityUtilization: number;
}

// ── Pipeline States ─────────────────────────────────────────
export interface PipelineState {
  state: string;
  stateCode: string;
  division: string;
  count: number;
  color: string;
  category: string;
}

// ── Equipment ───────────────────────────────────────────────
export type EquipmentStatus = 'operational' | 'needs-maintenance' | 'down' | 'in-maintenance';

export interface Equipment {
  id: string;
  name: string;
  productionLineId: string;
  productionLineName: string;
  status: EquipmentStatus;
  lastMaintained: string;
  nextMaintenanceDue: string;
  hoursSinceLastMaintenance: number;
  lifetimeHours: number;
  notes?: string;
}

// ── Production Lines ────────────────────────────────────────
export type ProductionLineStatus = 'running' | 'idle' | 'maintenance' | 'down';

export interface ProductionLine {
  id: string;
  name: string;
  category: string;
  states: string[];
  currentBatches: number;
  capacity: number;
  // Extended fields
  status: ProductionLineStatus;
  currentWorkOrderId: string | null;
  currentBatchName: string | null;
  throughputToday: number;
  throughputTarget: number;
  workers: string[];
  equipmentIds: string[];
}

// ── Dashboard ───────────────────────────────────────────────
export interface ThroughputDataPoint {
  date: string;
  units: number;
  target: number;
}

export interface ProductionDistribution {
  category: string;
  percentage: number;
  color: string;
}

export interface ManufacturingAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  relatedId?: string;
}
