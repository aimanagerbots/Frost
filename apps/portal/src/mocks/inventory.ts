import type {
  CannabisInventoryItem,
  NonCannabisItem,
  COASubmission,
  LabPartner,
  InventoryAlert,
  ActivityFeedEvent,
  PipelineStateNode,
  InventoryOverviewMetrics,
  CategoryDistribution,
  InventoryFilter,
  ProductCategory,
  ReadinessState,
  Brand,
  StrainType,
  COAStatus,
} from '@/modules/inventory/types';

// ═══════════════════════════════════════════════════════════════
// CANNABIS INVENTORY — 75 items
// ═══════════════════════════════════════════════════════════════

let _id = 0;
function ci(
  productName: string, category: ProductCategory, strain: string, strainType: StrainType,
  readinessState: ReadinessState, quantity: number, unit: CannabisInventoryItem['unit'],
  batchNumber: string, thc: number, cbd: number, coaStatus: COAStatus,
  location: string, brand: Brand, value: number,
  extra?: Partial<CannabisInventoryItem>,
): CannabisInventoryItem {
  _id++;
  const catPrefix = { flower: 'FL', preroll: 'PR', vaporizer: 'VP', concentrate: 'CN', edible: 'ED', beverage: 'BV' }[category];
  const strainCode = strain.replace(/[^A-Z]/gi, '').substring(0, 2).toUpperCase();
  return {
    id: `inv-${String(_id).padStart(3, '0')}`,
    sku: `${catPrefix}-${strainCode}-${extra?.packageSize?.replace(/[^0-9g]/g, '') || String(_id).padStart(2, '0')}`,
    productName, category, strain, strainType, readinessState, quantity, unit,
    batchNumber, thc, cbd, coaStatus, location, brand, value,
    lastUpdated: extra?.lastUpdated ?? '2026-03-07',
    ...extra,
  };
}

// --- FLOWER (30 items) ---
const flower: CannabisInventoryItem[] = [
  // Growing (5)
  ci('Wedding Cake Clone', 'flower', 'Wedding Cake', 'hybrid', 'growing', 48, 'plants', 'B2026-0301', 0, 0, 'not-tested', 'Greenhouse A', 'Frost Farms', 96, { lastUpdated: '2026-03-05' }),
  ci('Blue Dream Seedling', 'flower', 'Blue Dream', 'sativa', 'growing', 36, 'plants', 'B2026-0302', 0, 0, 'not-tested', 'Greenhouse B', 'Frost Farms', 72, { lastUpdated: '2026-03-04' }),
  ci('Gelato Clone', 'flower', 'Gelato', 'hybrid', 'growing', 42, 'plants', 'B2026-0303', 0, 0, 'not-tested', 'Greenhouse A', 'Northern Lights Co.', 84, { lastUpdated: '2026-03-06' }),
  ci('OG Kush Seedling', 'flower', 'OG Kush', 'indica', 'growing', 30, 'plants', 'B2026-0304', 0, 0, 'not-tested', 'Greenhouse C', 'Frost Farms', 60, { lastUpdated: '2026-03-03' }),
  ci('Jack Herer Clone', 'flower', 'Jack Herer', 'sativa', 'growing', 24, 'plants', 'B2026-0305', 0, 0, 'not-tested', 'Greenhouse B', 'Northern Lights Co.', 48, { lastUpdated: '2026-03-02' }),

  // Harvested (3)
  ci('Gorilla Glue Harvest', 'flower', 'Gorilla Glue', 'hybrid', 'harvested', 24, 'lbs', 'B2026-0280', 26.5, 0.8, 'not-tested', 'Dry Room 1', 'Frost Farms', 2880, { lastUpdated: '2026-03-06' }),
  ci('Zkittlez Harvest', 'flower', 'Zkittlez', 'indica', 'harvested', 18, 'lbs', 'B2026-0281', 23.4, 0.5, 'not-tested', 'Dry Room 2', 'Glacier Extracts', 2160, { lastUpdated: '2026-03-05' }),
  ci('GSC Harvest', 'flower', 'GSC', 'hybrid', 'harvested', 15, 'lbs', 'B2026-0282', 25.1, 0.7, 'not-tested', 'Dry Room 1', 'Frost Farms', 1800, { lastUpdated: '2026-03-04' }),

  // Dried (3)
  ci('Wedding Cake Dried', 'flower', 'Wedding Cake', 'hybrid', 'dried', 18, 'lbs', 'B2026-0270', 27.3, 0.6, 'not-tested', 'Cure Room A', 'Frost Farms', 3600, { lastUpdated: '2026-03-03' }),
  ci('Blue Dream Dried', 'flower', 'Blue Dream', 'sativa', 'dried', 14, 'lbs', 'B2026-0271', 22.8, 0.4, 'not-tested', 'Cure Room B', 'Frost Farms', 2520, { lastUpdated: '2026-03-02' }),
  ci('OG Kush Dried', 'flower', 'OG Kush', 'indica', 'dried', 12, 'lbs', 'B2026-0272', 24.2, 1.1, 'not-tested', 'Cure Room A', 'Northern Lights Co.', 2400, { lastUpdated: '2026-03-01' }),

  // Bucked (2)
  ci('Gelato Bucked', 'flower', 'Gelato', 'hybrid', 'bucked', 10, 'lbs', 'B2026-0260', 26.7, 0.6, 'not-tested', 'Processing Room A', 'Frost Farms', 2200, { lastUpdated: '2026-02-28' }),
  ci('Jack Herer Bucked', 'flower', 'Jack Herer', 'sativa', 'bucked', 8, 'lbs', 'B2026-0261', 21.9, 0.8, 'not-tested', 'Processing Room B', 'Northern Lights Co.', 1600, { lastUpdated: '2026-02-27' }),

  // Bulk Ready (3)
  ci('Blue Dream Bulk', 'flower', 'Blue Dream', 'sativa', 'bulk-ready', 8, 'lbs', 'B2026-0250', 22.5, 0.4, 'not-tested', 'Vault A', 'Frost Farms', 2400, { lastUpdated: '2026-02-25' }),
  ci('Wedding Cake Bulk', 'flower', 'Wedding Cake', 'hybrid', 'bulk-ready', 6, 'lbs', 'B2026-0251', 27.8, 0.5, 'not-tested', 'Vault A', 'Frost Farms', 2100, { lastUpdated: '2026-02-24' }),
  ci('Gelato Bulk', 'flower', 'Gelato', 'hybrid', 'bulk-ready', 5, 'lbs', 'B2026-0252', 26.4, 0.6, 'not-tested', 'Vault B', 'Northern Lights Co.', 1750, { lastUpdated: '2026-02-23' }),

  // COA Pending (2)
  ci('Gorilla Glue Bulk (Testing)', 'flower', 'Gorilla Glue', 'hybrid', 'coa-pending', 3, 'batches', 'B2026-0240', 26.2, 0.8, 'pending', 'Lab Queue', 'Frost Farms', 3600, { lastUpdated: '2026-03-05' }),
  ci('OG Kush Bulk (Testing)', 'flower', 'OG Kush', 'indica', 'coa-pending', 2, 'batches', 'B2026-0241', 24.6, 1.0, 'pending', 'Lab Queue', 'Northern Lights Co.', 2400, { lastUpdated: '2026-03-04' }),

  // COA Passed (3)
  ci('Blue Dream (COA Passed)', 'flower', 'Blue Dream', 'sativa', 'coa-passed', 4, 'batches', 'B2026-0230', 22.3, 0.4, 'passed', 'Pack Staging', 'Frost Farms', 4800, { lastUpdated: '2026-03-03' }),
  ci('Wedding Cake (COA Passed)', 'flower', 'Wedding Cake', 'hybrid', 'coa-passed', 3, 'batches', 'B2026-0231', 27.5, 0.5, 'passed', 'Pack Staging', 'Frost Farms', 4200, { lastUpdated: '2026-03-02' }),
  ci('GSC (COA Passed)', 'flower', 'GSC', 'hybrid', 'coa-passed', 2, 'batches', 'B2026-0232', 24.5, 0.7, 'passed', 'Pack Staging', 'Glacier Extracts', 2800, { lastUpdated: '2026-03-01' }),

  // Packaged (4)
  ci('Wedding Cake 3.5g', 'flower', 'Wedding Cake', 'hybrid', 'packaged', 340, 'units', 'B2026-0220', 27.5, 0.5, 'passed', 'Finished Goods', 'Frost Farms', 9520, { packageSize: '3.5g', lastUpdated: '2026-03-06' }),
  ci('Blue Dream 7g', 'flower', 'Blue Dream', 'sativa', 'packaged', 120, 'units', 'B2026-0221', 22.3, 0.4, 'passed', 'Finished Goods', 'Frost Farms', 4800, { packageSize: '7g', lastUpdated: '2026-03-05' }),
  ci('Gelato 3.5g', 'flower', 'Gelato', 'hybrid', 'packaged', 280, 'units', 'B2026-0222', 26.8, 0.6, 'passed', 'Finished Goods', 'Northern Lights Co.', 7840, { packageSize: '3.5g', lastUpdated: '2026-03-04' }),
  ci('OG Kush 14g', 'flower', 'OG Kush', 'indica', 'packaged', 60, 'units', 'B2026-0223', 24.0, 1.1, 'passed', 'Finished Goods', 'Northern Lights Co.', 3600, { packageSize: '14g', lastUpdated: '2026-03-03' }),

  // Fulfilled (2)
  ci('Wedding Cake 3.5g', 'flower', 'Wedding Cake', 'hybrid', 'fulfilled', 120, 'units', 'B2026-0210', 27.5, 0.5, 'passed', 'Fulfillment Room', 'Frost Farms', 3360, { packageSize: '3.5g', lastUpdated: '2026-03-07' }),
  ci('Blue Dream 3.5g', 'flower', 'Blue Dream', 'sativa', 'fulfilled', 85, 'units', 'B2026-0211', 22.3, 0.4, 'passed', 'Fulfillment Room', 'Frost Farms', 2380, { packageSize: '3.5g', lastUpdated: '2026-03-06' }),

  // Delivered (1)
  ci('GSC 3.5g', 'flower', 'GSC', 'hybrid', 'delivered', 200, 'units', 'B2026-0200', 24.5, 0.7, 'passed', 'Route A', 'Glacier Extracts', 5600, { packageSize: '3.5g', lastUpdated: '2026-03-07' }),
];

