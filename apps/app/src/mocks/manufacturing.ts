import type {
  WorkOrder,
  ManufacturingBatch,
  ManufacturingMetrics,
  PipelineState,
  ProductionLine,
  Equipment,
  ThroughputDataPoint,
  ProductionDistribution,
  ManufacturingAlert,
} from '@/modules/manufacturing/types';
import type { Task } from '@/modules/tasks/types';

// ── Operators ──────────────────────────────────────────────
const operators = {
  maria: { name: 'María García', role: 'Trim Lead' },
  carlos: { name: 'Carlos Mendez', role: 'Floor Supervisor' },
  james: { name: 'James Park', role: 'Extraction Tech' },
  lisa: { name: 'Lisa Chen', role: 'Pen Filling Specialist' },
  marcus: { name: 'Marcus Johnson', role: 'Preroll Lead' },
  sarah: { name: 'Sarah Williams', role: 'QA Manager' },
  roberto: { name: 'Roberto Flores', role: 'Preroll Operator' },
  ana: { name: 'Ana Dominguez', role: 'Packaging Tech' },
  jessica: { name: 'Jessica Pham', role: 'Fill Line Operator' },
  david: { name: 'David Chen', role: 'Extraction Lead' },
  miguel: { name: 'Miguel Santos', role: 'Concentrate Tech' },
};

// ── Flower pipeline states ─────────────────────────────────
const FLOWER_PIPELINE = ['Dried', 'Bucked', 'Trimmed', 'Bulk Ready', 'COA Pending', 'COA Passed'];
const PREROLL_PIPELINE = ['Ground', 'Rolling', 'Packed', 'COA Pending', 'COA Passed'];
const VAPE_PIPELINE = ['Extracted', 'Crude', 'Distillate', 'Flavored', 'Filled', 'Packagable'];
const CONCENTRATE_PIPELINE = ['Extracted', 'Processed', 'Purged', 'Portioned', 'COA Pending', 'COA Passed'];
const SOLVENTLESS_PIPELINE = ['Washed', 'Collected', 'Pressed', 'Cured', 'Portioned', 'COA Pending'];

