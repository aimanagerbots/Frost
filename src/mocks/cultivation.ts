import type {
  GrowRoom,
  HarvestRecord,
  CultivationMetrics,
  EnvironmentReading,
  RoomAlert,
  CultivationTask,
  GrowSupply,
  Strain,
  CultivationMessage,
  CultivationSuggestion,
  GrowStage,
} from '@/modules/cultivation/types';

// ─── Helpers ───────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function generateEnvHistory(
  baseTemp: number,
  baseHumidity: number,
  baseCo2: number,
  baseVpd: number,
  basePpfd: number
): EnvironmentReading[] {
  const readings: EnvironmentReading[] = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const ts = new Date(now);
    ts.setHours(now.getHours() - i);
    readings.push({
      timestamp: ts.toISOString(),
      temperature: baseTemp + Math.sin(i * 0.5) * 3,
      humidity: baseHumidity + Math.cos(i * 0.4) * 4,
      co2: baseCo2 + Math.sin(i * 0.3) * 80,
      vpd: +(baseVpd + Math.sin(i * 0.5) * 0.15).toFixed(2),
      lightIntensity: i >= 6 && i <= 18 ? basePpfd + Math.sin(i * 0.2) * 30 : 0,
    });
  }
  return readings;
}

// ─── Grow Rooms (8) ────────────────────────────────────────────

const growRooms: GrowRoom[] = [
  {
    id: 'room-1',
    name: 'Bloom A',
    status: 'active',
    strainId: 'strain-1',
    strainName: 'Wedding Cake',
    plantCount: 120,
    stage: 'flower',
    dayInStage: 42,
    totalDaysExpected: 63,
    layout: { rows: 6, columns: 20 },
    environment: {
      temperature: 78, temperatureTarget: 78,
      humidity: 52, humidityTarget: 50,
      co2: 1100, co2Target: 1200,
      lightHours: 12, lightIntensity: 850,
      vpd: 1.35, vpdTarget: 1.3,
      waterEC: 2.2, waterPH: 6.1, soilMoisture: 42,
      status: 'optimal',
    },
    estimatedHarvest: getDateOffset(21),
    estimatedYield: '9.6 kg',
    notes: 'Heavy resin production starting week 5. Purple hues appearing on upper canopy.',
    alerts: [],
    environmentHistory: generateEnvHistory(78, 52, 1100, 1.35, 850),
  },
  {
    id: 'room-2',
    name: 'Bloom B',
    status: 'active',
    strainId: 'strain-2',
    strainName: 'Blue Dream',
    plantCount: 100,
    stage: 'flower',
    dayInStage: 28,
    totalDaysExpected: 56,
    layout: { rows: 5, columns: 20 },
    environment: {
      temperature: 80, temperatureTarget: 78,
      humidity: 68, humidityTarget: 55,
      co2: 950, co2Target: 1100,
      lightHours: 12, lightIntensity: 800,
      vpd: 0.95, vpdTarget: 1.2,
      waterEC: 2.0, waterPH: 6.2, soilMoisture: 55,
      status: 'warning',
    },
    estimatedHarvest: getDateOffset(28),
    estimatedYield: '8.0 kg',
    notes: 'Dehumidifier in this room needs inspection. Plants stretching more than expected.',
    alerts: [
      {
        id: 'alert-1',
        type: 'humidity',
        severity: 'critical',
        message: 'Humidity critically high at 68% — target is 55%. Check dehumidifier Room 2.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        acknowledged: false,
      },
      {
        id: 'alert-2',
        type: 'vpd',
        severity: 'warning',
        message: 'VPD below optimal range — currently 0.95 kPa, target 1.2 kPa.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        acknowledged: false,
      },
    ],
    environmentHistory: generateEnvHistory(80, 68, 950, 0.95, 800),
  },
  {
    id: 'room-3',
    name: 'Bloom C',
    status: 'active',
    strainId: 'strain-3',
    strainName: 'Gelato',
    plantCount: 110,
    stage: 'flower',
    dayInStage: 56,
    totalDaysExpected: 63,
    layout: { rows: 5, columns: 22 },
    environment: {
      temperature: 76, temperatureTarget: 77,
      humidity: 48, humidityTarget: 48,
      co2: 1150, co2Target: 1200,
      lightHours: 12, lightIntensity: 850,
      vpd: 1.35, vpdTarget: 1.3,
      waterEC: 0.5, waterPH: 6.5, soilMoisture: 35,
      status: 'optimal',
    },
    estimatedHarvest: getDateOffset(7),
    estimatedYield: '8.8 kg',
    notes: 'Flush started day 54. Trichomes 60% milky, 10% amber. Monitoring daily.',
    alerts: [
      {
        id: 'alert-3',
        type: 'schedule',
        severity: 'info',
        message: 'Harvest window opens in 5 days — schedule trim team.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        acknowledged: false,
      },
    ],
    environmentHistory: generateEnvHistory(76, 48, 1150, 1.35, 850),
  },
  {
    id: 'room-4',
    name: 'Veg A',
    status: 'active',
    strainId: 'strain-4',
    strainName: 'GSC',
    plantCount: 150,
    stage: 'veg',
    dayInStage: 21,
    totalDaysExpected: 35,
    layout: { rows: 6, columns: 25 },
    environment: {
      temperature: 80, temperatureTarget: 80,
      humidity: 62, humidityTarget: 60,
      co2: 1200, co2Target: 1200,
      lightHours: 18, lightIntensity: 600,
      vpd: 1.1, vpdTarget: 1.0,
      waterEC: 1.8, waterPH: 6.0, soilMoisture: 50,
      status: 'optimal',
    },
    notes: 'Topped at day 14. SCROG net installed day 18. Ready for defoliation.',
    alerts: [],
    environmentHistory: generateEnvHistory(80, 62, 1200, 1.1, 600),
  },
  {
    id: 'room-5',
    name: 'Veg B',
    status: 'active',
    strainId: 'strain-5',
    strainName: 'Zkittlez',
    plantCount: 130,
    stage: 'veg',
    dayInStage: 14,
    totalDaysExpected: 35,
    layout: { rows: 5, columns: 26 },
    environment: {
      temperature: 79, temperatureTarget: 80,
      humidity: 60, humidityTarget: 60,
      co2: 1180, co2Target: 1200,
      lightHours: 18, lightIntensity: 600,
      vpd: 1.05, vpdTarget: 1.0,
      waterEC: 1.6, waterPH: 6.0, soilMoisture: 48,
      status: 'optimal',
    },
    notes: 'Topping scheduled for day 14-16. Strong root development.',
    alerts: [],
    environmentHistory: generateEnvHistory(79, 60, 1180, 1.05, 600),
  },
  {
    id: 'room-6',
    name: 'Dry Room 1',
    status: 'drying',
    strainId: 'strain-6',
    strainName: 'OG Kush',
    plantCount: 95,
    stage: 'dry',
    dayInStage: 7,
    totalDaysExpected: 12,
    environment: {
      temperature: 62, temperatureTarget: 60,
      humidity: 58, humidityTarget: 60,
      co2: 400, co2Target: 400,
      lightHours: 0, lightIntensity: 0,
      vpd: 0.55, vpdTarget: 0.5,
      status: 'optimal',
    },
    notes: 'Stems starting to snap. Check daily.',
    alerts: [],
    environmentHistory: generateEnvHistory(62, 58, 400, 0.55, 0),
  },
  {
    id: 'room-7',
    name: 'Dry Room 2',
    status: 'drying',
    strainId: 'strain-7',
    strainName: 'Jack Herer',
    plantCount: 85,
    stage: 'dry',
    dayInStage: 12,
    totalDaysExpected: 12,
    environment: {
      temperature: 61, temperatureTarget: 60,
      humidity: 56, humidityTarget: 60,
      co2: 400, co2Target: 400,
      lightHours: 0, lightIntensity: 0,
      vpd: 0.52, vpdTarget: 0.5,
      status: 'optimal',
    },
    notes: 'Dry complete. Ready for buck and handoff to manufacturing.',
    alerts: [
      {
        id: 'alert-4',
        type: 'schedule',
        severity: 'info',
        message: 'Dry complete — ready for handoff to manufacturing.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        acknowledged: false,
      },
    ],
    environmentHistory: generateEnvHistory(61, 56, 400, 0.52, 0),
  },
  {
    id: 'room-8',
    name: 'Clone Room',
    status: 'active',
    strainId: 'strain-mixed',
    strainName: 'Mixed Strains',
    plantCount: 200,
    stage: 'clone',
    dayInStage: 7,
    totalDaysExpected: 14,
    layout: { rows: 4, columns: 50 },
    environment: {
      temperature: 78, temperatureTarget: 78,
      humidity: 75, humidityTarget: 75,
      co2: 800, co2Target: 800,
      lightHours: 18, lightIntensity: 200,
      vpd: 0.6, vpdTarget: 0.6,
      soilMoisture: 70,
      status: 'optimal',
    },
    notes: 'Wedding Cake x80, Blue Dream x60, Gelato x60. Dome covers on. 90% root rate so far.',
    alerts: [],
    environmentHistory: generateEnvHistory(78, 75, 800, 0.6, 200),
  },
];

