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
  IrrigationEvent,
  NutrientRecipe,
  IrrigationData,
  HvacData,
  GrowCycle,
  Plant,
  QALot,
  QASample,
  DisposalRecord,
  GrowStage,
  PlantHealth,
  QATestType,
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
  for (let i = 95; i >= 0; i--) {
    const ts = new Date(now);
    ts.setMinutes(now.getMinutes() - i * 15);
    const hour = ts.getHours();
    readings.push({
      timestamp: ts.toISOString(),
      temperature: +(baseTemp + Math.sin(i * 0.12) * 3).toFixed(1),
      humidity: +(baseHumidity + Math.cos(i * 0.1) * 4).toFixed(1),
      co2: Math.round(baseCo2 + Math.sin(i * 0.08) * 80),
      vpd: +(baseVpd + Math.sin(i * 0.12) * 0.15).toFixed(2),
      lightIntensity: basePpfd > 0 && hour >= 6 && hour <= 18 ? Math.round(basePpfd + Math.sin(i * 0.05) * 30) : 0,
      ppfd: basePpfd > 0 && hour >= 6 && hour <= 18 ? Math.round(basePpfd + Math.sin(i * 0.05) * 30) : 0,
    });
  }
  return readings;
}

// ─── Irrigation Data Generators ───────────────────────────────

function makeIrrigation(stage: string): IrrigationData | undefined {
  if (stage === 'dry' || stage === 'cure') return undefined;
  const isFlower = stage === 'flower';
  const isVeg = stage === 'veg';
  const now = new Date();
  const lastIrr = new Date(now.getTime() - 2 * 3600000);
  const nextIrr = new Date(now.getTime() + 1.75 * 3600000);

  return {
    ph: isFlower ? 6.2 : 6.0,
    phMin: 5.8, phMax: 6.5,
    ec: isFlower ? 1.8 : 1.4,
    ecMin: isFlower ? 1.5 : 1.0, ecMax: isFlower ? 2.2 : 1.8,
    runoffPh: isFlower ? 6.4 : 6.2,
    runoffPhMin: 6.0, runoffPhMax: 6.8,
    runoffEc: isFlower ? 2.1 : 1.6,
    runoffEcMin: isFlower ? 1.8 : 1.2, runoffEcMax: isFlower ? 2.5 : 2.0,
    waterTemp: 68,
    waterTempMin: 65, waterTempMax: 72,
    flowRate: isVeg ? 2.0 : 2.4,
    reservoirLevel: stage === 'propagation' || stage === 'mother' ? 85 : 78,
    reservoirCapacity: 200,
    lastIrrigationTime: lastIrr.toISOString(),
    nextIrrigationTime: nextIrr.toISOString(),
    irrigationIntervalHours: isFlower ? 4 : 6,
  };
}

function makeHvac(stage: string): HvacData {
  const isDry = stage === 'dry' || stage === 'cure';
  const isFlower = stage === 'flower';
  return {
    supplyAirTemp: isDry ? 58 : 72,
    returnAirTemp: isDry ? 63 : isFlower ? 79 : 81,
    supplyAirTempTarget: isDry ? 58 : 72,
    damperPosition: isDry ? 40 : 65,
    damperMode: 'auto',
    compressorStatus: isDry ? 'idle' : 'running',
    compressorStage: isDry ? 0 : isFlower ? 2 : 1,
    compressorStagesTotal: 3,
    dehumidifierStatus: 'running',
    dehumidifierCapacity: isDry ? 72 : isFlower ? 48 : 35,
    energyUsageKwh: isDry ? 2.1 : isFlower ? 4.2 : 3.5,
    filterLifePercent: 82,
    filterReplacementDate: getDateOffset(25),
    lastMaintenanceDate: getDateOffset(-15),
  };
}

// ─── Grow Rooms (8) — per spec ────────────────────────────────

