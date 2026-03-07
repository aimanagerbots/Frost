// ─── Room & Environment ────────────────────────────────────────

export type RoomStatus = 'active' | 'drying' | 'empty' | 'cleaning' | 'transition';

export type GrowStage = 'clone' | 'veg' | 'flower' | 'harvest' | 'dry' | 'cure' | 'propagation' | 'mother' | 'maintenance';

export type EnvironmentStatus = 'optimal' | 'warning' | 'critical';

export type AlertSource = 'trollmaster' | 'growlink' | 'anderson' | 'system';

export interface RoomEnvironment {
  temperature: number;
  temperatureTarget: number;
  temperatureMin: number;
  temperatureMax: number;
  humidity: number;
  humidityTarget: number;
  humidityMin: number;
  humidityMax: number;
  co2: number;
  co2Target: number;
  co2Min: number;
  co2Max: number;
  lightHours: number;
  lightIntensity: number;
  vpd: number;
  vpdTarget: number;
  vpdMin: number;
  vpdMax: number;
  ppfd: number;
  ppfdTarget: number;
  ppfdMin: number;
  ppfdMax: number;
  dli: number;
  dliTarget: number;
  dliMin: number;
  dliMax: number;
  darkHours: number;
  waterEC?: number;
  waterPH?: number;
  soilMoisture?: number;
  status: EnvironmentStatus;
}

export interface EnvironmentReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  co2: number;
  vpd: number;
  lightIntensity: number;
  ppfd: number;
}

// ─── Irrigation & Fertigation (GrowLink) ─────────────────────

export interface IrrigationData {
  ph: number;
  phMin: number;
  phMax: number;
  ec: number;
  ecMin: number;
  ecMax: number;
  runoffPh: number;
  runoffPhMin: number;
  runoffPhMax: number;
  runoffEc: number;
  runoffEcMin: number;
  runoffEcMax: number;
  waterTemp: number;
  waterTempMin: number;
  waterTempMax: number;
  flowRate: number;
  reservoirLevel: number;
  reservoirCapacity: number;
  lastIrrigationTime: string;
  nextIrrigationTime: string;
  irrigationIntervalHours: number;
}

export interface IrrigationEvent {
  id: string;
  roomId: string;
  startTime: string;
  durationMinutes: number;
  volumeGallons: number;
  ph: number;
  ec: number;
  type: 'scheduled' | 'manual';
  recipeName: string;
  completed: boolean;
}

export interface NutrientComponent {
  name: string;
  amount: string;
  brand: string;
}

export interface NutrientRecipe {
  id: string;
  name: string;
  stage: GrowStage;
  components: NutrientComponent[];
  targetEc: number;
  targetPh: number;
  npk: string;
  notes: string;
}

// ─── HVAC System (H.E. Anderson) ─────────────────────────────

export type EquipmentStatus = 'running' | 'idle' | 'fault';

export interface HvacData {
  supplyAirTemp: number;
  returnAirTemp: number;
  supplyAirTempTarget: number;
  damperPosition: number;
  damperMode: 'auto' | 'manual';
  compressorStatus: EquipmentStatus;
  compressorStage: number;
  compressorStagesTotal: number;
  dehumidifierStatus: EquipmentStatus;
  dehumidifierCapacity: number;
  energyUsageKwh: number;
  filterLifePercent: number;
  filterReplacementDate?: string;
  lastMaintenanceDate: string;
}

// ─── Alerts ──────────────────────────────────────────────────

export type AlertType =
  | 'temperature'
  | 'humidity'
  | 'co2'
  | 'vpd'
  | 'light'
  | 'pest'
  | 'disease'
  | 'nutrient'
  | 'equipment'
  | 'schedule'
  | 'ph'
  | 'reservoir'
  | 'filter'
  | 'irrigation';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface RoomAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  source: AlertSource;
  message: string;
  metric?: string;
  currentValue?: string;
  threshold?: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
}