// ─── Harvest Records (12) ──────────────────────────────────────

const harvestRecords: HarvestRecord[] = [
  { id: 'harvest-1', roomId: 'room-3', strainName: 'Gelato', harvestDate: getDateOffset(7), wetWeight: 0, dryWeight: 0, dryRatio: 0, plantCount: 110, yieldPerPlant: 0, status: 'upcoming' },
  { id: 'harvest-2', roomId: 'room-7', strainName: 'Jack Herer', harvestDate: getDateOffset(-12), wetWeight: 34200, dryWeight: 0, dryRatio: 0, plantCount: 85, yieldPerPlant: 0, status: 'drying' },
  { id: 'harvest-3', roomId: 'room-6', strainName: 'OG Kush', harvestDate: getDateOffset(-7), wetWeight: 38400, dryWeight: 0, dryRatio: 0, plantCount: 95, yieldPerPlant: 0, status: 'drying' },
  { id: 'harvest-4', roomId: 'room-1', strainName: 'Purple Punch', harvestDate: getDateOffset(-30), wetWeight: 42100, dryWeight: 9680, dryRatio: 77, plantCount: 115, yieldPerPlant: 84, status: 'complete', handoffDate: getDateOffset(-16) },
  { id: 'harvest-5', roomId: 'room-2', strainName: 'Gorilla Glue', harvestDate: getDateOffset(-52), wetWeight: 35800, dryWeight: 8590, dryRatio: 76, plantCount: 100, yieldPerPlant: 86, status: 'complete', handoffDate: getDateOffset(-38) },
  { id: 'harvest-6', roomId: 'room-3', strainName: 'Sour Diesel', harvestDate: getDateOffset(-75), wetWeight: 39200, dryWeight: 8820, dryRatio: 77.5, plantCount: 108, yieldPerPlant: 82, status: 'complete', handoffDate: getDateOffset(-61) },
  { id: 'harvest-7', roomId: 'room-1', strainName: 'Northern Lights', harvestDate: getDateOffset(-95), wetWeight: 44600, dryWeight: 10700, dryRatio: 76, plantCount: 120, yieldPerPlant: 89, status: 'complete', handoffDate: getDateOffset(-81) },
  { id: 'harvest-8', roomId: 'room-2', strainName: 'White Widow', harvestDate: getDateOffset(-118), wetWeight: 31000, dryWeight: 6820, dryRatio: 78, plantCount: 90, yieldPerPlant: 76, status: 'complete', handoffDate: getDateOffset(-104) },
  { id: 'harvest-9', roomId: 'room-3', strainName: 'Tangie', harvestDate: getDateOffset(-140), wetWeight: 36400, dryWeight: 8370, dryRatio: 77, plantCount: 105, yieldPerPlant: 80, status: 'complete', handoffDate: getDateOffset(-126) },
  { id: 'harvest-10', roomId: 'room-1', strainName: 'Runtz', harvestDate: getDateOffset(-162), wetWeight: 41800, dryWeight: 9610, dryRatio: 77, plantCount: 118, yieldPerPlant: 81, status: 'complete', handoffDate: getDateOffset(-148) },
  { id: 'harvest-11', roomId: 'room-2', strainName: 'MAC', harvestDate: getDateOffset(-185), wetWeight: 33600, dryWeight: 8060, dryRatio: 76, plantCount: 98, yieldPerPlant: 82, status: 'complete', handoffDate: getDateOffset(-171) },
  { id: 'harvest-12', roomId: 'room-3', strainName: 'Dosidos', harvestDate: getDateOffset(-210), wetWeight: 37500, dryWeight: 8250, dryRatio: 78, plantCount: 102, yieldPerPlant: 81, status: 'complete', handoffDate: getDateOffset(-196) },
];