const growRooms: GrowRoom[] = [
  {
    id: 'room-1',
    name: 'Flower Room A',
    status: 'active',
    strainId: 'strain-1',
    strainName: 'Wedding Cake + Gelato',
    plantCount: 48,
    stage: 'flower',
    dayInStage: 42,
    totalDaysExpected: 63,
    layout: { rows: 4, columns: 12 },
    environment: {
      temperature: 78.2, temperatureTarget: 78, temperatureMin: 75, temperatureMax: 82,
      humidity: 52, humidityTarget: 50, humidityMin: 45, humidityMax: 55,
      co2: 1150, co2Target: 1200, co2Min: 1000, co2Max: 1400,
      lightHours: 12, darkHours: 12, lightIntensity: 850,
      vpd: 1.21, vpdTarget: 1.2, vpdMin: 0.8, vpdMax: 1.4,
      ppfd: 850, ppfdTarget: 900, ppfdMin: 800, ppfdMax: 1000,
      dli: 42.8, dliTarget: 45, dliMin: 40, dliMax: 50,
      waterEC: 2.2, waterPH: 6.1, soilMoisture: 42,
      status: 'optimal',
    },
    estimatedHarvest: getDateOffset(21),
    estimatedYield: '4.8 kg',
    notes: 'Heavy resin production starting week 5. Purple hues appearing on upper canopy.',
    alerts: [],
    environmentHistory: generateEnvHistory(78, 52, 1150, 1.21, 850),
    irrigation: makeIrrigation('flower'),
    hvac: makeHvac('flower'),
    capacity: 48,
  },
  {
    id: 'room-2',
    name: 'Flower Room B',
    status: 'active',
    strainId: 'strain-2',
    strainName: 'Blue Dream + GSC',
    plantCount: 48,
    stage: 'flower',
    dayInStage: 21,
    totalDaysExpected: 56,
    layout: { rows: 4, columns: 12 },
    environment: {
      temperature: 79.5, temperatureTarget: 78, temperatureMin: 75, temperatureMax: 82,
      humidity: 54, humidityTarget: 52, humidityMin: 45, humidityMax: 55,
      co2: 1180, co2Target: 1200, co2Min: 1000, co2Max: 1400,
      lightHours: 12, darkHours: 12, lightIntensity: 830,
      vpd: 1.15, vpdTarget: 1.2, vpdMin: 0.8, vpdMax: 1.4,
      ppfd: 830, ppfdTarget: 900, ppfdMin: 800, ppfdMax: 1000,
      dli: 41.6, dliTarget: 45, dliMin: 40, dliMax: 50,
      waterEC: 2.0, waterPH: 6.2, soilMoisture: 50,
      status: 'optimal',
    },
    estimatedHarvest: getDateOffset(35),
    estimatedYield: '4.2 kg',
    notes: 'Plants stretching well. SCROG net 80% filled. Good canopy evenness.',
    alerts: [],
    environmentHistory: generateEnvHistory(79, 54, 1180, 1.15, 830),
    irrigation: makeIrrigation('flower'),
    hvac: makeHvac('flower'),
    capacity: 48,
  },
  {
    id: 'room-3',
    name: 'Veg Room',
    status: 'active',
    strainId: 'strain-5',
    strainName: 'Zkittlez + Purple Punch',
    plantCount: 64,
    stage: 'veg',
    dayInStage: 28,
    totalDaysExpected: 35,
    layout: { rows: 4, columns: 16 },
    environment: {
      temperature: 80.1, temperatureTarget: 80, temperatureMin: 75, temperatureMax: 85,
      humidity: 58, humidityTarget: 55, humidityMin: 50, humidityMax: 65,
      co2: 1200, co2Target: 1200, co2Min: 800, co2Max: 1400,
      lightHours: 18, darkHours: 6, lightIntensity: 600,
      vpd: 1.1, vpdTarget: 1.0, vpdMin: 0.8, vpdMax: 1.2,
      ppfd: 600, ppfdTarget: 600, ppfdMin: 400, ppfdMax: 700,
      dli: 38.9, dliTarget: 40, dliMin: 30, dliMax: 45,
      waterEC: 1.6, waterPH: 6.0, soilMoisture: 50,
      status: 'warning',
    },
    notes: 'Topped at day 14. SCROG net installed day 21. Ready for defoliation.',
    alerts: [
      {
        id: 'alert-1',
        type: 'humidity',
        severity: 'warning',
        source: 'trollmaster',
        message: 'Humidity at 58% — target max 55%. Increase dehumidifier output.',
        metric: 'Humidity',
        currentValue: '58%',
        threshold: '55% max',
        timestamp: new Date(Date.now() - 23 * 60000).toISOString(),
        acknowledged: false,
      },
    ],
    environmentHistory: generateEnvHistory(80, 58, 1200, 1.1, 600),
    irrigation: makeIrrigation('veg'),
    hvac: makeHvac('veg'),
    capacity: 64,
  },
  {
    id: 'room-4',
    name: 'Veg Room 2',
    status: 'active',
    strainId: 'strain-6',
    strainName: 'OG Kush + Jack Herer',
    plantCount: 64,
    stage: 'veg',
    dayInStage: 14,
    totalDaysExpected: 35,
    layout: { rows: 4, columns: 16 },
    environment: {
      temperature: 79, temperatureTarget: 80, temperatureMin: 75, temperatureMax: 85,
      humidity: 60, humidityTarget: 60, humidityMin: 50, humidityMax: 65,
      co2: 1180, co2Target: 1200, co2Min: 800, co2Max: 1400,
      lightHours: 18, darkHours: 6, lightIntensity: 600,
      vpd: 1.05, vpdTarget: 1.0, vpdMin: 0.8, vpdMax: 1.2,
      ppfd: 580, ppfdTarget: 600, ppfdMin: 400, ppfdMax: 700,
      dli: 37.6, dliTarget: 40, dliMin: 30, dliMax: 45,
      waterEC: 1.4, waterPH: 6.0, soilMoisture: 48,
      status: 'optimal',
    },
    notes: 'Topping scheduled for day 14-16. Strong root development.',
    alerts: [],
    environmentHistory: generateEnvHistory(79, 60, 1180, 1.05, 580),
    irrigation: makeIrrigation('veg'),
    hvac: makeHvac('veg'),
    capacity: 64,
  },
  {
    id: 'room-5',
    name: 'Clone Room',
    status: 'active',
    strainId: 'strain-mixed',
    strainName: 'Various Strains',
    plantCount: 120,
    stage: 'propagation',
    dayInStage: 7,
    totalDaysExpected: 14,
    layout: { rows: 4, columns: 30 },
    environment: {
      temperature: 78, temperatureTarget: 78, temperatureMin: 75, temperatureMax: 80,
      humidity: 75, humidityTarget: 75, humidityMin: 70, humidityMax: 85,
      co2: 800, co2Target: 800, co2Min: 600, co2Max: 1000,
      lightHours: 18, darkHours: 6, lightIntensity: 200,
      vpd: 0.6, vpdTarget: 0.6, vpdMin: 0.4, vpdMax: 0.8,
      ppfd: 200, ppfdTarget: 200, ppfdMin: 150, ppfdMax: 300,
      dli: 13.0, dliTarget: 13, dliMin: 10, dliMax: 18,
      soilMoisture: 70,
      status: 'optimal',
    },
    notes: 'Wedding Cake x40, Blue Dream x30, Gelato x30, GSC x20. Dome covers on. 90% root rate so far.',
    alerts: [],
    environmentHistory: generateEnvHistory(78, 75, 800, 0.6, 200),
    irrigation: makeIrrigation('propagation'),
    hvac: makeHvac('propagation'),
    capacity: 150,
  },
  {
    id: 'room-6',
    name: 'Dry Room',
    status: 'drying',
    strainId: 'strain-1',
    strainName: 'Wedding Cake',
    plantCount: 0,
    stage: 'dry',
    dayInStage: 8,
    totalDaysExpected: 12,
    environment: {
      temperature: 62, temperatureTarget: 60, temperatureMin: 58, temperatureMax: 65,
      humidity: 58, humidityTarget: 60, humidityMin: 55, humidityMax: 62,
      co2: 400, co2Target: 400, co2Min: 350, co2Max: 500,
      lightHours: 0, darkHours: 24, lightIntensity: 0,
      vpd: 0.55, vpdTarget: 0.5, vpdMin: 0.4, vpdMax: 0.7,
      ppfd: 0, ppfdTarget: 0, ppfdMin: 0, ppfdMax: 0,
      dli: 0, dliTarget: 0, dliMin: 0, dliMax: 0,
      status: 'optimal',
    },
    notes: '24 lbs hanging. Stems starting to snap on edges. Check daily. Previous cycle from Flower Room A.',
    alerts: [
      {
        id: 'alert-2',
        type: 'schedule',
        severity: 'info',
        source: 'trollmaster',
        message: 'Drying complete estimate: 2 days remaining based on stem snap test.',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        acknowledged: false,
      },
    ],
    environmentHistory: generateEnvHistory(62, 58, 400, 0.55, 0),
    hvac: makeHvac('dry'),
    capacity: 30,
  },
  {
    id: 'room-7',
    name: 'Cure Room',
    status: 'active',
    strainId: 'strain-9',
    strainName: 'Northern Lights + Runtz',
    plantCount: 0,
    stage: 'cure',
    dayInStage: 21,
    totalDaysExpected: 30,
    environment: {
      temperature: 64, temperatureTarget: 62, temperatureMin: 60, temperatureMax: 68,
      humidity: 62, humidityTarget: 62, humidityMin: 58, humidityMax: 65,
      co2: 400, co2Target: 400, co2Min: 350, co2Max: 500,
      lightHours: 0, darkHours: 24, lightIntensity: 0,
      vpd: 0.48, vpdTarget: 0.5, vpdMin: 0.4, vpdMax: 0.6,
      ppfd: 0, ppfdTarget: 0, ppfdMin: 0, ppfdMax: 0,
      dli: 0, dliTarget: 0, dliMin: 0, dliMax: 0,
      status: 'optimal',
    },
    notes: '18 lbs in jars. Daily burping schedule. Terpene profile developing well.',
    alerts: [],
    environmentHistory: generateEnvHistory(64, 62, 400, 0.48, 0),
    hvac: makeHvac('cure'),
    capacity: 25,
  },
  {
    id: 'room-8',
    name: 'Mother Room',
    status: 'active',
    strainId: 'strain-mixed',
    strainName: '8 Strains',
    plantCount: 12,
    stage: 'mother',
    dayInStage: 90,
    totalDaysExpected: 365,
    layout: { rows: 2, columns: 6 },
    environment: {
      temperature: 77, temperatureTarget: 77, temperatureMin: 72, temperatureMax: 80,
      humidity: 55, humidityTarget: 55, humidityMin: 50, humidityMax: 60,
      co2: 1000, co2Target: 1000, co2Min: 800, co2Max: 1200,
      lightHours: 18, darkHours: 6, lightIntensity: 500,
      vpd: 0.95, vpdTarget: 1.0, vpdMin: 0.8, vpdMax: 1.2,
      ppfd: 500, ppfdTarget: 500, ppfdMin: 400, ppfdMax: 600,
      dli: 32.4, dliTarget: 32, dliMin: 25, dliMax: 40,
      waterEC: 1.2, waterPH: 6.0, soilMoisture: 55,
      status: 'optimal',
    },
    notes: '12 mother plants across 8 strains. Regular pruning and clone cutting schedule.',
    alerts: [],
    environmentHistory: generateEnvHistory(77, 55, 1000, 0.95, 500),
    irrigation: makeIrrigation('mother'),
    hvac: makeHvac('mother'),
    capacity: 16,
  },
];

// ─── Irrigation Events ────────────────────────────────────────

function generateIrrigationEvents(roomId: string): IrrigationEvent[] {
  const room = growRooms.find((r) => r.id === roomId);
  if (!room || !room.irrigation) return [];

  const events: IrrigationEvent[] = [];
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(6, 0, 0, 0);
  const interval = room.irrigation.irrigationIntervalHours;
  const isFlower = room.stage === 'flower';
  const recipeName = isFlower ? (room.dayInStage > 28 ? 'Flower Late' : 'Flower Early') : 'Veg';

  for (let i = 0; i < 6; i++) {
    const eventTime = new Date(startOfDay.getTime() + i * interval * 3600000);
    const completed = eventTime.getTime() < now.getTime();
    events.push({
      id: `irr-${roomId}-${i}`,
      roomId,
      startTime: eventTime.toISOString(),
      durationMinutes: isFlower ? 8 : 5,
      volumeGallons: isFlower ? 3.2 : 2.0,
      ph: room.irrigation.ph + (Math.random() - 0.5) * 0.2,
      ec: room.irrigation.ec + (Math.random() - 0.5) * 0.2,
      type: 'scheduled',
      recipeName,
      completed,
    });
  }
  return events;
}