// --- PREROLL (12 items) ---
const preroll: CannabisInventoryItem[] = [
  ci('Wedding Cake Preroll 1g', 'preroll', 'Wedding Cake', 'hybrid', 'packaged', 200, 'units', 'B2026-0310', 27.0, 0.5, 'passed', 'Finished Goods', 'Frost Farms', 2000, { packageSize: '1g', lastUpdated: '2026-03-06' }),
  ci('Blue Dream Infused Preroll 1g', 'preroll', 'Blue Dream', 'sativa', 'packaged', 150, 'units', 'B2026-0311', 32.0, 0.4, 'passed', 'Finished Goods', 'Frost Farms', 1950, { packageSize: '1g infused', lastUpdated: '2026-03-05' }),
  ci('OG Kush Preroll 5-Pack', 'preroll', 'OG Kush', 'indica', 'packaged', 80, 'units', 'B2026-0312', 24.0, 1.1, 'passed', 'Finished Goods', 'Northern Lights Co.', 2400, { packageSize: '5x0.5g', lastUpdated: '2026-03-04' }),
  ci('GSC Infused Preroll 1g', 'preroll', 'GSC', 'hybrid', 'packaged', 120, 'units', 'B2026-0313', 30.5, 0.7, 'passed', 'Finished Goods', 'Glacier Extracts', 1560, { packageSize: '1g infused', lastUpdated: '2026-03-03' }),
  ci('Jack Herer Preroll 1g', 'preroll', 'Jack Herer', 'sativa', 'fulfilled', 60, 'units', 'B2026-0314', 21.9, 0.8, 'passed', 'Fulfillment Room', 'Northern Lights Co.', 600, { packageSize: '1g', lastUpdated: '2026-03-07' }),
  ci('Gorilla Glue 5-Pack', 'preroll', 'Gorilla Glue', 'hybrid', 'fulfilled', 40, 'units', 'B2026-0315', 26.0, 0.7, 'passed', 'Fulfillment Room', 'Frost Farms', 1200, { packageSize: '5x0.5g', lastUpdated: '2026-03-06' }),
  ci('Wedding Cake Preroll (Rolling)', 'preroll', 'Wedding Cake', 'hybrid', 'bulk-ready', 15, 'lbs', 'B2026-0316', 27.0, 0.5, 'passed', 'Roll Room', 'Frost Farms', 3000, { lastUpdated: '2026-03-05' }),
  ci('Blue Dream Preroll (Rolling)', 'preroll', 'Blue Dream', 'sativa', 'bulk-ready', 10, 'lbs', 'B2026-0317', 22.0, 0.4, 'passed', 'Roll Room', 'Frost Farms', 2000, { lastUpdated: '2026-03-04' }),
  ci('Gelato Preroll 1g', 'preroll', 'Gelato', 'hybrid', 'coa-passed', 2, 'batches', 'B2026-0318', 26.8, 0.6, 'passed', 'Pack Staging', 'Northern Lights Co.', 2400, { packageSize: '1g', lastUpdated: '2026-03-03' }),
  ci('Zkittlez Preroll 1g', 'preroll', 'Zkittlez', 'indica', 'coa-pending', 1, 'batches', 'B2026-0319', 23.0, 0.5, 'pending', 'Lab Queue', 'Glacier Extracts', 1200, { packageSize: '1g', lastUpdated: '2026-03-02' }),
  ci('OG Kush Infused 1g', 'preroll', 'OG Kush', 'indica', 'delivered', 100, 'units', 'B2026-0320', 28.0, 1.0, 'passed', 'Route B', 'Northern Lights Co.', 1300, { packageSize: '1g infused', lastUpdated: '2026-03-07' }),
  ci('Sour Diesel Preroll 1g', 'preroll', 'Sour Diesel', 'sativa', 'packaged', 90, 'units', 'B2026-0321', 25.5, 0.3, 'passed', 'Finished Goods', 'Frost Farms', 900, { packageSize: '1g', lastUpdated: '2026-03-06' }),
];

// --- VAPORIZER (12 items) ---
const vaporizer: CannabisInventoryItem[] = [
  ci('Gelato Live Resin Cart 1g', 'vaporizer', 'Gelato', 'hybrid', 'packaged', 240, 'units', 'B2026-0410', 85.6, 0.5, 'passed', 'Finished Goods', 'Glacier Extracts', 7680, { packageSize: '1g cart', lastUpdated: '2026-03-06' }),
  ci('Blue Dream 510 Cart 1g', 'vaporizer', 'Blue Dream', 'sativa', 'packaged', 180, 'units', 'B2026-0411', 90.0, 0.2, 'passed', 'Finished Goods', 'Frost Farms', 4680, { packageSize: '1g cart', lastUpdated: '2026-03-05' }),
  ci('Sour Diesel Disposable 0.5g', 'vaporizer', 'Sour Diesel', 'sativa', 'packaged', 160, 'units', 'B2026-0412', 88.1, 0.3, 'passed', 'Finished Goods', 'Frost Farms', 4480, { packageSize: '0.5g disposable', lastUpdated: '2026-03-04' }),
  ci('OG Kush Cart 0.5g', 'vaporizer', 'OG Kush', 'indica', 'packaged', 100, 'units', 'B2026-0413', 89.5, 1.0, 'passed', 'Finished Goods', 'Northern Lights Co.', 2200, { packageSize: '0.5g cart', lastUpdated: '2026-03-03' }),
  ci('Wedding Cake Live Resin Cart', 'vaporizer', 'Wedding Cake', 'hybrid', 'fulfilled', 50, 'units', 'B2026-0414', 86.8, 0.4, 'passed', 'Fulfillment Room', 'Glacier Extracts', 1600, { packageSize: '1g cart', lastUpdated: '2026-03-07' }),
  ci('GSC Disposable 0.5g', 'vaporizer', 'GSC', 'hybrid', 'fulfilled', 30, 'units', 'B2026-0415', 85.5, 0.6, 'passed', 'Fulfillment Room', 'Glacier Extracts', 840, { packageSize: '0.5g disposable', lastUpdated: '2026-03-06' }),
  ci('Blue Dream Distillate', 'vaporizer', 'Blue Dream', 'sativa', 'bulk-ready', 3, 'lbs', 'B2026-0416', 91.2, 0.2, 'not-tested', 'Distillate Vault', 'Frost Farms', 6300, { lastUpdated: '2026-03-03' }),
  ci('OG Kush Distillate', 'vaporizer', 'OG Kush', 'indica', 'bulk-ready', 2, 'lbs', 'B2026-0417', 90.5, 1.0, 'not-tested', 'Distillate Vault', 'Northern Lights Co.', 4200, { lastUpdated: '2026-03-02' }),
  ci('Gorilla Glue Cart 1g', 'vaporizer', 'Gorilla Glue', 'hybrid', 'coa-passed', 3, 'batches', 'B2026-0418', 88.0, 0.8, 'passed', 'Pack Staging', 'Frost Farms', 3600, { packageSize: '1g cart', lastUpdated: '2026-03-04' }),
  ci('Zkittlez Cart 0.5g', 'vaporizer', 'Zkittlez', 'indica', 'coa-pending', 1, 'batches', 'B2026-0419', 87.2, 0.5, 'pending', 'Lab Queue', 'Glacier Extracts', 1200, { packageSize: '0.5g cart', lastUpdated: '2026-03-05' }),
  ci('Sour Diesel Cart 1g', 'vaporizer', 'Sour Diesel', 'sativa', 'delivered', 80, 'units', 'B2026-0420', 88.1, 0.3, 'passed', 'Route A', 'Frost Farms', 2240, { packageSize: '1g cart', lastUpdated: '2026-03-07' }),
  ci('Gelato Disposable 0.5g', 'vaporizer', 'Gelato', 'hybrid', 'packaged', 90, 'units', 'B2026-0421', 84.0, 0.5, 'passed', 'Finished Goods', 'Glacier Extracts', 2520, { packageSize: '0.5g disposable', lastUpdated: '2026-03-05' }),
];

