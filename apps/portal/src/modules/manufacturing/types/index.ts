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
}

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
}

export interface ManufacturingMetrics {
  totalWorkOrders: number;
  completedToday: number;
  inProgress: number;
  avgCompletionTime: number;
  throughputRate: number;
  bottleneckState: string;
  capacityUtilization: number;
}

export interface PipelineState {
  state: string;
  stateCode: string;
  division: string;
  count: number;
  color: string;
  category: string;
}

export interface ProductionLine {
  id: string;
  name: string;
  category: string;
  states: string[];
  currentBatches: number;
  capacity: number;
}
