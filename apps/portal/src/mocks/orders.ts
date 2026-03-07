import type {
  Order,
  OrderItem,
  OrderMetrics,
  OrderFilter,
  OrderPipelineStage,
  OrderVolumeWeek,
  CategoryRevenue,
  TopAccount,
} from '@/modules/orders/types';

// --- Line Item Templates ---

function item(
  id: string, sku: string, productName: string, category: string,
  subCategory: string, packageSize: string, quantity: number,
  unitPrice: number, batchNumber?: string
): OrderItem {
  return {
    id, sku, productName, category, subCategory, packageSize,
    quantity, unitPrice, lineTotal: quantity * unitPrice, batchNumber,
  };
}

// --- Orders (35) ---

const orders: Order[] = [
  // === PENDING (5) ===
  {
    id: 'ord-001', orderNumber: 'ORD-2026-0347', accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary',
    status: 'pending', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-03-06T08:30:00Z', subtotal: 5840, tax: 467.20, total: 6307.20,
    items: [
      item('li-001a', 'FROST-FL-WC-35', 'Wedding Cake Premium Flower', 'flower', 'Premium', '3.5g', 48, 28, 'FL-2026-089'),
      item('li-001b', 'FROST-PR-BD-1G', 'Blue Dream Infused Preroll', 'preroll', 'Infused', '1g', 24, 10),
      item('li-001c', 'FROST-VZ-GL-1G', 'Gelato Live Resin 510 Cart', 'vaporizer', 'Live Resin Cart', '1g', 36, 32, 'VZ-2026-034'),
      item('li-001d', 'FROST-ED-ZK-10', 'Watermelon Zkittlez Gummies', 'edible', 'Gummies', '10pk (100mg)', 60, 14, 'ED-2026-012'),
    ],
  },
  {
    id: 'ord-002', orderNumber: 'ORD-2026-0348', accountId: 'acct-pacific-leaf', accountName: 'Pacific Leaf',
    status: 'pending', assignedRep: 'Priya Patel', paymentMethod: 'cod', paymentStatus: 'pending',
    createdAt: '2026-03-06T07:15:00Z', subtotal: 3200, tax: 256, total: 3456,
    items: [
      item('li-002a', 'FROST-FL-BD-35', 'Blue Dream Flower', 'flower', 'Standard', '3.5g', 40, 24, 'FL-2026-091'),
      item('li-002b', 'FROST-FL-GS-35', 'GSC Flower', 'flower', 'Standard', '3.5g', 36, 22),
      item('li-002c', 'FROST-PR-GS-5PK', 'GSC Infused Preroll 5-Pack', 'preroll', 'Infused', '5pk', 20, 38),
    ],
  },
  {
    id: 'ord-003', orderNumber: 'ORD-2026-0349', accountId: 'acct-001', accountName: 'Ballard Buds',
    status: 'pending', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-03-06T06:00:00Z', subtotal: 2760, tax: 220.80, total: 2980.80,
    items: [
      item('li-003a', 'FROST-FL-OK-35', 'OG Kush Flower', 'flower', 'Standard', '3.5g', 30, 22),
      item('li-003b', 'FROST-VZ-SD-05', 'Sour Diesel Disposable', 'vaporizer', 'Disposable', '0.5g', 24, 28, 'VZ-2026-035'),
      item('li-003c', 'FROST-CN-OK-WX', 'OG Kush Wax', 'concentrate', 'Wax', '1g', 30, 26),
    ],
  },
  {
    id: 'ord-004', orderNumber: 'ORD-2026-0350', accountId: 'acct-012', accountName: 'Bellingham Bloom',
    status: 'pending', assignedRep: 'Jake Morrison', paymentMethod: 'check', paymentStatus: 'pending',
    createdAt: '2026-03-05T16:00:00Z', subtotal: 1880, tax: 150.40, total: 2030.40,
    items: [
      item('li-004a', 'FROST-FL-JH-35', 'Jack Herer Flower', 'flower', 'Standard', '3.5g', 24, 24),
      item('li-004b', 'FROST-PR-JH-5PK', 'Jack Herer Preroll 5-Pack', 'preroll', 'Standard', '5pk', 30, 32),
    ],
  },
  {
    id: 'ord-005', orderNumber: 'ORD-2026-0351', accountId: 'acct-cascade', accountName: 'Cascade Wellness',
    status: 'pending', assignedRep: 'Carlos Ruiz', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-03-05T14:00:00Z', subtotal: 4120, tax: 329.60, total: 4449.60,
    items: [
      item('li-005a', 'FROST-FL-GL-35', 'Gelato Flower', 'flower', 'Premium', '3.5g', 36, 28, 'FL-2026-090'),
      item('li-005b', 'FROST-ED-ZK-10', 'Watermelon Zkittlez Gummies', 'edible', 'Gummies', '10pk (100mg)', 48, 14),
      item('li-005c', 'FROST-BV-LM-CAN', 'Lemon Fizz CBD Seltzer', 'beverage', 'RTD Can', '12oz', 40, 8),
      item('li-005d', 'FROST-ED-CH-4PK', 'Dark Chocolate Bites', 'edible', 'Chocolates', '4pk (40mg)', 30, 18),
    ],
  },

  // === CONFIRMED (6) ===
  {
    id: 'ord-006', orderNumber: 'ORD-2026-0342', accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary',
    status: 'confirmed', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-03-04T09:00:00Z', confirmedAt: '2026-03-04T14:00:00Z',
    subtotal: 6240, tax: 499.20, total: 6739.20,
    items: [
      item('li-006a', 'FROST-FL-WC-35', 'Wedding Cake Premium Flower', 'flower', 'Premium', '3.5g', 60, 28, 'FL-2026-089'),
      item('li-006b', 'FROST-VZ-GL-1G', 'Gelato Live Resin 510 Cart', 'vaporizer', 'Live Resin Cart', '1g', 48, 32, 'VZ-2026-034'),
      item('li-006c', 'FROST-PR-BD-1G', 'Blue Dream Infused Preroll', 'preroll', 'Infused', '1g', 36, 10),
      item('li-006d', 'FROST-CN-GL-LR', 'Gelato Live Resin', 'concentrate', 'Live Resin', '1g', 24, 38),
    ],
  },
  {
    id: 'ord-007', orderNumber: 'ORD-2026-0343', accountId: 'acct-olympic', accountName: 'Olympic Greens',
    status: 'confirmed', assignedRep: 'Priya Patel', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-03-04T10:00:00Z', confirmedAt: '2026-03-04T16:00:00Z',
    subtotal: 3440, tax: 275.20, total: 3715.20,
    items: [
      item('li-007a', 'FROST-PR-WC-5PK', 'Wedding Cake Preroll 5-Pack', 'preroll', 'Standard', '5pk', 40, 32),
      item('li-007b', 'FROST-PR-BD-1G', 'Blue Dream Infused Preroll', 'preroll', 'Infused', '1g', 60, 10),
      item('li-007c', 'FROST-PR-GS-5PK', 'GSC Infused Preroll 5-Pack', 'preroll', 'Infused', '5pk', 24, 38),
    ],
  },
  {
    id: 'ord-008', orderNumber: 'ORD-2026-0344', accountId: 'acct-capitol-hill', accountName: 'Capitol Hill Collective',
    status: 'confirmed', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-03-03T11:00:00Z', confirmedAt: '2026-03-03T15:00:00Z',
    subtotal: 4960, tax: 396.80, total: 5356.80,
    items: [
      item('li-008a', 'FROST-VZ-GL-1G', 'Gelato Live Resin 510 Cart', 'vaporizer', 'Live Resin Cart', '1g', 60, 32),
      item('li-008b', 'FROST-CN-OK-SH', 'OG Kush Shatter', 'concentrate', 'Shatter', '1g', 40, 28),
      item('li-008c', 'FROST-VZ-SD-05', 'Sour Diesel Disposable', 'vaporizer', 'Disposable', '0.5g', 36, 28),
    ],
  },
  {
    id: 'ord-009', orderNumber: 'ORD-2026-0345', accountId: 'acct-olympic', accountName: 'Olympic Greens',
    status: 'confirmed', assignedRep: 'Priya Patel', paymentMethod: 'cod', paymentStatus: 'pending',
    createdAt: '2026-03-03T08:00:00Z', confirmedAt: '2026-03-03T12:00:00Z',
    subtotal: 2680, tax: 214.40, total: 2894.40,
    items: [
      item('li-009a', 'FROST-PR-JH-5PK', 'Jack Herer Preroll 5-Pack', 'preroll', 'Standard', '5pk', 36, 32),
      item('li-009b', 'FROST-PR-GG-1G', 'Gorilla Glue Preroll', 'preroll', 'Standard', '1g', 48, 8),
      item('li-009c', 'FROST-FL-ZK-35', 'Zkittlez Flower', 'flower', 'Standard', '3.5g', 24, 22),
    ],
  },
  {
    id: 'ord-010', orderNumber: 'ORD-2026-0346', accountId: 'acct-summit', accountName: 'Summit Cannabis Co.',
    status: 'confirmed', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-03-02T14:00:00Z', confirmedAt: '2026-03-03T09:00:00Z',
    subtotal: 3960, tax: 316.80, total: 4276.80,
    items: [
      item('li-010a', 'FROST-FL-BD-35', 'Blue Dream Flower', 'flower', 'Standard', '3.5g', 48, 24, 'FL-2026-091'),
      item('li-010b', 'FROST-VZ-BD-1G', 'Blue Dream 510 Cart', 'vaporizer', 'Distillate Cart', '1g', 36, 26),
      item('li-010c', 'FROST-ED-ZK-10', 'Watermelon Zkittlez Gummies', 'edible', 'Gummies', '10pk (100mg)', 36, 14),
    ],
  },
  {
    id: 'ord-011', orderNumber: 'ORD-2026-0341', accountId: 'acct-004', accountName: 'Bellevue Botanicals',
    status: 'confirmed', assignedRep: 'Priya Patel', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-03-02T10:00:00Z', confirmedAt: '2026-03-02T15:00:00Z',
    subtotal: 5120, tax: 409.60, total: 5529.60,
    items: [
      item('li-011a', 'FROST-FL-WC-35', 'Wedding Cake Premium Flower', 'flower', 'Premium', '3.5g', 72, 28),
      item('li-011b', 'FROST-FL-GL-35', 'Gelato Flower', 'flower', 'Premium', '3.5g', 48, 28),
      item('li-011c', 'FROST-CN-GL-DI', 'Gelato Diamonds', 'concentrate', 'Diamonds', '1g', 20, 48),
    ],
  },

  // === IN-PRODUCTION (5) ===
  {
    id: 'ord-012', orderNumber: 'ORD-2026-0336', accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary',
    status: 'in-production', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-03-01T09:00:00Z', confirmedAt: '2026-03-01T14:00:00Z',
    subtotal: 4480, tax: 358.40, total: 4838.40,
    items: [
      item('li-012a', 'FROST-FL-BD-35', 'Blue Dream Flower', 'flower', 'Standard', '3.5g', 60, 24, 'FL-2026-091'),
      item('li-012b', 'FROST-PR-WC-5PK', 'Wedding Cake Preroll 5-Pack', 'preroll', 'Standard', '5pk', 36, 32),
      item('li-012c', 'FROST-ED-CH-4PK', 'Dark Chocolate Bites', 'edible', 'Chocolates', '4pk (40mg)', 24, 18),
    ],
  },
  {
    id: 'ord-013', orderNumber: 'ORD-2026-0337', accountId: 'acct-pacific-leaf', accountName: 'Pacific Leaf',
    status: 'in-production', assignedRep: 'Priya Patel', paymentMethod: 'cod', paymentStatus: 'pending',
    createdAt: '2026-02-28T11:00:00Z', confirmedAt: '2026-02-28T16:00:00Z',
    subtotal: 2960, tax: 236.80, total: 3196.80,
    items: [
      item('li-013a', 'FROST-FL-OK-35', 'OG Kush Flower', 'flower', 'Standard', '3.5g', 48, 22),
      item('li-013b', 'FROST-VZ-OK-1G', 'OG Kush 510 Cart', 'vaporizer', 'Distillate Cart', '1g', 30, 26),
      item('li-013c', 'FROST-CN-OK-WX', 'OG Kush Wax', 'concentrate', 'Wax', '1g', 20, 26),
    ],
  },
  {
    id: 'ord-014', orderNumber: 'ORD-2026-0338', accountId: 'acct-015', accountName: 'Everett Extracts',
    status: 'in-production', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-02-28T09:00:00Z', confirmedAt: '2026-02-28T14:00:00Z',
    subtotal: 3680, tax: 294.40, total: 3974.40,
    items: [
      item('li-014a', 'FROST-CN-GL-LR', 'Gelato Live Resin', 'concentrate', 'Live Resin', '1g', 40, 38),
      item('li-014b', 'FROST-CN-WC-LR', 'Wedding Cake Live Rosin', 'concentrate', 'Live Rosin', '1g', 24, 52),
      item('li-014c', 'FROST-VZ-WC-1G', 'Wedding Cake Live Resin Cart', 'vaporizer', 'Live Resin Cart', '1g', 20, 32),
    ],
  },
  {
    id: 'ord-015', orderNumber: 'ORD-2026-0335', accountId: 'acct-spokane-valley', accountName: 'Spokane Valley Dispensary',
    status: 'in-production', assignedRep: 'Carlos Ruiz', paymentMethod: 'check', paymentStatus: 'pending',
    createdAt: '2026-02-27T10:00:00Z', confirmedAt: '2026-02-27T15:00:00Z',
    subtotal: 2240, tax: 179.20, total: 2419.20,
    items: [
      item('li-015a', 'FROST-FL-GG-35', 'Gorilla Glue Flower', 'flower', 'Standard', '3.5g', 36, 22),
      item('li-015b', 'FROST-PR-GG-1G', 'Gorilla Glue Preroll', 'preroll', 'Standard', '1g', 60, 8),
      item('li-015c', 'FROST-FL-JH-35', 'Jack Herer Flower', 'flower', 'Standard', '3.5g', 24, 24),
    ],
  },
  {
    id: 'ord-016', orderNumber: 'ORD-2026-0334', accountId: 'acct-006', accountName: 'Redmond Relief',
    status: 'in-production', assignedRep: 'Priya Patel', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-02-27T08:00:00Z', confirmedAt: '2026-02-27T13:00:00Z',
    subtotal: 1920, tax: 153.60, total: 2073.60,
    items: [
      item('li-016a', 'FROST-FL-BD-35', 'Blue Dream Flower', 'flower', 'Standard', '3.5g', 36, 24),
      item('li-016b', 'FROST-ED-ZK-10', 'Watermelon Zkittlez Gummies', 'edible', 'Gummies', '10pk (100mg)', 36, 14),
      item('li-016c', 'FROST-BV-LM-CAN', 'Lemon Fizz CBD Seltzer', 'beverage', 'RTD Can', '12oz', 30, 8),
    ],
  },

  // === PACKAGED (4) ===
  {
    id: 'ord-017', orderNumber: 'ORD-2026-0330', accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary',
    status: 'packaged', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-02-25T09:00:00Z', confirmedAt: '2026-02-25T14:00:00Z',
    subtotal: 5200, tax: 416, total: 5616,
    items: [
      item('li-017a', 'FROST-FL-GL-35', 'Gelato Flower', 'flower', 'Premium', '3.5g', 72, 28, 'FL-2026-090'),
      item('li-017b', 'FROST-VZ-GL-1G', 'Gelato Live Resin 510 Cart', 'vaporizer', 'Live Resin Cart', '1g', 48, 32, 'VZ-2026-034'),
      item('li-017c', 'FROST-PR-GL-1G', 'Gelato Preroll', 'preroll', 'Standard', '1g', 40, 8),
    ],
  },
  {
    id: 'ord-018', orderNumber: 'ORD-2026-0331', accountId: 'acct-capitol-hill', accountName: 'Capitol Hill Collective',
    status: 'packaged', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-02-24T10:00:00Z', confirmedAt: '2026-02-24T15:00:00Z',
    subtotal: 3840, tax: 307.20, total: 4147.20,
    items: [
      item('li-018a', 'FROST-CN-GL-DI', 'Gelato Diamonds', 'concentrate', 'Diamonds', '1g', 30, 48),
      item('li-018b', 'FROST-VZ-WC-1G', 'Wedding Cake Live Resin Cart', 'vaporizer', 'Live Resin Cart', '1g', 36, 32),
      item('li-018c', 'FROST-CN-GG-SH', 'Gorilla Glue Shatter', 'concentrate', 'Shatter', '1g', 24, 28),
    ],
  },
  {
    id: 'ord-019', orderNumber: 'ORD-2026-0332', accountId: 'acct-007', accountName: 'Tacoma Treehouse',
    status: 'packaged', assignedRep: 'Priya Patel', paymentMethod: 'cod', paymentStatus: 'pending',
    createdAt: '2026-02-24T08:00:00Z', confirmedAt: '2026-02-24T13:00:00Z',
    subtotal: 2400, tax: 192, total: 2592,
    items: [
      item('li-019a', 'FROST-FL-WC-35', 'Wedding Cake Premium Flower', 'flower', 'Premium', '3.5g', 36, 28),
      item('li-019b', 'FROST-FL-BD-35', 'Blue Dream Flower', 'flower', 'Standard', '3.5g', 36, 24),
      item('li-019c', 'FROST-PR-BD-1G', 'Blue Dream Infused Preroll', 'preroll', 'Infused', '1g', 24, 10),
    ],
  },
  {
    id: 'ord-020', orderNumber: 'ORD-2026-0333', accountId: 'acct-011', accountName: 'Yakima Valley Green',
    status: 'packaged', assignedRep: 'Carlos Ruiz', paymentMethod: 'check', paymentStatus: 'pending',
    createdAt: '2026-02-23T10:00:00Z', confirmedAt: '2026-02-23T15:00:00Z',
    subtotal: 1680, tax: 134.40, total: 1814.40,
    items: [
      item('li-020a', 'FROST-FL-OK-35', 'OG Kush Flower', 'flower', 'Standard', '3.5g', 30, 22),
      item('li-020b', 'FROST-PR-OK-1G', 'OG Kush Preroll', 'preroll', 'Standard', '1g', 48, 8),
      item('li-020c', 'FROST-ED-ZK-10', 'Watermelon Zkittlez Gummies', 'edible', 'Gummies', '10pk (100mg)', 20, 14),
    ],
  },

  // === FULFILLED (3) ===
  {
    id: 'ord-021', orderNumber: 'ORD-2026-0327', accountId: 'acct-puget-sound', accountName: 'Puget Sound Provisions',
    status: 'fulfilled', assignedRep: 'Priya Patel', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-02-22T09:00:00Z', confirmedAt: '2026-02-22T14:00:00Z', fulfilledAt: '2026-03-01T10:00:00Z',
    subtotal: 4800, tax: 384, total: 5184,
    items: [
      item('li-021a', 'FROST-FL-WC-35', 'Wedding Cake Premium Flower', 'flower', 'Premium', '3.5g', 60, 28),
      item('li-021b', 'FROST-FL-GL-35', 'Gelato Flower', 'flower', 'Premium', '3.5g', 48, 28),
      item('li-021c', 'FROST-VZ-GL-1G', 'Gelato Live Resin 510 Cart', 'vaporizer', 'Live Resin Cart', '1g', 24, 32),
      item('li-021d', 'FROST-BV-BL-CAN', 'Blueberry Lemonade Seltzer', 'beverage', 'RTD Can', '12oz', 24, 8),
    ],
  },
  {
    id: 'ord-022', orderNumber: 'ORD-2026-0328', accountId: 'acct-summit', accountName: 'Summit Cannabis Co.',
    status: 'fulfilled', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-02-21T10:00:00Z', confirmedAt: '2026-02-21T15:00:00Z', fulfilledAt: '2026-02-28T11:00:00Z',
    subtotal: 3600, tax: 288, total: 3888,
    items: [
      item('li-022a', 'FROST-FL-BD-35', 'Blue Dream Flower', 'flower', 'Standard', '3.5g', 48, 24),
      item('li-022b', 'FROST-PR-GS-5PK', 'GSC Infused Preroll 5-Pack', 'preroll', 'Infused', '5pk', 24, 38),
      item('li-022c', 'FROST-VZ-SD-05', 'Sour Diesel Disposable', 'vaporizer', 'Disposable', '0.5g', 24, 28),
    ],
  },
  {
    id: 'ord-023', orderNumber: 'ORD-2026-0329', accountId: 'acct-olympic', accountName: 'Olympic Greens',
    status: 'fulfilled', assignedRep: 'Priya Patel', paymentMethod: 'cod', paymentStatus: 'pending',
    createdAt: '2026-02-20T08:00:00Z', confirmedAt: '2026-02-20T13:00:00Z', fulfilledAt: '2026-02-27T10:00:00Z',
    subtotal: 2720, tax: 217.60, total: 2937.60,
    items: [
      item('li-023a', 'FROST-PR-WC-5PK', 'Wedding Cake Preroll 5-Pack', 'preroll', 'Standard', '5pk', 36, 32),
      item('li-023b', 'FROST-PR-BD-1G', 'Blue Dream Infused Preroll', 'preroll', 'Infused', '1g', 48, 10),
      item('li-023c', 'FROST-FL-ZK-35', 'Zkittlez Flower', 'flower', 'Standard', '3.5g', 24, 22),
    ],
  },

  // === SHIPPED (2) ===
  {
    id: 'ord-024', orderNumber: 'ORD-2026-0325', accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary',
    status: 'shipped', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-02-18T09:00:00Z', confirmedAt: '2026-02-18T14:00:00Z', fulfilledAt: '2026-02-24T10:00:00Z',
    subtotal: 5440, tax: 435.20, total: 5875.20,
    items: [
      item('li-024a', 'FROST-FL-WC-35', 'Wedding Cake Premium Flower', 'flower', 'Premium', '3.5g', 72, 28),
      item('li-024b', 'FROST-VZ-GL-1G', 'Gelato Live Resin 510 Cart', 'vaporizer', 'Live Resin Cart', '1g', 36, 32),
      item('li-024c', 'FROST-PR-WC-5PK', 'Wedding Cake Preroll 5-Pack', 'preroll', 'Standard', '5pk', 24, 32),
    ],
  },
  {
    id: 'ord-025', orderNumber: 'ORD-2026-0326', accountId: 'acct-008', accountName: 'Olympia Organics',
    status: 'shipped', assignedRep: 'Priya Patel', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-02-17T10:00:00Z', confirmedAt: '2026-02-17T15:00:00Z', fulfilledAt: '2026-02-23T11:00:00Z',
    subtotal: 2880, tax: 230.40, total: 3110.40,
    items: [
      item('li-025a', 'FROST-FL-JH-35', 'Jack Herer Flower', 'flower', 'Standard', '3.5g', 36, 24),
      item('li-025b', 'FROST-FL-BD-35', 'Blue Dream Flower', 'flower', 'Standard', '3.5g', 36, 24),
      item('li-025c', 'FROST-ED-ZK-10', 'Watermelon Zkittlez Gummies', 'edible', 'Gummies', '10pk (100mg)', 36, 14),
    ],
  },

  // === DELIVERED (6) ===
  {
    id: 'ord-026', orderNumber: 'ORD-2026-0319', accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary',
    status: 'delivered', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-02-14T09:00:00Z', confirmedAt: '2026-02-14T14:00:00Z', fulfilledAt: '2026-02-18T10:00:00Z', deliveredAt: '2026-02-20T14:00:00Z',
    subtotal: 4960, tax: 396.80, total: 5356.80,
    items: [
      item('li-026a', 'FROST-FL-GL-35', 'Gelato Flower', 'flower', 'Premium', '3.5g', 60, 28),
      item('li-026b', 'FROST-VZ-WC-1G', 'Wedding Cake Live Resin Cart', 'vaporizer', 'Live Resin Cart', '1g', 36, 32),
      item('li-026c', 'FROST-PR-GL-1G', 'Gelato Preroll', 'preroll', 'Standard', '1g', 48, 8),
    ],
  },
  {
    id: 'ord-027', orderNumber: 'ORD-2026-0320', accountId: 'acct-pacific-leaf', accountName: 'Pacific Leaf',
    status: 'delivered', assignedRep: 'Priya Patel', paymentMethod: 'cod', paymentStatus: 'overdue',
    createdAt: '2026-02-13T10:00:00Z', confirmedAt: '2026-02-13T15:00:00Z', fulfilledAt: '2026-02-17T11:00:00Z', deliveredAt: '2026-02-19T13:00:00Z',
    subtotal: 3200, tax: 256, total: 3456,
    notes: 'Payment overdue — follow up with David Kim.',
    items: [
      item('li-027a', 'FROST-FL-OK-35', 'OG Kush Flower', 'flower', 'Standard', '3.5g', 48, 22),
      item('li-027b', 'FROST-VZ-OK-1G', 'OG Kush 510 Cart', 'vaporizer', 'Distillate Cart', '1g', 36, 26),
      item('li-027c', 'FROST-PR-OK-1G', 'OG Kush Preroll', 'preroll', 'Standard', '1g', 48, 8),
    ],
  },
  {
    id: 'ord-028', orderNumber: 'ORD-2026-0321', accountId: 'acct-rainier', accountName: 'Rainier Remedies',
    status: 'delivered', assignedRep: 'Priya Patel', paymentMethod: 'check', paymentStatus: 'overdue',
    createdAt: '2026-02-12T09:00:00Z', confirmedAt: '2026-02-12T14:00:00Z', fulfilledAt: '2026-02-16T10:00:00Z', deliveredAt: '2026-02-18T12:00:00Z',
    subtotal: 3880, tax: 310.40, total: 4190.40,
    notes: 'Payment overdue by 4 days. Account has history of late payments.',
    items: [
      item('li-028a', 'FROST-FL-WC-35', 'Wedding Cake Premium Flower', 'flower', 'Premium', '3.5g', 48, 28),
      item('li-028b', 'FROST-FL-BD-35', 'Blue Dream Flower', 'flower', 'Standard', '3.5g', 36, 24),
      item('li-028c', 'FROST-ED-ZK-10', 'Watermelon Zkittlez Gummies', 'edible', 'Gummies', '10pk (100mg)', 48, 14),
    ],
  },
  {
    id: 'ord-029', orderNumber: 'ORD-2026-0322', accountId: 'acct-003', accountName: 'Fremont Flowers',
    status: 'delivered', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-02-11T10:00:00Z', confirmedAt: '2026-02-11T15:00:00Z', fulfilledAt: '2026-02-15T11:00:00Z', deliveredAt: '2026-02-17T14:00:00Z',
    subtotal: 2640, tax: 211.20, total: 2851.20,
    items: [
      item('li-029a', 'FROST-FL-BD-35', 'Blue Dream Flower', 'flower', 'Standard', '3.5g', 48, 24),
      item('li-029b', 'FROST-FL-GS-35', 'GSC Flower', 'flower', 'Standard', '3.5g', 36, 22),
      item('li-029c', 'FROST-PR-BD-1G', 'Blue Dream Infused Preroll', 'preroll', 'Infused', '1g', 36, 10),
    ],
  },
  {
    id: 'ord-030', orderNumber: 'ORD-2026-0323', accountId: 'acct-005', accountName: 'Kirkland Kush',
    status: 'delivered', assignedRep: 'Priya Patel', paymentMethod: 'ach', paymentStatus: 'pending',
    createdAt: '2026-02-10T08:00:00Z', confirmedAt: '2026-02-10T13:00:00Z', fulfilledAt: '2026-02-14T10:00:00Z', deliveredAt: '2026-02-16T12:00:00Z',
    subtotal: 2160, tax: 172.80, total: 2332.80,
    items: [
      item('li-030a', 'FROST-FL-GG-35', 'Gorilla Glue Flower', 'flower', 'Standard', '3.5g', 36, 22),
      item('li-030b', 'FROST-VZ-GG-1G', 'Gorilla Glue 510 Cart', 'vaporizer', 'Distillate Cart', '1g', 24, 26),
      item('li-030c', 'FROST-PR-GG-1G', 'Gorilla Glue Preroll', 'preroll', 'Standard', '1g', 36, 8),
    ],
  },
  {
    id: 'ord-031', orderNumber: 'ORD-2026-0324', accountId: 'acct-harbor', accountName: 'Harbor Cannabis',
    status: 'delivered', assignedRep: 'Carlos Ruiz', paymentMethod: 'cod', paymentStatus: 'overdue',
    createdAt: '2026-02-09T10:00:00Z', confirmedAt: '2026-02-09T15:00:00Z', fulfilledAt: '2026-02-13T11:00:00Z', deliveredAt: '2026-02-15T14:00:00Z',
    subtotal: 1560, tax: 124.80, total: 1684.80,
    notes: 'Chronic late payer. Consider switching to pre-pay.',
    items: [
      item('li-031a', 'FROST-FL-OK-35', 'OG Kush Flower', 'flower', 'Standard', '3.5g', 24, 22),
      item('li-031b', 'FROST-PR-OK-1G', 'OG Kush Preroll', 'preroll', 'Standard', '1g', 48, 8),
      item('li-031c', 'FROST-ED-ZK-10', 'Watermelon Zkittlez Gummies', 'edible', 'Gummies', '10pk (100mg)', 24, 14),
    ],
  },

  // === PAID (4) ===
  {
    id: 'ord-032', orderNumber: 'ORD-2026-0315', accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary',
    status: 'paid', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'received',
    createdAt: '2026-02-05T09:00:00Z', confirmedAt: '2026-02-05T14:00:00Z', fulfilledAt: '2026-02-09T10:00:00Z', deliveredAt: '2026-02-11T14:00:00Z', paidAt: '2026-02-13T09:00:00Z',
    subtotal: 5680, tax: 454.40, total: 6134.40,
    items: [
      item('li-032a', 'FROST-FL-WC-35', 'Wedding Cake Premium Flower', 'flower', 'Premium', '3.5g', 84, 28),
      item('li-032b', 'FROST-VZ-GL-1G', 'Gelato Live Resin 510 Cart', 'vaporizer', 'Live Resin Cart', '1g', 48, 32),
      item('li-032c', 'FROST-PR-WC-5PK', 'Wedding Cake Preroll 5-Pack', 'preroll', 'Standard', '5pk', 24, 32),
    ],
  },
  {
    id: 'ord-033', orderNumber: 'ORD-2026-0316', accountId: 'acct-pacific-leaf', accountName: 'Pacific Leaf',
    status: 'paid', assignedRep: 'Priya Patel', paymentMethod: 'cod', paymentStatus: 'received',
    createdAt: '2026-02-04T10:00:00Z', confirmedAt: '2026-02-04T15:00:00Z', fulfilledAt: '2026-02-08T11:00:00Z', deliveredAt: '2026-02-10T13:00:00Z', paidAt: '2026-02-10T13:00:00Z',
    subtotal: 2480, tax: 198.40, total: 2678.40,
    items: [
      item('li-033a', 'FROST-FL-BD-35', 'Blue Dream Flower', 'flower', 'Standard', '3.5g', 48, 24),
      item('li-033b', 'FROST-PR-BD-1G', 'Blue Dream Infused Preroll', 'preroll', 'Infused', '1g', 36, 10),
      item('li-033c', 'FROST-VZ-BD-1G', 'Blue Dream 510 Cart', 'vaporizer', 'Distillate Cart', '1g', 24, 26),
    ],
  },
  {
    id: 'ord-034', orderNumber: 'ORD-2026-0317', accountId: 'acct-capitol-hill', accountName: 'Capitol Hill Collective',
    status: 'paid', assignedRep: 'Jake Morrison', paymentMethod: 'ach', paymentStatus: 'received',
    createdAt: '2026-02-03T09:00:00Z', confirmedAt: '2026-02-03T14:00:00Z', fulfilledAt: '2026-02-07T10:00:00Z', deliveredAt: '2026-02-09T12:00:00Z', paidAt: '2026-02-11T10:00:00Z',
    subtotal: 4320, tax: 345.60, total: 4665.60,
    items: [
      item('li-034a', 'FROST-CN-GL-LR', 'Gelato Live Resin', 'concentrate', 'Live Resin', '1g', 48, 38),
      item('li-034b', 'FROST-VZ-GL-1G', 'Gelato Live Resin 510 Cart', 'vaporizer', 'Live Resin Cart', '1g', 36, 32),
      item('li-034c', 'FROST-CN-WC-LR', 'Wedding Cake Live Rosin', 'concentrate', 'Live Rosin', '1g', 12, 52),
    ],
  },
  {
    id: 'ord-035', orderNumber: 'ORD-2026-0318', accountId: 'acct-010', accountName: 'Walla Walla Weed Co',
    status: 'paid', assignedRep: 'Carlos Ruiz', paymentMethod: 'check', paymentStatus: 'received',
    createdAt: '2026-02-02T10:00:00Z', confirmedAt: '2026-02-02T15:00:00Z', fulfilledAt: '2026-02-06T11:00:00Z', deliveredAt: '2026-02-08T14:00:00Z', paidAt: '2026-02-14T09:00:00Z',
    subtotal: 1760, tax: 140.80, total: 1900.80,
    items: [
      item('li-035a', 'FROST-FL-OK-35', 'OG Kush Flower', 'flower', 'Standard', '3.5g', 36, 22),
      item('li-035b', 'FROST-FL-JH-35', 'Jack Herer Flower', 'flower', 'Standard', '3.5g', 24, 24),
      item('li-035c', 'FROST-PR-JH-5PK', 'Jack Herer Preroll 5-Pack', 'preroll', 'Standard', '5pk', 12, 32),
    ],
  },
];