// --- CONCENTRATE (10 items) ---
const concentrate: CannabisInventoryItem[] = [
  ci('Gelato Live Resin 1g', 'concentrate', 'Gelato', 'hybrid', 'packaged', 120, 'units', 'B2026-0510', 83.0, 0.5, 'passed', 'Finished Goods', 'Glacier Extracts', 4560, { packageSize: '1g', lastUpdated: '2026-03-06' }),
  ci('OG Kush Shatter 1g', 'concentrate', 'OG Kush', 'indica', 'packaged', 100, 'units', 'B2026-0511', 85.2, 1.1, 'passed', 'Finished Goods', 'Northern Lights Co.', 2800, { packageSize: '1g', lastUpdated: '2026-03-05' }),
  ci('Wedding Cake Live Rosin 1g', 'concentrate', 'Wedding Cake', 'hybrid', 'packaged', 60, 'units', 'B2026-0512', 81.5, 0.4, 'passed', 'Finished Goods', 'Frost Farms', 3120, { packageSize: '1g', lastUpdated: '2026-03-04' }),
  ci('Gelato Diamonds 1g', 'concentrate', 'Gelato', 'hybrid', 'packaged', 48, 'units', 'B2026-0513', 91.5, 0.3, 'passed', 'Finished Goods', 'Glacier Extracts', 2304, { packageSize: '1g', lastUpdated: '2026-03-03' }),
  ci('Blue Dream Wax 1g', 'concentrate', 'Blue Dream', 'sativa', 'coa-pending', 2, 'batches', 'B2026-0514', 80.8, 0.3, 'pending', 'Lab Queue', 'Frost Farms', 2400, { packageSize: '1g', lastUpdated: '2026-03-05' }),
  ci('Gorilla Glue Shatter Bulk', 'concentrate', 'Gorilla Glue', 'hybrid', 'bulk-ready', 3, 'lbs', 'B2026-0515', 84.6, 0.7, 'not-tested', 'Clean Room', 'Frost Farms', 4800, { lastUpdated: '2026-03-02' }),
  ci('OG Kush Wax Processing', 'concentrate', 'OG Kush', 'indica', 'dried', 5, 'lbs', 'B2026-0516', 78.5, 1.0, 'not-tested', 'Extraction Lab', 'Northern Lights Co.', 3000, { lastUpdated: '2026-03-01' }),
  ci('Wedding Cake Rosin Bulk', 'concentrate', 'Wedding Cake', 'hybrid', 'coa-passed', 2, 'batches', 'B2026-0517', 81.5, 0.4, 'passed', 'Pack Staging', 'Frost Farms', 3200, { lastUpdated: '2026-03-04' }),
  ci('Sour Diesel Shatter 1g', 'concentrate', 'Sour Diesel', 'sativa', 'fulfilled', 40, 'units', 'B2026-0518', 82.0, 0.3, 'passed', 'Fulfillment Room', 'Frost Farms', 1120, { packageSize: '1g', lastUpdated: '2026-03-07' }),
  ci('Zkittlez Live Resin 1g', 'concentrate', 'Zkittlez', 'indica', 'coa-pending', 1, 'batches', 'B2026-0519', 79.0, 0.5, 'pending', 'Lab Queue', 'Glacier Extracts', 1600, { packageSize: '1g', lastUpdated: '2026-03-06' }),
];

// --- EDIBLE (7 items) ---
const edible: CannabisInventoryItem[] = [
  ci('Watermelon Gummies 10pk', 'edible', 'Zkittlez', 'indica', 'packaged', 400, 'units', 'B2026-0610', 10.0, 0.5, 'passed', 'Finished Goods', 'Frost Farms', 5600, { packageSize: '10pk 100mg', lastUpdated: '2026-03-06' }),
  ci('Mango Gummies 10pk', 'edible', 'Gelato', 'hybrid', 'packaged', 300, 'units', 'B2026-0611', 10.0, 0.5, 'passed', 'Finished Goods', 'Frost Farms', 4200, { packageSize: '10pk 100mg', lastUpdated: '2026-03-05' }),
  ci('Dark Chocolate Bites 4pk', 'edible', 'GSC', 'hybrid', 'packaged', 200, 'units', 'B2026-0612', 25.0, 1.0, 'passed', 'Finished Goods', 'Glacier Extracts', 3600, { packageSize: '4pk 100mg', lastUpdated: '2026-03-04' }),
  ci('Sour Apple Gummies 10pk', 'edible', 'Sour Diesel', 'sativa', 'fulfilled', 150, 'units', 'B2026-0613', 10.0, 0.5, 'passed', 'Fulfillment Room', 'Frost Farms', 2100, { packageSize: '10pk 100mg', lastUpdated: '2026-03-07' }),
  ci('Blueberry Gummies 10pk', 'edible', 'Blue Dream', 'sativa', 'fulfilled', 80, 'units', 'B2026-0614', 10.0, 0.5, 'passed', 'Fulfillment Room', 'Frost Farms', 1120, { packageSize: '10pk 100mg', lastUpdated: '2026-03-06' }),
  ci('Caramel Chews 5pk', 'edible', 'OG Kush', 'indica', 'delivered', 60, 'units', 'B2026-0615', 20.0, 1.0, 'passed', 'Route A', 'Northern Lights Co.', 1080, { packageSize: '5pk 100mg', lastUpdated: '2026-03-07' }),
  ci('Mint Chocolate Bar', 'edible', 'Jack Herer', 'sativa', 'coa-passed', 1, 'batches', 'B2026-0616', 10.0, 0.5, 'passed', 'Pack Staging', 'Frost Farms', 1400, { packageSize: '100mg bar', lastUpdated: '2026-03-03' }),
];

// --- BEVERAGE (4 items) ---
const beverage: CannabisInventoryItem[] = [
  ci('Lemon Fizz CBD Seltzer', 'beverage', 'CBD Lemon', 'hybrid', 'packaged', 480, 'units', 'B2026-0710', 2.0, 10.0, 'passed', 'Cold Storage', 'Frost Farms', 3840, { packageSize: '12oz can', lastUpdated: '2026-03-06' }),
  ci('Blueberry Lemonade Seltzer', 'beverage', 'Blueberry', 'hybrid', 'packaged', 360, 'units', 'B2026-0711', 5.0, 5.0, 'passed', 'Cold Storage', 'Frost Farms', 2880, { packageSize: '12oz can', lastUpdated: '2026-03-05' }),
  ci('Mango THC Seltzer', 'beverage', 'Mango Haze', 'sativa', 'fulfilled', 200, 'units', 'B2026-0712', 5.0, 2.0, 'passed', 'Fulfillment Room', 'Frost Farms', 1600, { packageSize: '12oz can', lastUpdated: '2026-03-07' }),
  ci('Berry Blast Powder Mix 5pk', 'beverage', 'Mixed Berry', 'hybrid', 'delivered', 120, 'units', 'B2026-0713', 5.0, 5.0, 'passed', 'Route B', 'Northern Lights Co.', 1440, { packageSize: '5pk sachets', lastUpdated: '2026-03-07' }),
];

const allCannabis: CannabisInventoryItem[] = [
  ...flower, ...preroll, ...vaporizer, ...concentrate, ...edible, ...beverage,
];

// ═══════════════════════════════════════════════════════════════
// NON-CANNABIS MATERIALS — 35 items
// ═══════════════════════════════════════════════════════════════