// ── Work Orders (20) ──────────────────────────────────────
const workOrders: WorkOrder[] = [
  // ─── Flower Processing (6) ───
  {
    id: 'WO-2026-0307-001',
    type: 'flower',
    status: 'in-progress',
    priority: 'high',
    title: 'Wedding Cake bucking — 10 lbs dried',
    description: 'Buck 10 lbs dried Wedding Cake. Remove fan leaves and separate colas for trimming.',
    assignee: operators.maria.name,
    assigneeRole: operators.maria.role,
    estimatedMinutes: 150,
    batchNumber: 'B2026-0305-001',
    inputMaterials: [
      { name: 'Wedding Cake Dried Flower', type: 'cannabis', quantity: 10, unit: 'lbs', available: true },
      { name: 'Trim Bins', type: 'non-cannabis', quantity: 6, unit: 'units', available: true },
      { name: 'Trim Labor', type: 'labor', quantity: 2.5, unit: 'hours', available: true },
    ],
    outputProduct: 'Wedding Cake Bucked Flower',
    outputQuantity: 9,
    outputUnit: 'lbs',
    readinessStateFrom: 'Dried',
    readinessStateTo: 'Bucked',
    linkedOrderIds: ['ORD-2026-0302'],
    createdAt: '2026-03-07T06:00:00Z',
    startedAt: '2026-03-07T07:15:00Z',
    notes: 'Large colas — set aside for premium 3.5g jars',
    dueDate: '2026-03-07T16:00:00Z',
    progress: 60,
    workers: [operators.maria.name, operators.carlos.name],
    sourceOrderId: 'ORD-2026-0302',
    bomStatus: 'ready',
    pipelineType: 'Flower Processing',
  },
  {
    id: 'WO-2026-0307-002',
    type: 'flower',
    status: 'in-progress',
    priority: 'medium',
    title: 'Blue Dream trimming — 8 lbs bucked',
    description: 'Machine-assisted trim of 8 lbs Blue Dream. Final hand-trim for premium quality.',
    assignee: operators.maria.name,
    assigneeRole: operators.maria.role,
    estimatedMinutes: 180,
    batchNumber: 'B2026-0304-002',
    inputMaterials: [
      { name: 'Blue Dream Bucked Flower', type: 'cannabis', quantity: 8, unit: 'lbs', available: true },
      { name: 'Machine Trimmer Blades', type: 'non-cannabis', quantity: 2, unit: 'sets', available: true },
    ],
    outputProduct: 'Blue Dream Trimmed Flower',
    outputQuantity: 6.5,
    outputUnit: 'lbs',
    readinessStateFrom: 'Bucked',
    readinessStateTo: 'Trimmed',
    linkedOrderIds: ['ORD-2026-0298'],
    createdAt: '2026-03-07T06:00:00Z',
    startedAt: '2026-03-07T08:00:00Z',
    dueDate: '2026-03-07T14:00:00Z',
    progress: 30,
    workers: [operators.maria.name],
    sourceOrderId: 'ORD-2026-0298',
    bomStatus: 'ready',
    pipelineType: 'Flower Processing',
  },
  {
    id: 'WO-2026-0307-003',
    type: 'flower',
    status: 'queued',
    priority: 'medium',
    title: 'Gelato bulk packaging prep — 5 lbs trimmed',
    description: 'Weigh, inspect, and prepare Gelato trimmed flower for bulk packaging.',
    assignee: operators.carlos.name,
    assigneeRole: operators.carlos.role,
    estimatedMinutes: 90,
    batchNumber: 'B2026-0303-003',
    inputMaterials: [
      { name: 'Gelato Trimmed Flower', type: 'cannabis', quantity: 5, unit: 'lbs', available: true },
      { name: 'Turkey Bags (1 lb)', type: 'non-cannabis', quantity: 5, unit: 'bags', available: true },
    ],
    outputProduct: 'Gelato Bulk Ready Flower',
    outputQuantity: 5,
    outputUnit: 'lbs',
    readinessStateFrom: 'Trimmed',
    readinessStateTo: 'Bulk Ready',
    linkedOrderIds: [],
    createdAt: '2026-03-07T06:00:00Z',
    dueDate: '2026-03-08T12:00:00Z',
    progress: 0,
    workers: [operators.carlos.name],
    bomStatus: 'ready',
    pipelineType: 'Flower Processing',
  },
  {
    id: 'WO-2026-0307-004',
    type: 'flower',
    status: 'queued',
    priority: 'high',
    title: 'OG Kush bucking — 12 lbs',
    description: 'Buck 12 lbs OG Kush from latest harvest. Priority strain for wholesale order.',
    assignee: operators.maria.name,
    assigneeRole: operators.maria.role,
    estimatedMinutes: 180,
    batchNumber: 'B2026-0306-004',
    inputMaterials: [
      { name: 'OG Kush Dried Flower', type: 'cannabis', quantity: 12, unit: 'lbs', available: true },
      { name: 'Trim Bins', type: 'non-cannabis', quantity: 8, unit: 'units', available: true },
    ],
    outputProduct: 'OG Kush Bucked Flower',
    outputQuantity: 10.5,
    outputUnit: 'lbs',
    readinessStateFrom: 'Dried',
    readinessStateTo: 'Bucked',
    linkedOrderIds: ['ORD-2026-0310'],
    createdAt: '2026-03-07T06:00:00Z',
    dueDate: '2026-03-08T16:00:00Z',
    progress: 0,
    workers: [operators.maria.name, operators.carlos.name],
    sourceOrderId: 'ORD-2026-0310',
    bomStatus: 'ready',
    pipelineType: 'Flower Processing',
  },
  {
    id: 'WO-2026-0307-005',
    type: 'flower',
    status: 'completed',
    priority: 'medium',
    title: 'GSC trimming — 6 lbs',
    description: 'Machine + hand trim of 6 lbs GSC. Completed early shift.',
    assignee: operators.maria.name,
    assigneeRole: operators.maria.role,
    estimatedMinutes: 120,
    actualMinutes: 105,
    batchNumber: 'B2026-0302-005',
    inputMaterials: [
      { name: 'GSC Bucked Flower', type: 'cannabis', quantity: 6, unit: 'lbs', available: true },
    ],
    outputProduct: 'GSC Trimmed Flower',
    outputQuantity: 5,
    outputUnit: 'lbs',
    readinessStateFrom: 'Bucked',
    readinessStateTo: 'Trimmed',
    linkedOrderIds: [],
    createdAt: '2026-03-07T06:00:00Z',
    startedAt: '2026-03-07T06:30:00Z',
    completedAt: '2026-03-07T08:15:00Z',
    dueDate: '2026-03-07T12:00:00Z',
    progress: 100,
    workers: [operators.maria.name],
    bomStatus: 'ready',
    pipelineType: 'Flower Processing',
  },
  {
    id: 'WO-2026-0307-006',
    type: 'flower',
    status: 'completed',
    priority: 'low',
    title: 'Zkittlez quality inspection — 4 lbs',
    description: 'Visual inspection and moisture check on Zkittlez trimmed flower.',
    assignee: operators.sarah.name,
    assigneeRole: operators.sarah.role,
    estimatedMinutes: 45,
    actualMinutes: 40,
    batchNumber: 'B2026-0301-006',
    inputMaterials: [
      { name: 'Zkittlez Trimmed Flower', type: 'cannabis', quantity: 4, unit: 'lbs', available: true },
      { name: 'Moisture Meter', type: 'non-cannabis', quantity: 1, unit: 'unit', available: true },
    ],
    outputProduct: 'Zkittlez Inspected Flower',
    outputQuantity: 4,
    outputUnit: 'lbs',
    readinessStateFrom: 'Trimmed',
    readinessStateTo: 'Bulk Ready',
    linkedOrderIds: [],
    createdAt: '2026-03-07T06:00:00Z',
    startedAt: '2026-03-07T06:15:00Z',
    completedAt: '2026-03-07T06:55:00Z',
    dueDate: '2026-03-07T10:00:00Z',
    progress: 100,
    workers: [operators.sarah.name],
    bomStatus: 'ready',
    pipelineType: 'Flower Processing',
  },

  // ─── Preroll Production (4) ───
  {
    id: 'WO-2026-0307-007',
    type: 'preroll',
    status: 'in-progress',
    priority: 'high',
    title: 'Wedding Cake standard prerolls — 200 units',
    description: 'Grind, roll, and pack 200 standard 1g Wedding Cake prerolls.',
    assignee: operators.marcus.name,
    assigneeRole: operators.marcus.role,
    estimatedMinutes: 240,
    batchNumber: 'B2026-0306-007',
    inputMaterials: [
      { name: 'Wedding Cake Ground Flower', type: 'cannabis', quantity: 220, unit: 'g', available: true },
      { name: 'RAW Cones (1g)', type: 'non-cannabis', quantity: 210, unit: 'cones', available: true },
      { name: 'Doob Tubes', type: 'non-cannabis', quantity: 200, unit: 'tubes', available: true },
    ],
    outputProduct: 'Wedding Cake Preroll 1g',
    outputQuantity: 200,
    outputUnit: 'units',
    readinessStateFrom: 'Ground',
    readinessStateTo: 'Packed',
    linkedOrderIds: ['ORD-2026-0305'],
    createdAt: '2026-03-07T06:00:00Z',
    startedAt: '2026-03-07T07:00:00Z',
    dueDate: '2026-03-07T15:00:00Z',
    progress: 45,
    workers: [operators.marcus.name, operators.roberto.name],
    sourceOrderId: 'ORD-2026-0305',
    bomStatus: 'ready',
    pipelineType: 'Preroll Production',
  },
  {
    id: 'WO-2026-0307-008',
    type: 'preroll',
    status: 'queued',
    priority: 'medium',
    title: 'Blue Dream infused prerolls — 100 units',
    description: 'Infused prerolls with distillate drizzle and kief coating. 0.5g each.',
    assignee: operators.marcus.name,
    assigneeRole: operators.marcus.role,
    estimatedMinutes: 300,
    batchNumber: 'B2026-0306-008',
    inputMaterials: [
      { name: 'Blue Dream Ground Flower', type: 'cannabis', quantity: 60, unit: 'g', available: true },
      { name: 'Blue Dream Distillate', type: 'cannabis', quantity: 50, unit: 'g', available: false },
      { name: 'Kief', type: 'cannabis', quantity: 30, unit: 'g', available: true },
    ],
    outputProduct: 'Blue Dream Infused Preroll 0.5g',
    outputQuantity: 100,
    outputUnit: 'units',
    readinessStateFrom: 'Ground',
    readinessStateTo: 'Packed',
    linkedOrderIds: [],
    createdAt: '2026-03-07T06:00:00Z',
    dueDate: '2026-03-08T16:00:00Z',
    progress: 0,
    workers: [operators.marcus.name, operators.roberto.name],
    bomStatus: 'waiting',
    pipelineType: 'Preroll Production',
    notes: 'Waiting on distillate from extraction lab',
  },
  {
    id: 'WO-2026-0307-009',
    type: 'preroll',
    status: 'completed',
    priority: 'medium',
    title: 'Gelato multi-pack 5x0.5g — 50 packs',
    description: 'Pack Gelato prerolls into 5-packs with branded sleeves.',
    assignee: operators.ana.name,
    assigneeRole: operators.ana.role,
    estimatedMinutes: 120,
    actualMinutes: 110,
    batchNumber: 'B2026-0305-009',
    inputMaterials: [
      { name: 'Gelato Preroll 0.5g', type: 'cannabis', quantity: 250, unit: 'units', available: true },
      { name: 'Multi-Pack Sleeves', type: 'non-cannabis', quantity: 55, unit: 'sleeves', available: true },
    ],
    outputProduct: 'Gelato Multi-Pack 5x0.5g',
    outputQuantity: 50,
    outputUnit: 'packs',
    readinessStateFrom: 'Packed',
    readinessStateTo: 'COA Pending',
    linkedOrderIds: ['ORD-2026-0301'],
    createdAt: '2026-03-07T06:00:00Z',
    startedAt: '2026-03-07T06:30:00Z',
    completedAt: '2026-03-07T08:20:00Z',
    dueDate: '2026-03-07T12:00:00Z',
    progress: 100,
    workers: [operators.ana.name],
    sourceOrderId: 'ORD-2026-0301',
    bomStatus: 'ready',
    pipelineType: 'Preroll Production',
  },
  {
    id: 'WO-2026-0307-010',
    type: 'preroll',
    status: 'queued',
    priority: 'low',
    title: 'Jack Herer standard prerolls — 150 units',
    description: 'Standard 1g Jack Herer prerolls for wholesale channel.',
    assignee: operators.roberto.name,
    assigneeRole: operators.roberto.role,
    estimatedMinutes: 180,
    batchNumber: 'B2026-0306-010',
    inputMaterials: [
      { name: 'Jack Herer Ground Flower', type: 'cannabis', quantity: 165, unit: 'g', available: true },
      { name: 'RAW Cones (1g)', type: 'non-cannabis', quantity: 160, unit: 'cones', available: true },
    ],
    outputProduct: 'Jack Herer Preroll 1g',
    outputQuantity: 150,
    outputUnit: 'units',
    readinessStateFrom: 'Ground',
    readinessStateTo: 'Packed',
    linkedOrderIds: [],
    createdAt: '2026-03-07T06:00:00Z',
    dueDate: '2026-03-09T16:00:00Z',
    progress: 0,
    workers: [operators.roberto.name],
    bomStatus: 'ready',
    pipelineType: 'Preroll Production',
  },

  // ─── Extraction (3) ───
  {
    id: 'WO-2026-0307-011',
    type: 'concentrate',
    status: 'in-progress',
    priority: 'high',
    title: 'GSC hydrocarbon extraction — 5 lbs input',
    description: 'Closed-loop hydrocarbon extraction of 5 lbs GSC trim for crude oil.',
    assignee: operators.david.name,
    assigneeRole: operators.david.role,
    estimatedMinutes: 360,
    batchNumber: 'B2026-0305-011',
    inputMaterials: [
      { name: 'GSC Trim', type: 'cannabis', quantity: 5, unit: 'lbs', available: true },
      { name: 'N-Butane (instrument grade)', type: 'non-cannabis', quantity: 6, unit: 'lbs', available: true },
    ],
    outputProduct: 'GSC Crude Oil',
    outputQuantity: 680,
    outputUnit: 'g',
    readinessStateFrom: 'Extracted',
    readinessStateTo: 'Crude',
    linkedOrderIds: [],
    createdAt: '2026-03-07T06:00:00Z',
    startedAt: '2026-03-07T07:00:00Z',
    dueDate: '2026-03-07T17:00:00Z',
    progress: 70,
    workers: [operators.david.name, operators.miguel.name],
    bomStatus: 'ready',
    pipelineType: 'Extraction',
  },
  {
    id: 'WO-2026-0307-012',
    type: 'concentrate',
    status: 'queued',
    priority: 'high',
    title: 'Purple Punch live resin extraction — 3 lbs fresh frozen',
    description: 'Fresh-frozen live resin extraction for premium concentrate line.',
    assignee: operators.david.name,
    assigneeRole: operators.david.role,
    estimatedMinutes: 300,
    batchNumber: 'B2026-0306-012',
    inputMaterials: [
      { name: 'Purple Punch Fresh Frozen', type: 'cannabis', quantity: 3, unit: 'lbs', available: true },
      { name: 'N-Butane (instrument grade)', type: 'non-cannabis', quantity: 4, unit: 'lbs', available: true },
    ],
    outputProduct: 'Purple Punch Live Resin Crude',
    outputQuantity: 380,
    outputUnit: 'g',
    readinessStateFrom: 'Extracted',
    readinessStateTo: 'Processed',
    linkedOrderIds: [],
    createdAt: '2026-03-07T06:00:00Z',
    dueDate: '2026-03-08T17:00:00Z',
    progress: 0,
    workers: [operators.david.name],
    bomStatus: 'ready',
    pipelineType: 'Extraction',
  },
  {
    id: 'WO-2026-0307-013',
    type: 'concentrate',
    status: 'completed',
    priority: 'medium',
    title: 'Sour Diesel distillation run — 2L crude',
    description: 'Short-path distillation of 2L Sour Diesel crude into distillate.',
    assignee: operators.james.name,
    assigneeRole: operators.james.role,
    estimatedMinutes: 480,
    actualMinutes: 460,
    batchNumber: 'B2026-0304-013',
    inputMaterials: [
      { name: 'Sour Diesel Crude Oil', type: 'cannabis', quantity: 2, unit: 'L', available: true },
    ],
    outputProduct: 'Sour Diesel Distillate',
    outputQuantity: 1.6,
    outputUnit: 'L',
    readinessStateFrom: 'Crude',
    readinessStateTo: 'Distillate',
    linkedOrderIds: [],
    createdAt: '2026-03-06T06:00:00Z',
    startedAt: '2026-03-06T07:00:00Z',
    completedAt: '2026-03-06T14:40:00Z',
    dueDate: '2026-03-07T17:00:00Z',
    progress: 100,
    workers: [operators.james.name],
    bomStatus: 'ready',
    pipelineType: 'Extraction',
  },

  // ─── Vape Production (3) ───
  {
    id: 'WO-2026-0307-014',
    type: 'vaporizer',
    status: 'in-progress',
    priority: 'high',
    title: 'GSC 510 carts — 200 units, distillate fill',
    description: 'Fill 200 GSC 510 cartridges with distillate blend. CCELL hardware.',
    assignee: operators.jessica.name,
    assigneeRole: operators.jessica.role,
    estimatedMinutes: 300,
    batchNumber: 'B2026-0305-014',
    inputMaterials: [
      { name: 'GSC Distillate', type: 'cannabis', quantity: 200, unit: 'g', available: true },
      { name: 'CCELL 510 Carts (1g)', type: 'non-cannabis', quantity: 210, unit: 'carts', available: true },
      { name: 'Terpene Blend (GSC)', type: 'cannabis', quantity: 10, unit: 'g', available: true },
    ],
    outputProduct: 'GSC 510 Cart 1g',
    outputQuantity: 200,
    outputUnit: 'units',
    readinessStateFrom: 'Flavored',
    readinessStateTo: 'Filled',
    linkedOrderIds: ['ORD-2026-0299'],
    createdAt: '2026-03-07T06:00:00Z',
    startedAt: '2026-03-07T08:00:00Z',
    dueDate: '2026-03-07T16:00:00Z',
    progress: 20,
    workers: [operators.jessica.name],
    sourceOrderId: 'ORD-2026-0299',
    bomStatus: 'ready',
    pipelineType: 'Vape Fill',
  },
  {
    id: 'WO-2026-0307-015',
    type: 'vaporizer',
    status: 'queued',
    priority: 'medium',
    title: 'Wedding Cake live resin carts — 100 units',
    description: 'Fill 100 Wedding Cake live resin 510 carts. Premium line.',
    assignee: operators.jessica.name,
    assigneeRole: operators.jessica.role,
    estimatedMinutes: 180,
    batchNumber: 'B2026-0305-015',
    inputMaterials: [
      { name: 'Wedding Cake Live Resin', type: 'cannabis', quantity: 100, unit: 'g', available: true },
      { name: 'CCELL 510 Carts (1g)', type: 'non-cannabis', quantity: 105, unit: 'carts', available: true },
    ],
    outputProduct: 'Wedding Cake Live Resin 510 Cart 1g',
    outputQuantity: 100,
    outputUnit: 'units',
    readinessStateFrom: 'Flavored',
    readinessStateTo: 'Filled',
    linkedOrderIds: [],
    createdAt: '2026-03-07T06:00:00Z',
    dueDate: '2026-03-08T16:00:00Z',
    progress: 0,
    workers: [operators.jessica.name],
    bomStatus: 'ready',
    pipelineType: 'Vape Fill',
  },
  {
    id: 'WO-2026-0307-016',
    type: 'vaporizer',
    status: 'completed',
    priority: 'medium',
    title: 'Blue Dream disposable pens — 150 units',
    description: 'Fill and cap 150 Blue Dream all-in-one disposable pens.',
    assignee: operators.lisa.name,
    assigneeRole: operators.lisa.role,
    estimatedMinutes: 240,
    actualMinutes: 225,
    batchNumber: 'B2026-0304-016',
    inputMaterials: [
      { name: 'Blue Dream Distillate', type: 'cannabis', quantity: 75, unit: 'g', available: true },
      { name: 'Disposable Pen Hardware', type: 'non-cannabis', quantity: 155, unit: 'pens', available: true },
    ],
    outputProduct: 'Blue Dream Disposable Pen 0.5g',
    outputQuantity: 150,
    outputUnit: 'units',
    readinessStateFrom: 'Flavored',
    readinessStateTo: 'Filled',
    linkedOrderIds: ['ORD-2026-0297'],
    createdAt: '2026-03-06T06:00:00Z',
    startedAt: '2026-03-06T07:30:00Z',
    completedAt: '2026-03-06T11:15:00Z',
    dueDate: '2026-03-07T12:00:00Z',
    progress: 100,
    workers: [operators.lisa.name],
    sourceOrderId: 'ORD-2026-0297',
    bomStatus: 'ready',
    pipelineType: 'Vape Fill',
  },

  // ─── Concentrate (2) ───
  {
    id: 'WO-2026-0307-017',
    type: 'concentrate',
    status: 'in-progress',
    priority: 'medium',
    title: 'Zkittlez sugar/crumble portioning — 500g',
    description: 'Weigh and portion Zkittlez sugar wax into 1g jars.',
    assignee: operators.miguel.name,
    assigneeRole: operators.miguel.role,
    estimatedMinutes: 150,
    batchNumber: 'B2026-0304-017',
    inputMaterials: [
      { name: 'Zkittlez Sugar Wax', type: 'cannabis', quantity: 500, unit: 'g', available: true },
      { name: 'Glass Jars (1g)', type: 'non-cannabis', quantity: 520, unit: 'jars', available: true },
    ],
    outputProduct: 'Zkittlez Sugar 1g',
    outputQuantity: 500,
    outputUnit: 'jars',
    readinessStateFrom: 'Purged',
    readinessStateTo: 'Portioned',
    linkedOrderIds: ['ORD-2026-0303'],
    createdAt: '2026-03-07T06:00:00Z',
    startedAt: '2026-03-07T07:30:00Z',
    dueDate: '2026-03-07T14:00:00Z',
    progress: 80,
    workers: [operators.miguel.name],
    sourceOrderId: 'ORD-2026-0303',
    bomStatus: 'ready',
    pipelineType: 'Concentrate',
  },
  {
    id: 'WO-2026-0307-018',
    type: 'concentrate',
    status: 'queued',
    priority: 'low',
    title: 'OG Kush wax packaging prep — 300g',
    description: 'Portion and label OG Kush wax for retail packaging.',
    assignee: operators.miguel.name,
    assigneeRole: operators.miguel.role,
    estimatedMinutes: 90,
    batchNumber: 'B2026-0303-018',
    inputMaterials: [
      { name: 'OG Kush Purged Wax', type: 'cannabis', quantity: 300, unit: 'g', available: true },
      { name: 'Glass Jars (1g)', type: 'non-cannabis', quantity: 310, unit: 'jars', available: true },
    ],
    outputProduct: 'OG Kush Wax 1g',
    outputQuantity: 300,
    outputUnit: 'jars',
    readinessStateFrom: 'Purged',
    readinessStateTo: 'Portioned',
    linkedOrderIds: [],
    createdAt: '2026-03-07T06:00:00Z',
    dueDate: '2026-03-09T12:00:00Z',
    progress: 0,
    workers: [operators.miguel.name],
    bomStatus: 'ready',
    pipelineType: 'Concentrate',
  },

  // ─── Solventless (2) ───
  {
    id: 'WO-2026-0307-019',
    type: 'concentrate',
    status: 'queued',
    priority: 'medium',
    title: 'Gorilla Glue hash pressing — 200g bubble hash',
    description: 'Press 200g Gorilla Glue bubble hash into live rosin. 2 presses planned.',
    assignee: operators.miguel.name,
    assigneeRole: operators.miguel.role,
    estimatedMinutes: 240,
    batchNumber: 'B2026-0306-019',
    inputMaterials: [
      { name: 'Gorilla Glue Bubble Hash', type: 'cannabis', quantity: 200, unit: 'g', available: true },
      { name: 'Rosin Bags (37u)', type: 'non-cannabis', quantity: 20, unit: 'bags', available: true },
      { name: 'Parchment Paper', type: 'non-cannabis', quantity: 40, unit: 'sheets', available: true },
    ],
    outputProduct: 'Gorilla Glue Live Rosin',
    outputQuantity: 140,
    outputUnit: 'g',
    readinessStateFrom: 'Collected',
    readinessStateTo: 'Pressed',
    linkedOrderIds: [],
    createdAt: '2026-03-07T06:00:00Z',
    dueDate: '2026-03-08T16:00:00Z',
    progress: 0,
    workers: [operators.miguel.name],
    bomStatus: 'ready',
    pipelineType: 'Solventless',
  },
  {
    id: 'WO-2026-0307-020',
    type: 'concentrate',
    status: 'completed',
    priority: 'medium',
    title: 'Ice Cream Cake first press terp collection',
    description: 'First-press terp collection from Ice Cream Cake fresh frozen bubble hash.',
    assignee: operators.miguel.name,
    assigneeRole: operators.miguel.role,
    estimatedMinutes: 180,
    actualMinutes: 165,
    batchNumber: 'B2026-0305-020',
    inputMaterials: [
      { name: 'ICC Bubble Hash (fresh frozen)', type: 'cannabis', quantity: 150, unit: 'g', available: true },
      { name: 'Rosin Bags (25u)', type: 'non-cannabis', quantity: 15, unit: 'bags', available: true },
    ],
    outputProduct: 'ICC First Press Rosin',
    outputQuantity: 95,
    outputUnit: 'g',
    readinessStateFrom: 'Collected',
    readinessStateTo: 'Pressed',
    linkedOrderIds: [],
    createdAt: '2026-03-06T06:00:00Z',
    startedAt: '2026-03-06T08:00:00Z',
    completedAt: '2026-03-06T10:45:00Z',
    dueDate: '2026-03-07T12:00:00Z',
    progress: 100,
    workers: [operators.miguel.name],
    bomStatus: 'ready',
    pipelineType: 'Solventless',
  },
];

