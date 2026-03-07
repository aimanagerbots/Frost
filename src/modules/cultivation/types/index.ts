// Cultivation Domain Types

export type RoomStatus = 'active' | 'drying' | 'empty' | 'cleaning';
export type GrowStage = 'veg' | 'flower' | 'harvest' | 'dry';
export type EnvironmentStatus = 'optimal' | 'warning' | 'critical';

export interface RoomEnvironment {
  temperature: number; // °F
  humidity: number; // %
  co2: number; // ppm
  lightHours: number;
  vpd: number; // kPa
  status: EnvironmentStatus;
}

export interface GrowRoom {
  id: string;
  name: string;
  status: RoomStatus;
  strainName: string;
  plantCount: number;
  stage: GrowStage;
  dayInStage: number;
  expectedStageDays: number;
  environment: RoomEnvironment;
  estimatedHarvest?: string;
  estimatedYield?: string;
  environmentHistory: EnvironmentSnapshot[];
}

export interface EnvironmentSnapshot {
  timestamp: string;
  temperature: number;
  humidity: number;
  co2: number;
}

export interface HarvestRecord {
  id: string;
  roomId: string;
  strainName: string;
  harvestDate: string;
  wetWeight: number; // grams
  dryWeight: number; // grams
  dryRatio: number; // percentage moisture loss
  plantCount: number;
  yieldPerPlant: number; // grams
  handoffDate?: string;
  status: 'upcoming' | 'drying' | 'complete';
}

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
}