const nonCannabis: NonCannabisItem[] = [
  // Containers (10)
  { id: 'nc-001', name: 'Glass Jar 1g', category: 'containers', sku: 'NC-GJ-01', currentStock: 2400, unit: 'each', reorderPoint: 1000, reorderQuantity: 5000, supplier: 'Pacific Glass Co', lastOrdered: '2026-02-15', status: 'in-stock', unitCost: 0.45 },
  { id: 'nc-002', name: 'Glass Jar 3.5g', category: 'containers', sku: 'NC-GJ-35', currentStock: 800, unit: 'each', reorderPoint: 1500, reorderQuantity: 5000, supplier: 'Pacific Glass Co', lastOrdered: '2026-02-15', status: 'critical', unitCost: 0.55 },
  { id: 'nc-003', name: 'Glass Jar 7g', category: 'containers', sku: 'NC-GJ-07', currentStock: 1800, unit: 'each', reorderPoint: 800, reorderQuantity: 3000, supplier: 'Pacific Glass Co', lastOrdered: '2026-02-15', status: 'in-stock', unitCost: 0.65 },
  { id: 'nc-004', name: 'Glass Jar 14g', category: 'containers', sku: 'NC-GJ-14', currentStock: 600, unit: 'each', reorderPoint: 400, reorderQuantity: 2000, supplier: 'Pacific Glass Co', lastOrdered: '2026-02-15', status: 'in-stock', unitCost: 0.85 },
  { id: 'nc-005', name: 'Glass Jar 28g', category: 'containers', sku: 'NC-GJ-28', currentStock: 300, unit: 'each', reorderPoint: 200, reorderQuantity: 1000, supplier: 'Pacific Glass Co', lastOrdered: '2026-01-28', status: 'in-stock', unitCost: 1.10 },
  { id: 'nc-006', name: 'Mylar Bags 3.5g', category: 'containers', sku: 'NC-MB-35', currentStock: 4200, unit: 'each', reorderPoint: 2000, reorderQuantity: 10000, supplier: 'Pacific Packaging', lastOrdered: '2026-02-20', status: 'in-stock', unitCost: 0.12 },
  { id: 'nc-007', name: 'Mylar Bags 7g', category: 'containers', sku: 'NC-MB-07', currentStock: 1500, unit: 'each', reorderPoint: 1000, reorderQuantity: 5000, supplier: 'Pacific Packaging', lastOrdered: '2026-02-20', status: 'in-stock', unitCost: 0.15 },
  { id: 'nc-008', name: 'Preroll Tubes (CR)', category: 'containers', sku: 'NC-PT-01', currentStock: 450, unit: 'each', reorderPoint: 1000, reorderQuantity: 5000, supplier: 'Pacific Packaging', lastOrdered: '2026-02-10', status: 'critical', unitCost: 0.18 },
  { id: 'nc-009', name: 'Vape Cart Shell 1g (CCELL)', category: 'containers', sku: 'NC-VC-10', currentStock: 3600, unit: 'each', reorderPoint: 2000, reorderQuantity: 5000, supplier: 'CCELL Direct', lastOrdered: '2026-02-10', status: 'in-stock', unitCost: 1.85 },
  { id: 'nc-010', name: 'Vape Cart Shell 0.5g (CCELL)', category: 'containers', sku: 'NC-VC-05', currentStock: 200, unit: 'each', reorderPoint: 1000, reorderQuantity: 3000, supplier: 'CCELL Direct', lastOrdered: '2026-01-28', status: 'critical', unitCost: 1.65 },

  // Labels (8)
  { id: 'nc-011', name: 'Product Labels — Flower SKUs', category: 'labels', sku: 'NC-LB-FL', currentStock: 8500, unit: 'each', reorderPoint: 3000, reorderQuantity: 15000, supplier: 'NW Label Co', lastOrdered: '2026-02-18', status: 'in-stock', unitCost: 0.04 },
  { id: 'nc-012', name: 'Product Labels — Preroll SKUs', category: 'labels', sku: 'NC-LB-PR', currentStock: 5200, unit: 'each', reorderPoint: 2000, reorderQuantity: 10000, supplier: 'NW Label Co', lastOrdered: '2026-02-18', status: 'in-stock', unitCost: 0.04 },
  { id: 'nc-013', name: 'Product Labels — Cartridge SKUs', category: 'labels', sku: 'NC-LB-VP', currentStock: 4100, unit: 'each', reorderPoint: 2000, reorderQuantity: 10000, supplier: 'NW Label Co', lastOrdered: '2026-02-18', status: 'in-stock', unitCost: 0.04 },
  { id: 'nc-014', name: 'Product Labels — Concentrate SKUs', category: 'labels', sku: 'NC-LB-CN', currentStock: 3200, unit: 'each', reorderPoint: 1500, reorderQuantity: 8000, supplier: 'NW Label Co', lastOrdered: '2026-02-18', status: 'in-stock', unitCost: 0.04 },
  { id: 'nc-015', name: 'Product Labels — Edible SKUs', category: 'labels', sku: 'NC-LB-ED', currentStock: 2800, unit: 'each', reorderPoint: 1500, reorderQuantity: 8000, supplier: 'NW Label Co', lastOrdered: '2026-02-18', status: 'in-stock', unitCost: 0.05 },
  { id: 'nc-016', name: 'Compliance Labels (WA)', category: 'labels', sku: 'NC-LB-WA', currentStock: 12000, unit: 'each', reorderPoint: 5000, reorderQuantity: 25000, supplier: 'NW Label Co', lastOrdered: '2026-02-25', status: 'in-stock', unitCost: 0.03 },
  { id: 'nc-017', name: 'Batch/Lot Stickers', category: 'labels', sku: 'NC-LB-BT', currentStock: 9000, unit: 'each', reorderPoint: 4000, reorderQuantity: 20000, supplier: 'NW Label Co', lastOrdered: '2026-02-25', status: 'in-stock', unitCost: 0.02 },
  { id: 'nc-018', name: 'COA Insert Cards', category: 'labels', sku: 'NC-LB-COA', currentStock: 7000, unit: 'each', reorderPoint: 3000, reorderQuantity: 15000, supplier: 'NW Label Co', lastOrdered: '2026-02-12', status: 'in-stock', unitCost: 0.06 },

  // Packaging (12)
  { id: 'nc-019', name: 'Display Boxes (6-unit)', category: 'packaging', sku: 'NC-BX-06', currentStock: 1200, unit: 'each', reorderPoint: 500, reorderQuantity: 2000, supplier: 'Pacific Packaging', lastOrdered: '2026-02-15', status: 'in-stock', unitCost: 0.35 },
  { id: 'nc-020', name: 'Display Boxes (12-unit)', category: 'packaging', sku: 'NC-BX-12', currentStock: 800, unit: 'each', reorderPoint: 300, reorderQuantity: 1000, supplier: 'Pacific Packaging', lastOrdered: '2026-02-15', status: 'in-stock', unitCost: 0.50 },
  { id: 'nc-021', name: 'Boveda 62% Humidity Packs', category: 'packaging', sku: 'NC-HM-62', currentStock: 6400, unit: 'each', reorderPoint: 3000, reorderQuantity: 10000, supplier: 'Boveda Inc', lastOrdered: '2026-02-20', status: 'in-stock', unitCost: 0.28 },
  { id: 'nc-022', name: 'Shrink Wrap Bands', category: 'packaging', sku: 'NC-SW-01', currentStock: 12000, unit: 'each', reorderPoint: 5000, reorderQuantity: 25000, supplier: 'Pacific Packaging', lastOrdered: '2026-01-30', status: 'in-stock', unitCost: 0.01 },
  { id: 'nc-023', name: 'Tamper-Evident Seals', category: 'packaging', sku: 'NC-TE-01', currentStock: 8000, unit: 'each', reorderPoint: 4000, reorderQuantity: 20000, supplier: 'Pacific Packaging', lastOrdered: '2026-02-05', status: 'in-stock', unitCost: 0.02 },
  { id: 'nc-024', name: 'Child-Resistant Caps (jar)', category: 'packaging', sku: 'NC-CR-JR', currentStock: 3500, unit: 'each', reorderPoint: 2000, reorderQuantity: 10000, supplier: 'Pacific Glass Co', lastOrdered: '2026-02-15', status: 'in-stock', unitCost: 0.22 },
  { id: 'nc-025', name: 'Child-Resistant Caps (tube)', category: 'packaging', sku: 'NC-CR-TB', currentStock: 900, unit: 'each', reorderPoint: 1000, reorderQuantity: 5000, supplier: 'Pacific Packaging', lastOrdered: '2026-02-10', status: 'low', unitCost: 0.15 },

  // Other (5)
  { id: 'nc-026', name: 'Exit Bags (WA required)', category: 'other', sku: 'NC-EB-01', currentStock: 3400, unit: 'each', reorderPoint: 2000, reorderQuantity: 10000, supplier: 'Pacific Packaging', lastOrdered: '2026-02-05', status: 'in-stock', unitCost: 0.08 },
  { id: 'nc-027', name: 'Printed Inserts (brand card)', category: 'other', sku: 'NC-PI-01', currentStock: 5000, unit: 'each', reorderPoint: 2500, reorderQuantity: 10000, supplier: 'NW Label Co', lastOrdered: '2026-02-12', status: 'in-stock', unitCost: 0.07 },
  { id: 'nc-028', name: 'Shipping Boxes (small)', category: 'other', sku: 'NC-SB-SM', currentStock: 400, unit: 'each', reorderPoint: 300, reorderQuantity: 1000, supplier: 'Uline', lastOrdered: '2026-02-20', status: 'in-stock', unitCost: 1.20 },
  { id: 'nc-029', name: 'Shipping Boxes (medium)', category: 'other', sku: 'NC-SB-MD', currentStock: 250, unit: 'each', reorderPoint: 200, reorderQuantity: 500, supplier: 'Uline', lastOrdered: '2026-02-20', status: 'in-stock', unitCost: 1.80 },
  { id: 'nc-030', name: 'Shipping Boxes (large)', category: 'other', sku: 'NC-SB-LG', currentStock: 100, unit: 'each', reorderPoint: 100, reorderQuantity: 300, supplier: 'Uline', lastOrdered: '2026-01-15', status: 'low', unitCost: 2.50 },

  // Additional on-order / out-of-stock
  { id: 'nc-031', name: 'Beverage Cans 12oz', category: 'containers', sku: 'NC-BC-12', currentStock: 1800, unit: 'each', reorderPoint: 1000, reorderQuantity: 5000, supplier: 'Ball Corp', lastOrdered: '2026-02-25', status: 'in-stock', unitCost: 0.30 },
  { id: 'nc-032', name: 'Concentrate Jars 1g (glass)', category: 'containers', sku: 'NC-CJ-01', currentStock: 50, unit: 'each', reorderPoint: 500, reorderQuantity: 2000, supplier: 'Pacific Glass Co', lastOrdered: '2026-01-20', status: 'critical', unitCost: 0.75 },
  { id: 'nc-033', name: 'Edible Boxes (custom print)', category: 'packaging', sku: 'NC-EB-CP', currentStock: 1500, unit: 'each', reorderPoint: 800, reorderQuantity: 3000, supplier: 'Pacific Packaging', lastOrdered: '2026-02-18', status: 'in-stock', unitCost: 0.42 },
  { id: 'nc-034', name: 'Preroll 5-Pack Boxes', category: 'packaging', sku: 'NC-PB-05', currentStock: 0, unit: 'each', reorderPoint: 500, reorderQuantity: 2000, supplier: 'Pacific Packaging', lastOrdered: '2026-02-28', status: 'on-order', unitCost: 0.38 },
  { id: 'nc-035', name: 'Strain Stickers (custom)', category: 'labels', sku: 'NC-SS-01', currentStock: 0, unit: 'roll', reorderPoint: 10, reorderQuantity: 50, supplier: 'NW Label Co', lastOrdered: '2026-03-01', status: 'out-of-stock', unitCost: 12.00 },
];