// ─── Genetics Library (10 strains) ─────────────────────────────

const strains: Strain[] = [
  {
    id: 'strain-1', name: 'Wedding Cake', breeder: 'Seed Junky Genetics', type: 'hybrid',
    lineage: 'Triangle Mints x Animal Mints', flowerTimeDays: 63, vegTimeDays: 28,
    estimatedYieldPerPlant: '80-100g', thcRange: '25-29%', cbdRange: '<1%',
    terpeneProfile: ['Myrcene', 'Limonene', 'Caryophyllene'],
    difficulty: 'moderate', motherPlantStatus: 'active', cloneAvailability: 24,
    growNotes: 'Dense purple-tinted buds, heavy resin production. Responds well to topping and SCROG. Sensitive to humidity above 55% in late flower.',
    feedingSchedule: 'Heavy feeder. CalMag 5ml/gal, Flora Bloom 8ml/gal weeks 4-7. PK boost weeks 5-7.',
    ipmNotes: 'Moderate PM susceptibility. Preventative Regalia spray every 10 days in veg.',
    phenoNotes: 'Pheno #3 selected for density and trichome coverage. Slight purple fade in final 2 weeks under 75°F nights.',
    lastHarvest: getDateOffset(-30), avgYieldActual: '84g/plant',
  },
  {
    id: 'strain-2', name: 'Blue Dream', breeder: 'DJ Short lineage', type: 'sativa',
    lineage: 'Blueberry x Haze', flowerTimeDays: 56, vegTimeDays: 28,
    estimatedYieldPerPlant: '90-120g', thcRange: '19-24%', cbdRange: '<1%',
    terpeneProfile: ['Myrcene', 'Pinene', 'Caryophyllene'],
    difficulty: 'easy', motherPlantStatus: 'active', cloneAvailability: 18,
    growNotes: 'Vigorous grower, heavy stretcher in flower. Requires strong trellis support. Excellent beginner strain.',
    feedingSchedule: 'Moderate feeder. Standard GH Flora series. Responds well to foliar CalMag in veg.',
    ipmNotes: 'Resistant to most common pests. Occasional aphid pressure — ladybugs recommended.',
    lastHarvest: getDateOffset(-52), avgYieldActual: '86g/plant',
  },
  {
    id: 'strain-3', name: 'Gelato', breeder: 'Sherbinski / Cookie Fam', type: 'hybrid',
    lineage: 'Sunset Sherbet x Thin Mint GSC', flowerTimeDays: 63, vegTimeDays: 28,
    estimatedYieldPerPlant: '70-90g', thcRange: '22-28%', cbdRange: '<1%',
    terpeneProfile: ['Limonene', 'Caryophyllene', 'Humulene'],
    difficulty: 'moderate', motherPlantStatus: 'active', cloneAvailability: 15,
    growNotes: 'Compact structure, excellent for SOG. Beautiful purple and orange coloring. Moderate stretch.',
    feedingSchedule: 'Medium feeder. Slightly lower N in veg than average. PK boost weeks 4-6.',
    ipmNotes: 'Watch for botrytis in dense colas during late flower. Keep humidity below 50% after week 6.',
    lastHarvest: getDateOffset(-75), avgYieldActual: '82g/plant',
  },
  {
    id: 'strain-4', name: 'GSC', breeder: 'Cookie Fam', type: 'hybrid',
    lineage: 'OG Kush x Durban Poison', flowerTimeDays: 63, vegTimeDays: 35,
    estimatedYieldPerPlant: '60-80g', thcRange: '24-28%', cbdRange: '<1%',
    terpeneProfile: ['Caryophyllene', 'Limonene', 'Linalool'],
    difficulty: 'advanced', motherPlantStatus: 'active', cloneAvailability: 20,
    growNotes: 'Slower veg growth, needs longer veg time. Multiple topping recommended. Exceptional resin production.',
    feedingSchedule: 'Heavy feeder in flower. Start PK boost early at week 3. CalMag essential.',
    ipmNotes: 'Moderate spider mite susceptibility. Preventative neem oil in veg. No foliar sprays after week 3 flower.',
    lastHarvest: getDateOffset(-95), avgYieldActual: '72g/plant',
  },
  {
    id: 'strain-5', name: 'Zkittlez', breeder: '3rd Gen Family', type: 'indica',
    lineage: 'Grape Ape x Grapefruit', flowerTimeDays: 56, vegTimeDays: 28,
    estimatedYieldPerPlant: '75-95g', thcRange: '20-24%', cbdRange: '<1%',
    terpeneProfile: ['Linalool', 'Caryophyllene', 'Humulene'],
    difficulty: 'easy', motherPlantStatus: 'active', cloneAvailability: 22,
    growNotes: 'Candy-like aroma. Compact indica structure. Easy to train. Great color development.',
    feedingSchedule: 'Light to moderate feeder. Sensitive to nutrient burn — start at 75% recommended dose.',
    ipmNotes: 'Good natural pest resistance. Strong terpene profile deters most insects.',
    lastHarvest: getDateOffset(-140), avgYieldActual: '80g/plant',
  },
  {
    id: 'strain-6', name: 'OG Kush', breeder: 'Unknown (FL origin)', type: 'hybrid',
    lineage: 'Chemdawg x Lemon Thai x Hindu Kush', flowerTimeDays: 56, vegTimeDays: 28,
    estimatedYieldPerPlant: '70-85g', thcRange: '20-26%', cbdRange: '<1%',
    terpeneProfile: ['Myrcene', 'Limonene', 'Caryophyllene'],
    difficulty: 'moderate', motherPlantStatus: 'active', cloneAvailability: 10,
    growNotes: 'Classic strain. Strong fuel/pine aroma. Moderate stretch. Needs support stakes for heavy colas.',
    feedingSchedule: 'Standard GH Flora series. Likes slightly acidic pH (5.8-6.0). CalMag every watering.',
    ipmNotes: 'Moderate PM risk. Good airflow essential. Preventative sulfur burner in veg.',
    lastHarvest: getDateOffset(-7), avgYieldActual: '78g/plant',
  },
  {
    id: 'strain-7', name: 'Jack Herer', breeder: 'Sensi Seeds', type: 'sativa',
    lineage: 'Haze x Northern Lights x Shiva Skunk', flowerTimeDays: 63, vegTimeDays: 28,
    estimatedYieldPerPlant: '65-80g', thcRange: '18-23%', cbdRange: '<1%',
    terpeneProfile: ['Terpinolene', 'Pinene', 'Myrcene'],
    difficulty: 'moderate', motherPlantStatus: 'active', cloneAvailability: 8,
    growNotes: 'Heavy stretcher. Top early and often. Excellent daytime strain. Long flower time but worth the wait.',
    feedingSchedule: 'Moderate feeder. Benefits from extra silica for stem strength.',
    ipmNotes: 'Generally pest-resistant. Tall structure needs good canopy management for light penetration.',
    lastHarvest: getDateOffset(-12), avgYieldActual: '74g/plant',
  },
  {
    id: 'strain-8', name: 'Gorilla Glue #4', breeder: 'GG Strains', type: 'hybrid',
    lineage: 'Chem Sister x Sour Dubb x Chocolate Diesel', flowerTimeDays: 56, vegTimeDays: 28,
    estimatedYieldPerPlant: '85-110g', thcRange: '25-30%', cbdRange: '<1%',
    terpeneProfile: ['Caryophyllene', 'Myrcene', 'Limonene'],
    difficulty: 'moderate', motherPlantStatus: 'retired', cloneAvailability: 0,
    growNotes: 'Extremely resin-heavy — scissors will gum up constantly. Incredible potency but high maintenance.',
    feedingSchedule: 'Heavy feeder. Requires maximum CalMag. PK boost throughout flower.',
    ipmNotes: 'Retired due to recurring spider mite susceptibility. Consider restarting from seed with resistant phenotype.',
    phenoNotes: 'Original GG4 cut. Dense, frosty buds. Fuel/chocolate aroma.',
    lastHarvest: getDateOffset(-52), avgYieldActual: '86g/plant',
  },
  {
    id: 'strain-9', name: 'Northern Lights', breeder: 'Sensi Seeds', type: 'indica',
    lineage: 'Afghani landrace', flowerTimeDays: 49, vegTimeDays: 21,
    estimatedYieldPerPlant: '60-75g', thcRange: '16-21%', cbdRange: '1-2%',
    terpeneProfile: ['Myrcene', 'Pinene', 'Linalool'],
    difficulty: 'easy', motherPlantStatus: 'archived', cloneAvailability: 0,
    growNotes: 'Classic strain, archive genetics available. Low THC by current standards but excellent terpene profile and reliable producer.',
    feedingSchedule: 'Light feeder. Does well with organic amendments. Very forgiving of pH fluctuations.',
    ipmNotes: 'Excellent natural resistance to pests and disease. One of the hardiest strains.',
    lastHarvest: getDateOffset(-95), avgYieldActual: '68g/plant',
  },
  {
    id: 'strain-10', name: 'Runtz', breeder: 'Runtz Crew', type: 'hybrid',
    lineage: 'Zkittlez x Gelato', flowerTimeDays: 56, vegTimeDays: 28,
    estimatedYieldPerPlant: '70-90g', thcRange: '24-29%', cbdRange: '<1%',
    terpeneProfile: ['Limonene', 'Linalool', 'Caryophyllene'],
    difficulty: 'advanced', motherPlantStatus: 'active', cloneAvailability: 6,
    growNotes: 'New addition Q1 2026. First harvest pending. Very resin-heavy, requires careful humidity management.',
    feedingSchedule: 'Medium-heavy feeder. Sensitive to overwatering. Let medium dry back between waterings.',
    ipmNotes: 'Watch for broad mites — small leaf curling is the early sign. Predatory mites recommended preventatively.',
    phenoNotes: 'Testing 3 phenotypes. #2 showing best trichome density and structure.',
  },
];