// --- Metrics ---

const orderMetrics: OrderMetrics = {
  totalOrders: 35,
  pendingCount: 5,
  avgFulfillmentDays: 3.2,
  onTimeRate: 94,
  avgOrderValue: 3840,
  revenueThisMonth: 1240000,
};

// --- Pipeline ---

const ORDER_PIPELINE: OrderPipelineStage[] = [
  { status: 'pending', label: 'Pending', count: 5, color: '#94A3B8' },
  { status: 'confirmed', label: 'Confirmed', count: 6, color: '#3B82F6' },
  { status: 'in-production', label: 'In Production', count: 5, color: '#8B5CF6' },
  { status: 'packaged', label: 'Packaged', count: 4, color: '#06B6D4' },
  { status: 'fulfilled', label: 'Fulfilled', count: 3, color: '#F59E0B' },
  { status: 'shipped', label: 'Shipped', count: 2, color: '#F97316' },
  { status: 'delivered', label: 'Delivered', count: 6, color: '#22C55E' },
  { status: 'paid', label: 'Paid', count: 4, color: '#059669' },
];

// --- Exports ---

export function getOrders(filters?: OrderFilter): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...orders];

      if (filters?.status) {
        result = result.filter((o) => o.status === filters.status);
      }
      if (filters?.accountId) {
        result = result.filter((o) => o.accountId === filters.accountId);
      }
      if (filters?.paymentStatus) {
        result = result.filter((o) => o.paymentStatus === filters.paymentStatus);
      }
      if (filters?.category) {
        result = result.filter((o) =>
          o.items.some((i) => i.category === filters.category)
        );
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.accountName.toLowerCase().includes(q)
        );
      }

      resolve(result);
    }, 300);
  });
}