// ─── Nutrient Recipes ─────────────────────────────────────────

const nutrientRecipes: NutrientRecipe[] = [
  {
    id: 'recipe-veg',
    name: 'Veg',
    stage: 'veg',
    targetEc: 1.4,
    targetPh: 6.0,
    npk: '3-1-2',
    notes: 'Standard vegetative growth formula. Increase to full strength after week 2.',
    components: [
      { name: 'Flora Grow', amount: '10ml/gal', brand: 'General Hydroponics' },
      { name: 'Flora Micro', amount: '5ml/gal', brand: 'General Hydroponics' },
      { name: 'Flora Bloom', amount: '2ml/gal', brand: 'General Hydroponics' },
      { name: 'CalMag Plus', amount: '5ml/gal', brand: 'Botanicare' },
      { name: 'Hydroguard', amount: '2ml/gal', brand: 'Botanicare' },
    ],
  },
  {
    id: 'recipe-flower-early',
    name: 'Flower Early',
    stage: 'flower',
    targetEc: 1.8,
    targetPh: 6.2,
    npk: '1-3-2',
    notes: 'Transition to bloom. Weeks 1-4 of flower. Reduce nitrogen, increase phosphorus.',
    components: [
      { name: 'Flora Bloom', amount: '5ml/gal', brand: 'General Hydroponics' },
      { name: 'Flora Micro', amount: '5ml/gal', brand: 'General Hydroponics' },
      { name: 'Flora Grow', amount: '2ml/gal', brand: 'General Hydroponics' },
      { name: 'CalMag Plus', amount: '5ml/gal', brand: 'Botanicare' },
      { name: 'Mammoth P', amount: '0.16ml/gal', brand: 'Mammoth Microbes' },
    ],
  },
  {
    id: 'recipe-flower-late',
    name: 'Flower Late',
    stage: 'flower',
    targetEc: 2.2,
    targetPh: 6.2,
    npk: '0-3-3',
    notes: 'Heavy bloom feeding. Weeks 5-8. Maximum phosphorus and potassium. PK boost added.',
    components: [
      { name: 'Flora Bloom', amount: '8ml/gal', brand: 'General Hydroponics' },
      { name: 'Flora Micro', amount: '5ml/gal', brand: 'General Hydroponics' },
      { name: 'CalMag Plus', amount: '5ml/gal', brand: 'Botanicare' },
      { name: 'PK 13/14', amount: '1.5ml/gal', brand: 'Canna' },
      { name: 'Mammoth P', amount: '0.16ml/gal', brand: 'Mammoth Microbes' },
      { name: 'Hydroguard', amount: '2ml/gal', brand: 'Botanicare' },
    ],
  },
];

// ─── Additional Alerts (cross-system) ─────────────────────────

const additionalAlerts: RoomAlert[] = [
  {
    id: 'alert-gl-1',
    type: 'reservoir',
    severity: 'warning',
    source: 'growlink',
    message: 'Reservoir level at 25% — refill recommended before next irrigation cycle.',
    metric: 'Reservoir Level',
    currentValue: '25%',
    threshold: '> 20%',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'alert-he-1',
    type: 'filter',
    severity: 'info',
    source: 'anderson',
    message: 'Room 1 HVAC filter replacement due in 5 days. Schedule maintenance.',
    metric: 'Filter Life',
    currentValue: '18%',
    threshold: '< 20%',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    acknowledged: false,
  },
];

// Add cross-system alerts to specific rooms
growRooms[0].alerts.push(additionalAlerts[1]); // filter alert on Room 1
growRooms[2].hvac = { ...growRooms[2].hvac!, filterLifePercent: 65 }; // Room 3 has lower filter

// ─── Harvest Records (12) ──────────────────────────────────────

const harvestRecords: HarvestRecord[] = [
  { id: 'harvest-1', roomId: 'room-1', strainName: 'Wedding Cake', harvestDate: getDateOffset(21), wetWeight: 0, dryWeight: 0, dryRatio: 0, plantCount: 48, yieldPerPlant: 0, status: 'upcoming' },
  { id: 'harvest-2', roomId: 'room-6', strainName: 'Wedding Cake', harvestDate: getDateOffset(-8), wetWeight: 24000, dryWeight: 0, dryRatio: 0, plantCount: 48, yieldPerPlant: 0, status: 'drying' },
  { id: 'harvest-3', roomId: 'room-7', strainName: 'Northern Lights', harvestDate: getDateOffset(-21), wetWeight: 18000, dryWeight: 4140, dryRatio: 77, plantCount: 40, yieldPerPlant: 103, status: 'complete', handoffDate: getDateOffset(-7) },
  { id: 'harvest-4', roomId: 'room-1', strainName: 'Purple Punch', harvestDate: getDateOffset(-30), wetWeight: 22100, dryWeight: 5080, dryRatio: 77, plantCount: 48, yieldPerPlant: 106, status: 'complete', handoffDate: getDateOffset(-16) },
  { id: 'harvest-5', roomId: 'room-2', strainName: 'Gorilla Glue', harvestDate: getDateOffset(-52), wetWeight: 19800, dryWeight: 4750, dryRatio: 76, plantCount: 48, yieldPerPlant: 99, status: 'complete', handoffDate: getDateOffset(-38) },
  { id: 'harvest-6', roomId: 'room-1', strainName: 'Sour Diesel', harvestDate: getDateOffset(-75), wetWeight: 21200, dryWeight: 4880, dryRatio: 77, plantCount: 48, yieldPerPlant: 102, status: 'complete', handoffDate: getDateOffset(-61) },
  { id: 'harvest-7', roomId: 'room-2', strainName: 'Northern Lights', harvestDate: getDateOffset(-95), wetWeight: 20600, dryWeight: 4940, dryRatio: 76, plantCount: 48, yieldPerPlant: 103, status: 'complete', handoffDate: getDateOffset(-81) },
  { id: 'harvest-8', roomId: 'room-1', strainName: 'White Widow', harvestDate: getDateOffset(-118), wetWeight: 17000, dryWeight: 3740, dryRatio: 78, plantCount: 48, yieldPerPlant: 78, status: 'complete', handoffDate: getDateOffset(-104) },
  { id: 'harvest-9', roomId: 'room-2', strainName: 'Tangie', harvestDate: getDateOffset(-140), wetWeight: 19400, dryWeight: 4460, dryRatio: 77, plantCount: 48, yieldPerPlant: 93, status: 'complete', handoffDate: getDateOffset(-126) },
  { id: 'harvest-10', roomId: 'room-1', strainName: 'Runtz', harvestDate: getDateOffset(-162), wetWeight: 21800, dryWeight: 5010, dryRatio: 77, plantCount: 48, yieldPerPlant: 104, status: 'complete', handoffDate: getDateOffset(-148) },
  { id: 'harvest-11', roomId: 'room-2', strainName: 'MAC', harvestDate: getDateOffset(-185), wetWeight: 18600, dryWeight: 4460, dryRatio: 76, plantCount: 48, yieldPerPlant: 93, status: 'complete', handoffDate: getDateOffset(-171) },
  { id: 'harvest-12', roomId: 'room-1', strainName: 'Dosidos', harvestDate: getDateOffset(-210), wetWeight: 20500, dryWeight: 4510, dryRatio: 78, plantCount: 48, yieldPerPlant: 94, status: 'complete', handoffDate: getDateOffset(-196) },
];