// ═══════════════════════════════════════════════════════════════
// COA SUBMISSIONS — 28 submissions
// ═══════════════════════════════════════════════════════════════

const coaSubmissions: COASubmission[] = [
  // PASSED (18)
  { id: 'coa-001', batchNumber: 'B2026-0220', productName: 'Wedding Cake 3.5g', category: 'flower', strain: 'Wedding Cake', labName: 'Confidence Analytics', dateSubmitted: '2026-02-20', dateExpected: '2026-02-24', dateReceived: '2026-02-23', status: 'passed', expirationDate: '2026-08-23', results: { thc: 27.5, cbd: 0.5, totalTerpenes: 3.8, moisture: 8.2, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-002', batchNumber: 'B2026-0221', productName: 'Blue Dream 7g', category: 'flower', strain: 'Blue Dream', labName: 'Confidence Analytics', dateSubmitted: '2026-02-18', dateExpected: '2026-02-22', dateReceived: '2026-02-21', status: 'passed', expirationDate: '2026-08-21', results: { thc: 22.3, cbd: 0.4, totalTerpenes: 2.9, moisture: 9.1, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-003', batchNumber: 'B2026-0222', productName: 'Gelato 3.5g', category: 'flower', strain: 'Gelato', labName: 'Steep Hill', dateSubmitted: '2026-02-15', dateExpected: '2026-02-20', dateReceived: '2026-02-19', status: 'passed', expirationDate: '2026-08-19', results: { thc: 26.8, cbd: 0.6, totalTerpenes: 4.2, moisture: 7.8, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-004', batchNumber: 'B2026-0223', productName: 'OG Kush 14g', category: 'flower', strain: 'OG Kush', labName: 'Cannalysis Labs', dateSubmitted: '2026-02-12', dateExpected: '2026-02-17', dateReceived: '2026-02-17', status: 'passed', expirationDate: '2026-08-17', results: { thc: 24.0, cbd: 1.1, totalTerpenes: 3.1, moisture: 8.5, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-005', batchNumber: 'B2026-0410', productName: 'Gelato Live Resin Cart 1g', category: 'vaporizer', strain: 'Gelato', labName: 'Confidence Analytics', dateSubmitted: '2026-02-22', dateExpected: '2026-02-26', dateReceived: '2026-02-25', status: 'passed', expirationDate: '2026-08-25', results: { thc: 85.6, cbd: 0.5, totalTerpenes: 8.2, moisture: 0.3, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-006', batchNumber: 'B2026-0411', productName: 'Blue Dream 510 Cart 1g', category: 'vaporizer', strain: 'Blue Dream', labName: 'Steep Hill', dateSubmitted: '2026-02-20', dateExpected: '2026-02-25', dateReceived: '2026-02-24', status: 'passed', expirationDate: '2026-08-24', results: { thc: 90.0, cbd: 0.2, totalTerpenes: 5.5, moisture: 0.2, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-007', batchNumber: 'B2026-0510', productName: 'Gelato Live Resin 1g', category: 'concentrate', strain: 'Gelato', labName: 'Confidence Analytics', dateSubmitted: '2026-02-18', dateExpected: '2026-02-22', dateReceived: '2026-02-21', status: 'passed', expirationDate: '2026-08-21', results: { thc: 83.0, cbd: 0.5, totalTerpenes: 6.8, moisture: 1.2, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-008', batchNumber: 'B2026-0511', productName: 'OG Kush Shatter 1g', category: 'concentrate', strain: 'OG Kush', labName: 'Steep Hill', dateSubmitted: '2026-02-16', dateExpected: '2026-02-21', dateReceived: '2026-02-20', status: 'passed', expirationDate: '2026-08-20', results: { thc: 85.2, cbd: 1.1, totalTerpenes: 4.5, moisture: 0.8, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-009', batchNumber: 'B2026-0310', productName: 'Wedding Cake Preroll 1g', category: 'preroll', strain: 'Wedding Cake', labName: 'Confidence Analytics', dateSubmitted: '2026-02-22', dateExpected: '2026-02-26', dateReceived: '2026-02-25', status: 'passed', expirationDate: '2026-08-25', results: { thc: 27.0, cbd: 0.5, totalTerpenes: 3.2, moisture: 10.1, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-010', batchNumber: 'B2026-0610', productName: 'Watermelon Gummies 10pk', category: 'edible', strain: 'Zkittlez', labName: 'Cannalysis Labs', dateSubmitted: '2026-02-25', dateExpected: '2026-03-01', dateReceived: '2026-02-28', status: 'passed', expirationDate: '2026-08-28', results: { thc: 10.0, cbd: 0.5, totalTerpenes: 0.8, moisture: 12.0, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-011', batchNumber: 'B2026-0710', productName: 'Lemon Fizz CBD Seltzer', category: 'beverage', strain: 'CBD Lemon', labName: 'Confidence Analytics', dateSubmitted: '2026-02-24', dateExpected: '2026-02-28', dateReceived: '2026-02-27', status: 'passed', expirationDate: '2026-08-27', results: { thc: 2.0, cbd: 10.0, totalTerpenes: 0.5, moisture: 95.0, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-012', batchNumber: 'B2026-0232', productName: 'GSC Flower Bulk', category: 'flower', strain: 'GSC', labName: 'Steep Hill', dateSubmitted: '2026-02-20', dateExpected: '2026-02-25', dateReceived: '2026-02-24', status: 'passed', expirationDate: '2026-08-24', results: { thc: 24.5, cbd: 0.7, totalTerpenes: 3.4, moisture: 8.8, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-013', batchNumber: 'B2026-0418', productName: 'Gorilla Glue Cart 1g', category: 'vaporizer', strain: 'Gorilla Glue', labName: 'Confidence Analytics', dateSubmitted: '2026-02-25', dateExpected: '2026-03-01', dateReceived: '2026-02-28', status: 'passed', expirationDate: '2026-08-28', results: { thc: 88.0, cbd: 0.8, totalTerpenes: 6.2, moisture: 0.4, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-014', batchNumber: 'B2026-0412', productName: 'Sour Diesel Disposable', category: 'vaporizer', strain: 'Sour Diesel', labName: 'Cannalysis Labs', dateSubmitted: '2026-02-18', dateExpected: '2026-02-23', dateReceived: '2026-02-23', status: 'passed', expirationDate: '2026-08-23', results: { thc: 88.1, cbd: 0.3, totalTerpenes: 4.8, moisture: 0.2, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-015', batchNumber: 'B2026-0512', productName: 'Wedding Cake Live Rosin', category: 'concentrate', strain: 'Wedding Cake', labName: 'Confidence Analytics', dateSubmitted: '2026-02-22', dateExpected: '2026-02-26', dateReceived: '2026-02-25', status: 'passed', expirationDate: '2026-08-25', results: { thc: 81.5, cbd: 0.4, totalTerpenes: 7.1, moisture: 1.0, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-016', batchNumber: 'B2026-0318', productName: 'Gelato Preroll 1g', category: 'preroll', strain: 'Gelato', labName: 'Steep Hill', dateSubmitted: '2026-02-24', dateExpected: '2026-02-28', dateReceived: '2026-02-28', status: 'passed', expirationDate: '2026-08-28', results: { thc: 26.8, cbd: 0.6, totalTerpenes: 3.9, moisture: 9.5, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-017', batchNumber: 'B2026-0517', productName: 'Wedding Cake Rosin Bulk', category: 'concentrate', strain: 'Wedding Cake', labName: 'Confidence Analytics', dateSubmitted: '2026-02-26', dateExpected: '2026-03-02', dateReceived: '2026-03-01', status: 'passed', expirationDate: '2026-09-01', results: { thc: 81.5, cbd: 0.4, totalTerpenes: 7.3, moisture: 0.9, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },
  { id: 'coa-018', batchNumber: 'B2026-0616', productName: 'Mint Chocolate Bar', category: 'edible', strain: 'Jack Herer', labName: 'Cannalysis Labs', dateSubmitted: '2026-02-25', dateExpected: '2026-03-01', dateReceived: '2026-03-01', status: 'passed', expirationDate: '2026-09-01', results: { thc: 10.0, cbd: 0.5, totalTerpenes: 0.6, moisture: 11.5, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass' } },

  // FAILED (3)
  { id: 'coa-019', batchNumber: 'B2026-0519', productName: 'Zkittlez Live Resin 1g', category: 'concentrate', strain: 'Zkittlez', labName: 'Steep Hill', dateSubmitted: '2026-03-01', dateExpected: '2026-03-06', dateReceived: '2026-03-05', status: 'failed', results: { thc: 79.0, cbd: 0.5, totalTerpenes: 5.2, moisture: 1.8, contaminants: 'fail', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'fail', failureReasons: ['Residual solvent (butane) at 12ppm — limit is 10ppm'] } },
  { id: 'coa-020', batchNumber: 'B2026-0245', productName: 'Purple Punch Bulk', category: 'flower', strain: 'Purple Punch', labName: 'Confidence Analytics', dateSubmitted: '2026-02-10', dateExpected: '2026-02-14', dateReceived: '2026-02-14', status: 'failed', results: { thc: 19.8, cbd: 0.1, totalTerpenes: 2.8, moisture: 14.5, contaminants: 'pass', pesticides: 'pass', heavyMetals: 'pass', residualSolvents: 'pass', failureReasons: ['Moisture content 14.5% — limit is 13%'] } },
  { id: 'coa-021', batchNumber: 'B2026-0420A', productName: 'GSC Live Resin Cart', category: 'vaporizer', strain: 'GSC', labName: 'Cannalysis Labs', dateSubmitted: '2026-01-28', dateExpected: '2026-02-02', dateReceived: '2026-02-02', status: 'failed', results: { thc: 82.5, cbd: 0.6, totalTerpenes: 5.8, moisture: 0.5, contaminants: 'fail', pesticides: 'fail', heavyMetals: 'pass', residualSolvents: 'pass', failureReasons: ['Myclobutanil detected at 0.15ppm — limit is 0.10ppm'] } },

  // IN-TESTING (2)
  { id: 'coa-022', batchNumber: 'B2026-0240', productName: 'Gorilla Glue Bulk', category: 'flower', strain: 'Gorilla Glue', labName: 'Confidence Analytics', dateSubmitted: '2026-03-05', dateExpected: '2026-03-09', status: 'in-testing' },
  { id: 'coa-023', batchNumber: 'B2026-0419', productName: 'Zkittlez Cart 0.5g', category: 'vaporizer', strain: 'Zkittlez', labName: 'Steep Hill', dateSubmitted: '2026-03-05', dateExpected: '2026-03-10', status: 'in-testing' },

  // SUBMITTED (5)
  { id: 'coa-024', batchNumber: 'B2026-0241', productName: 'OG Kush Bulk', category: 'flower', strain: 'OG Kush', labName: 'Cannalysis Labs', dateSubmitted: '2026-03-06', dateExpected: '2026-03-11', status: 'submitted' },
  { id: 'coa-025', batchNumber: 'B2026-0514', productName: 'Blue Dream Wax 1g', category: 'concentrate', strain: 'Blue Dream', labName: 'Steep Hill', dateSubmitted: '2026-03-06', dateExpected: '2026-03-11', status: 'submitted' },
  { id: 'coa-026', batchNumber: 'B2026-0319', productName: 'Zkittlez Preroll 1g', category: 'preroll', strain: 'Zkittlez', labName: 'Confidence Analytics', dateSubmitted: '2026-03-06', dateExpected: '2026-03-10', status: 'submitted' },
  { id: 'coa-027', batchNumber: 'B2026-0711A', productName: 'Mango THC Seltzer', category: 'beverage', strain: 'Mango Haze', labName: 'Cannalysis Labs', dateSubmitted: '2026-03-07', dateExpected: '2026-03-12', status: 'submitted' },
  { id: 'coa-028', batchNumber: 'B2026-0616A', productName: 'Raspberry Gummies 10pk', category: 'edible', strain: 'Raspberry Kush', labName: 'Confidence Analytics', dateSubmitted: '2026-03-07', dateExpected: '2026-03-11', status: 'submitted' },
];

// ═══════════════════════════════════════════════════════════════
// LAB PARTNERS
// ═══════════════════════════════════════════════════════════════

const labPartners: LabPartner[] = [
  { id: 'lab-001', name: 'Confidence Analytics', location: 'Seattle, WA', avgTurnaround: 3.8, testsThisMonth: 23, passRate: 96, contactEmail: 'testing@confidenceanalytics.com', contactPhone: '(206) 555-0142' },
  { id: 'lab-002', name: 'Steep Hill', location: 'Seattle, WA', avgTurnaround: 4.5, testsThisMonth: 12, passRate: 91, contactEmail: 'submissions@steephill.com', contactPhone: '(206) 555-0198' },
  { id: 'lab-003', name: 'Cannalysis Labs', location: 'Yakima, WA', avgTurnaround: 5.1, testsThisMonth: 8, passRate: 93, contactEmail: 'lab@cannalysis.com', contactPhone: '(509) 555-0167' },
];

// ═══════════════════════════════════════════════════════════════
// ALERTS — 14 active alerts
// ═══════════════════════════════════════════════════════════════

const alerts: InventoryAlert[] = [
  { id: 'alert-001', severity: 'critical', type: 'low-stock', title: 'Gelato 3.5g Glass Jars — 12 remaining', description: 'Glass Jar 3.5g stock at 800 units, reorder point is 1,500. Lead time from Pacific Glass Co is 2 weeks.', affectedItems: ['nc-002'], timestamp: '2026-03-07T08:00:00Z', recommendedAction: 'Place emergency reorder with Pacific Glass Co for 5,000 units', actionLabel: 'Reorder', acknowledged: false },
  { id: 'alert-002', severity: 'critical', type: 'low-stock', title: 'Preroll Tubes (CR) critically low', description: 'Only 450 tubes remaining, reorder point is 1,000. Current burn rate is ~80/day. Will run out in ~6 days.', affectedItems: ['nc-008'], timestamp: '2026-03-07T07:30:00Z', recommendedAction: 'Place urgent reorder with Pacific Packaging for 5,000 tubes', actionLabel: 'Reorder', acknowledged: false },
  { id: 'alert-003', severity: 'critical', type: 'low-stock', title: 'Vape Cart Shell 0.5g — 200 remaining', description: 'CCELL 0.5g shells at 200 units, reorder point is 1,000. CCELL lead time is 3 weeks.', affectedItems: ['nc-010'], timestamp: '2026-03-07T07:00:00Z', recommendedAction: 'Contact CCELL Direct for expedited order of 3,000 shells', actionLabel: 'Reorder', acknowledged: false },
  { id: 'alert-004', severity: 'critical', type: 'failed-coa', title: 'Zkittlez Live Resin — COA FAILED', description: 'Batch B2026-0519 failed: residual solvent (butane) at 12ppm, limit is 10ppm. Batch quarantined.', affectedItems: ['coa-019'], timestamp: '2026-03-05T14:30:00Z', recommendedAction: 'Review extraction process parameters and schedule remediation', actionLabel: 'Investigate', acknowledged: false },
  { id: 'alert-005', severity: 'warning', type: 'expiring-coa', title: 'Blue Dream 7g — COA expires March 21', description: 'COA for batch B2026-0221 expires in 14 days. 120 units still in stock.', affectedItems: ['coa-002'], timestamp: '2026-03-07T06:00:00Z', recommendedAction: 'Schedule retesting with Confidence Analytics before March 15', actionLabel: 'Schedule Retest', acknowledged: false },
  { id: 'alert-006', severity: 'warning', type: 'expiring-coa', title: 'Gelato 3.5g — COA expires March 19', description: 'COA for batch B2026-0222 expires in 12 days. 280 units still in stock.', affectedItems: ['coa-003'], timestamp: '2026-03-07T06:00:00Z', recommendedAction: 'Submit retest to Steep Hill or accelerate sales of remaining stock', actionLabel: 'Schedule Retest', acknowledged: false },
  { id: 'alert-007', severity: 'warning', type: 'aging', title: 'OG Kush Bulk — 45 days in COA Pending', description: 'Batch B2026-0241 has been in COA Pending for 45 days. Expected turnaround was 5 days.', affectedItems: ['inv-019'], timestamp: '2026-03-07T06:00:00Z', recommendedAction: 'Contact Cannalysis Labs about delayed results for B2026-0241', actionLabel: 'Contact Lab', acknowledged: false },
  { id: 'alert-008', severity: 'warning', type: 'aging', title: 'Wedding Cake 3.5g — fulfilled 14+ days', description: '120 units fulfilled on Feb 21 but not yet delivered. Orders may be stale.', affectedItems: ['inv-027'], timestamp: '2026-03-07T06:00:00Z', recommendedAction: 'Check delivery schedule and verify order status', actionLabel: 'View Orders', acknowledged: false },
  { id: 'alert-009', severity: 'warning', type: 'reconciliation', title: 'Bamboo shows 48 units, Frost shows 52', description: 'Wedding Cake 3.5g (B2026-0220) has a 4-unit discrepancy between Frost inventory and Bamboo traceability system.', affectedItems: ['inv-024'], timestamp: '2026-03-06T16:00:00Z', recommendedAction: 'Perform physical count and reconcile with Bamboo', actionLabel: 'Reconcile', acknowledged: false },
  { id: 'alert-010', severity: 'warning', type: 'reconciliation', title: 'Bamboo shows 238 carts, Frost shows 240', description: 'Gelato Live Resin Cart 1g (B2026-0410) has a 2-unit discrepancy.', affectedItems: ['inv-043'], timestamp: '2026-03-06T16:00:00Z', recommendedAction: 'Verify cart count at Finished Goods and update Bamboo', actionLabel: 'Reconcile', acknowledged: false },
  { id: 'alert-011', severity: 'info', type: 'out-of-stock', title: 'Wedding Cake Infused Preroll — 0 units packaged', description: 'No packaged inventory for Wedding Cake Infused Preroll. 3 pending orders waiting.', affectedItems: [], timestamp: '2026-03-07T09:00:00Z', recommendedAction: 'Prioritize infused preroll production in next roll session', actionLabel: 'View Orders', acknowledged: false },
  { id: 'alert-012', severity: 'info', type: 'out-of-stock', title: 'Preroll 5-Pack Boxes on order', description: 'Preroll 5-Pack packaging boxes are out of stock. Reorder placed Feb 28, expected delivery March 10.', affectedItems: ['nc-034'], timestamp: '2026-03-07T06:00:00Z', recommendedAction: 'Track shipment status with Pacific Packaging', actionLabel: 'Track Order', acknowledged: false },
  { id: 'alert-013', severity: 'warning', type: 'low-stock', title: 'Concentrate Jars 1g critically low', description: 'Only 50 glass concentrate jars remaining. Reorder point is 500.', affectedItems: ['nc-032'], timestamp: '2026-03-07T07:00:00Z', recommendedAction: 'Place urgent reorder with Pacific Glass Co', actionLabel: 'Reorder', acknowledged: false },
  { id: 'alert-014', severity: 'info', type: 'low-stock', title: 'Child-Resistant Caps (tube) approaching reorder', description: '900 units remaining, reorder point is 1,000. Burn rate ~50/day.', affectedItems: ['nc-025'], timestamp: '2026-03-07T06:00:00Z', recommendedAction: 'Schedule reorder within 2 days', actionLabel: 'Reorder', acknowledged: false },
];

// ═══════════════════════════════════════════════════════════════
// ACTIVITY FEED — 18 recent events
// ═══════════════════════════════════════════════════════════════

const activityFeed: ActivityFeedEvent[] = [
  { id: 'evt-001', timestamp: '2026-03-07T10:30:00Z', productName: 'Wedding Cake 3.5g', batchNumber: 'B2026-0220', eventType: 'packaged', description: '50 units packaged at Packaging Line A' },
  { id: 'evt-002', timestamp: '2026-03-07T09:15:00Z', productName: 'Blue Dream Bulk', batchNumber: 'B2026-0250', eventType: 'coa-submitted', description: 'COA submitted to Confidence Analytics' },
  { id: 'evt-003', timestamp: '2026-03-07T08:00:00Z', productName: 'Gelato Live Resin Cart 1g', batchNumber: 'B2026-0410', eventType: 'fulfilled', description: '50 units allocated to Order #ORD-2026-0445' },
  { id: 'evt-004', timestamp: '2026-03-06T16:45:00Z', productName: 'GSC 3.5g', batchNumber: 'B2026-0200', eventType: 'delivered', description: '200 units delivered to Herbal Wellness (Route A)' },
  { id: 'evt-005', timestamp: '2026-03-06T14:30:00Z', productName: 'Gorilla Glue Cart 1g', batchNumber: 'B2026-0418', eventType: 'coa-passed', description: 'COA PASSED — THC 88.0%, all contaminant tests clear' },
  { id: 'evt-006', timestamp: '2026-03-06T12:00:00Z', productName: 'OG Kush Shatter 1g', batchNumber: 'B2026-0511', eventType: 'packaged', description: '25 units packaged at Concentrate Line' },
  { id: 'evt-007', timestamp: '2026-03-06T10:30:00Z', productName: 'Wedding Cake Preroll 1g', batchNumber: 'B2026-0310', eventType: 'packaged', description: '100 units packaged at Roll Room 1' },
  { id: 'evt-008', timestamp: '2026-03-05T16:00:00Z', productName: 'Zkittlez Live Resin 1g', batchNumber: 'B2026-0519', eventType: 'coa-failed', description: 'COA FAILED — residual solvent 12ppm (limit 10ppm)' },
  { id: 'evt-009', timestamp: '2026-03-05T14:00:00Z', productName: 'Gorilla Glue Harvest', batchNumber: 'B2026-0280', eventType: 'harvested', description: '24 lbs harvested from Greenhouse A, moved to Dry Room 1' },
  { id: 'evt-010', timestamp: '2026-03-05T11:00:00Z', productName: 'Sour Diesel Cart 1g', batchNumber: 'B2026-0420', eventType: 'delivered', description: '80 units delivered to Green Leaf Dispensary (Route A)' },
  { id: 'evt-011', timestamp: '2026-03-05T09:00:00Z', productName: 'Blue Dream Infused Preroll', batchNumber: 'B2026-0311', eventType: 'fulfilled', description: '30 units allocated to Order #ORD-2026-0442' },
  { id: 'evt-012', timestamp: '2026-03-04T15:30:00Z', productName: 'Gelato Preroll 1g', batchNumber: 'B2026-0318', eventType: 'coa-passed', description: 'COA PASSED — THC 26.8%, moisture 9.5%' },
  { id: 'evt-013', timestamp: '2026-03-04T13:00:00Z', productName: 'Preroll Tubes (CR)', eventType: 'reorder', description: 'Stock below reorder point — 450 remaining, reorder point 1,000' },
  { id: 'evt-014', timestamp: '2026-03-04T10:00:00Z', productName: 'OG Kush 14g', batchNumber: 'B2026-0223', eventType: 'packaged', description: '30 units packaged at Packaging Line B' },
  { id: 'evt-015', timestamp: '2026-03-03T16:00:00Z', productName: 'Caramel Chews 5pk', batchNumber: 'B2026-0615', eventType: 'delivered', description: '60 units delivered to Mountain High (Route A)' },
  { id: 'evt-016', timestamp: '2026-03-03T12:00:00Z', productName: 'Wedding Cake Rosin Bulk', batchNumber: 'B2026-0517', eventType: 'coa-passed', description: 'COA PASSED — THC 81.5%, terpenes 7.3%' },
  { id: 'evt-017', timestamp: '2026-03-02T14:00:00Z', productName: 'Blue Dream Dried', batchNumber: 'B2026-0271', eventType: 'harvested', description: '14 lbs moved from Dry Room to Cure Room B' },
  { id: 'evt-018', timestamp: '2026-03-01T10:00:00Z', productName: 'CCELL 0.5g Shells', eventType: 'alert', description: 'Stock critically low — 200 remaining, reorder point 1,000' },
];

// ═══════════════════════════════════════════════════════════════
// COMPUTED HELPERS
// ═══════════════════════════════════════════════════════════════

function computePipeline(): PipelineStateNode[] {
  const stateOrder: ReadinessState[] = [
    'growing', 'harvested', 'dried', 'bucked', 'trimmed', 'bulk-ready',
    'coa-pending', 'coa-passed', 'packaged', 'fulfilled', 'delivered',
  ];
  const stateLabels: Record<ReadinessState, string> = {
    growing: 'Growing', harvested: 'Harvested', dried: 'Dried',
    bucked: 'Bucked', trimmed: 'Trimmed', 'bulk-ready': 'Bulk Ready',
    'coa-pending': 'COA Pending', 'coa-passed': 'COA Passed',
    packaged: 'Packaged', fulfilled: 'Fulfilled', delivered: 'Delivered',
  };
  const stateUnits: Record<ReadinessState, string> = {
    growing: 'plants', harvested: 'lbs', dried: 'lbs',
    bucked: 'lbs', trimmed: 'lbs', 'bulk-ready': 'lbs',
    'coa-pending': 'batches', 'coa-passed': 'batches',
    packaged: 'units', fulfilled: 'units', delivered: 'units',
  };
  const thresholds: Record<ReadinessState, { low: number; critical: number }> = {
    growing: { low: 30, critical: 10 }, harvested: { low: 10, critical: 5 },
    dried: { low: 10, critical: 5 }, bucked: { low: 5, critical: 2 },
    trimmed: { low: 5, critical: 2 }, 'bulk-ready': { low: 5, critical: 2 },
    'coa-pending': { low: 5, critical: 8 }, 'coa-passed': { low: 3, critical: 1 },
    packaged: { low: 200, critical: 50 }, fulfilled: { low: 50, critical: 20 },
    delivered: { low: 50, critical: 20 },
  };

  return stateOrder.map((state) => {
    const items = allCannabis.filter((i) => i.readinessState === state);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const t = thresholds[state];
    const health = count <= t.critical ? 'critical' : count <= t.low ? 'low' : 'healthy';
    return { state, label: stateLabels[state], count, unit: stateUnits[state], health };
  });
}

function computeCategories(): CategoryDistribution[] {
  const labels: Record<ProductCategory, string> = {
    flower: 'Flower', preroll: 'Prerolls', vaporizer: 'Vaporizers',
    concentrate: 'Concentrates', edible: 'Edibles', beverage: 'Beverages',
  };
  const trends: Record<ProductCategory, number> = {
    flower: 5, preroll: 12, vaporizer: 8, concentrate: -3, edible: 15, beverage: 22,
  };

  return (['flower', 'preroll', 'vaporizer', 'concentrate', 'edible', 'beverage'] as ProductCategory[]).map((cat) => {
    const items = allCannabis.filter((i) => i.category === cat && ['packaged', 'fulfilled'].includes(i.readinessState));
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const value = items.reduce((sum, i) => sum + i.value, 0);
    const lowStock = count < 100;
    return { category: cat, label: labels[cat], count, value, trend: trends[cat], lowStock };
  });
}

function computeMetrics(): InventoryOverviewMetrics {
  const packaged = allCannabis.filter((i) => ['packaged', 'fulfilled'].includes(i.readinessState));
  const uniqueSKUs = new Set(packaged.map((i) => i.sku)).size;
  const totalValue = allCannabis.reduce((sum, i) => sum + i.value, 0);
  const belowReorder = nonCannabis.filter((i) => i.currentStock < i.reorderPoint).length;
  const coaPending = coaSubmissions.filter((s) => s.status === 'submitted' || s.status === 'in-testing').length;
  const expiringCOAs = coaSubmissions.filter((s) => {
    if (!s.expirationDate) return false;
    const exp = new Date(s.expirationDate);
    const cutoff = new Date('2026-04-06');
    return exp <= cutoff && s.status === 'passed';
  }).length;

  return {
    totalSKUs: uniqueSKUs + 100,
    totalValue,
    belowReorderPoint: belowReorder,
    coaPending,
    avgDaysInPipeline: 94,
    expiringCOAs,
  };
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS — async getters matching TanStack Query pattern
// ═══════════════════════════════════════════════════════════════

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getCannabisInventory(filters?: InventoryFilter): Promise<CannabisInventoryItem[]> {
  await delay(300);
  let result = [...allCannabis];
  if (filters?.category) result = result.filter((i) => i.category === filters.category);
  if (filters?.readinessState) result = result.filter((i) => i.readinessState === filters.readinessState);
  if (filters?.strain) result = result.filter((i) => i.strain.toLowerCase().includes(filters.strain!.toLowerCase()));
  if (filters?.brand) result = result.filter((i) => i.brand === filters.brand);
  if (filters?.thcMin != null) result = result.filter((i) => i.thc >= filters.thcMin!);
  if (filters?.thcMax != null) result = result.filter((i) => i.thc <= filters.thcMax!);
  if (filters?.packageSize) result = result.filter((i) => i.packageSize === filters.packageSize);
  if (filters?.coaStatus) result = result.filter((i) => i.coaStatus === filters.coaStatus);
  if (filters?.stockLevel === 'low-stock') result = result.filter((i) => i.quantity > 0 && i.quantity < 100);
  if (filters?.stockLevel === 'out-of-stock') result = result.filter((i) => i.quantity === 0);
  if (filters?.stockLevel === 'in-stock') result = result.filter((i) => i.quantity >= 100);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((i) =>
      i.productName.toLowerCase().includes(q) || i.strain.toLowerCase().includes(q) ||
      i.sku.toLowerCase().includes(q) || i.batchNumber.toLowerCase().includes(q)
    );
  }
  return result;
}

export async function getNonCannabisInventory(): Promise<NonCannabisItem[]> {
  await delay(200);
  return [...nonCannabis];
}

export async function getCOASubmissions(filters?: { status?: COASubmission['status']; search?: string }): Promise<COASubmission[]> {
  await delay(300);
  let result = [...coaSubmissions];
  if (filters?.status) result = result.filter((s) => s.status === filters.status);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((s) =>
      s.batchNumber.toLowerCase().includes(q) || s.productName.toLowerCase().includes(q) ||
      s.strain.toLowerCase().includes(q) || s.labName.toLowerCase().includes(q)
    );
  }
  return result;
}

export async function getLabPartners(): Promise<LabPartner[]> {
  await delay(200);
  return [...labPartners];
}

export async function getInventoryAlerts(): Promise<InventoryAlert[]> {
  await delay(200);
  return [...alerts];
}

export async function getActivityFeed(): Promise<ActivityFeedEvent[]> {
  await delay(200);
  return [...activityFeed];
}

export async function getPipelineNodes(): Promise<PipelineStateNode[]> {
  await delay(200);
  return computePipeline();
}

export async function getOverviewMetrics(): Promise<InventoryOverviewMetrics> {
  await delay(200);
  return computeMetrics();
}

export async function getCategoryDistribution(): Promise<CategoryDistribution[]> {
  await delay(200);
  return computeCategories();
}