// ── Manufacturing Batches (18) ──────────────────────────────
const batches: ManufacturingBatch[] = [
  // Flower batches
  {
    id: 'batch-fl-01', batchNumber: 'B2026-0305-001', category: 'flower', strainName: 'Wedding Cake',
    productName: 'Wedding Cake Premium Flower 3.5g',
    currentState: 'Bucked',
    previousStates: [
      { state: 'Dried', timestamp: '2026-03-02T00:00:00Z', operator: 'María García' },
    ],
    pipelineStates: FLOWER_PIPELINE,
    quantity: 10, unit: 'lbs', startDate: '2026-03-02T00:00:00Z', estimatedCompletion: '2026-03-10T00:00:00Z', location: 'Processing Room A',
    yieldInput: 10, yieldInputUnit: 'lbs', yieldOutput: 9, yieldOutputUnit: 'lbs', yieldPercent: 90,
    coaStatus: 'not-required', notes: 'Premium colas separated for 3.5g jars',
  },
  {
    id: 'batch-fl-02', batchNumber: 'B2026-0304-002', category: 'flower', strainName: 'Blue Dream',
    productName: 'Blue Dream Flower 7g',
    currentState: 'Trimmed',
    previousStates: [
      { state: 'Dried', timestamp: '2026-02-28T00:00:00Z', operator: 'María García' },
      { state: 'Bucked', timestamp: '2026-03-02T00:00:00Z', operator: 'María García' },
    ],
    pipelineStates: FLOWER_PIPELINE,
    quantity: 8, unit: 'lbs', startDate: '2026-02-28T00:00:00Z', estimatedCompletion: '2026-03-09T00:00:00Z', location: 'Trim Room',
    yieldInput: 8, yieldInputUnit: 'lbs', yieldOutput: 6.5, yieldOutputUnit: 'lbs', yieldPercent: 81,
    coaStatus: 'not-required',
  },
  {
    id: 'batch-fl-03', batchNumber: 'B2026-0303-003', category: 'flower', strainName: 'Gelato',
    productName: 'Gelato Flower 3.5g',
    currentState: 'Trimmed',
    previousStates: [
      { state: 'Dried', timestamp: '2026-02-25T00:00:00Z', operator: 'María García' },
      { state: 'Bucked', timestamp: '2026-02-28T00:00:00Z', operator: 'Carlos Mendez' },
    ],
    pipelineStates: FLOWER_PIPELINE,
    quantity: 5, unit: 'lbs', startDate: '2026-02-25T00:00:00Z', estimatedCompletion: '2026-03-08T00:00:00Z', location: 'Processing Room B',
    coaStatus: 'not-required',
  },
  {
    id: 'batch-fl-04', batchNumber: 'B2026-0301-006', category: 'flower', strainName: 'Zkittlez',
    productName: 'Zkittlez Flower 3.5g',
    currentState: 'Bulk Ready',
    previousStates: [
      { state: 'Dried', timestamp: '2026-02-20T00:00:00Z', operator: 'María García' },
      { state: 'Bucked', timestamp: '2026-02-23T00:00:00Z', operator: 'María García' },
      { state: 'Trimmed', timestamp: '2026-02-26T00:00:00Z', operator: 'María García' },
    ],
    pipelineStates: FLOWER_PIPELINE,
    quantity: 4, unit: 'lbs', startDate: '2026-02-20T00:00:00Z', estimatedCompletion: '2026-03-08T00:00:00Z', location: 'Vault A',
    coaStatus: 'pending',
  },
  {
    id: 'batch-fl-05', batchNumber: 'B2026-0225-005', category: 'flower', strainName: 'GSC',
    productName: 'GSC Flower 7g',
    currentState: 'COA Passed',
    previousStates: [
      { state: 'Dried', timestamp: '2026-02-15T00:00:00Z', operator: 'María García' },
      { state: 'Bucked', timestamp: '2026-02-18T00:00:00Z', operator: 'María García' },
      { state: 'Trimmed', timestamp: '2026-02-21T00:00:00Z', operator: 'Carlos Mendez' },
      { state: 'Bulk Ready', timestamp: '2026-02-23T00:00:00Z', operator: 'Sarah Williams' },
      { state: 'COA Pending', timestamp: '2026-02-25T00:00:00Z', operator: 'Sarah Williams' },
    ],
    pipelineStates: FLOWER_PIPELINE,
    quantity: 6, unit: 'lbs', startDate: '2026-02-15T00:00:00Z', location: 'Packagable Vault',
    coaStatus: 'passed',
  },

  // Preroll batches
  {
    id: 'batch-pr-01', batchNumber: 'B2026-0306-007', category: 'preroll', strainName: 'Wedding Cake',
    productName: 'Wedding Cake Preroll 1g',
    currentState: 'Rolling',
    previousStates: [
      { state: 'Ground', timestamp: '2026-03-06T14:00:00Z', operator: 'Marcus Johnson' },
    ],
    pipelineStates: PREROLL_PIPELINE,
    quantity: 200, unit: 'units', startDate: '2026-03-06T00:00:00Z', estimatedCompletion: '2026-03-08T00:00:00Z', location: 'Preroll Station',
    coaStatus: 'not-required',
  },
  {
    id: 'batch-pr-02', batchNumber: 'B2026-0305-009', category: 'preroll', strainName: 'Gelato',
    productName: 'Gelato Multi-Pack 5x0.5g',
    currentState: 'COA Pending',
    previousStates: [
      { state: 'Ground', timestamp: '2026-03-04T00:00:00Z', operator: 'Marcus Johnson' },
      { state: 'Rolling', timestamp: '2026-03-04T10:00:00Z', operator: 'Roberto Flores' },
      { state: 'Packed', timestamp: '2026-03-05T08:00:00Z', operator: 'Ana Dominguez' },
    ],
    pipelineStates: PREROLL_PIPELINE,
    quantity: 50, unit: 'packs', startDate: '2026-03-04T00:00:00Z', location: 'QC Station',
    coaStatus: 'submitted',
  },

  // Vape batches
  {
    id: 'batch-vp-01', batchNumber: 'B2026-0305-014', category: 'vaporizer', strainName: 'GSC',
    productName: 'GSC 510 Cart 1g',
    currentState: 'Flavored',
    previousStates: [
      { state: 'Extracted', timestamp: '2026-03-01T00:00:00Z', operator: 'David Chen' },
      { state: 'Crude', timestamp: '2026-03-02T00:00:00Z', operator: 'David Chen' },
      { state: 'Distillate', timestamp: '2026-03-04T00:00:00Z', operator: 'James Park' },
    ],
    pipelineStates: VAPE_PIPELINE,
    quantity: 200, unit: 'carts', startDate: '2026-03-01T00:00:00Z', estimatedCompletion: '2026-03-09T00:00:00Z', location: 'Fill Station',
    yieldInput: 5, yieldInputUnit: 'lbs', yieldOutput: 210, yieldOutputUnit: 'g distillate', yieldPercent: 14.2,
    coaStatus: 'not-required', notes: 'Running slightly above expected yield. Terpene preservation looking good.',
  },
  {
    id: 'batch-vp-02', batchNumber: 'B2026-0304-016', category: 'vaporizer', strainName: 'Blue Dream',
    productName: 'Blue Dream Disposable Pen 0.5g',
    currentState: 'Filled',
    previousStates: [
      { state: 'Extracted', timestamp: '2026-02-27T00:00:00Z', operator: 'David Chen' },
      { state: 'Crude', timestamp: '2026-02-28T00:00:00Z', operator: 'James Park' },
      { state: 'Distillate', timestamp: '2026-03-02T00:00:00Z', operator: 'James Park' },
      { state: 'Flavored', timestamp: '2026-03-04T00:00:00Z', operator: 'Lisa Chen' },
    ],
    pipelineStates: VAPE_PIPELINE,
    quantity: 150, unit: 'pens', startDate: '2026-02-27T00:00:00Z', location: 'QC Station',
    coaStatus: 'pending',
  },
  {
    id: 'batch-vp-03', batchNumber: 'B2026-0303-030', category: 'vaporizer', strainName: 'Wedding Cake',
    productName: 'Wedding Cake Live Resin 510 Cart 1g',
    currentState: 'Distillate',
    previousStates: [
      { state: 'Extracted', timestamp: '2026-02-28T00:00:00Z', operator: 'David Chen' },
      { state: 'Crude', timestamp: '2026-03-01T00:00:00Z', operator: 'David Chen' },
    ],
    pipelineStates: VAPE_PIPELINE,
    quantity: 100, unit: 'carts', startDate: '2026-02-28T00:00:00Z', estimatedCompletion: '2026-03-10T00:00:00Z', location: 'Distillation Room',
    coaStatus: 'not-required',
  },

  // Concentrate batches
  {
    id: 'batch-cn-01', batchNumber: 'B2026-0305-011', category: 'concentrate', strainName: 'GSC',
    productName: 'GSC Shatter 1g',
    currentState: 'Extracted',
    previousStates: [],
    pipelineStates: CONCENTRATE_PIPELINE,
    quantity: 5, unit: 'lbs input', startDate: '2026-03-05T00:00:00Z', estimatedCompletion: '2026-03-12T00:00:00Z', location: 'Extraction Lab',
    yieldInput: 5, yieldInputUnit: 'lbs', coaStatus: 'not-required',
  },
  {
    id: 'batch-cn-02', batchNumber: 'B2026-0304-017', category: 'concentrate', strainName: 'Zkittlez',
    productName: 'Zkittlez Sugar 1g',
    currentState: 'Portioned',
    previousStates: [
      { state: 'Extracted', timestamp: '2026-02-25T00:00:00Z', operator: 'David Chen' },
      { state: 'Processed', timestamp: '2026-02-27T00:00:00Z', operator: 'David Chen' },
      { state: 'Purged', timestamp: '2026-03-01T00:00:00Z', operator: 'Miguel Santos' },
    ],
    pipelineStates: CONCENTRATE_PIPELINE,
    quantity: 500, unit: 'g', startDate: '2026-02-25T00:00:00Z', location: 'Concentrate Station',
    yieldInput: 4, yieldInputUnit: 'lbs', yieldOutput: 500, yieldOutputUnit: 'g', yieldPercent: 27.5,
    coaStatus: 'pending',
  },
  {
    id: 'batch-cn-03', batchNumber: 'B2026-0303-018', category: 'concentrate', strainName: 'OG Kush',
    productName: 'OG Kush Wax 1g',
    currentState: 'Purged',
    previousStates: [
      { state: 'Extracted', timestamp: '2026-02-22T00:00:00Z', operator: 'David Chen' },
      { state: 'Processed', timestamp: '2026-02-24T00:00:00Z', operator: 'James Park' },
    ],
    pipelineStates: CONCENTRATE_PIPELINE,
    quantity: 300, unit: 'g', startDate: '2026-02-22T00:00:00Z', estimatedCompletion: '2026-03-09T00:00:00Z', location: 'Vacuum Oven Room',
    coaStatus: 'not-required',
  },

  // Solventless batches
  {
    id: 'batch-sl-01', batchNumber: 'B2026-0306-019', category: 'concentrate', strainName: 'Gorilla Glue',
    productName: 'Gorilla Glue Live Rosin 1g',
    currentState: 'Collected',
    previousStates: [
      { state: 'Washed', timestamp: '2026-03-05T00:00:00Z', operator: 'Miguel Santos' },
    ],
    pipelineStates: SOLVENTLESS_PIPELINE,
    quantity: 200, unit: 'g bubble hash', startDate: '2026-03-05T00:00:00Z', estimatedCompletion: '2026-03-10T00:00:00Z', location: 'Solventless Lab',
    coaStatus: 'not-required',
  },
  {
    id: 'batch-sl-02', batchNumber: 'B2026-0305-020', category: 'concentrate', strainName: 'Ice Cream Cake',
    productName: 'ICC First Press Rosin 1g',
    currentState: 'Pressed',
    previousStates: [
      { state: 'Washed', timestamp: '2026-03-03T00:00:00Z', operator: 'Miguel Santos' },
      { state: 'Collected', timestamp: '2026-03-04T00:00:00Z', operator: 'Miguel Santos' },
    ],
    pipelineStates: SOLVENTLESS_PIPELINE,
    quantity: 95, unit: 'g', startDate: '2026-03-03T00:00:00Z', estimatedCompletion: '2026-03-09T00:00:00Z', location: 'Solventless Lab',
    yieldInput: 150, yieldInputUnit: 'g bubble hash', yieldOutput: 95, yieldOutputUnit: 'g rosin', yieldPercent: 63,
    coaStatus: 'not-required', notes: 'Excellent terp profile. Save for premium jar release.',
  },
  {
    id: 'batch-sl-03', batchNumber: 'B2026-0228-021', category: 'concentrate', strainName: 'Papaya',
    productName: 'Papaya Hash Rosin 1g',
    currentState: 'Cured',
    previousStates: [
      { state: 'Washed', timestamp: '2026-02-22T00:00:00Z', operator: 'Miguel Santos' },
      { state: 'Collected', timestamp: '2026-02-23T00:00:00Z', operator: 'Miguel Santos' },
      { state: 'Pressed', timestamp: '2026-02-25T00:00:00Z', operator: 'Miguel Santos' },
    ],
    pipelineStates: SOLVENTLESS_PIPELINE,
    quantity: 110, unit: 'g', startDate: '2026-02-22T00:00:00Z', estimatedCompletion: '2026-03-08T00:00:00Z', location: 'Cold Cure Room',
    yieldInput: 180, yieldInputUnit: 'g bubble hash', yieldOutput: 110, yieldOutputUnit: 'g rosin', yieldPercent: 61,
    coaStatus: 'pending', notes: '7-day cold cure in progress',
  },
];

