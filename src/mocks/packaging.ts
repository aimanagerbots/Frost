import type {
  PackagingOrder,
  NonCannabisInventory,
  PackagingMetrics,
} from '@/modules/packaging/types';

// ── Packaging Orders (20) ───────────────────────────────────
const packagingOrders: PackagingOrder[] = [
  // Completed (4)
  {
    id: 'pkg-001',
    status: 'completed',
    priority: 'high',
    product: 'Wedding Cake 3.5g',
    sku: 'FL-WC-35',
    category: 'flower',
    quantity: 200,
    cannabisMaterials: [{ name: 'Wedding Cake Packagable Flower', required: 700, available: 700, unit: 'g' }],
    nonCannabisMaterials: [
      { name: 'Glass Jar 3.5g', required: 200, available: 1800, unit: 'units', inStock: true },
      { name: 'Label — FL-WC-35', required: 200, available: 1400, unit: 'units', inStock: true },
      { name: 'Boveda 62% Humidity Pack', required: 200, available: 4500, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 200, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 90,
    assignee: 'Aisha Williams',
    linkedOrderId: 'ord-2024-041',
    createdAt: '2024-11-30T08:00:00Z',
    completedAt: '2024-11-30T09:35:00Z',
  },
  {
    id: 'pkg-002',
    status: 'completed',
    priority: 'medium',
    product: 'OG Kush 7g',
    sku: 'FL-OK-7',
    category: 'flower',
    quantity: 100,
    cannabisMaterials: [{ name: 'OG Kush Packagable Flower', required: 700, available: 700, unit: 'g' }],
    nonCannabisMaterials: [
      { name: 'Glass Jar 7g', required: 100, available: 600, unit: 'units', inStock: true },
      { name: 'Label — FL-OK-7', required: 100, available: 800, unit: 'units', inStock: true },
      { name: 'Boveda 62% Humidity Pack', required: 100, available: 4500, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 100, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 60,
    assignee: 'Rachel Kim',
    createdAt: '2024-11-30T07:00:00Z',
    completedAt: '2024-11-30T08:05:00Z',
  },
  {
    id: 'pkg-003',
    status: 'completed',
    priority: 'high',
    product: 'Purple Punch Preroll 5-Pack',
    sku: 'PR-PP-5PK',
    category: 'preroll',
    quantity: 80,
    cannabisMaterials: [{ name: 'Purple Punch 0.5g Loose Rolled Prerolls', required: 400, available: 400, unit: 'prerolls' }],
    nonCannabisMaterials: [
      { name: 'Preroll Tube (single)', required: 400, available: 3200, unit: 'units', inStock: true },
      { name: '5-Pack Box', required: 80, available: 120, unit: 'units', inStock: true },
      { name: 'Label — PR-PP-5PK', required: 80, available: 600, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 80, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 75,
    assignee: 'David Okonkwo',
    linkedOrderId: 'ord-2024-039',
    createdAt: '2024-11-30T06:00:00Z',
    completedAt: '2024-11-30T07:20:00Z',
  },
  {
    id: 'pkg-004',
    status: 'completed',
    priority: 'medium',
    product: 'OG Kush Wax 1g',
    sku: 'CN-OK-WAX-1',
    category: 'concentrate',
    quantity: 150,
    cannabisMaterials: [{ name: 'OG Kush Wax Portions (1g)', required: 150, available: 150, unit: 'portions' }],
    nonCannabisMaterials: [
      { name: 'Concentrate Container 1g', required: 150, available: 500, unit: 'units', inStock: true },
      { name: 'Label — CN-OK-WAX-1', required: 150, available: 900, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 150, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 55,
    assignee: 'Aisha Williams',
    linkedOrderId: 'ord-2024-043',
    createdAt: '2024-11-29T14:00:00Z',
    completedAt: '2024-11-29T14:58:00Z',
  },

  // In-progress (6)
  {
    id: 'pkg-005',
    status: 'in-progress',
    priority: 'high',
    product: 'Wedding Cake 3.5g',
    sku: 'FL-WC-35',
    category: 'flower',
    quantity: 150,
    cannabisMaterials: [{ name: 'Wedding Cake Packagable Flower', required: 525, available: 525, unit: 'g' }],
    nonCannabisMaterials: [
      { name: 'Glass Jar 3.5g', required: 150, available: 1800, unit: 'units', inStock: true },
      { name: 'Label — FL-WC-35', required: 150, available: 1400, unit: 'units', inStock: true },
      { name: 'Boveda 62% Humidity Pack', required: 150, available: 4500, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 150, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 70,
    assignee: 'Aisha Williams',
    linkedOrderId: 'ord-2024-055',
    createdAt: '2024-12-01T08:00:00Z',
  },
  {
    id: 'pkg-006',
    status: 'in-progress',
    priority: 'medium',
    product: 'Blue Dream 1g',
    sku: 'FL-BD-1',
    category: 'flower',
    quantity: 300,
    cannabisMaterials: [{ name: 'Blue Dream Packagable Flower', required: 300, available: 300, unit: 'g' }],
    nonCannabisMaterials: [
      { name: 'Glass Jar 1g', required: 300, available: 2400, unit: 'units', inStock: true },
      { name: 'Label — FL-BD-1', required: 300, available: 1200, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 300, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 100,
    assignee: 'Rachel Kim',
    createdAt: '2024-12-01T08:30:00Z',
  },
  {
    id: 'pkg-007',
    status: 'in-progress',
    priority: 'critical',
    product: 'Gelato Live Resin 510 Cart 1g',
    sku: 'VP-GL-LR-1',
    category: 'vaporizer',
    quantity: 100,
    cannabisMaterials: [{ name: 'Gelato Live Resin Loose Filled Carts', required: 100, available: 100, unit: 'carts' }],
    nonCannabisMaterials: [
      { name: 'Cart Box (510)', required: 100, available: 950, unit: 'units', inStock: true },
      { name: 'Label — VP-GL-LR-1', required: 100, available: 500, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 100, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 45,
    assignee: 'David Okonkwo',
    linkedOrderId: 'ord-2024-061',
    createdAt: '2024-12-01T09:00:00Z',
  },
  {
    id: 'pkg-008',
    status: 'in-progress',
    priority: 'medium',
    product: 'GSC 14g',
    sku: 'FL-GSC-14',
    category: 'flower',
    quantity: 50,
    cannabisMaterials: [{ name: 'GSC Packagable Flower', required: 700, available: 700, unit: 'g' }],
    nonCannabisMaterials: [
      { name: 'Glass Jar 14g', required: 50, available: 200, unit: 'units', inStock: true },
      { name: 'Label — FL-GSC-14', required: 50, available: 350, unit: 'units', inStock: true },
      { name: 'Boveda 62% Humidity Pack', required: 50, available: 4500, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 50, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 40,
    assignee: 'Aisha Williams',
    createdAt: '2024-12-01T09:30:00Z',
  },
  {
    id: 'pkg-009',
    status: 'in-progress',
    priority: 'high',
    product: 'Wedding Cake Distillate 510 Cart 0.5g',
    sku: 'VP-WC-DIST-05',
    category: 'vaporizer',
    quantity: 120,
    cannabisMaterials: [{ name: 'Wedding Cake Distillate Loose Filled Carts', required: 120, available: 120, unit: 'carts' }],
    nonCannabisMaterials: [
      { name: 'Cart Box (510)', required: 120, available: 950, unit: 'units', inStock: true },
      { name: 'Label — VP-WC-DIST-05', required: 120, available: 380, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 120, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 50,
    assignee: 'Rachel Kim',
    createdAt: '2024-12-01T10:00:00Z',
  },
  {
    id: 'pkg-010',
    status: 'in-progress',
    priority: 'medium',
    product: 'Blue Dream Shatter 1g',
    sku: 'CN-BD-SH-1',
    category: 'concentrate',
    quantity: 200,
    cannabisMaterials: [{ name: 'Blue Dream Shatter 1g Portions', required: 200, available: 200, unit: 'portions' }],
    nonCannabisMaterials: [
      { name: 'Concentrate Container 1g', required: 200, available: 500, unit: 'units', inStock: true },
      { name: 'Label — CN-BD-SH-1', required: 200, available: 700, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 200, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 65,
    assignee: 'David Okonkwo',
    linkedOrderId: 'ord-2024-050',
    createdAt: '2024-12-01T10:30:00Z',
  },

  // Blocked (2)
  {
    id: 'pkg-011',
    status: 'blocked-material',
    priority: 'high',
    product: 'Blue Dream Preroll 5-Pack',
    sku: 'PR-BD-5PK',
    category: 'preroll',
    quantity: 150,
    cannabisMaterials: [{ name: 'Blue Dream 0.5g Loose Rolled Prerolls', required: 750, available: 750, unit: 'prerolls' }],
    nonCannabisMaterials: [
      { name: 'Preroll Tube (single)', required: 750, available: 3200, unit: 'units', inStock: true },
      { name: '5-Pack Box', required: 150, available: 120, unit: 'units', inStock: false },
      { name: 'Label — PR-BD-5PK', required: 150, available: 600, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 150, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 100,
    assignee: 'David Okonkwo',
    linkedOrderId: 'ord-2024-058',
    createdAt: '2024-12-01T07:00:00Z',
  },
  {
    id: 'pkg-012',
    status: 'blocked-material',
    priority: 'medium',
    product: 'Gelato Wax 0.5g',
    sku: 'CN-GL-WAX-05',
    category: 'concentrate',
    quantity: 100,
    cannabisMaterials: [{ name: 'Gelato Wax Portions (0.5g)', required: 100, available: 100, unit: 'portions' }],
    nonCannabisMaterials: [
      { name: 'Concentrate Container 0.5g', required: 100, available: 45, unit: 'units', inStock: false },
      { name: 'Label — CN-GL-WAX-05', required: 100, available: 400, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 100, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 40,
    assignee: 'Rachel Kim',
    createdAt: '2024-12-01T07:30:00Z',
  },

  // Queued (8)
  {
    id: 'pkg-013',
    status: 'queued',
    priority: 'high',
    product: 'Purple Punch 3.5g',
    sku: 'FL-PP-35',
    category: 'flower',
    quantity: 180,
    cannabisMaterials: [{ name: 'Purple Punch Packagable Flower', required: 630, available: 630, unit: 'g' }],
    nonCannabisMaterials: [
      { name: 'Glass Jar 3.5g', required: 180, available: 1800, unit: 'units', inStock: true },
      { name: 'Label — FL-PP-35', required: 180, available: 950, unit: 'units', inStock: true },
      { name: 'Boveda 62% Humidity Pack', required: 180, available: 4500, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 180, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 80,
    assignee: 'Aisha Williams',
    createdAt: '2024-12-01T11:00:00Z',
  },
  {
    id: 'pkg-014',
    status: 'queued',
    priority: 'medium',
    product: 'Zkittlez 28g',
    sku: 'FL-ZK-28',
    category: 'flower',
    quantity: 30,
    cannabisMaterials: [{ name: 'Zkittlez Packagable Flower', required: 840, available: 840, unit: 'g' }],
    nonCannabisMaterials: [
      { name: 'Glass Jar 28g', required: 30, available: 80, unit: 'units', inStock: true },
      { name: 'Label — FL-ZK-28', required: 30, available: 200, unit: 'units', inStock: true },
      { name: 'Boveda 62% Humidity Pack', required: 30, available: 4500, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 30, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 25,
    assignee: 'Rachel Kim',
    createdAt: '2024-12-01T11:30:00Z',
  },
  {
    id: 'pkg-015',
    status: 'queued',
    priority: 'high',
    product: 'OG Kush Preroll 3-Pack',
    sku: 'PR-OK-3PK',
    category: 'preroll',
    quantity: 100,
    cannabisMaterials: [{ name: 'OG Kush 0.5g Loose Rolled Prerolls', required: 300, available: 300, unit: 'prerolls' }],
    nonCannabisMaterials: [
      { name: 'Preroll Tube (single)', required: 300, available: 3200, unit: 'units', inStock: true },
      { name: '3-Pack Box', required: 100, available: 800, unit: 'units', inStock: true },
      { name: 'Label — PR-OK-3PK', required: 100, available: 450, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 100, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 65,
    assignee: 'David Okonkwo',
    createdAt: '2024-12-01T12:00:00Z',
  },
  {
    id: 'pkg-016',
    status: 'queued',
    priority: 'low',
    product: 'Purple Punch Distillate 510 Cart 1g',
    sku: 'VP-PP-DIST-1',
    category: 'vaporizer',
    quantity: 80,
    cannabisMaterials: [{ name: 'Purple Punch Distillate Loose Filled Carts', required: 80, available: 80, unit: 'carts' }],
    nonCannabisMaterials: [
      { name: 'Cart Box (510)', required: 80, available: 950, unit: 'units', inStock: true },
      { name: 'Label — VP-PP-DIST-1', required: 80, available: 300, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 80, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 35,
    assignee: 'Aisha Williams',
    createdAt: '2024-12-01T12:30:00Z',
  },
  {
    id: 'pkg-017',
    status: 'queued',
    priority: 'medium',
    product: 'Gelato 3.5g',
    sku: 'FL-GL-35',
    category: 'flower',
    quantity: 120,
    cannabisMaterials: [{ name: 'Gelato Packagable Flower', required: 420, available: 420, unit: 'g' }],
    nonCannabisMaterials: [
      { name: 'Glass Jar 3.5g', required: 120, available: 1800, unit: 'units', inStock: true },
      { name: 'Label — FL-GL-35', required: 120, available: 800, unit: 'units', inStock: true },
      { name: 'Boveda 62% Humidity Pack', required: 120, available: 4500, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 120, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 55,
    assignee: 'Rachel Kim',
    createdAt: '2024-12-01T13:00:00Z',
  },
  {
    id: 'pkg-018',
    status: 'queued',
    priority: 'high',
    product: 'Wedding Cake Wax 1g',
    sku: 'CN-WC-WAX-1',
    category: 'concentrate',
    quantity: 200,
    cannabisMaterials: [{ name: 'Wedding Cake Clean Wax Portions (1g)', required: 200, available: 200, unit: 'portions' }],
    nonCannabisMaterials: [
      { name: 'Concentrate Container 1g', required: 200, available: 500, unit: 'units', inStock: true },
      { name: 'Label — CN-WC-WAX-1', required: 200, available: 650, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 200, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 70,
    assignee: 'David Okonkwo',
    createdAt: '2024-12-01T13:30:00Z',
  },
  {
    id: 'pkg-019',
    status: 'queued',
    priority: 'low',
    product: 'Durban Poison 1g',
    sku: 'FL-DP-1',
    category: 'flower',
    quantity: 200,
    cannabisMaterials: [{ name: 'Durban Poison Packagable Flower', required: 200, available: 0, unit: 'g' }],
    nonCannabisMaterials: [
      { name: 'Glass Jar 1g', required: 200, available: 2400, unit: 'units', inStock: true },
      { name: 'Label — FL-DP-1', required: 200, available: 1000, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 200, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 65,
    assignee: 'Aisha Williams',
    createdAt: '2024-12-01T14:00:00Z',
  },
  {
    id: 'pkg-020',
    status: 'queued',
    priority: 'medium',
    product: 'Gelato Mini Preroll 10-Pack',
    sku: 'PR-GL-10PK',
    category: 'preroll',
    quantity: 15,
    cannabisMaterials: [{ name: 'Gelato 0.35g Mini Prerolls', required: 150, available: 0, unit: 'prerolls' }],
    nonCannabisMaterials: [
      { name: 'Preroll Tube (single)', required: 150, available: 3200, unit: 'units', inStock: true },
      { name: '10-Pack Box', required: 15, available: 200, unit: 'units', inStock: true },
      { name: 'Label — PR-GL-10PK', required: 15, available: 100, unit: 'units', inStock: true },
      { name: 'Shrink Wrap Band', required: 15, available: 8000, unit: 'units', inStock: true },
    ],
    estimatedMinutes: 20,
    assignee: 'David Okonkwo',
    createdAt: '2024-12-01T14:30:00Z',
  },
];

// ── Non-Cannabis Inventory (30) ─────────────────────────────
const nonCannabisInventory: NonCannabisInventory[] = [
  // Glass Jars
  { id: 'nci-001', name: 'Glass Jar 1g', type: 'jar', size: '1g', currentStock: 2400, reorderPoint: 500, reorderQuantity: 3000, unit: 'units', costPerUnit: 0.45, supplier: 'Pacific Glass Supply', lastOrderDate: '2024-11-15T00:00:00Z', status: 'in-stock' },
  { id: 'nci-002', name: 'Glass Jar 3.5g', type: 'jar', size: '3.5g', currentStock: 1800, reorderPoint: 400, reorderQuantity: 2500, unit: 'units', costPerUnit: 0.65, supplier: 'Pacific Glass Supply', lastOrderDate: '2024-11-15T00:00:00Z', status: 'in-stock' },
  { id: 'nci-003', name: 'Glass Jar 7g', type: 'jar', size: '7g', currentStock: 600, reorderPoint: 200, reorderQuantity: 1000, unit: 'units', costPerUnit: 0.85, supplier: 'Pacific Glass Supply', lastOrderDate: '2024-11-10T00:00:00Z', status: 'in-stock' },
  { id: 'nci-004', name: 'Glass Jar 14g', type: 'jar', size: '14g', currentStock: 200, reorderPoint: 100, reorderQuantity: 500, unit: 'units', costPerUnit: 1.10, supplier: 'Pacific Glass Supply', lastOrderDate: '2024-11-10T00:00:00Z', status: 'in-stock' },
  { id: 'nci-005', name: 'Glass Jar 28g', type: 'jar', size: '28g', currentStock: 80, reorderPoint: 50, reorderQuantity: 300, unit: 'units', costPerUnit: 1.45, supplier: 'Pacific Glass Supply', lastOrderDate: '2024-11-01T00:00:00Z', status: 'in-stock' },

  // Preroll Tubes
  { id: 'nci-006', name: 'Preroll Tube (single)', type: 'tube', size: 'Standard', currentStock: 3200, reorderPoint: 800, reorderQuantity: 5000, unit: 'units', costPerUnit: 0.12, supplier: 'GreenPak Solutions', lastOrderDate: '2024-11-20T00:00:00Z', status: 'in-stock' },
  { id: 'nci-007', name: 'Preroll Tube (king size)', type: 'tube', size: 'King', currentStock: 1100, reorderPoint: 300, reorderQuantity: 2000, unit: 'units', costPerUnit: 0.15, supplier: 'GreenPak Solutions', lastOrderDate: '2024-11-20T00:00:00Z', status: 'in-stock' },

  // Multi-pack Boxes
  { id: 'nci-008', name: '3-Pack Box', type: 'box', size: '3-pack', currentStock: 800, reorderPoint: 200, reorderQuantity: 1500, unit: 'units', costPerUnit: 0.35, supplier: 'GreenPak Solutions', lastOrderDate: '2024-11-18T00:00:00Z', status: 'in-stock' },
  { id: 'nci-009', name: '5-Pack Box', type: 'box', size: '5-pack', currentStock: 120, reorderPoint: 150, reorderQuantity: 1000, unit: 'units', costPerUnit: 0.42, supplier: 'GreenPak Solutions', lastOrderDate: '2024-10-25T00:00:00Z', status: 'low' },
  { id: 'nci-010', name: '7-Pack Box', type: 'box', size: '7-pack', currentStock: 340, reorderPoint: 100, reorderQuantity: 800, unit: 'units', costPerUnit: 0.50, supplier: 'GreenPak Solutions', lastOrderDate: '2024-11-05T00:00:00Z', status: 'in-stock' },
  { id: 'nci-011', name: '10-Pack Box', type: 'box', size: '10-pack', currentStock: 200, reorderPoint: 80, reorderQuantity: 500, unit: 'units', costPerUnit: 0.60, supplier: 'GreenPak Solutions', lastOrderDate: '2024-11-05T00:00:00Z', status: 'in-stock' },

  // Mylar Bags
  { id: 'nci-012', name: 'Mylar Bag 1g', type: 'bag', size: '1g', currentStock: 1500, reorderPoint: 400, reorderQuantity: 3000, unit: 'units', costPerUnit: 0.08, supplier: 'WestCoast Packaging', lastOrderDate: '2024-11-12T00:00:00Z', status: 'in-stock' },
  { id: 'nci-013', name: 'Mylar Bag 3.5g', type: 'bag', size: '3.5g', currentStock: 900, reorderPoint: 300, reorderQuantity: 2000, unit: 'units', costPerUnit: 0.10, supplier: 'WestCoast Packaging', lastOrderDate: '2024-11-12T00:00:00Z', status: 'in-stock' },
  { id: 'nci-014', name: 'Mylar Bag 7g', type: 'bag', size: '7g', currentStock: 450, reorderPoint: 150, reorderQuantity: 1000, unit: 'units', costPerUnit: 0.14, supplier: 'WestCoast Packaging', lastOrderDate: '2024-11-01T00:00:00Z', status: 'in-stock' },

  // Vape Packaging
  { id: 'nci-015', name: 'Cart Box (510)', type: 'vape-packaging', size: '510 Thread', currentStock: 950, reorderPoint: 300, reorderQuantity: 2000, unit: 'units', costPerUnit: 0.28, supplier: 'VapePak Inc', lastOrderDate: '2024-11-22T00:00:00Z', status: 'in-stock' },
  { id: 'nci-016', name: 'Disposable Vape Box', type: 'vape-packaging', size: 'Disposable', currentStock: 400, reorderPoint: 150, reorderQuantity: 1000, unit: 'units', costPerUnit: 0.32, supplier: 'VapePak Inc', lastOrderDate: '2024-11-10T00:00:00Z', status: 'in-stock' },

  // Concentrate Containers
  { id: 'nci-017', name: 'Concentrate Container 0.5g', type: 'concentrate-container', size: '0.5g', currentStock: 45, reorderPoint: 100, reorderQuantity: 500, unit: 'units', costPerUnit: 0.22, supplier: 'CannaPak Supply', lastOrderDate: '2024-10-20T00:00:00Z', status: 'critical' },
  { id: 'nci-018', name: 'Concentrate Container 1g', type: 'concentrate-container', size: '1g', currentStock: 500, reorderPoint: 200, reorderQuantity: 1000, unit: 'units', costPerUnit: 0.28, supplier: 'CannaPak Supply', lastOrderDate: '2024-11-15T00:00:00Z', status: 'in-stock' },

  // Labels (15 SKU-specific types — showing a representative set)
  { id: 'nci-019', name: 'Label — FL-WC-35', type: 'label', size: 'Flower 3.5g', currentStock: 1400, reorderPoint: 300, reorderQuantity: 2000, unit: 'units', costPerUnit: 0.04, supplier: 'LabelPro Northwest', lastOrderDate: '2024-11-20T00:00:00Z', status: 'in-stock' },
  { id: 'nci-020', name: 'Label — FL-BD-1', type: 'label', size: 'Flower 1g', currentStock: 1200, reorderPoint: 300, reorderQuantity: 2000, unit: 'units', costPerUnit: 0.04, supplier: 'LabelPro Northwest', lastOrderDate: '2024-11-20T00:00:00Z', status: 'in-stock' },
  { id: 'nci-021', name: 'Label — PR-BD-5PK', type: 'label', size: 'Preroll 5pk', currentStock: 600, reorderPoint: 200, reorderQuantity: 1500, unit: 'units', costPerUnit: 0.05, supplier: 'LabelPro Northwest', lastOrderDate: '2024-11-15T00:00:00Z', status: 'in-stock' },
  { id: 'nci-022', name: 'Label — VP-GL-LR-1', type: 'label', size: 'Vape 1g', currentStock: 500, reorderPoint: 200, reorderQuantity: 1500, unit: 'units', costPerUnit: 0.05, supplier: 'LabelPro Northwest', lastOrderDate: '2024-11-18T00:00:00Z', status: 'in-stock' },
  { id: 'nci-023', name: 'Label — CN-OK-WAX-1', type: 'label', size: 'Conc 1g', currentStock: 900, reorderPoint: 200, reorderQuantity: 1500, unit: 'units', costPerUnit: 0.05, supplier: 'LabelPro Northwest', lastOrderDate: '2024-11-18T00:00:00Z', status: 'in-stock' },
  { id: 'nci-024', name: 'Label — FL-PP-35', type: 'label', size: 'Flower 3.5g', currentStock: 950, reorderPoint: 300, reorderQuantity: 2000, unit: 'units', costPerUnit: 0.04, supplier: 'LabelPro Northwest', lastOrderDate: '2024-11-20T00:00:00Z', status: 'in-stock' },
  { id: 'nci-025', name: 'Label — VP-WC-DIST-05', type: 'label', size: 'Vape 0.5g', currentStock: 85, reorderPoint: 100, reorderQuantity: 1000, unit: 'units', costPerUnit: 0.05, supplier: 'LabelPro Northwest', lastOrderDate: '2024-10-10T00:00:00Z', status: 'low' },
  { id: 'nci-026', name: 'Label — CN-GL-WAX-05', type: 'label', size: 'Conc 0.5g', currentStock: 400, reorderPoint: 150, reorderQuantity: 1000, unit: 'units', costPerUnit: 0.05, supplier: 'LabelPro Northwest', lastOrderDate: '2024-11-10T00:00:00Z', status: 'in-stock' },

  // Shrink Wrap
  { id: 'nci-027', name: 'Shrink Wrap Band', type: 'shrink-wrap', size: 'Universal', currentStock: 8000, reorderPoint: 2000, reorderQuantity: 10000, unit: 'units', costPerUnit: 0.02, supplier: 'WestCoast Packaging', lastOrderDate: '2024-11-25T00:00:00Z', status: 'in-stock' },

  // Humidity Packs
  { id: 'nci-028', name: 'Boveda 62% Humidity Pack', type: 'humidity-pack', size: '8g', currentStock: 4500, reorderPoint: 1000, reorderQuantity: 5000, unit: 'units', costPerUnit: 0.55, supplier: 'Boveda Direct', lastOrderDate: '2024-11-20T00:00:00Z', status: 'in-stock' },

  // Edible & Beverage Packaging
  { id: 'nci-029', name: 'Edible Pouch (child-resistant)', type: 'edible-packaging', size: '10-count', currentStock: 350, reorderPoint: 150, reorderQuantity: 1000, unit: 'units', costPerUnit: 0.18, supplier: 'GreenPak Solutions', lastOrderDate: '2024-11-08T00:00:00Z', status: 'in-stock' },
  { id: 'nci-030', name: 'Beverage Can Sleeve', type: 'beverage-packaging', size: '12oz', currentStock: 200, reorderPoint: 100, reorderQuantity: 500, unit: 'units', costPerUnit: 0.25, supplier: 'GreenPak Solutions', lastOrderDate: '2024-11-01T00:00:00Z', status: 'in-stock' },
];

// ── Metrics ─────────────────────────────────────────────────
const metrics: PackagingMetrics = {
  totalOrders: 20,
  completedToday: 4,
  inProgress: 6,
  materialShortages: 2,
  avgPackagesPerHour: 45,
  topSKU: 'FL-WC-35',
};

// ── Helpers ──────────────────────────────────────────────────
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Exports ─────────────────────────────────────────────────
export async function getPackagingOrders(filters?: { status?: string; category?: string; priority?: string }): Promise<PackagingOrder[]> {
  await delay(300);
  let result = packagingOrders;
  if (filters?.status) result = result.filter((o) => o.status === filters.status);
  if (filters?.category) result = result.filter((o) => o.category === filters.category);
  if (filters?.priority) result = result.filter((o) => o.priority === filters.priority);
  return result;
}

export async function getPackagingOrder(id: string): Promise<PackagingOrder | undefined> {
  await delay(300);
  return packagingOrders.find((o) => o.id === id);
}

export async function getNonCannabisInventory(filters?: { type?: string; status?: string }): Promise<NonCannabisInventory[]> {
  await delay(300);
  let result = nonCannabisInventory;
  if (filters?.type) result = result.filter((i) => i.type === filters.type);
  if (filters?.status) result = result.filter((i) => i.status === filters.status);
  return result;
}

export async function getPackagingMetrics(): Promise<PackagingMetrics> {
  await delay(300);
  return metrics;
}
