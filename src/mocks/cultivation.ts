import type {
  GrowRoom,
  HarvestRecord,
  CultivationMetrics,
  EnvironmentSnapshot,
} from '@/modules/cultivation/types';

// --- Environment History Generator ---
function generateEnvHistory(
  baseTemp: number,
  baseHumidity: number,
  baseCo2: number
): EnvironmentSnapshot[] {
  const snapshots: EnvironmentSnapshot[] = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const ts = new Date(now);
    ts.setHours(now.getHours() - i);
    snapshots.push({
      timestamp: ts.toISOString(),
      temperature: baseTemp + (Math.sin(i * 0.5) * 3),
      humidity: baseHumidity + (Math.cos(i * 0.4) * 4),
      co2: baseCo2 + (Math.sin(i * 0.3) * 80),
    });
  }
  return snapshots;
}

// --- Grow Rooms ---
const growRooms: GrowRoom[] = [
  {
    id: 'room-1',
    name: 'Bloom A',
    status: 'active',
    strainName: 'Wedding Cake',
    plantCount: 120,
    stage: 'flower',
    dayInStage: 42,
    expectedStageDays: 63,
    environment: {
      temperature: 76,
      humidity: 52,
      co2: 1100,
      lightHours: 12,
      vpd: 1.2,
      status: 'optimal',
    },
    estimatedHarvest: getDateOffset(21),
    estimatedYield: '9.4 kg',
    environmentHistory: generateEnvHistory(76, 52, 1100),
  },
  {
    id: 'room-2',
    name: 'Bloom B',
    status: 'active',
    strainName: 'Blue Dream',
    plantCount: 100,
    stage: 'flower',
    dayInStage: 28,
    expectedStageDays: 60,
    environment: {
      temperature: 78,
      humidity: 68,
      co2: 1050,
      lightHours: 12,
      vpd: 0.9,
      status: 'warning',
    },
    estimatedHarvest: getDateOffset(32),
    estimatedYield: '7.8 kg',
    environmentHistory: generateEnvHistory(78, 68, 1050),
  },
  {
    id: 'room-3',
    name: 'Bloom C',
    status: 'active',
    strainName: 'Gelato',
    plantCount: 110,
    stage: 'flower',
    dayInStage: 56,
    expectedStageDays: 61,
    environment: {
      temperature: 74,
      humidity: 48,
      co2: 1150,
      lightHours: 12,
      vpd: 1.3,
      status: 'optimal',
    },
    estimatedHarvest: getDateOffset(5),
    estimatedYield: '8.6 kg',
    environmentHistory: generateEnvHistory(74, 48, 1150),
  },
  {
    id: 'room-4',
    name: 'Veg A',
    status: 'active',
    strainName: 'GSC',
    plantCount: 150,
    stage: 'veg',
    dayInStage: 21,
    expectedStageDays: 35,
    environment: {
      temperature: 80,
      humidity: 62,
      co2: 1000,
      lightHours: 18,
      vpd: 1.0,
      status: 'optimal',
    },
    environmentHistory: generateEnvHistory(80, 62, 1000),
  },
  {
    id: 'room-5',
    name: 'Veg B',
    status: 'active',
    strainName: 'Zkittlez',
    plantCount: 130,
    stage: 'veg',
    dayInStage: 14,
    expectedStageDays: 35,
    environment: {
      temperature: 79,
      humidity: 60,
      co2: 980,
      lightHours: 18,
      vpd: 1.1,
      status: 'optimal',
    },
    environmentHistory: generateEnvHistory(79, 60, 980),
  },
  {
    id: 'room-6',
    name: 'Dry Room 1',
    status: 'drying',
    strainName: 'OG Kush',
    plantCount: 95,
    stage: 'dry',
    dayInStage: 7,
    expectedStageDays: 14,
    environment: {
      temperature: 68,
      humidity: 55,
      co2: 800,
      lightHours: 0,
      vpd: 0.8,
      status: 'optimal',
    },
    environmentHistory: generateEnvHistory(68, 55, 800),
  },
  {
    id: 'room-7',
    name: 'Dry Room 2',
    status: 'drying',
    strainName: 'Jack Herer',
    plantCount: 85,
    stage: 'dry',
    dayInStage: 12,
    expectedStageDays: 14,
    environment: {
      temperature: 69,
      humidity: 53,
      co2: 810,
      lightHours: 0,
      vpd: 0.85,
      status: 'optimal',
    },
    environmentHistory: generateEnvHistory(69, 53, 810),
  },
  {
    id: 'room-8',
    name: 'Clone Room',
    status: 'active',
    strainName: 'Mixed Strains',
    plantCount: 200,
    stage: 'veg',
    dayInStage: 7,
    expectedStageDays: 21,
    environment: {
      temperature: 78,
      humidity: 65,
      co2: 900,
      lightHours: 18,
      vpd: 0.9,
      status: 'optimal',
    },
    environmentHistory: generateEnvHistory(78, 65, 900),
  },
];