export function getOrder(id: string): Promise<Order | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(orders.find((o) => o.id === id));
    }, 200);
  });
}

export function getOrderMetrics(): Promise<OrderMetrics> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ ...orderMetrics }), 300);
  });
}

export function getOrderPipeline(): Promise<OrderPipelineStage[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...ORDER_PIPELINE]), 200);
  });
}

// --- Order Volume Chart (12 weeks) ---

const ORDER_VOLUME: OrderVolumeWeek[] = [
  { week: 'Dec 15', pending: 4, confirmed: 5, inProduction: 6, fulfilled: 5, delivered: 7, paid: 5 },
  { week: 'Dec 22', pending: 3, confirmed: 6, inProduction: 5, fulfilled: 6, delivered: 6, paid: 6 },
  { week: 'Dec 29', pending: 5, confirmed: 4, inProduction: 7, fulfilled: 4, delivered: 5, paid: 4 },
  { week: 'Jan 5', pending: 6, confirmed: 5, inProduction: 4, fulfilled: 5, delivered: 6, paid: 5 },
  { week: 'Jan 12', pending: 4, confirmed: 7, inProduction: 5, fulfilled: 6, delivered: 5, paid: 6 },
  { week: 'Jan 19', pending: 5, confirmed: 6, inProduction: 6, fulfilled: 4, delivered: 7, paid: 4 },
  { week: 'Jan 26', pending: 3, confirmed: 5, inProduction: 7, fulfilled: 5, delivered: 6, paid: 5 },
  { week: 'Feb 2', pending: 6, confirmed: 4, inProduction: 5, fulfilled: 7, delivered: 5, paid: 6 },
  { week: 'Feb 9', pending: 4, confirmed: 6, inProduction: 6, fulfilled: 5, delivered: 7, paid: 4 },
  { week: 'Feb 16', pending: 5, confirmed: 5, inProduction: 5, fulfilled: 6, delivered: 6, paid: 5 },
  { week: 'Feb 23', pending: 4, confirmed: 7, inProduction: 4, fulfilled: 5, delivered: 7, paid: 6 },
  { week: 'Mar 3', pending: 5, confirmed: 6, inProduction: 5, fulfilled: 3, delivered: 6, paid: 4 },
];