// ─── Genetics Library (10 strains + 2 more = 12) ──────────────

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
    phenoNotes: 'Pheno #3 selected for density and trichome coverage. Slight purple fade in final 2 weeks under 75F nights.',
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
    difficulty: 'easy', motherPlantStatus: 'active', cloneAvailability: 12,
    growNotes: 'Classic indica. Low THC by current standards but excellent terpene profile and reliable producer.',
    feedingSchedule: 'Light feeder. Does well with organic amendments. Very forgiving of pH fluctuations.',
    ipmNotes: 'Excellent natural resistance to pests and disease. One of the hardiest strains.',
    lastHarvest: getDateOffset(-21), avgYieldActual: '68g/plant',
  },
  {
    id: 'strain-10', name: 'Runtz', breeder: 'Runtz Crew', type: 'hybrid',
    lineage: 'Zkittlez x Gelato', flowerTimeDays: 56, vegTimeDays: 28,
    estimatedYieldPerPlant: '70-90g', thcRange: '24-29%', cbdRange: '<1%',
    terpeneProfile: ['Limonene', 'Linalool', 'Caryophyllene'],
    difficulty: 'advanced', motherPlantStatus: 'active', cloneAvailability: 6,
    growNotes: 'Very resin-heavy, requires careful humidity management.',
    feedingSchedule: 'Medium-heavy feeder. Sensitive to overwatering. Let medium dry back between waterings.',
    ipmNotes: 'Watch for broad mites — small leaf curling is the early sign. Predatory mites recommended preventatively.',
    phenoNotes: 'Testing 3 phenotypes. #2 showing best trichome density and structure.',
  },
  {
    id: 'strain-11', name: 'Purple Punch', breeder: 'Symbiotic Genetics', type: 'indica',
    lineage: 'Larry OG x Granddaddy Purple', flowerTimeDays: 56, vegTimeDays: 28,
    estimatedYieldPerPlant: '75-90g', thcRange: '20-25%', cbdRange: '<1%',
    terpeneProfile: ['Limonene', 'Myrcene', 'Caryophyllene'],
    difficulty: 'easy', motherPlantStatus: 'active', cloneAvailability: 14,
    growNotes: 'Grape candy aroma. Beautiful purple coloring. Compact structure ideal for SOG.',
    feedingSchedule: 'Light to moderate feeder. Responds well to organic amendments.',
    ipmNotes: 'Good pest resistance. Dense buds require good airflow to prevent mold.',
    lastHarvest: getDateOffset(-30), avgYieldActual: '82g/plant',
  },
  {
    id: 'strain-12', name: 'Sour Diesel', breeder: 'Unknown (East Coast)', type: 'sativa',
    lineage: 'Chemdawg 91 x Super Skunk', flowerTimeDays: 70, vegTimeDays: 28,
    estimatedYieldPerPlant: '80-100g', thcRange: '20-25%', cbdRange: '<1%',
    terpeneProfile: ['Myrcene', 'Limonene', 'Caryophyllene'],
    difficulty: 'moderate', motherPlantStatus: 'active', cloneAvailability: 10,
    growNotes: 'Long flower time but heavy producer. Fuel/diesel aroma. Heavy stretcher — needs height management.',
    feedingSchedule: 'Moderate to heavy feeder. Benefits from silica supplement for stem strength.',
    ipmNotes: 'Moderate pest resistance. Needs good airflow due to tall, open structure.',
    lastHarvest: getDateOffset(-75), avgYieldActual: '88g/plant',
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
  { id: 'supply-14', name: 'Beneficial Insects — Ladybugs', category: 'ipm', currentStock: 0, unit: '1500ct container', reorderPoint: 1, reorderQuantity: 2, costPerUnit: 18, supplier: "Nature's Good Guys", status: 'out-of-stock', applicationFrequency: 'As needed for aphid control' },
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
  const now = new Date();
  const todayDow = now.getDay();

  for (const room of rooms) {
    const week = Math.floor(room.dayInStage / 7) + 1;
    const stage = room.stage;

    // Monday: Inspection (all rooms)
    tasks.push({
      id: `task-${taskId++}`, roomId: room.id, title: `Room inspection — ${room.name}`,
      description: `Full room walkthrough: check plants, environment sensors, equipment, cleanliness.`,
      category: 'inspection', stage, weekOfStage: week, dayOfWeek: 1, recurring: true,
      assignee: ASSIGNEES[taskId % 4], priority: 'medium', status: 'todo',
      dueDate: getDateOffset(1 - todayDow + (1 <= todayDow ? 0 : 7)),
      tags: ['walkthrough'],
    });

    if (stage === 'flower') {
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Feeding — ${room.name}`,
        description: week >= 4 ? `Flower feed: Flora Bloom 8ml/gal, Flora Micro 5ml/gal, CalMag 5ml/gal, PK 13/14 1.5ml/gal. Target EC 2.0-2.4, pH 6.0-6.3.` : `Transition feed: Flora Bloom 5ml/gal, Flora Micro 5ml/gal, Flora Grow 2ml/gal, CalMag 5ml/gal. Target EC 1.8-2.0.`,
        category: 'feeding', stage, weekOfStage: week, dayOfWeek: 2, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'high', status: 'todo',
        dueDate: getDateOffset(2 - todayDow + (2 <= todayDow ? 0 : 7)),
        tags: ['nutrients'],
      });
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Light feed — ${room.name}`,
        description: `Half-strength nutrient mix. Check runoff EC and pH.`,
        category: 'feeding', stage, weekOfStage: week, dayOfWeek: 4, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'medium', status: 'todo',
        dueDate: getDateOffset(4 - todayDow + (4 <= todayDow ? 0 : 7)),
        tags: ['nutrients'],
      });
      if (week <= 3) {
        tasks.push({
          id: `task-${taskId++}`, roomId: room.id, title: `IPM spray — ${room.name}`,
          description: `Preventative neem oil application. Only in early flower — no spraying after week 3.`,
          category: 'ipm', stage, weekOfStage: week, dayOfWeek: 1, recurring: true,
          assignee: ASSIGNEES[taskId % 4], priority: 'medium', status: 'todo',
          dueDate: getDateOffset(1 - todayDow + (1 <= todayDow ? 0 : 7)),
          tags: ['ipm', 'preventative'],
        });
      }
      if (week === 3 || week === 6) {
        tasks.push({
          id: `task-${taskId++}`, roomId: room.id, title: `Defoliation — ${room.name}`,
          description: week === 3 ? `Remove large fan leaves blocking bud sites. Lollipop lower 1/3 of canopy.` : `Final defoliation. Remove any large fans blocking light to colas.`,
          category: 'defoliation', stage, weekOfStage: week, dayOfWeek: 3, recurring: false,
          assignee: ASSIGNEES[taskId % 4], priority: 'high', status: 'todo',
          dueDate: getDateOffset(3 - todayDow + (3 <= todayDow ? 0 : 7)),
          tags: ['canopy'],
        });
      }
      if (room.dayInStage >= room.totalDaysExpected - 14) {
        tasks.push({
          id: `task-${taskId++}`, roomId: room.id, title: `Flush check — ${room.name}`,
          description: `Check runoff EC. Target < 0.5. Water only, no nutrients. Monitor trichomes daily.`,
          category: 'flush', stage, weekOfStage: week, dayOfWeek: 5, recurring: true,
          assignee: ASSIGNEES[taskId % 4], priority: 'high', status: 'todo',
          dueDate: getDateOffset(5 - todayDow + (5 <= todayDow ? 0 : 7)),
          tags: ['harvest-prep'],
        });
      }
      if (room.dayInStage >= room.totalDaysExpected - 3) {
        tasks.push({
          id: `task-${taskId++}`, roomId: room.id, title: `Harvest prep — ${room.name}`,
          description: `Trichome check (70% milky, 20% amber = peak THC). Prep dry room, clean scissors, schedule trim team.`,
          category: 'harvest-prep', stage, weekOfStage: week, dayOfWeek: 5, recurring: false,
          assignee: ASSIGNEES[taskId % 4], priority: 'urgent', status: 'todo',
          dueDate: getDateOffset(3),
          tags: ['harvest'],
        });
      }
    } else if (stage === 'veg') {
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Feeding — ${room.name}`,
        description: `Veg feed: Flora Grow 10ml/gal, Flora Micro 5ml/gal, CalMag 5ml/gal. Target EC 1.4-1.8, pH 5.8-6.2.`,
        category: 'feeding', stage, weekOfStage: week, dayOfWeek: 2, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'high', status: 'todo',
        dueDate: getDateOffset(2 - todayDow + (2 <= todayDow ? 0 : 7)),
        tags: ['nutrients'],
      });
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Light feed — ${room.name}`,
        description: `Half-strength veg nutrients. Foliar CalMag spray if needed.`,
        category: 'feeding', stage, weekOfStage: week, dayOfWeek: 4, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'medium', status: 'todo',
        dueDate: getDateOffset(4 - todayDow + (4 <= todayDow ? 0 : 7)),
        tags: ['nutrients'],
      });
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Training & defoliation — ${room.name}`,
        description: week <= 2 ? `Top plants if not yet topped. Begin LST. Light defoliation.` : `Heavy defoliation. Install SCROG net if not done. Tuck branches under net.`,
        category: week <= 2 ? 'training' : 'defoliation', stage, weekOfStage: week, dayOfWeek: 3, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'medium', status: 'todo',
        dueDate: getDateOffset(3 - todayDow + (3 <= todayDow ? 0 : 7)),
        tags: ['canopy'],
      });
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `IPM scout + spray — ${room.name}`,
        description: `Check sticky traps. Inspect undersides of leaves. Neem oil preventative if needed.`,
        category: 'ipm', stage, weekOfStage: week, dayOfWeek: 4, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'medium', status: 'todo',
        dueDate: getDateOffset(4 - todayDow + (4 <= todayDow ? 0 : 7)),
        tags: ['ipm'],
      });
      if (week >= 3 && week <= 4) {
        tasks.push({
          id: `task-${taskId++}`, roomId: room.id, title: `Transplant check — ${room.name}`,
          description: `Check if roots are filling container. Transplant to final pot if root-bound.`,
          category: 'transplant', stage, weekOfStage: week, dayOfWeek: 5, recurring: false,
          assignee: ASSIGNEES[taskId % 4], priority: 'medium', status: 'todo',
          dueDate: getDateOffset(5 - todayDow + (5 <= todayDow ? 0 : 7)),
          tags: ['transplant'],
        });
      }
    } else if (stage === 'dry' || stage === 'cure') {
      for (let d = 1; d <= 5; d++) {
        tasks.push({
          id: `task-${taskId++}`, roomId: room.id, title: `${stage === 'dry' ? 'Dry' : 'Cure'} room check — ${room.name}`,
          description: stage === 'dry'
            ? `Check temp (60F target), humidity (60% target). Check stem snap test. No visitors.`
            : `Burp jars, check humidity (62% target). Inspect for mold. Record terpene notes.`,
          category: 'environmental', stage, weekOfStage: week, dayOfWeek: d, recurring: true,
          assignee: ASSIGNEES[taskId % 4], priority: 'high', status: 'todo',
          dueDate: getDateOffset(d - todayDow + (d <= todayDow ? 0 : 7)),
          tags: [stage],
        });
      }
    } else if (stage === 'propagation' || stage === 'clone') {
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Clone care — ${room.name}`,
        description: `Mist domes, check humidity (75-80%), remove any dead cuttings. Check for root development.`,
        category: 'environmental', stage, weekOfStage: week, dayOfWeek: 1, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'high', status: 'todo',
        dueDate: getDateOffset(1 - todayDow + (1 <= todayDow ? 0 : 7)),
        tags: ['clones'],
      });
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Clone feeding — ${room.name}`,
        description: `Light foliar spray with rooting solution. EC < 0.8.`,
        category: 'feeding', stage, weekOfStage: week, dayOfWeek: 3, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'medium', status: 'todo',
        dueDate: getDateOffset(3 - todayDow + (3 <= todayDow ? 0 : 7)),
        tags: ['clones', 'nutrients'],
      });
    } else if (stage === 'mother') {
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Mother plant pruning — ${room.name}`,
        description: `Prune mother plants to maintain shape. Take cuttings if clone room has capacity.`,
        category: 'training', stage, weekOfStage: week, dayOfWeek: 2, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'medium', status: 'todo',
        dueDate: getDateOffset(2 - todayDow + (2 <= todayDow ? 0 : 7)),
        tags: ['mothers'],
      });
      tasks.push({
        id: `task-${taskId++}`, roomId: room.id, title: `Mother feeding — ${room.name}`,
        description: `Light veg nutrients. EC 1.0-1.2. Keep mothers healthy but not overly vigorous.`,
        category: 'feeding', stage, weekOfStage: week, dayOfWeek: 3, recurring: true,
        assignee: ASSIGNEES[taskId % 4], priority: 'medium', status: 'todo',
        dueDate: getDateOffset(3 - todayDow + (3 <= todayDow ? 0 : 7)),
        tags: ['mothers', 'nutrients'],
      });
    }
  }

  // Add specific named tasks from the spec
  const specTasks: CultivationTask[] = [
    {
      id: `task-${taskId++}`, roomId: 'room-1', title: 'Check trichome development Room 1 — Wedding Cake',
      description: 'Daily trichome check with 60x loupe. Record milky/amber/clear percentages.',
      category: 'inspection', stage: 'flower', weekOfStage: 6, dayOfWeek: todayDow, recurring: true,
      assignee: 'Marco R.', priority: 'high', status: 'in-progress',
      dueDate: getDateOffset(0), tags: ['trichomes', 'harvest-prep'],
    },
    {
      id: `task-${taskId++}`, roomId: 'room-4', title: 'Transplant clones to Veg Room 2',
      description: 'Transfer rooted clones from Clone Room to Veg Room 2. Prepare 1-gallon pots with Coco Loco.',
      category: 'transplant', stage: 'veg', weekOfStage: 2, dayOfWeek: todayDow + 1, recurring: false,
      assignee: 'Sofia L.', priority: 'medium', status: 'todo',
      dueDate: getDateOffset(1), tags: ['transplant'],
    },
    {
      id: `task-${taskId++}`, roomId: 'room-6', title: 'Clean and sanitize Dry Room',
      description: 'Deep clean dry room. H2O2 wipe all surfaces. Check HVAC filters. Prep for next harvest.',
      category: 'cleaning', stage: 'dry', weekOfStage: 1, dayOfWeek: todayDow - 1, recurring: false,
      assignee: 'Carlos M.', priority: 'low', status: 'done',
      completedAt: new Date(Date.now() - 86400000).toISOString(), completedBy: 'Carlos M.',
      dueDate: getDateOffset(-1), tags: ['cleaning'],
    },
    {
      id: `task-${taskId++}`, roomId: 'room-1', title: 'Mix Flower Late nutrient batch',
      description: 'Mix 50-gallon batch of Flower Late recipe. Flora Bloom 8ml/gal, Flora Micro 5ml/gal, CalMag 5ml/gal, PK 13/14 1.5ml/gal. Verify EC 2.2, pH 6.2.',
      category: 'feeding', stage: 'flower', weekOfStage: 6, dayOfWeek: todayDow, recurring: false,
      assignee: 'Diana P.', priority: 'high', status: 'todo',
      dueDate: getDateOffset(0), tags: ['nutrients', 'mixing'],
    },
    {
      id: `task-${taskId++}`, roomId: 'room-1', title: 'Harvest Room 1 — Wedding Cake',
      description: 'Full harvest of Wedding Cake + Gelato. 48 plants. Estimated 4.8 kg wet. Schedule trim team and prep dry room.',
      category: 'harvest-prep', stage: 'flower', weekOfStage: 9, dayOfWeek: todayDow + 3, recurring: false,
      assignee: 'Marco R.', priority: 'urgent', status: 'todo',
      dueDate: getDateOffset(3), tags: ['harvest'],
    },
    {
      id: `task-${taskId++}`, roomId: 'room-3', title: 'IPM spray — all veg rooms',
      description: 'Preventative neem oil spray on all veg rooms. Check sticky traps and replace as needed.',
      category: 'ipm', stage: 'veg', weekOfStage: 4, dayOfWeek: todayDow, recurring: true,
      assignee: 'Sofia L.', priority: 'medium', status: 'in-progress',
      dueDate: getDateOffset(0), tags: ['ipm', 'preventative'],
    },
    {
      id: `task-${taskId++}`, roomId: 'room-2', title: 'Replace HVAC filters Room 2',
      description: 'Replace 20x25x4 HVAC filters in Flower Room B. Check supply from inventory.',
      category: 'environmental', stage: 'flower', weekOfStage: 3, dayOfWeek: todayDow + 5, recurring: false,
      assignee: 'Carlos M.', priority: 'low', status: 'todo',
      dueDate: getDateOffset(5), tags: ['hvac', 'maintenance'],
    },
    {
      id: `task-${taskId++}`, roomId: 'room-1', title: 'Take runoff samples all flower rooms',
      description: 'Collect runoff from Flower Room A and B. Test pH and EC. Record in log.',
      category: 'inspection', stage: 'flower', weekOfStage: 6, dayOfWeek: todayDow, recurring: true,
      assignee: 'Diana P.', priority: 'medium', status: 'done',
      completedAt: new Date(Date.now() - 3600000).toISOString(), completedBy: 'Diana P.',
      dueDate: getDateOffset(0), tags: ['runoff', 'testing'],
    },
  ];

  tasks.push(...specTasks);

  // Assign statuses based on day of week
  tasks.forEach((t) => {
    if (t.status !== 'done' && t.status !== 'in-progress') {
      if (t.dayOfWeek < todayDow && Math.random() > 0.15) {
        t.status = 'done';
        t.completedAt = new Date(now.getTime() - (todayDow - t.dayOfWeek) * 86400000).toISOString();
        t.completedBy = t.assignee;
      } else if (t.dayOfWeek === todayDow && Math.random() > 0.6) {
        t.status = 'in-progress';
      }
    }
  });

  return tasks;
}