// --- Harvest Records ---
const harvestRecords: HarvestRecord[] = [
  {
    id: 'harvest-1',
    roomId: 'room-3',
    strainName: 'Gelato',
    harvestDate: getDateOffset(5),
    wetWeight: 0,
    dryWeight: 0,
    dryRatio: 0,
    plantCount: 110,
    yieldPerPlant: 0,
    status: 'upcoming',
  },
  {
    id: 'harvest-2',
    roomId: 'room-7',
    strainName: 'Jack Herer',
    harvestDate: getDateOffset(-12),
    wetWeight: 34200,
    dryWeight: 0,
    dryRatio: 0,
    plantCount: 85,
    yieldPerPlant: 0,
    status: 'drying',
  },
  {
    id: 'harvest-3',
    roomId: 'room-6',
    strainName: 'OG Kush',
    harvestDate: getDateOffset(-7),
    wetWeight: 38400,
    dryWeight: 0,
    dryRatio: 0,
    plantCount: 95,
    yieldPerPlant: 0,
    status: 'drying',
  },
  {
    id: 'harvest-4',
    roomId: 'room-1',
    strainName: 'Purple Punch',
    harvestDate: getDateOffset(-30),
    wetWeight: 42100,
    dryWeight: 9680,
    dryRatio: 77,
    plantCount: 115,
    yieldPerPlant: 84,
    status: 'complete',
    handoffDate: getDateOffset(-16),
  },
  {
    id: 'harvest-5',
    roomId: 'room-2',
    strainName: 'Gorilla Glue',
    harvestDate: getDateOffset(-52),
    wetWeight: 35800,
    dryWeight: 8590,
    dryRatio: 76,
    plantCount: 100,
    yieldPerPlant: 86,
    status: 'complete',
    handoffDate: getDateOffset(-38),
  },
  {
    id: 'harvest-6',
    roomId: 'room-3',
    strainName: 'Sour Diesel',
    harvestDate: getDateOffset(-75),
    wetWeight: 39200,
    dryWeight: 8820,
    dryRatio: 77.5,
    plantCount: 108,
    yieldPerPlant: 82,
    status: 'complete',
    handoffDate: getDateOffset(-61),
  },
  {
    id: 'harvest-7',
    roomId: 'room-1',
    strainName: 'Northern Lights',
    harvestDate: getDateOffset(-95),
    wetWeight: 44600,
    dryWeight: 10700,
    dryRatio: 76,
    plantCount: 120,
    yieldPerPlant: 89,
    status: 'complete',
    handoffDate: getDateOffset(-81),
  },
  {
    id: 'harvest-8',
    roomId: 'room-2',
    strainName: 'White Widow',
    harvestDate: getDateOffset(-118),
    wetWeight: 31000,
    dryWeight: 6820,
    dryRatio: 78,
    plantCount: 90,
    yieldPerPlant: 76,
    status: 'complete',
    handoffDate: getDateOffset(-104),
  },
  {
    id: 'harvest-9',
    roomId: 'room-3',
    strainName: 'Tangie',
    harvestDate: getDateOffset(-140),
    wetWeight: 36400,
    dryWeight: 8370,
    dryRatio: 77,
    plantCount: 105,
    yieldPerPlant: 80,
    status: 'complete',
    handoffDate: getDateOffset(-126),
  },
  {
    id: 'harvest-10',
    roomId: 'room-1',
    strainName: 'Runtz',
    harvestDate: getDateOffset(-162),
    wetWeight: 41800,
    dryWeight: 9610,
    dryRatio: 77,
    plantCount: 118,
    yieldPerPlant: 81,
    status: 'complete',
    handoffDate: getDateOffset(-148),
  },
  {
    id: 'harvest-11',
    roomId: 'room-2',
    strainName: 'MAC',
    harvestDate: getDateOffset(-185),
    wetWeight: 33600,
    dryWeight: 8060,
    dryRatio: 76,
    plantCount: 98,
    yieldPerPlant: 82,
    status: 'complete',
    handoffDate: getDateOffset(-171),
  },
  {
    id: 'harvest-12',
    roomId: 'room-3',
    strainName: 'Dosidos',
    harvestDate: getDateOffset(-210),
    wetWeight: 37500,
    dryWeight: 8250,
    dryRatio: 78,
    plantCount: 102,
    yieldPerPlant: 81,
    status: 'complete',
    handoffDate: getDateOffset(-196),
  },
];

// --- Helper ---
function getDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// --- Helpers ---
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Export Functions ---
export async function getGrowRooms(): Promise<GrowRoom[]> {
  await delay(300);
  return growRooms;
}

export async function getGrowRoom(id: string): Promise<GrowRoom | undefined> {
  await delay(300);
  return growRooms.find((r) => r.id === id);
}

export async function getHarvestRecords(): Promise<HarvestRecord[]> {
  await delay(300);
  return harvestRecords;
}

export async function getCultivationMetrics(): Promise<CultivationMetrics> {
  await delay(300);
  const activeRooms = growRooms.filter((r) => r.status === 'active' || r.status === 'drying').length;
  const flowerRooms = growRooms.filter((r) => r.stage === 'flower');
  const vegRooms = growRooms.filter((r) => r.stage === 'veg');
  const completedHarvests = harvestRecords.filter((h) => h.status === 'complete');
  const avgYield = completedHarvests.length
    ? Math.round(completedHarvests.reduce((sum, h) => sum + h.yieldPerPlant, 0) / completedHarvests.length)
    : 0;
  const envAlerts = growRooms.filter((r) => r.environment.status !== 'optimal').length;
  const upcoming = harvestRecords.find((h) => h.status === 'upcoming');

  return {
    activeRooms,
    totalPlants: growRooms.reduce((sum, r) => sum + r.plantCount, 0),
    nextHarvest: upcoming?.harvestDate ?? 'N/A',
    nextHarvestStrain: upcoming?.strainName ?? 'N/A',
    daysToNextHarvest: upcoming ? Math.max(0, Math.ceil((new Date(upcoming.harvestDate).getTime() - Date.now()) / 86400000)) : 0,
    avgYieldPerPlant: avgYield,
    environmentAlerts: envAlerts,
    plantsInFlower: flowerRooms.reduce((sum, r) => sum + r.plantCount, 0),
    plantsInVeg: vegRooms.reduce((sum, r) => sum + r.plantCount, 0),
  };
}