// ── Pipeline States ────────────────────────────────────────
const pipelineStates: PipelineState[] = [
  // Flower
  { state: 'Dried', stateCode: 'FL-DRY', division: 'Manufacturing', count: 3, color: '#22C55E', category: 'flower' },
  { state: 'Bucked', stateCode: 'FL-BUCK', division: 'Manufacturing', count: 2, color: '#22C55E', category: 'flower' },
  { state: 'Trimmed', stateCode: 'FL-TRIM', division: 'Manufacturing', count: 3, color: '#22C55E', category: 'flower' },
  { state: 'Bulk Ready', stateCode: 'FL-BULK', division: 'Manufacturing', count: 1, color: '#22C55E', category: 'flower' },
  { state: 'COA Pending', stateCode: 'FL-COA-P', division: 'Compliance', count: 1, color: '#9333EA', category: 'flower' },
  { state: 'COA Passed', stateCode: 'FL-COA-OK', division: 'Compliance', count: 1, color: '#9333EA', category: 'flower' },

  // Vaporizer
  { state: 'Extracted', stateCode: 'VP-EXT', division: 'Manufacturing', count: 2, color: '#06B6D4', category: 'vaporizer' },
  { state: 'Crude', stateCode: 'VP-CRUDE', division: 'Manufacturing', count: 1, color: '#06B6D4', category: 'vaporizer' },
  { state: 'Distillate', stateCode: 'VP-DIST', division: 'Manufacturing', count: 2, color: '#06B6D4', category: 'vaporizer' },
  { state: 'Flavored', stateCode: 'VP-FLAV', division: 'Manufacturing', count: 1, color: '#06B6D4', category: 'vaporizer' },
  { state: 'Filled', stateCode: 'VP-FILL', division: 'Manufacturing', count: 2, color: '#06B6D4', category: 'vaporizer' },
  { state: 'Packagable', stateCode: 'VP-PKG', division: 'Manufacturing', count: 1, color: '#06B6D4', category: 'vaporizer' },

  // Concentrate
  { state: 'Extracted', stateCode: 'CN-EXT', division: 'Manufacturing', count: 1, color: '#F59E0B', category: 'concentrate' },
  { state: 'Processed', stateCode: 'CN-PROC', division: 'Manufacturing', count: 2, color: '#F59E0B', category: 'concentrate' },
  { state: 'Purged', stateCode: 'CN-PURGE', division: 'Manufacturing', count: 1, color: '#F59E0B', category: 'concentrate' },
  { state: 'Portioned', stateCode: 'CN-PORT', division: 'Manufacturing', count: 1, color: '#F59E0B', category: 'concentrate' },
  { state: 'COA Pending', stateCode: 'CN-COA-P', division: 'Compliance', count: 1, color: '#F59E0B', category: 'concentrate' },
  { state: 'COA Passed', stateCode: 'CN-COA-OK', division: 'Compliance', count: 1, color: '#F59E0B', category: 'concentrate' },

  // Preroll
  { state: 'Ground', stateCode: 'PR-GND', division: 'Manufacturing', count: 2, color: '#84CC16', category: 'preroll' },
  { state: 'Rolling', stateCode: 'PR-ROLL', division: 'Manufacturing', count: 1, color: '#84CC16', category: 'preroll' },
  { state: 'Packed', stateCode: 'PR-PACK', division: 'Manufacturing', count: 1, color: '#84CC16', category: 'preroll' },
  { state: 'COA Pending', stateCode: 'PR-COA-P', division: 'Compliance', count: 1, color: '#84CC16', category: 'preroll' },
  { state: 'COA Passed', stateCode: 'PR-COA-OK', division: 'Compliance', count: 1, color: '#84CC16', category: 'preroll' },
];