// ─── Grow Supplies (25) ────────────────────────────────────────

const growSupplies: GrowSupply[] = [
  // Nutrients
  { id: 'supply-1', name: 'Botanicare CalMag Plus', category: 'nutrient', currentStock: 3, unit: 'gallon', reorderPoint: 1, reorderQuantity: 4, costPerUnit: 45, supplier: 'Hydrofarm', lastOrderDate: getDateOffset(-14), status: 'in-stock', mixRatio: '5ml/gal', applicationFrequency: 'Every watering' },
  { id: 'supply-2', name: 'General Hydroponics Flora Bloom', category: 'nutrient', currentStock: 4, unit: 'gallon', reorderPoint: 2, reorderQuantity: 4, costPerUnit: 28, supplier: 'Hydrofarm', lastOrderDate: getDateOffset(-21), status: 'in-stock', mixRatio: '5-8ml/gal', applicationFrequency: 'Every watering in flower' },
  { id: 'supply-3', name: 'General Hydroponics Flora Micro', category: 'nutrient', currentStock: 4, unit: 'gallon', reorderPoint: 2, reorderQuantity: 4, costPerUnit: 28, supplier: 'Hydrofarm', lastOrderDate: getDateOffset(-21), status: 'in-stock', mixRatio: '5ml/gal', applicationFrequency: 'Every watering' },
  { id: 'supply-4', name: 'General Hydroponics Flora Grow', category: 'nutrient', currentStock: 5, unit: 'gallon', reorderPoint: 2, reorderQuantity: 4, costPerUnit: 24, supplier: 'Hydrofarm', lastOrderDate: getDateOffset(-21), status: 'in-stock', mixRatio: '5-10ml/gal', applicationFrequency: 'Every watering in veg' },
  { id: 'supply-5', name: 'Botanicare Hydroguard', category: 'nutrient', currentStock: 2, unit: 'quart', reorderPoint: 1, reorderQuantity: 3, costPerUnit: 32, supplier: 'Botanicare', lastOrderDate: getDateOffset(-30), status: 'in-stock', mixRatio: '2ml/gal', applicationFrequency: 'Every watering' },
  { id: 'supply-6', name: 'Mammoth P', category: 'nutrient', currentStock: 1, unit: '500ml', reorderPoint: 1, reorderQuantity: 2, costPerUnit: 55, supplier: 'Mammoth Microbes', lastOrderDate: getDateOffset(-45), status: 'low', mixRatio: '0.16ml/gal', applicationFrequency: 'Weekly in flower' },
  { id: 'supply-7', name: 'Canna PK 13/14', category: 'nutrient', subcategory: 'bloom booster', currentStock: 2, unit: 'liter', reorderPoint: 1, reorderQuantity: 3, costPerUnit: 22, supplier: 'Canna', lastOrderDate: getDateOffset(-28), status: 'in-stock', mixRatio: '1.5ml/gal weeks 4-6', applicationFrequency: 'Twice weekly, flower weeks 4-6' },
  // Soil/Media
  { id: 'supply-8', name: 'Coco Loco Potting Mix', category: 'soil-media', currentStock: 12, unit: '2 cu ft bag', reorderPoint: 5, reorderQuantity: 20, costPerUnit: 18, supplier: "Fox Farm", lastOrderDate: getDateOffset(-10), status: 'in-stock' },
  { id: 'supply-9', name: 'Perlite #3', category: 'soil-media', currentStock: 8, unit: '4 cu ft bag', reorderPoint: 3, reorderQuantity: 10, costPerUnit: 24, supplier: 'Whittemore', lastOrderDate: getDateOffset(-20), status: 'in-stock' },
  { id: 'supply-10', name: 'Rockwool Cubes 1.5"', category: 'soil-media', currentStock: 3, unit: 'tray (200ct)', reorderPoint: 1, reorderQuantity: 5, costPerUnit: 35, supplier: 'Grodan', lastOrderDate: getDateOffset(-35), status: 'in-stock' },
  // IPM
  { id: 'supply-11', name: 'Neem Oil Concentrate', category: 'ipm', currentStock: 3, unit: '16oz bottle', reorderPoint: 1, reorderQuantity: 4, costPerUnit: 14, supplier: 'Dyna-Gro', lastOrderDate: getDateOffset(-30), status: 'in-stock', mixRatio: '1 tbsp/gal', applicationFrequency: 'Weekly in veg, as needed' },
  { id: 'supply-12', name: 'Regalia Biofungicide', category: 'ipm', currentStock: 2, unit: 'quart', reorderPoint: 1, reorderQuantity: 3, costPerUnit: 48, supplier: 'Marrone Bio', lastOrderDate: getDateOffset(-40), status: 'in-stock', mixRatio: '4oz/gal', applicationFrequency: 'Every 10 days preventative' },
  { id: 'supply-13', name: 'Yellow Sticky Traps', category: 'ipm', currentStock: 5, unit: 'pack (20ct)', reorderPoint: 2, reorderQuantity: 10, costPerUnit: 8, supplier: 'Catchmaster', lastOrderDate: getDateOffset(-15), status: 'in-stock', applicationFrequency: 'Replace weekly' },
  { id: 'supply-14', name: 'Beneficial Insects — Ladybugs', category: 'ipm', currentStock: 0, unit: '1500ct container', reorderPoint: 1, reorderQuantity: 2, costPerUnit: 18, supplier: 'Nature\'s Good Guys', status: 'out-of-stock', applicationFrequency: 'As needed for aphid control' },
  { id: 'supply-15', name: 'Spinosad Spray', category: 'ipm', currentStock: 2, unit: '32oz bottle', reorderPoint: 1, reorderQuantity: 3, costPerUnit: 22, supplier: 'Monterey', lastOrderDate: getDateOffset(-25), status: 'in-stock', mixRatio: '4 tbsp/gal', applicationFrequency: 'As needed, no later than week 3 flower' },
  // Equipment
  { id: 'supply-16', name: 'Chikamasa B-500s Trim Scissors', category: 'equipment', currentStock: 12, unit: 'pair', reorderPoint: 4, reorderQuantity: 12, costPerUnit: 16, supplier: 'Chikamasa', lastOrderDate: getDateOffset(-60), status: 'in-stock' },
  { id: 'supply-17', name: 'Drying Rack Nets 4ft', category: 'equipment', currentStock: 8, unit: 'net', reorderPoint: 3, reorderQuantity: 6, costPerUnit: 12, supplier: 'VIVOSUN', lastOrderDate: getDateOffset(-90), status: 'in-stock' },
  { id: 'supply-18', name: 'pH Test Strips', category: 'equipment', currentStock: 4, unit: '100ct roll', reorderPoint: 2, reorderQuantity: 6, costPerUnit: 9, supplier: 'Hydrion', lastOrderDate: getDateOffset(-20), status: 'in-stock' },
  { id: 'supply-19', name: 'EC/pH Meter Calibration Set', category: 'equipment', currentStock: 3, unit: 'set', reorderPoint: 1, reorderQuantity: 4, costPerUnit: 15, supplier: 'Bluelab', lastOrderDate: getDateOffset(-45), status: 'in-stock' },
  // Containers
  { id: 'supply-20', name: '5 Gallon Fabric Pots', category: 'container', currentStock: 60, unit: 'pot', reorderPoint: 50, reorderQuantity: 100, costPerUnit: 2.5, supplier: 'Vivosun', lastOrderDate: getDateOffset(-30), status: 'low' },
  { id: 'supply-21', name: '1 Gallon Nursery Pots', category: 'container', currentStock: 200, unit: 'pot', reorderPoint: 100, reorderQuantity: 300, costPerUnit: 0.5, supplier: 'Greenhouse Megastore', lastOrderDate: getDateOffset(-15), status: 'in-stock' },
  // Environmental
  { id: 'supply-22', name: 'HVAC Filters 20x25x4', category: 'environmental', currentStock: 4, unit: 'filter', reorderPoint: 2, reorderQuantity: 6, costPerUnit: 28, supplier: 'Honeywell', lastOrderDate: getDateOffset(-60), status: 'in-stock', applicationFrequency: 'Replace monthly' },
  { id: 'supply-23', name: 'CO2 Tank Refill', category: 'environmental', currentStock: 2, unit: '50lb tank', reorderPoint: 1, reorderQuantity: 2, costPerUnit: 35, supplier: 'Airgas', lastOrderDate: getDateOffset(-7), status: 'in-stock' },
  // Cleaning
  { id: 'supply-24', name: 'Hydrogen Peroxide 34%', category: 'cleaning', currentStock: 3, unit: 'gallon', reorderPoint: 1, reorderQuantity: 4, costPerUnit: 20, supplier: 'BulkPeroxide', lastOrderDate: getDateOffset(-20), status: 'in-stock', mixRatio: '3ml/gal for sterilization', applicationFrequency: 'Between cycles' },
  { id: 'supply-25', name: 'Isopropyl Alcohol 99%', category: 'cleaning', currentStock: 5, unit: 'gallon', reorderPoint: 2, reorderQuantity: 4, costPerUnit: 18, supplier: 'Amazon', lastOrderDate: getDateOffset(-25), status: 'in-stock', applicationFrequency: 'Daily tool cleaning' },
];