export interface GrowRoom {
  id: string;
  name: string;
  status: RoomStatus;
  strainId: string;
  strainName: string;
  plantCount: number;
  stage: GrowStage;
  dayInStage: number;
  totalDaysExpected: number;
  environment: RoomEnvironment;
  environmentHistory: EnvironmentReading[];
  estimatedHarvest?: string;
  estimatedYield?: string;
  layout?: { rows: number; columns: number };
  notes?: string;
  alerts: RoomAlert[];
  irrigation?: IrrigationData;
  hvac?: HvacData;
  capacity?: number;
}

// ─── Harvest Records ───────────────────────────────────────────

export interface HarvestRecord {
  id: string;
  roomId: string;
  strainName: string;
  harvestDate: string;
  wetWeight: number;
  dryWeight: number;
  dryRatio: number;
  plantCount: number;
  yieldPerPlant: number;
  handoffDate?: string;
  status: 'upcoming' | 'drying' | 'complete';
}

// ─── Cultivation Tasks (Kanban + Calendar) ───────────────────

export type TaskCategory =
  | 'feeding'
  | 'ipm'
  | 'defoliation'
  | 'training'
  | 'transplant'
  | 'flush'
  | 'harvest-prep'
  | 'environmental'
  | 'cleaning'
  | 'inspection';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface CultivationTask {
  id: string;
  roomId: string;
  title: string;
  description: string;
  category: TaskCategory;
  stage: GrowStage;
  weekOfStage: number;
  dayOfWeek: number;
  recurring: boolean;
  assignee?: string;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  tags?: string[];
}

// ─── Grow Supplies ─────────────────────────────────────────────

export type SupplyCategory =
  | 'nutrient'
  | 'soil-media'
  | 'ipm'
  | 'equipment'
  | 'container'
  | 'environmental'
  | 'cleaning'
  | 'other';

export type SupplyStatus = 'in-stock' | 'low' | 'critical' | 'out-of-stock';

export interface GrowSupply {
  id: string;
  name: string;
  category: SupplyCategory;
  subcategory?: string;
  currentStock: number;
  unit: string;
  reorderPoint: number;
  reorderQuantity: number;
  costPerUnit: number;
  supplier: string;
  lastOrderDate?: string;
  status: SupplyStatus;
  mixRatio?: string;
  applicationFrequency?: string;
}

// ─── Genetics Library ──────────────────────────────────────────

export type StrainType = 'indica' | 'sativa' | 'hybrid' | 'cbd' | 'balanced';

export type MotherPlantStatus = 'active' | 'retired' | 'archived';

export type StrainDifficulty = 'easy' | 'moderate' | 'advanced';

export interface Strain {
  id: string;
  name: string;
  breeder: string;
  type: StrainType;
  lineage: string;
  flowerTimeDays: number;
  vegTimeDays: number;
  estimatedYieldPerPlant: string;
  thcRange: string;
  cbdRange: string;
  terpeneProfile: string[];
  difficulty: StrainDifficulty;
  motherPlantStatus: MotherPlantStatus;
  cloneAvailability: number;
  phenoNotes?: string;
  growNotes?: string;
  feedingSchedule?: string;
  ipmNotes?: string;
  imageUrl?: string;
  lastHarvest?: string;
  avgYieldActual?: string;
}

// ─── AI Chat ───────────────────────────────────────────────────

export type CultivationChatMode = 'cultivation-ai';

export interface CultivationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language?: 'en' | 'es';
  translatedContent?: string;
}

export interface CultivationSuggestion {
  id: string;
  text: string;
  language?: 'en' | 'es';
}

// ─── Metrics ───────────────────────────────────────────────────

export interface CultivationMetrics {
  activeRooms: number;
  totalPlants: number;
  nextHarvest: string;
  nextHarvestStrain: string;
  daysToNextHarvest: number;
  avgYieldPerPlant: number;
  environmentAlerts: number;
  plantsInFlower: number;
  plantsInVeg: number;
  geneticsCount: number;
  tasksToday: number;
}

// ─── View State ────────────────────────────────────────────────

export type CultivationView =
  | 'environment'
  | 'tasks'
  | 'calendar'
  | 'supplies'
  | 'genetics'
  | 'chat';