// ── Production Lines (6) ────────────────────────────────────
const productionLines: ProductionLine[] = [
  {
    id: 'line-flower', name: 'Flower Processing Line', category: 'flower',
    states: FLOWER_PIPELINE, currentBatches: 3, capacity: 6,
    status: 'running', currentWorkOrderId: 'WO-2026-0307-001', currentBatchName: 'Wedding Cake bucking',
    throughputToday: 18, throughputTarget: 25, workers: [operators.maria.name, operators.carlos.name],
    equipmentIds: ['eq-bucker-01', 'eq-trimmer-01', 'eq-trimmer-02', 'eq-sort-table-01'],
  },
  {
    id: 'line-preroll', name: 'Preroll Line', category: 'preroll',
    states: PREROLL_PIPELINE, currentBatches: 2, capacity: 4,
    status: 'running', currentWorkOrderId: 'WO-2026-0307-007', currentBatchName: 'Wedding Cake prerolls',
    throughputToday: 90, throughputTarget: 200, workers: [operators.marcus.name, operators.roberto.name],
    equipmentIds: ['eq-grinder-01', 'eq-roller-01', 'eq-scale-pr-01', 'eq-tube-filler-01'],
  },
  {
    id: 'line-extraction', name: 'Extraction Lab', category: 'concentrate',
    states: ['Extracted', 'Crude', 'Distillate'], currentBatches: 2, capacity: 4,
    status: 'running', currentWorkOrderId: 'WO-2026-0307-011', currentBatchName: 'GSC hydrocarbon extraction',
    throughputToday: 3500, throughputTarget: 5000, workers: [operators.david.name, operators.miguel.name],
    equipmentIds: ['eq-extractor-01', 'eq-extractor-02', 'eq-rotovap-01', 'eq-purge-oven-01'],
  },
  {
    id: 'line-vape-fill', name: 'Vape Fill Line', category: 'vaporizer',
    states: ['Flavored', 'Filled', 'Packagable'], currentBatches: 1, capacity: 3,
    status: 'running', currentWorkOrderId: 'WO-2026-0307-014', currentBatchName: 'GSC 510 carts',
    throughputToday: 40, throughputTarget: 200, workers: [operators.jessica.name],
    equipmentIds: ['eq-fill-machine-01', 'eq-cap-station-01', 'eq-scale-vp-01'],
  },
  {
    id: 'line-concentrate', name: 'Concentrate Station', category: 'concentrate',
    states: ['Purged', 'Portioned', 'COA Pending'], currentBatches: 1, capacity: 3,
    status: 'running', currentWorkOrderId: 'WO-2026-0307-017', currentBatchName: 'Zkittlez sugar portioning',
    throughputToday: 400, throughputTarget: 500, workers: [operators.miguel.name],
    equipmentIds: ['eq-portion-scale-01', 'eq-jar-station-01'],
  },
  {
    id: 'line-solventless', name: 'Solventless Lab', category: 'concentrate',
    states: SOLVENTLESS_PIPELINE, currentBatches: 0, capacity: 2,
    status: 'idle', currentWorkOrderId: null, currentBatchName: null,
    throughputToday: 0, throughputTarget: 100, workers: [],
    equipmentIds: ['eq-wash-station-01', 'eq-press-01', 'eq-press-02', 'eq-freeze-dryer-01', 'eq-collection-tools-01'],
  },
];