// ─── AI Chat Conversations ─────────────────────────────────────

const advisorConversations: CultivationMessage[] = [
  {
    id: 'msg-1', role: 'user',
    content: "What's the optimal VPD for Week 6 of flower?",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'msg-2', role: 'assistant',
    content: "**Optimal VPD for Week 6 Flower: 1.2-1.4 kPa**\n\nAt this stage, your plants are in peak resin production. Here's the breakdown:\n\n**Target Range:** 1.2-1.4 kPa\n- Lower end (1.2) = safer, less stress on plants\n- Upper end (1.4) = pushes transpiration, can increase resin production\n\n**How to achieve this at your temps:**\n- At 78°F → target 48-52% RH for 1.2-1.4 kPa\n- At 80°F → target 50-54% RH for the same VPD range\n\n**Why it matters in Week 6:**\n- Peak trichome development — consistent VPD prevents stress\n- Too low VPD (< 1.0) → stomata close, reduced transpiration, slower resin production\n- Too high VPD (> 1.6) → plant stress, leaf curling, potential nutrient lockout\n\n**Your current rooms:**\n- Flower Room A: VPD 1.21 kPa — in range\n- Flower Room B: VPD 1.15 kPa — slightly low, could increase by lowering RH 2-3%\n\nKeep your dehumidifiers dialed in and monitor every 4 hours during lights-on period.",
    timestamp: new Date(Date.now() - 7100000).toISOString(),
  },
  {
    id: 'msg-3', role: 'user',
    content: 'Room 3 humidity is trending high, what should I adjust?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'msg-4', role: 'assistant',
    content: "**Veg Room (Room 3) — Humidity Trending at 58% (target max 55%)**\n\nThis is a moderate concern for veg but not critical yet. Here's what to check:\n\n1. **Dehumidifier settings** — Increase target from current setting. Set to 52% to give headroom.\n2. **Air exchange rate** — Your H.E. Anderson system shows damper at 65%. Consider opening to 75% temporarily to increase fresh air intake.\n3. **Plant density** — 64 plants in veg transpire heavily. If canopy is dense, a light defoliation will reduce humidity.\n4. **Watering schedule** — Check if GrowLink is irrigating too frequently. In veg week 4, every 6 hours is sufficient.\n5. **Night cycle** — Humidity spikes during lights-off are common. Run dehumidifier at higher output during dark period.\n\n**Immediate action:** Increase dehumidifier output and open dampers to 75%. Monitor for 4 hours.\n\n**If it doesn't improve:** Check the dehumidifier filter and drain line. Room 3's unit was serviced 15 days ago — it may need the filter cleaned again.",
    timestamp: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: 'msg-5', role: 'user',
    content: 'When should I switch Room 4 from veg to flower?',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'msg-6', role: 'assistant',
    content: "**Veg Room 2 (Room 4) — OG Kush + Jack Herer, Day 14 of 35**\n\nYou have about 3 weeks of veg remaining. Here's what to consider for the flip:\n\n**When to flip (criteria-based, not just calendar):**\n1. **Height:** Plants should be 12-18\" tall. OG Kush stretches 1.5x in flower, Jack Herer stretches 2x. Plan for final height.\n2. **Root development:** Roots should fill the 5-gallon pot. Check drainage holes for root tips.\n3. **Canopy coverage:** SCROG net should be 70-80% filled before flip. Currently at day 14 — topping just happened.\n4. **Plant health:** All plants should be pest-free, well-fed, and showing vigorous growth.\n\n**My recommendation:** Flip at day 28-35, when:\n- [ ] Canopy fills 75% of SCROG net\n- [ ] All topped branches have recovered and are growing evenly\n- [ ] Root mass fills containers\n- [ ] IPM preventative completed (last spray before flip)\n\n**Pre-flip checklist:**\n- Run one flush with plain water 2 days before flip\n- Switch nutrient recipe from Veg to Flower Early\n- Adjust light schedule from 18/6 to 12/12\n- Lower CO2 target slightly (1200 → 1100 ppm)\n- Increase dehumidifier — humidity management is critical from day 1 of flower\n\n**Timeline:** Earliest flip: Day 28 (2 weeks). Recommended: Day 32-35.",
    timestamp: new Date(Date.now() - 1700000).toISOString(),
  },
];