const CATEGORY_REVENUE: CategoryRevenue[] = [
  { category: 'Flower', revenue: 433800, percentage: 35, color: '#22C55E' },
  { category: 'Preroll', revenue: 223020, percentage: 18, color: '#84CC16' },
  { category: 'Vaporizer', revenue: 272580, percentage: 22, color: '#06B6D4' },
  { category: 'Concentrate', revenue: 148680, percentage: 12, color: '#F59E0B' },
  { category: 'Edible', revenue: 99120, percentage: 8, color: '#EC4899' },
  { category: 'Beverage', revenue: 62400, percentage: 5, color: '#8B5CF6' },
];

const TOP_ACCOUNTS: TopAccount[] = [
  { accountId: 'acct-greenfield', accountName: 'Greenfield Dispensary', orderCount: 6, totalRevenue: 34951.20, avgOrderValue: 5825.20 },
  { accountId: 'acct-pacific-leaf', accountName: 'Pacific Leaf', orderCount: 4, totalRevenue: 12787.20, avgOrderValue: 3196.80 },
  { accountId: 'acct-capitol-hill', accountName: 'Capitol Hill Collective', orderCount: 3, totalRevenue: 14169.60, avgOrderValue: 4723.20 },
  { accountId: 'acct-olympic', accountName: 'Olympic Greens', orderCount: 3, totalRevenue: 9547.20, avgOrderValue: 3182.40 },
  { accountId: 'acct-summit', accountName: 'Summit Cannabis Co.', orderCount: 2, totalRevenue: 8164.80, avgOrderValue: 4082.40 },
];

export function getOrderVolumeChart(): Promise<OrderVolumeWeek[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...ORDER_VOLUME]), 300);
  });
}

export function getRevenueByCategory(): Promise<CategoryRevenue[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...CATEGORY_REVENUE]), 250);
  });
}

export function getTopAccounts(): Promise<TopAccount[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...TOP_ACCOUNTS]), 200);
  });
}