// ── Equipment (24) ──────────────────────────────────────────
const equipment: Equipment[] = [
  // Flower Processing Line
  { id: 'eq-bucker-01', name: 'CenturionPro Bucker', productionLineId: 'line-flower', productionLineName: 'Flower Processing Line', status: 'operational', lastMaintained: '2026-02-28T00:00:00Z', nextMaintenanceDue: '2026-03-14T00:00:00Z', hoursSinceLastMaintenance: 56, lifetimeHours: 3200 },
  { id: 'eq-trimmer-01', name: 'Trimming Machine #1', productionLineId: 'line-flower', productionLineName: 'Flower Processing Line', status: 'operational', lastMaintained: '2026-03-01T00:00:00Z', nextMaintenanceDue: '2026-03-15T00:00:00Z', hoursSinceLastMaintenance: 48, lifetimeHours: 2400, notes: 'Blade replacement scheduled next maintenance' },
  { id: 'eq-trimmer-02', name: 'Trimming Machine #2', productionLineId: 'line-flower', productionLineName: 'Flower Processing Line', status: 'operational', lastMaintained: '2026-03-03T00:00:00Z', nextMaintenanceDue: '2026-03-17T00:00:00Z', hoursSinceLastMaintenance: 32, lifetimeHours: 1800 },
  { id: 'eq-sort-table-01', name: 'Sorting Table', productionLineId: 'line-flower', productionLineName: 'Flower Processing Line', status: 'operational', lastMaintained: '2026-02-20T00:00:00Z', nextMaintenanceDue: '2026-04-20T00:00:00Z', hoursSinceLastMaintenance: 120, lifetimeHours: 5000 },

  // Preroll Line
  { id: 'eq-grinder-01', name: 'Industrial Grinder', productionLineId: 'line-preroll', productionLineName: 'Preroll Line', status: 'operational', lastMaintained: '2026-03-04T00:00:00Z', nextMaintenanceDue: '2026-03-18T00:00:00Z', hoursSinceLastMaintenance: 24, lifetimeHours: 1600 },
  { id: 'eq-roller-01', name: 'Futurola Knockbox 100', productionLineId: 'line-preroll', productionLineName: 'Preroll Line', status: 'operational', lastMaintained: '2026-03-02T00:00:00Z', nextMaintenanceDue: '2026-03-16T00:00:00Z', hoursSinceLastMaintenance: 40, lifetimeHours: 2200 },
  { id: 'eq-scale-pr-01', name: 'Precision Scale (Preroll)', productionLineId: 'line-preroll', productionLineName: 'Preroll Line', status: 'operational', lastMaintained: '2026-03-05T00:00:00Z', nextMaintenanceDue: '2026-06-05T00:00:00Z', hoursSinceLastMaintenance: 16, lifetimeHours: 4500 },
  { id: 'eq-tube-filler-01', name: 'Tube Filling Station', productionLineId: 'line-preroll', productionLineName: 'Preroll Line', status: 'operational', lastMaintained: '2026-03-01T00:00:00Z', nextMaintenanceDue: '2026-03-15T00:00:00Z', hoursSinceLastMaintenance: 48, lifetimeHours: 900 },

  // Extraction Lab
  { id: 'eq-extractor-01', name: 'Extraction Machine #1', productionLineId: 'line-extraction', productionLineName: 'Extraction Lab', status: 'operational', lastMaintained: '2026-02-28T00:00:00Z', nextMaintenanceDue: '2026-03-14T00:00:00Z', hoursSinceLastMaintenance: 56, lifetimeHours: 4800, notes: 'Running current GSC batch' },
  { id: 'eq-extractor-02', name: 'Extraction Machine #2', productionLineId: 'line-extraction', productionLineName: 'Extraction Lab', status: 'needs-maintenance', lastMaintained: '2026-02-10T00:00:00Z', nextMaintenanceDue: '2026-03-04T00:00:00Z', hoursSinceLastMaintenance: 200, lifetimeHours: 5200, notes: 'Maintenance overdue by 3 days — gasket replacement needed' },
  { id: 'eq-rotovap-01', name: 'Rotary Evaporator', productionLineId: 'line-extraction', productionLineName: 'Extraction Lab', status: 'operational', lastMaintained: '2026-03-03T00:00:00Z', nextMaintenanceDue: '2026-03-17T00:00:00Z', hoursSinceLastMaintenance: 32, lifetimeHours: 3600 },
  { id: 'eq-purge-oven-01', name: 'Vacuum Purge Oven', productionLineId: 'line-extraction', productionLineName: 'Extraction Lab', status: 'operational', lastMaintained: '2026-02-25T00:00:00Z', nextMaintenanceDue: '2026-03-11T00:00:00Z', hoursSinceLastMaintenance: 80, lifetimeHours: 6200, notes: 'Running purge cycle' },

  // Vape Fill Line
  { id: 'eq-fill-machine-01', name: 'Cart Fill Machine', productionLineId: 'line-vape-fill', productionLineName: 'Vape Fill Line', status: 'operational', lastMaintained: '2026-03-05T00:00:00Z', nextMaintenanceDue: '2026-03-19T00:00:00Z', hoursSinceLastMaintenance: 16, lifetimeHours: 2800 },
  { id: 'eq-cap-station-01', name: 'Capping Station', productionLineId: 'line-vape-fill', productionLineName: 'Vape Fill Line', status: 'operational', lastMaintained: '2026-03-01T00:00:00Z', nextMaintenanceDue: '2026-03-15T00:00:00Z', hoursSinceLastMaintenance: 48, lifetimeHours: 1400 },
  { id: 'eq-scale-vp-01', name: 'Precision Scale (Vape)', productionLineId: 'line-vape-fill', productionLineName: 'Vape Fill Line', status: 'operational', lastMaintained: '2026-03-06T00:00:00Z', nextMaintenanceDue: '2026-06-06T00:00:00Z', hoursSinceLastMaintenance: 8, lifetimeHours: 3200 },

  // Concentrate Station
  { id: 'eq-portion-scale-01', name: 'Portioning Scale', productionLineId: 'line-concentrate', productionLineName: 'Concentrate Station', status: 'operational', lastMaintained: '2026-03-04T00:00:00Z', nextMaintenanceDue: '2026-06-04T00:00:00Z', hoursSinceLastMaintenance: 24, lifetimeHours: 2100 },
  { id: 'eq-jar-station-01', name: 'Jar Filling Station', productionLineId: 'line-concentrate', productionLineName: 'Concentrate Station', status: 'operational', lastMaintained: '2026-03-02T00:00:00Z', nextMaintenanceDue: '2026-03-16T00:00:00Z', hoursSinceLastMaintenance: 40, lifetimeHours: 1100 },

  // Solventless Lab
  { id: 'eq-wash-station-01', name: 'Ice Water Wash Station', productionLineId: 'line-solventless', productionLineName: 'Solventless Lab', status: 'operational', lastMaintained: '2026-03-06T00:00:00Z', nextMaintenanceDue: '2026-03-20T00:00:00Z', hoursSinceLastMaintenance: 8, lifetimeHours: 1200, notes: 'Clean and ready' },
  { id: 'eq-press-01', name: 'Rosin Press #1', productionLineId: 'line-solventless', productionLineName: 'Solventless Lab', status: 'operational', lastMaintained: '2026-03-05T00:00:00Z', nextMaintenanceDue: '2026-03-19T00:00:00Z', hoursSinceLastMaintenance: 16, lifetimeHours: 2600 },
  { id: 'eq-press-02', name: 'Rosin Press #2', productionLineId: 'line-solventless', productionLineName: 'Solventless Lab', status: 'operational', lastMaintained: '2026-03-03T00:00:00Z', nextMaintenanceDue: '2026-03-17T00:00:00Z', hoursSinceLastMaintenance: 32, lifetimeHours: 1900 },
  { id: 'eq-freeze-dryer-01', name: 'Freeze Dryer', productionLineId: 'line-solventless', productionLineName: 'Solventless Lab', status: 'operational', lastMaintained: '2026-02-28T00:00:00Z', nextMaintenanceDue: '2026-03-14T00:00:00Z', hoursSinceLastMaintenance: 56, lifetimeHours: 4400, notes: 'Filter replacement at next service' },
  { id: 'eq-collection-tools-01', name: 'Collection Tool Set', productionLineId: 'line-solventless', productionLineName: 'Solventless Lab', status: 'operational', lastMaintained: '2026-03-06T00:00:00Z', nextMaintenanceDue: '2026-04-06T00:00:00Z', hoursSinceLastMaintenance: 8, lifetimeHours: 800 },
];