const chatSuggestions: CultivationSuggestion[] = [
  { id: 'sug-1', text: "What's the optimal VPD for Week 6 of flower?" },
  { id: 'sug-2', text: 'Room 3 humidity is trending high, what should I adjust?' },
  { id: 'sug-3', text: 'When should I switch Room 4 from veg to flower?' },
  { id: 'sug-4', text: 'What strains should we consider for next quarter?' },
  { id: 'sug-5', text: 'Show me environment trends for Flower Room A' },
  { id: 'sug-6', text: 'How do I optimize DLI for our flowering rooms?' },
];

// ─── Chat Matching ─────────────────────────────────────────────

export function matchCultivationChat(input: string): CultivationMessage | null {
  const lower = input.toLowerCase();
  if (lower.includes('vpd') || lower.includes('week 6')) {
    return advisorConversations[1];
  }
  if (lower.includes('humidity') || lower.includes('room 3') || lower.includes('trending')) {
    return advisorConversations[3];
  }
  if (lower.includes('switch') || lower.includes('room 4') || lower.includes('veg to flower') || lower.includes('flip')) {
    return advisorConversations[5];
  }
  return null;
}

export function getCultivationFallback(_input: string): CultivationMessage {
  return {
    id: `msg-fallback-${Date.now()}`,
    role: 'assistant',
    content: `I'd be happy to help with that. Based on current room data:\n\n- **Flower Room A:** Wedding Cake + Gelato, flower day 42/63, all optimal\n- **Flower Room B:** Blue Dream + GSC, flower day 21/56, all optimal\n- **Veg Room:** Zkittlez + Purple Punch, veg day 28/35, humidity warning\n- **Veg Room 2:** OG Kush + Jack Herer, veg day 14/35, optimal\n- **Clone Room:** 120 clones, propagation day 7/14\n- **Dry Room:** Wedding Cake, drying day 8/12\n- **Cure Room:** Northern Lights + Runtz, curing day 21/30\n- **Mother Room:** 12 mothers, 8 strains\n\nCould you be more specific about what you'd like to know? I can help with feeding schedules, environment troubleshooting, harvest timing, pest management, or strain recommendations.`,
    timestamp: new Date().toISOString(),
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

export async function getCultivationChat(): Promise<{ messages: CultivationMessage[]; suggestions: CultivationSuggestion[] }> {
  await delay(300);
  return {
    messages: [...advisorConversations],
    suggestions: [...chatSuggestions],
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
  const vegRooms = growRooms.filter((r) => r.stage === 'veg' || r.stage === 'propagation' || r.stage === 'mother');
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

export async function getIrrigationEvents(roomId: string): Promise<IrrigationEvent[]> {
  await delay(300);
  return generateIrrigationEvents(roomId);
}

export async function getNutrientRecipes(): Promise<NutrientRecipe[]> {
  await delay(300);
  return [...nutrientRecipes];
}

export async function getNutrientRecipeForRoom(roomId: string): Promise<NutrientRecipe | undefined> {
  await delay(300);
  const room = growRooms.find((r) => r.id === roomId);
  if (!room) return undefined;
  if (room.stage === 'flower') {
    return room.dayInStage > 28 ? nutrientRecipes[2] : nutrientRecipes[1];
  }
  if (room.stage === 'veg' || room.stage === 'mother' || room.stage === 'propagation') {
    return nutrientRecipes[0];
  }
  return undefined;
}

// ─── Grow Cycles ──────────────────────────────────────────────

const STRAIN_NAMES = [
  'Wedding Cake', 'Blue Dream', 'Zkittlez', 'OG Kush', 'Gelato',
  'Purple Punch', 'GSC', 'Jack Herer', 'Runtz', 'Gorilla Glue',
  'Mimosa', 'Tropicana Cookies', 'MAC', 'Ice Cream Cake', 'Cherry Pie',
];

const ROOM_NAMES = [
  'Flower Room A', 'Flower Room B', 'Veg Room', 'Veg Room 2',
  'Clone Room', 'Mother Room', 'Dry Room', 'Cure Room',
];

const growCycles: GrowCycle[] = [
  { id: 'gc-1', roomId: 'room-1', roomName: 'Flower Room A', strainId: 'strain-1', strainName: 'Wedding Cake', startDate: getDateOffset(-70), currentStage: 'flower', dayInStage: 42, totalDays: 70, expectedHarvestDate: getDateOffset(21), plantCount: 48, status: 'active' },
  { id: 'gc-2', roomId: 'room-2', roomName: 'Flower Room B', strainId: 'strain-2', strainName: 'Blue Dream', startDate: getDateOffset(-49), currentStage: 'flower', dayInStage: 21, totalDays: 56, expectedHarvestDate: getDateOffset(35), plantCount: 48, status: 'active' },
  { id: 'gc-3', roomId: 'room-3', roomName: 'Veg Room', strainId: 'strain-5', strainName: 'Zkittlez', startDate: getDateOffset(-28), currentStage: 'veg', dayInStage: 28, totalDays: 35, expectedHarvestDate: getDateOffset(63), plantCount: 64, status: 'active' },
  { id: 'gc-4', roomId: 'room-4', roomName: 'Veg Room 2', strainId: 'strain-6', strainName: 'OG Kush', startDate: getDateOffset(-14), currentStage: 'veg', dayInStage: 14, totalDays: 35, expectedHarvestDate: getDateOffset(77), plantCount: 36, status: 'active' },
  { id: 'gc-5', roomId: 'room-5', roomName: 'Clone Room', strainId: 'strain-3', strainName: 'Gelato', startDate: getDateOffset(-10), currentStage: 'clone', dayInStage: 10, totalDays: 14, expectedHarvestDate: getDateOffset(90), plantCount: 120, status: 'active' },
  { id: 'gc-6', roomId: 'room-1', roomName: 'Flower Room A', strainId: 'strain-4', strainName: 'Purple Punch', startDate: getDateOffset(-140), currentStage: 'harvest', dayInStage: 0, totalDays: 65, expectedHarvestDate: getDateOffset(-75), plantCount: 48, status: 'completed', notes: 'Yielded 5.1 kg. Great trichome density.' },
  { id: 'gc-7', roomId: 'room-2', roomName: 'Flower Room B', strainId: 'strain-7', strainName: 'Jack Herer', startDate: getDateOffset(-160), currentStage: 'harvest', dayInStage: 0, totalDays: 60, expectedHarvestDate: getDateOffset(-100), plantCount: 48, status: 'completed', notes: 'Slightly below expected yield due to heat spike in week 6.' },
  { id: 'gc-8', roomId: 'room-3', roomName: 'Veg Room', strainId: 'strain-8', strainName: 'Runtz', startDate: getDateOffset(7), currentStage: 'clone', dayInStage: 0, totalDays: 35, expectedHarvestDate: getDateOffset(98), plantCount: 64, status: 'planned', notes: 'Clones ordered from nursery. Expected delivery next week.' },
  { id: 'gc-9', roomId: 'room-4', roomName: 'Veg Room 2', strainId: 'strain-9', strainName: 'Gorilla Glue', startDate: getDateOffset(-200), currentStage: 'harvest', dayInStage: 0, totalDays: 70, expectedHarvestDate: getDateOffset(-130), plantCount: 36, status: 'completed' },
  { id: 'gc-10', roomId: 'room-1', roomName: 'Flower Room A', strainId: 'strain-10', strainName: 'Mimosa', startDate: getDateOffset(-250), currentStage: 'harvest', dayInStage: 0, totalDays: 58, expectedHarvestDate: getDateOffset(-192), plantCount: 48, status: 'completed' },
  { id: 'gc-11', roomId: 'room-5', roomName: 'Clone Room', strainId: 'strain-11', strainName: 'Tropicana Cookies', startDate: getDateOffset(-180), currentStage: 'clone', dayInStage: 0, totalDays: 14, expectedHarvestDate: getDateOffset(-100), plantCount: 100, status: 'cancelled', notes: 'Cancelled — root rot detected in source mother.' },
];

// ─── Plants ───────────────────────────────────────────────────

const HEALTH_OPTIONS: PlantHealth[] = ['healthy', 'healthy', 'healthy', 'healthy', 'stressed', 'sick'];

function generatePlants(): Plant[] {
  const plants: Plant[] = [];
  let id = 1;
  for (const room of growRooms) {
    const count = Math.min(room.plantCount, 12);
    for (let i = 0; i < count; i++) {
      plants.push({
        id: `plant-${id}`,
        plantTag: `1A406${String(id).padStart(10, '0')}${Math.floor(Math.random() * 9000 + 1000)}`,
        strainId: room.strainId,
        strainName: room.strainName.split(' + ')[0],
        roomId: room.id,
        roomName: room.name,
        stage: room.stage as GrowStage,
        health: HEALTH_OPTIONS[Math.floor(Math.random() * HEALTH_OPTIONS.length)],
        daysSinceTransplant: room.dayInStage + Math.floor(Math.random() * 5),
        sourceType: room.stage === 'clone' || room.stage === 'propagation' ? 'clone' : room.stage === 'mother' ? 'mother' : (Math.random() > 0.2 ? 'clone' : 'seed'),
      });
      id++;
    }
  }
  return plants;
}

const mockPlants = generatePlants();

// ─── QA Lots ──────────────────────────────────────────────────

const LAB_NAMES = ['Confidence Analytics', 'Green Leaf Lab', 'Pacific Agricultural Lab', 'Kaycha Labs WA'];

const qaLots: QALot[] = [
  { id: 'lot-1', lotNumber: 'LOT-2026-001', strainName: 'Wedding Cake', harvestDate: getDateOffset(-30), batchSize: 2400, unit: 'grams', status: 'released', labName: LAB_NAMES[0], submittedDate: getDateOffset(-28), resultsDate: getDateOffset(-21) },
  { id: 'lot-2', lotNumber: 'LOT-2026-002', strainName: 'Purple Punch', harvestDate: getDateOffset(-25), batchSize: 3100, unit: 'grams', status: 'passed', labName: LAB_NAMES[1], submittedDate: getDateOffset(-23), resultsDate: getDateOffset(-16) },
  { id: 'lot-3', lotNumber: 'LOT-2026-003', strainName: 'Blue Dream', harvestDate: getDateOffset(-18), batchSize: 2800, unit: 'grams', status: 'in-testing', labName: LAB_NAMES[2], submittedDate: getDateOffset(-15) },
  { id: 'lot-4', lotNumber: 'LOT-2026-004', strainName: 'Jack Herer', harvestDate: getDateOffset(-12), batchSize: 1900, unit: 'grams', status: 'pending' },
  { id: 'lot-5', lotNumber: 'LOT-2026-005', strainName: 'OG Kush', harvestDate: getDateOffset(-45), batchSize: 2200, unit: 'grams', status: 'failed', labName: LAB_NAMES[3], submittedDate: getDateOffset(-43), resultsDate: getDateOffset(-36) },
  { id: 'lot-6', lotNumber: 'LOT-2026-006', strainName: 'Gorilla Glue', harvestDate: getDateOffset(-60), batchSize: 3500, unit: 'grams', status: 'released', labName: LAB_NAMES[0], submittedDate: getDateOffset(-58), resultsDate: getDateOffset(-50) },
  { id: 'lot-7', lotNumber: 'LOT-2026-007', strainName: 'Gelato', harvestDate: getDateOffset(-8), batchSize: 2100, unit: 'grams', status: 'pending' },
  { id: 'lot-8', lotNumber: 'LOT-2026-008', strainName: 'Zkittlez', harvestDate: getDateOffset(-55), batchSize: 2700, unit: 'grams', status: 'released', labName: LAB_NAMES[1], submittedDate: getDateOffset(-53), resultsDate: getDateOffset(-45) },
];

// ─── QA Samples ───────────────────────────────────────────────

const qaSamples: QASample[] = [
  { id: 'qs-1', sampleId: 'SMP-001', lotId: 'lot-1', lotNumber: 'LOT-2026-001', labName: LAB_NAMES[0], testTypes: ['potency', 'terpenes', 'pesticides', 'microbials'], status: 'reviewed', collectedDate: getDateOffset(-29), submittedDate: getDateOffset(-28), resultsDate: getDateOffset(-21), thc: 28.4, cbd: 0.12, totalTerpenes: 3.8, passedAll: true },
  { id: 'qs-2', sampleId: 'SMP-002', lotId: 'lot-2', lotNumber: 'LOT-2026-002', labName: LAB_NAMES[1], testTypes: ['potency', 'terpenes', 'pesticides'], status: 'reviewed', collectedDate: getDateOffset(-24), submittedDate: getDateOffset(-23), resultsDate: getDateOffset(-16), thc: 24.1, cbd: 0.08, totalTerpenes: 2.9, passedAll: true },
  { id: 'qs-3', sampleId: 'SMP-003', lotId: 'lot-3', lotNumber: 'LOT-2026-003', labName: LAB_NAMES[2], testTypes: ['potency', 'terpenes', 'pesticides', 'microbials', 'heavy-metals'], status: 'in-testing', collectedDate: getDateOffset(-16), submittedDate: getDateOffset(-15) },
  { id: 'qs-4', sampleId: 'SMP-004', lotId: 'lot-4', lotNumber: 'LOT-2026-004', labName: LAB_NAMES[3], testTypes: ['potency', 'pesticides'], status: 'collected', collectedDate: getDateOffset(-11) },
  { id: 'qs-5', sampleId: 'SMP-005', lotId: 'lot-5', lotNumber: 'LOT-2026-005', labName: LAB_NAMES[3], testTypes: ['potency', 'pesticides', 'microbials'], status: 'reviewed', collectedDate: getDateOffset(-44), submittedDate: getDateOffset(-43), resultsDate: getDateOffset(-36), thc: 19.2, cbd: 0.3, totalTerpenes: 1.4, passedAll: false },
  { id: 'qs-6', sampleId: 'SMP-006', lotId: 'lot-6', lotNumber: 'LOT-2026-006', labName: LAB_NAMES[0], testTypes: ['potency', 'terpenes', 'pesticides', 'microbials', 'residual-solvents'], status: 'reviewed', collectedDate: getDateOffset(-59), submittedDate: getDateOffset(-58), resultsDate: getDateOffset(-50), thc: 30.2, cbd: 0.05, totalTerpenes: 4.1, passedAll: true },
  { id: 'qs-7', sampleId: 'SMP-007', lotId: 'lot-3', lotNumber: 'LOT-2026-003', labName: LAB_NAMES[2], testTypes: ['moisture'], status: 'submitted', collectedDate: getDateOffset(-16), submittedDate: getDateOffset(-14) },
  { id: 'qs-8', sampleId: 'SMP-008', lotId: 'lot-7', lotNumber: 'LOT-2026-007', labName: LAB_NAMES[1], testTypes: ['potency', 'terpenes'], status: 'collected', collectedDate: getDateOffset(-7) },
];

// ─── Disposal Records ─────────────────────────────────────────

const WITNESSES = ['Michael Perkins', 'Sarah Chen', 'James Rodriguez', 'Emily Frost'];

const disposalRecords: DisposalRecord[] = [
  { id: 'disp-1', itemDescription: 'OG Kush trim — failed pesticide screen', reason: 'failed-qa', method: 'compost', weightGrams: 2200, disposalDate: getDateOffset(-35), witness: WITNESSES[0], metrcTag: '1A40603000012345001', complianceStatus: 'compliant' },
  { id: 'disp-2', itemDescription: 'Veg Room dead plants — root rot', reason: 'pest-contamination', method: 'compost', weightGrams: 850, disposalDate: getDateOffset(-22), witness: WITNESSES[1], metrcTag: '1A40603000012345002', complianceStatus: 'compliant' },
  { id: 'disp-3', itemDescription: 'Blue Dream larf — mold discovered post-dry', reason: 'mold', method: 'incineration', weightGrams: 1400, disposalDate: getDateOffset(-14), witness: WITNESSES[2], metrcTag: '1A40603000012345003', complianceStatus: 'compliant', notes: 'Isolated incident. Room sanitized.' },
  { id: 'disp-4', itemDescription: 'Expired nutrient stock — General Hydroponics', reason: 'expired', method: 'rendering', weightGrams: 5000, disposalDate: getDateOffset(-8), witness: WITNESSES[3], complianceStatus: 'compliant' },
  { id: 'disp-5', itemDescription: 'Clone Room runts — stunted growth batch', reason: 'damaged', method: 'compost', weightGrams: 320, disposalDate: getDateOffset(-5), witness: WITNESSES[0], metrcTag: '1A40603000012345005', complianceStatus: 'pending-review', notes: 'Awaiting manager sign-off.' },
  { id: 'disp-6', itemDescription: 'Purple Punch stems — post-harvest waste', reason: 'regulatory', method: 'compost', weightGrams: 3200, disposalDate: getDateOffset(-42), witness: WITNESSES[1], metrcTag: '1A40603000012345006', complianceStatus: 'compliant' },
  { id: 'disp-7', itemDescription: 'Mother plant removal — Tropicana Cookies', reason: 'pest-contamination', method: 'incineration', weightGrams: 1100, disposalDate: getDateOffset(-60), witness: WITNESSES[2], metrcTag: '1A40603000012345007', complianceStatus: 'compliant', notes: 'Mother retired after root rot spread. All clones from this mother quarantined.' },
];

// ─── New Getters ──────────────────────────────────────────────

export async function getGrowCycles(): Promise<GrowCycle[]> {
  await delay(350);
  return [...growCycles];
}

export async function getPlants(filters?: { roomId?: string; stage?: string; health?: string; search?: string }): Promise<Plant[]> {
  await delay(350);
  let result = [...mockPlants];
  if (filters?.roomId) result = result.filter((p) => p.roomId === filters.roomId);
  if (filters?.stage) result = result.filter((p) => p.stage === filters.stage);
  if (filters?.health) result = result.filter((p) => p.health === filters.health);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((p) => p.strainName.toLowerCase().includes(q) || p.plantTag.includes(q) || p.roomName.toLowerCase().includes(q));
  }
  return result;
}

export async function getQALots(): Promise<QALot[]> {
  await delay(300);
  return [...qaLots];
}

export async function getQASamples(): Promise<QASample[]> {
  await delay(300);
  return [...qaSamples];
}

export async function getDisposalRecords(): Promise<DisposalRecord[]> {
  await delay(300);
  return [...disposalRecords];
}
