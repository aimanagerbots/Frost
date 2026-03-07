import type {
  FulfillmentOrder,
  FulfillmentMetrics,
  PickItem,
  FulfillmentStatus,
  FulfillmentPriority,
} from '@/modules/fulfillment/types';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// — Pick Items pools by status —

function pickItems(items: Omit<PickItem, 'picked'>[], allPicked = false): PickItem[] {
  return items.map((item) => ({ ...item, picked: allPicked }));
}

// — Fulfillment Orders —

const orders: FulfillmentOrder[] = [
  // QUEUED (5)
  {
    id: 'ful-001',
    orderId: 'ord-2024-0341',
    orderNumber: 'ORD-0341',
    accountName: 'Greenfield Dispensary',
    status: 'queued',
    priority: 'high',
    items: pickItems([
      { sku: 'FL-WC-14G', productName: 'Wedding Cake 14g', category: 'flower', quantity: 8, shelfLocation: 'Aisle A, Shelf 2, Bin 5' },
      { sku: 'PR-GG-6PK', productName: 'Gorilla Glue 6-Pack Prerolls', category: 'preroll', quantity: 12, shelfLocation: 'Aisle B, Shelf 1, Bin 3' },
      { sku: 'ED-GUM-10PK', productName: 'Sour Gummy Bears 10pk', category: 'edible', quantity: 20, shelfLocation: 'Aisle D, Shelf 3, Bin 8' },
      { sku: 'VP-CDT-1G', productName: 'Blue Dream CDT Cart 1g', category: 'vaporizer', quantity: 15, shelfLocation: 'Aisle C, Shelf 2, Bin 1' },
    ]),
    assignee: 'Tyler Ross',
    estimatedMinutes: 25,
    createdAt: '2024-12-15T08:30:00Z',
  },
  {
    id: 'ful-002',
    orderId: 'ord-2024-0342',
    orderNumber: 'ORD-0342',
    accountName: 'Olympic Greens',
    status: 'queued',
    priority: 'normal',
    items: pickItems([
      { sku: 'FL-BD-7G', productName: 'Blue Dream 7g', category: 'flower', quantity: 10, shelfLocation: 'Aisle A, Shelf 1, Bin 2' },
      { sku: 'CN-LR-1G', productName: 'Gelato Live Resin 1g', category: 'concentrate', quantity: 6, shelfLocation: 'Aisle C, Shelf 4, Bin 7' },
      { sku: 'BV-LEM-4PK', productName: 'Lemonade Seltzer 4-Pack', category: 'beverage', quantity: 8, shelfLocation: 'Aisle E, Shelf 1, Bin 2' },
    ]),
    assignee: 'Aisha Williams',
    estimatedMinutes: 18,
    createdAt: '2024-12-15T08:45:00Z',
  },
  {
    id: 'ful-003',
    orderId: 'ord-2024-0343',
    orderNumber: 'ORD-0343',
    accountName: 'Capitol Hill Collective',
    status: 'queued',
    priority: 'urgent',
    items: pickItems([
      { sku: 'FL-GSC-28G', productName: 'Girl Scout Cookies 28g', category: 'flower', quantity: 4, shelfLocation: 'Aisle A, Shelf 3, Bin 12' },
      { sku: 'PR-BD-3PK', productName: 'Blue Dream 3-Pack Prerolls', category: 'preroll', quantity: 24, shelfLocation: 'Aisle B, Shelf 2, Bin 6' },
      { sku: 'ED-CHO-BAR', productName: 'Dark Chocolate Bar 100mg', category: 'edible', quantity: 15, shelfLocation: 'Aisle D, Shelf 1, Bin 4' },
      { sku: 'VP-DST-05G', productName: 'OG Kush Distillate 0.5g', category: 'vaporizer', quantity: 10, shelfLocation: 'Aisle C, Shelf 1, Bin 9' },
      { sku: 'CN-SHT-1G', productName: 'Wedding Cake Shatter 1g', category: 'concentrate', quantity: 8, shelfLocation: 'Aisle C, Shelf 3, Bin 2' },
    ]),
    assignee: 'Tyler Ross',
    estimatedMinutes: 30,
    createdAt: '2024-12-15T07:15:00Z',
  },
  {
    id: 'ful-004',
    orderId: 'ord-2024-0344',
    orderNumber: 'ORD-0344',
    accountName: 'Puget Sound Wellness',
    status: 'queued',
    priority: 'normal',
    items: pickItems([
      { sku: 'FL-PP-3.5G', productName: 'Purple Punch 3.5g', category: 'flower', quantity: 16, shelfLocation: 'Aisle A, Shelf 4, Bin 1' },
      { sku: 'ED-GUM-10PK', productName: 'Sour Gummy Bears 10pk', category: 'edible', quantity: 10, shelfLocation: 'Aisle D, Shelf 3, Bin 8' },
      { sku: 'BV-TEA-6PK', productName: 'Iced Tea Infused 6-Pack', category: 'beverage', quantity: 4, shelfLocation: 'Aisle E, Shelf 2, Bin 5' },
    ]),
    assignee: 'Aisha Williams',
    estimatedMinutes: 15,
    createdAt: '2024-12-15T09:00:00Z',
  },
  {
    id: 'ful-005',
    orderId: 'ord-2024-0345',
    orderNumber: 'ORD-0345',
    accountName: 'Emerald City Cannabis',
    status: 'queued',
    priority: 'low',
    items: pickItems([
      { sku: 'PR-OGK-6PK', productName: 'OG Kush 6-Pack Prerolls', category: 'preroll', quantity: 6, shelfLocation: 'Aisle B, Shelf 3, Bin 1' },
      { sku: 'VP-LR-1G', productName: 'Gelato Live Resin Cart 1g', category: 'vaporizer', quantity: 4, shelfLocation: 'Aisle C, Shelf 2, Bin 4' },
      { sku: 'ED-MINT-TIN', productName: 'Peppermint Mints Tin', category: 'edible', quantity: 12, shelfLocation: 'Aisle D, Shelf 2, Bin 3' },
    ]),
    assignee: 'Tyler Ross',
    estimatedMinutes: 12,
    createdAt: '2024-12-15T09:30:00Z',
  },

  // PICKING (4)
  {
    id: 'ful-006',
    orderId: 'ord-2024-0336',
    orderNumber: 'ORD-0336',
    accountName: 'Summit Therapeutics',
    status: 'picking',
    priority: 'high',
    items: [
      { sku: 'FL-WC-7G', productName: 'Wedding Cake 7g', category: 'flower', quantity: 12, shelfLocation: 'Aisle A, Shelf 2, Bin 4', picked: true },
      { sku: 'CN-BDR-1G', productName: 'Blue Dream Budder 1g', category: 'concentrate', quantity: 8, shelfLocation: 'Aisle C, Shelf 4, Bin 3', picked: true },
      { sku: 'PR-WC-3PK', productName: 'Wedding Cake 3-Pack Prerolls', category: 'preroll', quantity: 18, shelfLocation: 'Aisle B, Shelf 1, Bin 7', picked: false },
      { sku: 'ED-BRW-2PK', productName: 'Double Fudge Brownies 2pk', category: 'edible', quantity: 10, shelfLocation: 'Aisle D, Shelf 4, Bin 2', picked: false },
    ],
    assignee: 'Aisha Williams',
    estimatedMinutes: 22,
    createdAt: '2024-12-15T07:00:00Z',
    startedAt: '2024-12-15T08:10:00Z',
  },
  {
    id: 'ful-007',
    orderId: 'ord-2024-0337',
    orderNumber: 'ORD-0337',
    accountName: 'Rainier Remedies',
    status: 'picking',
    priority: 'normal',
    items: [
      { sku: 'FL-GG-14G', productName: 'Gorilla Glue 14g', category: 'flower', quantity: 6, shelfLocation: 'Aisle A, Shelf 3, Bin 8', picked: true },
      { sku: 'VP-CDT-05G', productName: 'Sour Diesel CDT Cart 0.5g', category: 'vaporizer', quantity: 20, shelfLocation: 'Aisle C, Shelf 1, Bin 5', picked: false },
      { sku: 'BV-SPK-4PK', productName: 'Sparkling Water Infused 4pk', category: 'beverage', quantity: 6, shelfLocation: 'Aisle E, Shelf 1, Bin 8', picked: false },
    ],
    assignee: 'Tyler Ross',
    estimatedMinutes: 20,
    createdAt: '2024-12-15T07:30:00Z',
    startedAt: '2024-12-15T08:20:00Z',
  },
  {
    id: 'ful-008',
    orderId: 'ord-2024-0338',
    orderNumber: 'ORD-0338',
    accountName: 'Cascade Cannabis Co.',
    status: 'picking',
    priority: 'normal',
    items: [
      { sku: 'FL-BD-3.5G', productName: 'Blue Dream 3.5g', category: 'flower', quantity: 24, shelfLocation: 'Aisle A, Shelf 1, Bin 1', picked: false },
      { sku: 'PR-PP-6PK', productName: 'Purple Punch 6-Pack Prerolls', category: 'preroll', quantity: 8, shelfLocation: 'Aisle B, Shelf 2, Bin 9', picked: false },
      { sku: 'CN-WAX-1G', productName: 'GSC Wax 1g', category: 'concentrate', quantity: 5, shelfLocation: 'Aisle C, Shelf 3, Bin 6', picked: false },
      { sku: 'ED-GUM-10PK', productName: 'Sour Gummy Bears 10pk', category: 'edible', quantity: 14, shelfLocation: 'Aisle D, Shelf 3, Bin 8', picked: false },
      { sku: 'VP-DST-1G', productName: 'Gelato Distillate Cart 1g', category: 'vaporizer', quantity: 10, shelfLocation: 'Aisle C, Shelf 2, Bin 7', picked: false },
      { sku: 'BV-LEM-4PK', productName: 'Lemonade Seltzer 4-Pack', category: 'beverage', quantity: 6, shelfLocation: 'Aisle E, Shelf 1, Bin 2', picked: false },
    ],
    assignee: 'Aisha Williams',
    estimatedMinutes: 35,
    createdAt: '2024-12-15T06:45:00Z',
    startedAt: '2024-12-15T08:00:00Z',
  },
  {
    id: 'ful-009',
    orderId: 'ord-2024-0339',
    orderNumber: 'ORD-0339',
    accountName: 'Ballard Buds',
    status: 'picking',
    priority: 'high',
    items: [
      { sku: 'FL-OGK-7G', productName: 'OG Kush 7g', category: 'flower', quantity: 10, shelfLocation: 'Aisle A, Shelf 2, Bin 9', picked: true },
      { sku: 'PR-GG-3PK', productName: 'Gorilla Glue 3-Pack Prerolls', category: 'preroll', quantity: 16, shelfLocation: 'Aisle B, Shelf 1, Bin 4', picked: true },
      { sku: 'ED-CHO-BAR', productName: 'Dark Chocolate Bar 100mg', category: 'edible', quantity: 8, shelfLocation: 'Aisle D, Shelf 1, Bin 4', picked: false },
    ],
    assignee: 'Tyler Ross',
    estimatedMinutes: 18,
    createdAt: '2024-12-15T07:15:00Z',
    startedAt: '2024-12-15T08:30:00Z',
  },

  // PICKED (3)
  {
    id: 'ful-010',
    orderId: 'ord-2024-0330',
    orderNumber: 'ORD-0330',
    accountName: 'Fremont Flowers',
    status: 'picked',
    priority: 'normal',
    items: pickItems([
      { sku: 'FL-PP-14G', productName: 'Purple Punch 14g', category: 'flower', quantity: 6, shelfLocation: 'Aisle A, Shelf 4, Bin 3' },
      { sku: 'PR-BD-6PK', productName: 'Blue Dream 6-Pack Prerolls', category: 'preroll', quantity: 10, shelfLocation: 'Aisle B, Shelf 2, Bin 2' },
      { sku: 'VP-LR-05G', productName: 'Wedding Cake Live Resin 0.5g', category: 'vaporizer', quantity: 12, shelfLocation: 'Aisle C, Shelf 2, Bin 8' },
    ], true),
    assignee: 'Aisha Williams',
    estimatedMinutes: 20,
    actualMinutes: 18,
    createdAt: '2024-12-15T06:00:00Z',
    startedAt: '2024-12-15T07:00:00Z',
  },
  {
    id: 'ful-011',
    orderId: 'ord-2024-0331',
    orderNumber: 'ORD-0331',
    accountName: 'Green Lake Gardens',
    status: 'picked',
    priority: 'high',
    items: pickItems([
      { sku: 'FL-WC-3.5G', productName: 'Wedding Cake 3.5g', category: 'flower', quantity: 20, shelfLocation: 'Aisle A, Shelf 2, Bin 3' },
      { sku: 'CN-LR-1G', productName: 'Gelato Live Resin 1g', category: 'concentrate', quantity: 8, shelfLocation: 'Aisle C, Shelf 4, Bin 7' },
      { sku: 'ED-GUM-10PK', productName: 'Sour Gummy Bears 10pk', category: 'edible', quantity: 16, shelfLocation: 'Aisle D, Shelf 3, Bin 8' },
      { sku: 'BV-TEA-6PK', productName: 'Iced Tea Infused 6-Pack', category: 'beverage', quantity: 5, shelfLocation: 'Aisle E, Shelf 2, Bin 5' },
    ], true),
    assignee: 'Tyler Ross',
    estimatedMinutes: 24,
    actualMinutes: 21,
    createdAt: '2024-12-15T05:30:00Z',
    startedAt: '2024-12-15T06:30:00Z',
  },
  {
    id: 'ful-012',
    orderId: 'ord-2024-0332',
    orderNumber: 'ORD-0332',
    accountName: 'Tacoma Treehouse',
    status: 'picked',
    priority: 'normal',
    items: pickItems([
      { sku: 'FL-SD-7G', productName: 'Sour Diesel 7g', category: 'flower', quantity: 8, shelfLocation: 'Aisle A, Shelf 1, Bin 6' },
      { sku: 'PR-OGK-3PK', productName: 'OG Kush 3-Pack Prerolls', category: 'preroll', quantity: 12, shelfLocation: 'Aisle B, Shelf 3, Bin 2' },
      { sku: 'VP-CDT-1G', productName: 'Blue Dream CDT Cart 1g', category: 'vaporizer', quantity: 6, shelfLocation: 'Aisle C, Shelf 2, Bin 1' },
    ], true),
    assignee: 'Aisha Williams',
    estimatedMinutes: 16,
    actualMinutes: 14,
    createdAt: '2024-12-15T06:15:00Z',
    startedAt: '2024-12-15T07:15:00Z',
  },

  // PACKING (2)
  {
    id: 'ful-013',
    orderId: 'ord-2024-0325',
    orderNumber: 'ORD-0325',
    accountName: 'Bellingham Botanicals',
    status: 'packing',
    priority: 'normal',
    items: pickItems([
      { sku: 'FL-GG-28G', productName: 'Gorilla Glue 28g', category: 'flower', quantity: 3, shelfLocation: 'Aisle A, Shelf 3, Bin 10' },
      { sku: 'CN-SHT-1G', productName: 'Wedding Cake Shatter 1g', category: 'concentrate', quantity: 10, shelfLocation: 'Aisle C, Shelf 3, Bin 2' },
      { sku: 'ED-MINT-TIN', productName: 'Peppermint Mints Tin', category: 'edible', quantity: 8, shelfLocation: 'Aisle D, Shelf 2, Bin 3' },
      { sku: 'VP-DST-05G', productName: 'OG Kush Distillate 0.5g', category: 'vaporizer', quantity: 12, shelfLocation: 'Aisle C, Shelf 1, Bin 9' },
    ], true),
    assignee: 'Tyler Ross',
    estimatedMinutes: 22,
    actualMinutes: 20,
    createdAt: '2024-12-15T05:00:00Z',
    startedAt: '2024-12-15T06:00:00Z',
  },
  {
    id: 'ful-014',
    orderId: 'ord-2024-0326',
    orderNumber: 'ORD-0326',
    accountName: 'Olympia Organic',
    status: 'packing',
    priority: 'high',
    items: pickItems([
      { sku: 'FL-BD-14G', productName: 'Blue Dream 14g', category: 'flower', quantity: 10, shelfLocation: 'Aisle A, Shelf 1, Bin 3' },
      { sku: 'PR-WC-6PK', productName: 'Wedding Cake 6-Pack Prerolls', category: 'preroll', quantity: 14, shelfLocation: 'Aisle B, Shelf 1, Bin 8' },
      { sku: 'BV-SPK-4PK', productName: 'Sparkling Water Infused 4pk', category: 'beverage', quantity: 10, shelfLocation: 'Aisle E, Shelf 1, Bin 8' },
    ], true),
    assignee: 'Aisha Williams',
    estimatedMinutes: 18,
    actualMinutes: 17,
    createdAt: '2024-12-15T04:30:00Z',
    startedAt: '2024-12-15T05:30:00Z',
  },

  // PACKED (2)
  {
    id: 'ful-015',
    orderId: 'ord-2024-0320',
    orderNumber: 'ORD-0320',
    accountName: 'Spokane Stems',
    status: 'packed',
    priority: 'normal',
    items: pickItems([
      { sku: 'FL-GSC-7G', productName: 'Girl Scout Cookies 7g', category: 'flower', quantity: 14, shelfLocation: 'Aisle A, Shelf 3, Bin 11' },
      { sku: 'PR-PP-3PK', productName: 'Purple Punch 3-Pack Prerolls', category: 'preroll', quantity: 20, shelfLocation: 'Aisle B, Shelf 2, Bin 4' },
      { sku: 'CN-WAX-1G', productName: 'GSC Wax 1g', category: 'concentrate', quantity: 6, shelfLocation: 'Aisle C, Shelf 3, Bin 6' },
      { sku: 'ED-CHO-BAR', productName: 'Dark Chocolate Bar 100mg', category: 'edible', quantity: 10, shelfLocation: 'Aisle D, Shelf 1, Bin 4' },
      { sku: 'VP-CDT-1G', productName: 'Blue Dream CDT Cart 1g', category: 'vaporizer', quantity: 8, shelfLocation: 'Aisle C, Shelf 2, Bin 1' },
    ], true),
    assignee: 'Tyler Ross',
    estimatedMinutes: 28,
    actualMinutes: 25,
    createdAt: '2024-12-15T03:00:00Z',
    startedAt: '2024-12-15T04:00:00Z',
  },
  {
    id: 'ful-016',
    orderId: 'ord-2024-0321',
    orderNumber: 'ORD-0321',
    accountName: 'Whidbey Island Wellness',
    status: 'packed',
    priority: 'low',
    items: pickItems([
      { sku: 'FL-OGK-3.5G', productName: 'OG Kush 3.5g', category: 'flower', quantity: 8, shelfLocation: 'Aisle A, Shelf 2, Bin 7' },
      { sku: 'ED-BRW-2PK', productName: 'Double Fudge Brownies 2pk', category: 'edible', quantity: 6, shelfLocation: 'Aisle D, Shelf 4, Bin 2' },
      { sku: 'BV-LEM-4PK', productName: 'Lemonade Seltzer 4-Pack', category: 'beverage', quantity: 4, shelfLocation: 'Aisle E, Shelf 1, Bin 2' },
    ], true),
    assignee: 'Aisha Williams',
    estimatedMinutes: 14,
    actualMinutes: 12,
    createdAt: '2024-12-15T03:30:00Z',
    startedAt: '2024-12-15T04:30:00Z',
  },

  // MANIFESTED / READY-FOR-DRIVER (2)
  {
    id: 'ful-017',
    orderId: 'ord-2024-0315',
    orderNumber: 'ORD-0315',
    accountName: 'Greenfield Dispensary',
    status: 'manifested',
    priority: 'high',
    items: pickItems([
      { sku: 'FL-WC-28G', productName: 'Wedding Cake 28g', category: 'flower', quantity: 5, shelfLocation: 'Aisle A, Shelf 2, Bin 6' },
      { sku: 'PR-GG-6PK', productName: 'Gorilla Glue 6-Pack Prerolls', category: 'preroll', quantity: 10, shelfLocation: 'Aisle B, Shelf 1, Bin 3' },
      { sku: 'CN-LR-1G', productName: 'Gelato Live Resin 1g', category: 'concentrate', quantity: 8, shelfLocation: 'Aisle C, Shelf 4, Bin 7' },
      { sku: 'ED-GUM-10PK', productName: 'Sour Gummy Bears 10pk', category: 'edible', quantity: 12, shelfLocation: 'Aisle D, Shelf 3, Bin 8' },
    ], true),
    assignee: 'Tyler Ross',
    estimatedMinutes: 24,
    actualMinutes: 22,
    manifestNumber: 'MAN-2024-1215-001',
    createdAt: '2024-12-15T02:00:00Z',
    startedAt: '2024-12-15T03:00:00Z',
    completedAt: '2024-12-15T06:30:00Z',
  },
  {
    id: 'ful-018',
    orderId: 'ord-2024-0316',
    orderNumber: 'ORD-0316',
    accountName: 'Capitol Hill Collective',
    status: 'ready-for-driver',
    priority: 'urgent',
    items: pickItems([
      { sku: 'FL-BD-7G', productName: 'Blue Dream 7g', category: 'flower', quantity: 15, shelfLocation: 'Aisle A, Shelf 1, Bin 2' },
      { sku: 'PR-BD-3PK', productName: 'Blue Dream 3-Pack Prerolls', category: 'preroll', quantity: 20, shelfLocation: 'Aisle B, Shelf 2, Bin 6' },
      { sku: 'VP-LR-1G', productName: 'Gelato Live Resin Cart 1g', category: 'vaporizer', quantity: 10, shelfLocation: 'Aisle C, Shelf 2, Bin 4' },
      { sku: 'ED-MINT-TIN', productName: 'Peppermint Mints Tin', category: 'edible', quantity: 8, shelfLocation: 'Aisle D, Shelf 2, Bin 3' },
      { sku: 'BV-TEA-6PK', productName: 'Iced Tea Infused 6-Pack', category: 'beverage', quantity: 6, shelfLocation: 'Aisle E, Shelf 2, Bin 5' },
    ], true),
    assignee: 'Aisha Williams',
    estimatedMinutes: 30,
    actualMinutes: 26,
    manifestNumber: 'MAN-2024-1215-002',
    createdAt: '2024-12-15T01:30:00Z',
    startedAt: '2024-12-15T02:30:00Z',
    completedAt: '2024-12-15T06:00:00Z',
  },
];

const metrics: FulfillmentMetrics = {
  totalOrders: 18,
  completedToday: 6,
  inProgress: 8,
  avgPickTime: 22,
  accuracyRate: 98.5,
  itemsPerHour: 34,
};

// — Export functions —

export async function getFulfillmentOrders(filters?: {
  status?: FulfillmentStatus;
  priority?: FulfillmentPriority;
  search?: string;
}): Promise<FulfillmentOrder[]> {
  await delay(400);
  let result = [...orders];
  if (filters?.status) {
    result = result.filter((o) => o.status === filters.status);
  }
  if (filters?.priority) {
    result = result.filter((o) => o.priority === filters.priority);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.accountName.toLowerCase().includes(q) ||
        o.assignee.toLowerCase().includes(q)
    );
  }
  return result;
}

export async function getFulfillmentOrder(id: string): Promise<FulfillmentOrder | undefined> {
  await delay(300);
  return orders.find((o) => o.id === id);
}

export async function getFulfillmentMetrics(): Promise<FulfillmentMetrics> {
  await delay(300);
  return metrics;
}