// ── Metrics ─────────────────────────────────────────────────
const metrics: ManufacturingMetrics = {
  totalWorkOrders: 20,
  completedToday: 8,
  inProgress: 5,
  avgCompletionTime: 47,
  throughputRate: 85,
  bottleneckState: 'Pen Filling',
  capacityUtilization: 82,
};

// ── Throughput History (30 days) ────────────────────────────
function generateThroughputHistory(): ThroughputDataPoint[] {
  const points: ThroughputDataPoint[] = [];
  const baseDate = new Date('2026-02-06');
  for (let i = 0; i < 30; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const target = isWeekend ? 0 : 400;
    const noise = Math.floor(Math.random() * 80) - 40;
    const units = isWeekend ? 0 : Math.max(280, Math.min(450, 360 + noise));
    points.push({
      date: d.toISOString().split('T')[0],
      units,
      target,
    });
  }
  return points;
}
const throughputHistory = generateThroughputHistory();

// ── Production Distribution ─────────────────────────────────
const productionDistribution: ProductionDistribution[] = [
  { category: 'Flower Processing', percentage: 35, color: '#22C55E' },
  { category: 'Preroll Production', percentage: 20, color: '#84CC16' },
  { category: 'Extraction', percentage: 15, color: '#F59E0B' },
  { category: 'Vape Filling', percentage: 15, color: '#06B6D4' },
  { category: 'Concentrate', percentage: 10, color: '#EF4444' },
  { category: 'Solventless', percentage: 5, color: '#8B5CF6' },
];