// ─── Task Generation (Stage-Driven) ───────────────────────────

const ASSIGNEES = ['Marco R.', 'Sofia L.', 'Carlos M.', 'Diana P.'];

function generateTasksForRooms(rooms: GrowRoom[]): CultivationTask[] {
  const tasks: CultivationTask[] = [];
  let taskId = 1;

  for (const room of rooms) {
    const week = Math.floor(room.dayInStage / 7) + 1;
    const stage = room.stage;

    // Monday: Inspection (all rooms)
    tasks.push({
      id: `task-${taskId++}`, roomId: room.id, title: `Room inspection — ${room.name}`,
      description: `Full room walkthrough: check plants, environment sensors, equipment, cleanliness.`,
      category: 'inspection', stage, weekOfStage: week, dayOfWeek: 1, recurring: true,
      assignee: ASSIGNEES[taskId % 4], priority: 'medium',
    });

    if (stage === 'flower') {
      // Tuesday: Feeding (flower)
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Feeding — ${room.name}`,
        description: week >= 4 ? `Flower feed: Flora Bloom 8ml/gal, Flora Micro 5ml/gal, CalMag 5ml/gal, PK 13/14 1.5ml/gal. Target EC 2.0-2.4, pH 6.0-6.3.` : `Transition feed: Flora Bloom 5ml/gal, Flora Micro 5ml/gal, Flora Grow 2ml/gal, CalMag 5ml/gal. Target EC 1.8-2.0.`,
        category: 'feeding', stage, weekOfStage: week, dayOfWeek: 2, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'high',
      });
      // Thursday: Light feed
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Light feed — ${room.name}`,
        description: `Half-strength nutrient mix. Check runoff EC and pH.`,
        category: 'feeding', stage, weekOfStage: week, dayOfWeek: 4, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'medium',
      });
      // Monday: IPM spray if < week 4
      if (week <= 3) {
        tasks.push({
          id: `task-${taskId++}`, roomId: room.id, title: `IPM spray — ${room.name}`,
          description: `Preventative neem oil application. Only in early flower — no spraying after week 3.`,
          category: 'ipm', stage, weekOfStage: week, dayOfWeek: 1, recurring: true,
          assignee: ASSIGNEES[taskId % 4], priority: 'medium',
        });
      }
      // Wednesday: Defoliation weeks 3 + 6
      if (week === 3 || week === 6) {
        tasks.push({
          id: `task-${taskId++}`, roomId: room.id, title: `Defoliation — ${room.name}`,
          description: week === 3 ? `Remove large fan leaves blocking bud sites. Lollipop lower 1/3 of canopy.` : `Final defoliation. Remove any large fans blocking light to colas.`,
          category: 'defoliation', stage, weekOfStage: week, dayOfWeek: 3, recurring: false,
          assignee: ASSIGNEES[taskId % 4], priority: 'high',
        });
      }
      // Friday: Flush check (last 2 weeks)
      if (room.dayInStage >= room.totalDaysExpected - 14) {
        tasks.push({
          id: `task-${taskId++}`, roomId: room.id, title: `Flush check — ${room.name}`,
          description: `Check runoff EC. Target < 0.5. Water only, no nutrients. Monitor trichomes daily.`,
          category: 'flush', stage, weekOfStage: week, dayOfWeek: 5, recurring: true,
          assignee: ASSIGNEES[taskId % 4], priority: 'high',
        });
      }
      // Harvest prep (last 3 days)
      if (room.dayInStage >= room.totalDaysExpected - 3) {
        tasks.push({
          id: `task-${taskId++}`, roomId: room.id, title: `Harvest prep — ${room.name}`,
          description: `Trichome check (70% milky, 20% amber = peak THC). Prep dry room, clean scissors, schedule trim team.`,
          category: 'harvest-prep', stage, weekOfStage: week, dayOfWeek: 5, recurring: false,
          assignee: ASSIGNEES[taskId % 4], priority: 'high',
        });
      }
    } else if (stage === 'veg') {
      // Tuesday: Feeding (veg)
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Feeding — ${room.name}`,
        description: `Veg feed: Flora Grow 10ml/gal, Flora Micro 5ml/gal, CalMag 5ml/gal. Target EC 1.4-1.8, pH 5.8-6.2.`,
        category: 'feeding', stage, weekOfStage: week, dayOfWeek: 2, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'high',
      });
      // Thursday: Feed #2
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Light feed — ${room.name}`,
        description: `Half-strength veg nutrients. Foliar CalMag spray if needed.`,
        category: 'feeding', stage, weekOfStage: week, dayOfWeek: 4, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'medium',
      });
      // Wednesday: Training/defoliation
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Training & defoliation — ${room.name}`,
        description: week <= 2 ? `Top plants if not yet topped. Begin LST. Light defoliation.` : `Heavy defoliation. Install SCROG net if not done. Tuck branches under net.`,
        category: week <= 2 ? 'training' : 'defoliation', stage, weekOfStage: week, dayOfWeek: 3, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'medium',
      });
      // Weekly IPM
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `IPM scout + spray — ${room.name}`,
        description: `Check sticky traps. Inspect undersides of leaves. Neem oil preventative if needed.`,
        category: 'ipm', stage, weekOfStage: week, dayOfWeek: 4, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'medium',
      });
      // Transplant check weeks 3-4
      if (week >= 3 && week <= 4) {
        tasks.push({
          id: `task-${taskId++}`, roomId: room.id, title: `Transplant check — ${room.name}`,
          description: `Check if roots are filling container. Transplant to final pot if root-bound.`,
          category: 'transplant', stage, weekOfStage: week, dayOfWeek: 5, recurring: false,
          assignee: ASSIGNEES[taskId % 4], priority: 'medium',
        });
      }
    } else if (stage === 'dry') {
      // Daily humidity/temp check
      for (let d = 1; d <= 5; d++) {
        tasks.push({
          id: `task-${taskId++}`, roomId: room.id, title: `Dry room check — ${room.name}`,
          description: `Check temp (60°F target), humidity (60% target). Check stem snap test. No visitors.`,
          category: 'environmental', stage, weekOfStage: week, dayOfWeek: d, recurring: true,
          assignee: ASSIGNEES[taskId % 4], priority: 'high',
        });
      }
    } else if (stage === 'clone') {
      // Clone care
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Clone care — ${room.name}`,
        description: `Mist domes, check humidity (75-80%), remove any dead cuttings. Check for root development.`,
        category: 'environmental', stage, weekOfStage: week, dayOfWeek: 1, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'high',
      });
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Clone feeding — ${room.name}`,
        description: `Light foliar spray with rooting solution. EC < 0.8.`,
        category: 'feeding', stage, weekOfStage: week, dayOfWeek: 3, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'medium',
      });
    }
  }

  // Mark some tasks as completed for realism
  const now = new Date();
  const dayOfWeek = now.getDay();
  tasks.forEach((t) => {
    if (t.dayOfWeek < dayOfWeek && Math.random() > 0.15) {
      t.completedAt = new Date(now.getTime() - (dayOfWeek - t.dayOfWeek) * 86400000).toISOString();
      t.completedBy = t.assignee;
    }
  });

  return tasks;
}

// ─── AI Chat Conversations ─────────────────────────────────────

const advisorConversations: CultivationMessage[] = [
  { id: 'msg-1', role: 'user', content: "What's the feeding schedule for Bloom A this week?", timestamp: new Date(Date.now() - 7200000).toISOString(), language: 'en' },
  { id: 'msg-2', role: 'assistant', content: "**Bloom A — Wedding Cake, Flower Week 6**\n\nThis is a critical feeding week. Here's your schedule:\n\n**Tuesday (Heavy Feed):**\n- Flora Bloom: 8ml/gal\n- Flora Micro: 5ml/gal\n- CalMag Plus: 5ml/gal\n- PK 13/14: 1.5ml/gal\n- Mammoth P: 0.16ml/gal\n- Target EC: 2.2-2.4\n- Target pH: 6.0-6.2\n\n**Thursday (Light Feed):**\n- Half-strength of Tuesday's mix\n- Target EC: 1.2-1.4\n\n**Important:** Week 6 is peak resin production for Wedding Cake. Don't reduce feeding yet — flush starts week 8. Monitor trichomes starting this week.", timestamp: new Date(Date.now() - 7100000).toISOString(), language: 'en' },
  { id: 'msg-3', role: 'user', content: 'Room 2 humidity is high, what should I do?', timestamp: new Date(Date.now() - 3600000).toISOString(), language: 'en' },
  { id: 'msg-4', role: 'assistant', content: "**Room 2 (Bloom B) — Humidity Alert: 68% (target 55%)**\n\nThis is critically high for flower week 4. Immediate steps:\n\n1. **Check dehumidifier** — Is it running? Check filter, drain line, and compressor. Room 2's unit has been flagged before.\n2. **Increase air circulation** — Turn exhaust fan to max. Open any passive intakes.\n3. **Defoliate** — Remove large fan leaves trapping moisture. This is overdue for week 4 anyway.\n4. **Check for standing water** — Drain any runoff trays immediately.\n5. **Monitor VPD** — Currently 0.95 kPa (target 1.2). This will improve as humidity drops.\n\n**Risk:** Botrytis (bud rot) risk increases exponentially above 60% RH in flower. Blue Dream's dense colas are particularly vulnerable.\n\n**Follow up in 4 hours** — humidity should be below 60% or we need to consider portable dehumidifier backup.", timestamp: new Date(Date.now() - 3500000).toISOString(), language: 'en' },
  { id: 'msg-5', role: 'user', content: 'When should we harvest Room 3?', timestamp: new Date(Date.now() - 1800000).toISOString(), language: 'en' },
  { id: 'msg-6', role: 'assistant', content: "**Room 3 (Bloom C) — Gelato, Day 56 of 63**\n\nYou're in the harvest window zone. Here's my recommendation:\n\n**Trichome Analysis Guide:**\n- Clear trichomes → too early, wait\n- 70% milky + 20% amber + 10% clear → **Peak THC** (recommended for Gelato)\n- 50% milky + 40% amber → More sedative/couch-lock effect\n\n**Current status:** Flush started day 54. Runoff EC is 0.5 and dropping.\n\n**Recommended harvest window:** Days 60-65 (5-9 days from now)\n\n**Prep checklist:**\n- [ ] Schedule trim team for harvest day\n- [ ] Clean and prep Dry Room (target: 60°F, 60% RH)\n- [ ] Sharpen/replace trim scissors (Chikamasa B-500s)\n- [ ] Check trichomes daily with 60x loupe\n- [ ] Plan staggered harvest if trichome development is uneven across canopy\n\n**Estimated yield:** 8.8 kg wet → ~2.0 kg dry (based on Gelato historical: 77% moisture loss)", timestamp: new Date(Date.now() - 1700000).toISOString(), language: 'en' },
];

const translatorConversations: CultivationMessage[] = [
  { id: 'trans-1', role: 'user', content: 'Los tricomas del cuarto 3 están casi listos. ¿Puedo empezar a preparar la cosecha?', timestamp: new Date(Date.now() - 5400000).toISOString(), language: 'es', translatedContent: 'The trichomes in Room 3 are almost ready. Can I start preparing the harvest?' },
  { id: 'trans-2', role: 'assistant', content: 'Yes, start harvest prep on Friday. Make sure the dry room is clean and ready. Check that we have enough drying rack nets.', timestamp: new Date(Date.now() - 5300000).toISOString(), language: 'en', translatedContent: 'Sí, comienza la preparación de la cosecha el viernes. Asegúrate de que el cuarto de secado esté limpio y listo. Verifica que tengamos suficientes redes de secado.' },
  { id: 'trans-3', role: 'user', content: 'Encontré manchas blancas en las hojas del cuarto 4. Parece hongo. ¿Qué hago?', timestamp: new Date(Date.now() - 3600000).toISOString(), language: 'es', translatedContent: 'I found white spots on the leaves in Room 4. It looks like fungus. What should I do?' },
  { id: 'trans-4', role: 'assistant', content: "Don't touch the affected plants. Increase airflow in the room. I'll come check — it might be powdery mildew. Remove the worst leaves with gloves and bag them. Spray Regalia on unaffected plants as prevention.", timestamp: new Date(Date.now() - 3500000).toISOString(), language: 'en', translatedContent: 'No toques las plantas afectadas. Aumenta la circulación de aire en el cuarto. Voy a ir a revisar — podría ser oídio. Retira las hojas más afectadas con guantes y ponlas en una bolsa. Rocía Regalia en las plantas no afectadas como prevención.' },
];

const chatSuggestions: CultivationSuggestion[] = [
  { id: 'sug-1', text: "What's the feeding schedule for Bloom A this week?", language: 'en' },
  { id: 'sug-2', text: '¿Cuál es el calendario de alimentación para Bloom A esta semana?', language: 'es' },
  { id: 'sug-3', text: 'Room 2 humidity is high, what should I do?', language: 'en' },
  { id: 'sug-4', text: 'El ambiente del cuarto 2 no está bien — ¿qué debo revisar?', language: 'es' },
  { id: 'sug-5', text: 'When should we harvest Room 3?', language: 'en' },
  { id: 'sug-6', text: '¿Cuándo debemos cosechar el cuarto 3?', language: 'es' },
  { id: 'sug-7', text: 'What strains should we consider for next quarter?', language: 'en' },
  { id: 'sug-8', text: 'Show me environment trends for Bloom A', language: 'en' },
];

// ─── Chat Matching ─────────────────────────────────────────────

export function matchCultivationChat(input: string): CultivationMessage | null {
  const lower = input.toLowerCase();
  if (lower.includes('feeding') || lower.includes('schedule') || lower.includes('bloom a') || lower.includes('alimentación')) {
    return advisorConversations[1];
  }
  if (lower.includes('humidity') || lower.includes('high') || lower.includes('room 2') || lower.includes('humedad') || lower.includes('cuarto 2')) {
    return advisorConversations[3];
  }
  if (lower.includes('harvest') || lower.includes('room 3') || lower.includes('trichome') || lower.includes('cosecha') || lower.includes('cuarto 3')) {
    return advisorConversations[5];
  }
  return null;
}

export function getCultivationFallback(input: string): CultivationMessage {
  return {
    id: `msg-fallback-${Date.now()}`,
    role: 'assistant',
    content: `I'd be happy to help with that. Based on current room data:\n\n- **Bloom A:** Wedding Cake, flower day 42/63, all optimal\n- **Bloom B:** Blue Dream, flower day 28/56, humidity warning\n- **Bloom C:** Gelato, flower day 56/63, harvest approaching\n- **Veg A/B:** GSC and Zkittlez, on schedule\n- **Dry Rooms:** OG Kush (day 7) and Jack Herer (day 12, ready)\n\nCould you be more specific about what you'd like to know? I can help with feeding schedules, environment troubleshooting, harvest timing, pest management, or strain recommendations.`,
    timestamp: new Date().toISOString(),
    language: 'en',
  };
}

// ─── Export Functions ──────────────────────────────────────────

export async function getGrowRooms(): Promise<GrowRoom[]> {
  await delay(300);
  return [...growRooms];
}

export async function getGrowRoom(id: string): Promise<GrowRoom | undefined> {
  await delay(300);
  return growRooms.find((r) => r.id === id);
}

export async function getEnvironmentHistory(roomId: string): Promise<EnvironmentReading[]> {
  await delay(300);
  const room = growRooms.find((r) => r.id === roomId);
  return room?.environmentHistory ?? [];
}

export async function getRoomAlerts(roomId?: string): Promise<RoomAlert[]> {
  await delay(300);
  if (roomId) {
    const room = growRooms.find((r) => r.id === roomId);
    return room?.alerts ?? [];
  }
  return growRooms.flatMap((r) => r.alerts.map((a) => ({ ...a, id: `${r.id}-${a.id}` })));
}

export async function getCultivationTasks(roomId?: string): Promise<CultivationTask[]> {
  await delay(300);
  const tasks = generateTasksForRooms(growRooms);
  return roomId ? tasks.filter((t) => t.roomId === roomId) : tasks;
}

export async function getGrowSupplies(filters?: { category?: string; status?: string }): Promise<GrowSupply[]> {
  await delay(300);
  let result = [...growSupplies];
  if (filters?.category) result = result.filter((s) => s.category === filters.category);
  if (filters?.status) result = result.filter((s) => s.status === filters.status);
  return result;
}

export async function getGeneticsLibrary(filters?: { type?: string; motherStatus?: string; search?: string }): Promise<Strain[]> {
  await delay(300);
  let result = [...strains];
  if (filters?.type) result = result.filter((s) => s.type === filters.type);
  if (filters?.motherStatus) result = result.filter((s) => s.motherPlantStatus === filters.motherStatus);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((s) => s.name.toLowerCase().includes(q) || s.breeder.toLowerCase().includes(q) || s.lineage.toLowerCase().includes(q));
  }
  return result;
}

export async function getStrain(id: string): Promise<Strain | undefined> {
  await delay(300);
  return strains.find((s) => s.id === id);
}

export async function getCultivationChat(mode: 'cultivation-ai' | 'translator'): Promise<{ messages: CultivationMessage[]; suggestions: CultivationSuggestion[] }> {
  await delay(300);
  return {
    messages: mode === 'cultivation-ai' ? [...advisorConversations] : [...translatorConversations],
    suggestions: chatSuggestions.filter((s) => mode === 'cultivation-ai' ? s.language === 'en' : true),
  };
}

export async function getHarvestRecords(): Promise<HarvestRecord[]> {
  await delay(300);
  return [...harvestRecords];
}

export async function getCultivationMetrics(): Promise<CultivationMetrics> {
  await delay(300);
  const active = growRooms.filter((r) => r.status === 'active' || r.status === 'drying');
  const flowerRooms = growRooms.filter((r) => r.stage === 'flower');
  const vegRooms = growRooms.filter((r) => r.stage === 'veg' || r.stage === 'clone');
  const completed = harvestRecords.filter((h) => h.status === 'complete');
  const avgYield = completed.length ? Math.round(completed.reduce((s, h) => s + h.yieldPerPlant, 0) / completed.length) : 0;
  const envAlerts = growRooms.reduce((s, r) => s + r.alerts.filter((a) => a.severity !== 'info').length, 0);
  const upcoming = harvestRecords.find((h) => h.status === 'upcoming');
  const tasks = generateTasksForRooms(growRooms);
  const today = new Date().getDay();
  const tasksToday = tasks.filter((t) => t.dayOfWeek === today && !t.completedAt).length;

  return {
    activeRooms: active.length,
    totalPlants: growRooms.reduce((s, r) => s + r.plantCount, 0),
    nextHarvest: upcoming?.harvestDate ?? 'N/A',
    nextHarvestStrain: upcoming?.strainName ?? 'N/A',
    daysToNextHarvest: upcoming ? Math.max(0, Math.ceil((new Date(upcoming.harvestDate).getTime() - Date.now()) / 86400000)) : 0,
    avgYieldPerPlant: avgYield,
    environmentAlerts: envAlerts,
    plantsInFlower: flowerRooms.reduce((s, r) => s + r.plantCount, 0),
    plantsInVeg: vegRooms.reduce((s, r) => s + r.plantCount, 0),
    geneticsCount: strains.filter((s) => s.motherPlantStatus === 'active').length,
    tasksToday,
  };
}