// ── Alerts ──────────────────────────────────────────────────
const manufacturingAlerts: ManufacturingAlert[] = [
  { id: 'alert-01', severity: 'critical', message: 'Extraction Machine #2 — maintenance overdue by 3 days', timestamp: '2026-03-07T06:00:00Z', relatedId: 'eq-extractor-02' },
  { id: 'alert-02', severity: 'warning', message: 'Preroll line running 15% below target speed', timestamp: '2026-03-07T09:30:00Z', relatedId: 'line-preroll' },
  { id: 'alert-03', severity: 'warning', message: 'Distillate batch B2026-0305-014 — viscosity check needed before filling', timestamp: '2026-03-07T08:15:00Z', relatedId: 'batch-vp-01' },
  { id: 'alert-04', severity: 'info', message: 'Solventless Lab idle — no active work orders queued', timestamp: '2026-03-07T07:00:00Z', relatedId: 'line-solventless' },
  { id: 'alert-05', severity: 'warning', message: 'Blue Dream infused preroll WO waiting on distillate from extraction', timestamp: '2026-03-07T07:30:00Z', relatedId: 'WO-2026-0307-008' },
  { id: 'alert-06', severity: 'info', message: 'Vacuum Purge Oven maintenance due in 4 days', timestamp: '2026-03-07T06:00:00Z', relatedId: 'eq-purge-oven-01' },
];

// ── Helpers ──────────────────────────────────────────────────
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Exports ─────────────────────────────────────────────────
export async function getWorkOrders(filters?: { type?: string; status?: string; priority?: string }): Promise<WorkOrder[]> {
  await delay(300);
  let result = workOrders;
  if (filters?.type) result = result.filter((wo) => wo.type === filters.type);
  if (filters?.status) result = result.filter((wo) => wo.status === filters.status);
  if (filters?.priority) result = result.filter((wo) => wo.priority === filters.priority);
  return result;
}

export async function getWorkOrder(id: string): Promise<WorkOrder | undefined> {
  await delay(200);
  return workOrders.find((wo) => wo.id === id);
}

export async function getManufacturingBatches(filters?: { category?: string }): Promise<ManufacturingBatch[]> {
  await delay(300);
  if (filters?.category) return batches.filter((b) => b.category === filters.category);
  return batches;
}

export async function getPipelineStates(category?: string): Promise<PipelineState[]> {
  await delay(200);
  if (category) return pipelineStates.filter((s) => s.category === category);
  return pipelineStates;
}

export async function getProductionLines(): Promise<ProductionLine[]> {
  await delay(300);
  return productionLines;
}

export async function getManufacturingMetrics(): Promise<ManufacturingMetrics> {
  await delay(200);
  return metrics;
}

export async function getEquipment(lineId?: string): Promise<Equipment[]> {
  await delay(300);
  if (lineId) return equipment.filter((e) => e.productionLineId === lineId);
  return equipment;
}

export async function getThroughputHistory(): Promise<ThroughputDataPoint[]> {
  await delay(200);
  return throughputHistory;
}

export async function getProductionDistribution(): Promise<ProductionDistribution[]> {
  await delay(200);
  return productionDistribution;
}

export async function getManufacturingAlerts(): Promise<ManufacturingAlert[]> {
  await delay(200);
  return manufacturingAlerts;
}

// ── Task Bridge ──────────────────────────────────────────────
function workOrderStatusToTaskStatus(status: WorkOrder['status']): Task['status'] {
  switch (status) {
    case 'queued': return 'todo';
    case 'in-progress': return 'in-progress';
    case 'completed': return 'done';
    case 'blocked': return 'blocked';
  }
}

function workOrderToTask(wo: WorkOrder): Task {
  return {
    id: wo.id,
    title: wo.title,
    description: wo.description,
    status: workOrderStatusToTaskStatus(wo.status),
    priority: wo.priority,
    assignee: wo.assignee,
    dueDate: wo.dueDate,
    createdAt: wo.createdAt,
    completedAt: wo.completedAt,
    module: 'Manufacturing',
    moduleRoute: '/manufacturing',
    tags: [wo.type, wo.pipelineType.toLowerCase().replace(/\s+/g, '-')],
    source: 'work-order',
  };
}

export function getManufacturingWorkOrderTasks(): Task[] {
  return workOrders.map(workOrderToTask);
}
