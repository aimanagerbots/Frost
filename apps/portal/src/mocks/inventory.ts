import type {
  InventoryItem,
  InventoryMetrics,
  InventoryByState,
  InventoryByCategory,
  InventoryFilter,
  ProductCategory,
  StrainType,
  Division,
  ReadinessState,
  PipelineGroup,
} from '@/modules/inventory/types';

// --- Helper ---

let idCounter = 0;
function makeItem(
  productName: string, category: ProductCategory, subCategory: string,
  strainName: string, strainType: StrainType, readinessState: ReadinessState,
  division: Division, quantity: number, unit: 'units' | 'grams' | 'lbs',
  batchNumber: string, thcPercent: number | undefined, cbdPercent: number | undefined,
  location: string, valuePerUnit: number,
  extra?: Partial<InventoryItem>
): InventoryItem {
  idCounter++;
  const prefix = category.substring(0, 2).toUpperCase();
  return {
    id: `inv-${String(idCounter).padStart(3, '0')}`,
    sku: `FROST-${prefix}-${strainName.substring(0, 2).toUpperCase()}-${String(idCounter).padStart(3, '0')}`,
    productName, category, subCategory, strainName, strainType,
    readinessState, division, quantity, unit, batchNumber,
    thcPercent, cbdPercent, location,
    value: quantity * valuePerUnit,
    ...extra,
  };
}

// --- Flower Inventory (40 items) ---

const flowerItems: InventoryItem[] = [
  // Growing (5)
  makeItem('Wedding Cake Clone', 'flower', 'Clone', 'Wedding Cake', 'hybrid', 'growing', 'cultivation', 200, 'units', 'FL-2026-095', undefined, undefined, 'Greenhouse A', 2),
  makeItem('Blue Dream Seedling', 'flower', 'Seedling', 'Blue Dream', 'sativa', 'growing', 'cultivation', 150, 'units', 'FL-2026-096', undefined, undefined, 'Greenhouse B', 2.5),
  makeItem('Gelato Clone', 'flower', 'Clone', 'Gelato', 'hybrid', 'growing', 'cultivation', 180, 'units', 'FL-2026-097', undefined, undefined, 'Greenhouse A', 2),
  makeItem('OG Kush Seedling', 'flower', 'Seedling', 'OG Kush', 'indica', 'growing', 'cultivation', 120, 'units', 'FL-2026-098', undefined, undefined, 'Greenhouse C', 2.5),
  makeItem('Jack Herer Clone', 'flower', 'Clone', 'Jack Herer', 'sativa', 'growing', 'cultivation', 100, 'units', 'FL-2026-099', undefined, undefined, 'Greenhouse B', 2),

  // Harvested/Dried (4)
  makeItem('Gorilla Glue Dried Flower', 'flower', 'Dried Flower', 'Gorilla Glue', 'hybrid', 'harvested-dried', 'cultivation', 80, 'lbs', 'FL-2026-085', 26.5, 0.8, 'Dry Room 1', 120),
  makeItem('Zkittlez Dried Flower', 'flower', 'Dried Flower', 'Zkittlez', 'indica', 'harvested-dried', 'cultivation', 60, 'lbs', 'FL-2026-086', 23.4, 0.5, 'Dry Room 2', 110),
  makeItem('GSC Dried Flower', 'flower', 'Dried Flower', 'GSC', 'hybrid', 'harvested-dried', 'cultivation', 45, 'lbs', 'FL-2026-087', 25.1, 0.7, 'Dry Room 1', 130),
  makeItem('Wedding Cake Dried', 'flower', 'Dried Flower', 'Wedding Cake', 'hybrid', 'harvested-dried', 'cultivation', 55, 'lbs', 'FL-2026-088', 27.3, 0.6, 'Dry Room 2', 140),

  // Bucked (3)
  makeItem('Blue Dream Bucked', 'flower', 'Bucked', 'Blue Dream', 'sativa', 'bucked', 'manufacturing', 40, 'lbs', 'FL-2026-082', 22.8, 0.4, 'Processing Room A', 100),
  makeItem('OG Kush Bucked', 'flower', 'Bucked', 'OG Kush', 'indica', 'bucked', 'manufacturing', 35, 'lbs', 'FL-2026-083', 24.2, 1.1, 'Processing Room A', 110),
  makeItem('Gelato Bucked', 'flower', 'Bucked', 'Gelato', 'hybrid', 'bucked', 'manufacturing', 30, 'lbs', 'FL-2026-084', 26.7, 0.6, 'Processing Room B', 120),

  // Trimmed (4)
  makeItem('Wedding Cake Trimmed', 'flower', 'Trimmed', 'Wedding Cake', 'hybrid', 'trimmed', 'manufacturing', 50, 'lbs', 'FL-2026-078', 27.1, 0.5, 'Trim Room 1', 180),
  makeItem('Jack Herer Trimmed', 'flower', 'Trimmed', 'Jack Herer', 'sativa', 'trimmed', 'manufacturing', 35, 'lbs', 'FL-2026-079', 21.9, 0.8, 'Trim Room 2', 160),
  makeItem('Gorilla Glue Trimmed', 'flower', 'Trimmed', 'Gorilla Glue', 'hybrid', 'trimmed', 'manufacturing', 25, 'lbs', 'FL-2026-080', 26.0, 0.7, 'Trim Room 1', 170),
  makeItem('GSC Trimmed', 'flower', 'Trimmed', 'GSC', 'hybrid', 'trimmed', 'manufacturing', 20, 'lbs', 'FL-2026-081', 24.8, 0.6, 'Trim Room 2', 175),

  // Bulk Ready (5)
  makeItem('Blue Dream Bulk', 'flower', 'Bulk Ready', 'Blue Dream', 'sativa', 'bulk-ready', 'manufacturing', 30, 'lbs', 'FL-2026-073', 22.5, 0.4, 'Vault A', 220),
  makeItem('Wedding Cake Bulk', 'flower', 'Bulk Ready', 'Wedding Cake', 'hybrid', 'bulk-ready', 'manufacturing', 25, 'lbs', 'FL-2026-074', 27.8, 0.5, 'Vault A', 280),
  makeItem('Gelato Bulk', 'flower', 'Bulk Ready', 'Gelato', 'hybrid', 'bulk-ready', 'manufacturing', 20, 'lbs', 'FL-2026-075', 26.4, 0.6, 'Vault B', 260),
  makeItem('Zkittlez Bulk', 'flower', 'Bulk Ready', 'Zkittlez', 'indica', 'bulk-ready', 'manufacturing', 15, 'lbs', 'FL-2026-076', 23.1, 0.5, 'Vault B', 240),
  makeItem('OG Kush Bulk', 'flower', 'Bulk Ready', 'OG Kush', 'indica', 'bulk-ready', 'manufacturing', 18, 'lbs', 'FL-2026-077', 24.6, 1.0, 'Vault A', 230),

  // COA Pending (3)
  makeItem('Gorilla Glue COA Pending', 'flower', 'Awaiting COA', 'Gorilla Glue', 'hybrid', 'coa-pending', 'manufacturing', 12, 'lbs', 'FL-2026-070', 26.2, 0.8, 'Lab Queue', 250),
  makeItem('Jack Herer COA Pending', 'flower', 'Awaiting COA', 'Jack Herer', 'sativa', 'coa-pending', 'manufacturing', 10, 'lbs', 'FL-2026-071', 21.5, 0.9, 'Lab Queue', 240),
  makeItem('Wedding Cake COA Pending', 'flower', 'Awaiting COA', 'Wedding Cake', 'hybrid', 'coa-pending', 'manufacturing', 8, 'lbs', 'FL-2026-072', 28.1, 0.5, 'Lab Queue', 290),

  // COA Passed (6)
  makeItem('Blue Dream Packagable', 'flower', 'COA Passed', 'Blue Dream', 'sativa', 'coa-passed', 'packaging', 22, 'lbs', 'FL-2026-091', 22.3, 0.4, 'Pack Staging', 240),
  makeItem('Wedding Cake Packagable', 'flower', 'COA Passed', 'Wedding Cake', 'hybrid', 'coa-passed', 'packaging', 18, 'lbs', 'FL-2026-089', 27.5, 0.5, 'Pack Staging', 300),
  makeItem('Gelato Packagable', 'flower', 'COA Passed', 'Gelato', 'hybrid', 'coa-passed', 'packaging', 15, 'lbs', 'FL-2026-090', 26.8, 0.6, 'Pack Staging', 280),
  makeItem('GSC Packagable', 'flower', 'COA Passed', 'GSC', 'hybrid', 'coa-passed', 'packaging', 12, 'lbs', 'FL-2026-068', 24.5, 0.7, 'Pack Staging', 260),
  makeItem('OG Kush Packagable', 'flower', 'COA Passed', 'OG Kush', 'indica', 'coa-passed', 'packaging', 10, 'lbs', 'FL-2026-069', 24.0, 1.1, 'Pack Staging', 250),
  makeItem('Zkittlez Packagable', 'flower', 'COA Passed', 'Zkittlez', 'indica', 'coa-passed', 'packaging', 8, 'lbs', 'FL-2026-067', 23.0, 0.5, 'Pack Staging', 250),

  // Packaged (6)
  makeItem('Wedding Cake 3.5g', 'flower', 'Eighth', 'Wedding Cake', 'hybrid', 'packaged', 'packaging', 340, 'units', 'FL-2026-060', 27.5, 0.5, 'Finished Goods', 28, { packagedDate: '2026-02-28' }),
  makeItem('Blue Dream 3.5g', 'flower', 'Eighth', 'Blue Dream', 'sativa', 'packaged', 'packaging', 23, 'units', 'FL-2026-061', 22.3, 0.4, 'Finished Goods', 24, { packagedDate: '2026-02-27' }),
  makeItem('Gelato 3.5g', 'flower', 'Eighth', 'Gelato', 'hybrid', 'packaged', 'packaging', 280, 'units', 'FL-2026-062', 26.8, 0.6, 'Finished Goods', 28, { packagedDate: '2026-02-26' }),
  makeItem('OG Kush 3.5g', 'flower', 'Eighth', 'OG Kush', 'indica', 'packaged', 'packaging', 200, 'units', 'FL-2026-063', 24.0, 1.1, 'Finished Goods', 22, { packagedDate: '2026-02-25' }),
  makeItem('GSC 3.5g', 'flower', 'Eighth', 'GSC', 'hybrid', 'packaged', 'packaging', 180, 'units', 'FL-2026-064', 24.5, 0.7, 'Finished Goods', 22, { packagedDate: '2026-02-24' }),
  makeItem('Zkittlez 3.5g', 'flower', 'Eighth', 'Zkittlez', 'indica', 'packaged', 'packaging', 160, 'units', 'FL-2026-065', 23.0, 0.5, 'Finished Goods', 22, { packagedDate: '2026-02-23' }),

  // Fulfillable (4)
  makeItem('Wedding Cake 3.5g (Ready)', 'flower', 'Eighth', 'Wedding Cake', 'hybrid', 'fulfillable', 'fulfillment', 120, 'units', 'FL-2026-055', 27.5, 0.5, 'Fulfillment Bay 1', 28),
  makeItem('Blue Dream 3.5g (Ready)', 'flower', 'Eighth', 'Blue Dream', 'sativa', 'fulfillable', 'fulfillment', 96, 'units', 'FL-2026-056', 22.3, 0.4, 'Fulfillment Bay 1', 24),
  makeItem('Gorilla Glue 3.5g (Ready)', 'flower', 'Eighth', 'Gorilla Glue', 'hybrid', 'fulfillable', 'fulfillment', 72, 'units', 'FL-2026-057', 26.0, 0.7, 'Fulfillment Bay 2', 22),
  makeItem('Jack Herer 3.5g (Ready)', 'flower', 'Eighth', 'Jack Herer', 'sativa', 'fulfillable', 'fulfillment', 60, 'units', 'FL-2026-058', 21.9, 0.8, 'Fulfillment Bay 2', 24),
];

// --- Vaporizer Inventory (25 items) ---

const vaporizerItems: InventoryItem[] = [
  // Extracted (3)
  makeItem('Blue Dream Crude Extract', 'vaporizer', 'Crude Oil', 'Blue Dream', 'sativa', 'extracted', 'manufacturing', 5000, 'grams', 'VZ-2026-040', 78.0, 0.3, 'Extraction Lab', 6),
  makeItem('OG Kush Crude Extract', 'vaporizer', 'Crude Oil', 'OG Kush', 'indica', 'extracted', 'manufacturing', 4000, 'grams', 'VZ-2026-041', 76.5, 1.2, 'Extraction Lab', 6),
  makeItem('Wedding Cake Crude', 'vaporizer', 'Crude Oil', 'Wedding Cake', 'hybrid', 'extracted', 'manufacturing', 3500, 'grams', 'VZ-2026-042', 80.2, 0.4, 'Extraction Lab', 7),

  // Crude (2)
  makeItem('Gorilla Glue Crude Oil', 'vaporizer', 'Crude Oil', 'Gorilla Glue', 'hybrid', 'crude', 'manufacturing', 5000, 'grams', 'VZ-2026-038', 74.3, 0.9, 'Distillation Queue', 8),
  makeItem('Gelato Crude Oil', 'vaporizer', 'Crude Oil', 'Gelato', 'hybrid', 'crude', 'manufacturing', 3000, 'grams', 'VZ-2026-039', 79.1, 0.5, 'Distillation Queue', 9),

  // Distillate (3)
  makeItem('Blue Dream Distillate', 'vaporizer', 'Distillate', 'Blue Dream', 'sativa', 'distillate', 'manufacturing', 3000, 'grams', 'VZ-2026-035', 91.2, 0.2, 'Distillate Vault', 14),
  makeItem('Sour Diesel Distillate', 'vaporizer', 'Distillate', 'Sour Diesel', 'sativa', 'distillate', 'manufacturing', 2500, 'grams', 'VZ-2026-036', 89.7, 0.3, 'Distillate Vault', 14),
  makeItem('OG Kush Distillate', 'vaporizer', 'Distillate', 'OG Kush', 'indica', 'distillate', 'manufacturing', 2000, 'grams', 'VZ-2026-037', 90.5, 1.0, 'Distillate Vault', 15),

  // Flavored (3)
  makeItem('Gelato Terp Blend', 'vaporizer', 'Terped Distillate', 'Gelato', 'hybrid', 'flavored', 'manufacturing', 2000, 'grams', 'VZ-2026-032', 88.4, 0.5, 'Terp Room', 18),
  makeItem('Wedding Cake Terp Blend', 'vaporizer', 'Terped Distillate', 'Wedding Cake', 'hybrid', 'flavored', 'manufacturing', 1500, 'grams', 'VZ-2026-033', 87.9, 0.4, 'Terp Room', 19),
  makeItem('GSC Terp Blend', 'vaporizer', 'Terped Distillate', 'GSC', 'hybrid', 'flavored', 'manufacturing', 1000, 'grams', 'VZ-2026-034A', 86.2, 0.6, 'Terp Room', 18),

  // Pen Filled (3)
  makeItem('Gelato Live Resin 510 Cart', 'vaporizer', 'Live Resin Cart', 'Gelato', 'hybrid', 'pen-filled', 'manufacturing', 200, 'units', 'VZ-2026-034', 85.6, 0.5, 'Fill Station', 18),
  makeItem('Sour Diesel Disposable', 'vaporizer', 'Disposable', 'Sour Diesel', 'sativa', 'pen-filled', 'manufacturing', 180, 'units', 'VZ-2026-035A', 88.1, 0.3, 'Fill Station', 15),
  makeItem('Wedding Cake Live Resin Cart', 'vaporizer', 'Live Resin Cart', 'Wedding Cake', 'hybrid', 'pen-filled', 'manufacturing', 150, 'units', 'VZ-2026-036A', 86.8, 0.4, 'Fill Station', 18),

  // Loose Filled (2)
  makeItem('Blue Dream 510 Cart (QC)', 'vaporizer', 'Distillate Cart', 'Blue Dream', 'sativa', 'loose-filled', 'manufacturing', 100, 'units', 'VZ-2026-030', 90.0, 0.2, 'QC Station', 14),
  makeItem('OG Kush 510 Cart (QC)', 'vaporizer', 'Distillate Cart', 'OG Kush', 'indica', 'loose-filled', 'manufacturing', 80, 'units', 'VZ-2026-031', 89.5, 1.0, 'QC Station', 14),

  // Packagable (3)
  makeItem('Gorilla Glue 510 Cart', 'vaporizer', 'Distillate Cart', 'Gorilla Glue', 'hybrid', 'packagable', 'packaging', 120, 'units', 'VZ-2026-028', 88.0, 0.8, 'Pack Staging', 16),
  makeItem('GSC Disposable', 'vaporizer', 'Disposable', 'GSC', 'hybrid', 'packagable', 'packaging', 90, 'units', 'VZ-2026-029', 85.5, 0.6, 'Pack Staging', 14),
  makeItem('Zkittlez 510 Cart', 'vaporizer', 'Distillate Cart', 'Zkittlez', 'indica', 'packagable', 'packaging', 60, 'units', 'VZ-2026-027', 87.2, 0.5, 'Pack Staging', 15),

  // Packaged (3)
  makeItem('Gelato Live Resin Cart 1g', 'vaporizer', 'Live Resin Cart', 'Gelato', 'hybrid', 'packaged', 'packaging', 240, 'units', 'VZ-2026-024', 85.6, 0.5, 'Finished Goods', 32, { packagedDate: '2026-02-28' }),
  makeItem('Blue Dream 510 Cart 1g', 'vaporizer', 'Distillate Cart', 'Blue Dream', 'sativa', 'packaged', 'packaging', 180, 'units', 'VZ-2026-025', 90.0, 0.2, 'Finished Goods', 26, { packagedDate: '2026-02-27' }),
  makeItem('Sour Diesel Disposable 0.5g', 'vaporizer', 'Disposable', 'Sour Diesel', 'sativa', 'packaged', 'packaging', 160, 'units', 'VZ-2026-026', 88.1, 0.3, 'Finished Goods', 28, { packagedDate: '2026-02-26' }),
];

// --- Concentrate Inventory (15 items) ---

const concentrateItems: InventoryItem[] = [
  // Processing (3)
  makeItem('OG Kush Wax Processing', 'concentrate', 'Wax', 'OG Kush', 'indica', 'processing', 'manufacturing', 2000, 'grams', 'CN-2026-020', 78.5, 1.0, 'Extraction Lab', 12),
  makeItem('Gelato Live Resin Processing', 'concentrate', 'Live Resin', 'Gelato', 'hybrid', 'processing', 'manufacturing', 1500, 'grams', 'CN-2026-021', 82.3, 0.5, 'Extraction Lab', 18),
  makeItem('Wedding Cake Rosin Processing', 'concentrate', 'Live Rosin', 'Wedding Cake', 'hybrid', 'processing', 'manufacturing', 800, 'grams', 'CN-2026-022', 80.1, 0.4, 'Rosin Press', 28),

  // Clean Bulk (2)
  makeItem('Gorilla Glue Shatter Bulk', 'concentrate', 'Shatter', 'Gorilla Glue', 'hybrid', 'clean-bulk', 'manufacturing', 1200, 'grams', 'CN-2026-018', 84.6, 0.7, 'Clean Room', 16),
  makeItem('GSC Diamonds Bulk', 'concentrate', 'Diamonds', 'GSC', 'hybrid', 'clean-bulk', 'manufacturing', 600, 'grams', 'CN-2026-019', 92.1, 0.3, 'Clean Room', 30),

  // COA Pending (2)
  makeItem('OG Kush Shatter COA', 'concentrate', 'Shatter', 'OG Kush', 'indica', 'coa-pending', 'manufacturing', 800, 'grams', 'CN-2026-016', 85.2, 1.1, 'Lab Queue', 18),
  makeItem('Blue Dream Wax COA', 'concentrate', 'Wax', 'Blue Dream', 'sativa', 'coa-pending', 'manufacturing', 500, 'grams', 'CN-2026-017', 80.8, 0.3, 'Lab Queue', 14),

  // COA Passed (2)
  makeItem('Gelato Live Resin Packagable', 'concentrate', 'Live Resin', 'Gelato', 'hybrid', 'coa-passed', 'packaging', 400, 'grams', 'CN-2026-014', 83.0, 0.5, 'Pack Staging', 22),
  makeItem('Wedding Cake Live Rosin Pkg', 'concentrate', 'Live Rosin', 'Wedding Cake', 'hybrid', 'coa-passed', 'packaging', 300, 'grams', 'CN-2026-015', 81.5, 0.4, 'Pack Staging', 32),

  // Packagable (2)
  makeItem('OG Kush Wax 1g', 'concentrate', 'Wax', 'OG Kush', 'indica', 'packagable', 'packaging', 150, 'units', 'CN-2026-012', 78.5, 1.0, 'Pack Staging', 16),
  makeItem('Gorilla Glue Shatter 1g', 'concentrate', 'Shatter', 'Gorilla Glue', 'hybrid', 'packagable', 'packaging', 100, 'units', 'CN-2026-013', 84.6, 0.7, 'Pack Staging', 18),

  // Packaged (4)
  makeItem('Gelato Live Resin 1g', 'concentrate', 'Live Resin', 'Gelato', 'hybrid', 'packaged', 'packaging', 120, 'units', 'CN-2026-008', 83.0, 0.5, 'Finished Goods', 38, { packagedDate: '2026-02-28' }),
  makeItem('OG Kush Shatter 1g', 'concentrate', 'Shatter', 'OG Kush', 'indica', 'packaged', 'packaging', 100, 'units', 'CN-2026-009', 85.2, 1.1, 'Finished Goods', 28, { packagedDate: '2026-02-27' }),
  makeItem('Wedding Cake Live Rosin 1g', 'concentrate', 'Live Rosin', 'Wedding Cake', 'hybrid', 'packaged', 'packaging', 60, 'units', 'CN-2026-010', 81.5, 0.4, 'Finished Goods', 52, { packagedDate: '2026-02-26' }),
  makeItem('Gelato Diamonds 1g', 'concentrate', 'Diamonds', 'Gelato', 'hybrid', 'packaged', 'packaging', 48, 'units', 'CN-2026-011', 91.5, 0.3, 'Finished Goods', 48, { packagedDate: '2026-02-25' }),
];

// --- Preroll Inventory (12 items) ---

const prerollItems: InventoryItem[] = [
  // Rolling (3)
  makeItem('GSC Infused Prerolls (Rolling)', 'preroll', 'Infused', 'GSC', 'hybrid', 'rolling', 'manufacturing', 500, 'units', 'PR-2026-018', 24.5, 0.7, 'Roll Room 1', 4),
  makeItem('Wedding Cake Prerolls (Rolling)', 'preroll', 'Standard', 'Wedding Cake', 'hybrid', 'rolling', 'manufacturing', 400, 'units', 'PR-2026-019', 27.0, 0.5, 'Roll Room 1', 3),
  makeItem('Blue Dream Infused (Rolling)', 'preroll', 'Infused', 'Blue Dream', 'sativa', 'rolling', 'manufacturing', 300, 'units', 'PR-2026-020', 22.0, 0.4, 'Roll Room 2', 4),

  // Loose Rolled (3)
  makeItem('Jack Herer Prerolls (QC)', 'preroll', 'Standard', 'Jack Herer', 'sativa', 'loose-rolled', 'manufacturing', 300, 'units', 'PR-2026-016', 21.9, 0.8, 'QC Station', 3.5),
  makeItem('Gorilla Glue Prerolls (QC)', 'preroll', 'Standard', 'Gorilla Glue', 'hybrid', 'loose-rolled', 'manufacturing', 250, 'units', 'PR-2026-017', 26.0, 0.7, 'QC Station', 3),
  makeItem('OG Kush Prerolls (QC)', 'preroll', 'Standard', 'OG Kush', 'indica', 'loose-rolled', 'manufacturing', 200, 'units', 'PR-2026-015', 24.0, 1.1, 'QC Station', 3),

  // Packagable (2)
  makeItem('Wedding Cake Preroll 5-Pack', 'preroll', 'Standard 5pk', 'Wedding Cake', 'hybrid', 'packagable', 'packaging', 80, 'units', 'PR-2026-013', 27.0, 0.5, 'Pack Staging', 20),
  makeItem('GSC Infused Preroll 5-Pack', 'preroll', 'Infused 5pk', 'GSC', 'hybrid', 'packagable', 'packaging', 60, 'units', 'PR-2026-014', 24.5, 0.7, 'Pack Staging', 24),

  // Packaged (4)
  makeItem('Blue Dream Infused Preroll 1g', 'preroll', 'Infused', 'Blue Dream', 'sativa', 'packaged', 'packaging', 360, 'units', 'PR-2026-009', 22.0, 0.4, 'Finished Goods', 10, { packagedDate: '2026-02-28' }),
  makeItem('Wedding Cake Preroll 5-Pack', 'preroll', 'Standard 5pk', 'Wedding Cake', 'hybrid', 'packaged', 'packaging', 200, 'units', 'PR-2026-010', 27.0, 0.5, 'Finished Goods', 32, { packagedDate: '2026-02-27' }),
  makeItem('GSC Infused Preroll 5-Pack', 'preroll', 'Infused 5pk', 'GSC', 'hybrid', 'packaged', 'packaging', 150, 'units', 'PR-2026-011', 24.5, 0.7, 'Finished Goods', 38, { packagedDate: '2026-02-26' }),
  makeItem('Jack Herer Preroll 5-Pack', 'preroll', 'Standard 5pk', 'Jack Herer', 'sativa', 'packaged', 'packaging', 120, 'units', 'PR-2026-012', 21.9, 0.8, 'Finished Goods', 32, { packagedDate: '2026-02-25' }),
];

// --- Edible Inventory (6 items) ---

const edibleItems: InventoryItem[] = [
  makeItem('Watermelon Zkittlez Gummies 10pk', 'edible', 'Gummies', 'Zkittlez', 'indica', 'packaged', 'packaging', 400, 'units', 'ED-2026-012', undefined, undefined, 'Finished Goods', 14, { packagedDate: '2026-02-28' }),
  makeItem('Mango Gelato Gummies 10pk', 'edible', 'Gummies', 'Gelato', 'hybrid', 'packaged', 'packaging', 300, 'units', 'ED-2026-013', undefined, undefined, 'Finished Goods', 14, { packagedDate: '2026-02-27' }),
  makeItem('Dark Chocolate Bites 4pk', 'edible', 'Chocolates', 'Mixed', 'hybrid', 'packaged', 'packaging', 200, 'units', 'ED-2026-014', undefined, undefined, 'Finished Goods', 18, { packagedDate: '2026-02-26' }),
  makeItem('Sour Apple Gummies 10pk', 'edible', 'Gummies', 'Sour Apple', 'sativa', 'fulfillable', 'fulfillment', 150, 'units', 'ED-2026-010', undefined, undefined, 'Fulfillment Bay 3', 14),
  makeItem('Watermelon Zkittlez Gummies (Ready)', 'edible', 'Gummies', 'Zkittlez', 'indica', 'fulfillable', 'fulfillment', 180, 'units', 'ED-2026-011', undefined, undefined, 'Fulfillment Bay 3', 14),
  makeItem('Dark Chocolate Bites (Ready)', 'edible', 'Chocolates', 'Mixed', 'hybrid', 'fulfillable', 'fulfillment', 100, 'units', 'ED-2026-009', undefined, undefined, 'Fulfillment Bay 3', 18),
];

// --- Beverage Inventory (4 items) ---

const beverageItems: InventoryItem[] = [
  makeItem('Lemon Fizz CBD Seltzer 12oz', 'beverage', 'RTD Can', 'CBD Lemon', 'cbd', 'packaged', 'packaging', 480, 'units', 'BV-2026-004', undefined, 10.0, 'Cold Storage 1', 8, { packagedDate: '2026-02-28' }),
  makeItem('Blueberry Lemonade Seltzer 12oz', 'beverage', 'RTD Can', 'Blueberry', 'cbd', 'packaged', 'packaging', 360, 'units', 'BV-2026-005', undefined, 10.0, 'Cold Storage 1', 8, { packagedDate: '2026-02-27' }),
  makeItem('Lemon Fizz CBD Seltzer (Ready)', 'beverage', 'RTD Can', 'CBD Lemon', 'cbd', 'fulfillable', 'fulfillment', 200, 'units', 'BV-2026-002', undefined, 10.0, 'Fulfillment Bay 4', 8),
  makeItem('Berry Blast Powder Mix 5pk', 'beverage', 'Powder Mix', 'Berry', 'balanced', 'fulfillable', 'fulfillment', 120, 'units', 'BV-2026-003', 5.0, 5.0, 'Fulfillment Bay 4', 12),
];

// --- Combined ---

const allItems: InventoryItem[] = [
  ...flowerItems, ...vaporizerItems, ...concentrateItems,
  ...prerollItems, ...edibleItems, ...beverageItems,
];

// --- Metrics ---

function computeMetrics(): InventoryMetrics {
  const categoryCounts: Record<string, number> = {};
  let totalValue = 0;

  for (const item of allItems) {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    totalValue += item.value;
  }

  const stateMap = new Map<string, InventoryByState>();
  for (const item of allItems) {
    const key = `${item.division}-${item.readinessState}`;
    if (stateMap.has(key)) {
      stateMap.get(key)!.count++;
    } else {
      stateMap.set(key, {
        state: item.readinessState,
        label: item.readinessState.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        count: 1,
        division: item.division,
        color: DIVISION_COLORS[item.division] || '#94A3B8',
      });
    }
  }

  return {
    totalItems: allItems.length,
    totalValue,
    lowStockAlerts: 8,
    categoryCounts,
    stateDistribution: Array.from(stateMap.values()),
  };
}

const DIVISION_COLORS: Record<Division, string> = {
  cultivation: '#22C55E',
  manufacturing: '#10B981',
  packaging: '#84CC16',
  fulfillment: '#14B8A6',
  delivery: '#0EA5E9',
};

// --- Category Summary ---

function computeCategorySummary(): InventoryByCategory[] {
  const map = new Map<ProductCategory, { count: number; value: number }>();
  const labels: Record<ProductCategory, string> = {
    flower: 'Flower', preroll: 'Preroll', vaporizer: 'Vaporizer',
    concentrate: 'Concentrate', edible: 'Edible', beverage: 'Beverage',
  };

  for (const item of allItems) {
    const entry = map.get(item.category) || { count: 0, value: 0 };
    entry.count++;
    entry.value += item.value;
    map.set(item.category, entry);
  }

  const total = allItems.length;
  return (['flower', 'preroll', 'vaporizer', 'concentrate', 'edible', 'beverage'] as ProductCategory[]).map(
    (cat) => {
      const entry = map.get(cat) || { count: 0, value: 0 };
      return {
        category: cat,
        label: labels[cat],
        count: entry.count,
        value: entry.value,
        percentage: total > 0 ? Math.round((entry.count / total) * 100) : 0,
      };
    }
  );
}

// --- Pipeline Groups ---

function computePipelineGroups(): PipelineGroup[] {
  const divisionOrder: Division[] = ['cultivation', 'manufacturing', 'packaging', 'fulfillment', 'delivery'];
  const divisionLabels: Record<Division, string> = {
    cultivation: 'Cultivation', manufacturing: 'Manufacturing',
    packaging: 'Packaging', fulfillment: 'Fulfillment', delivery: 'Delivery',
  };

  return divisionOrder.map((div) => {
    const divItems = allItems.filter((i) => i.division === div);
    const stateMap = new Map<ReadinessState, number>();
    for (const i of divItems) {
      stateMap.set(i.readinessState, (stateMap.get(i.readinessState) || 0) + 1);
    }

    const states = Array.from(stateMap.entries()).map(([state, count]) => ({
      state,
      label: state.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      count,
    }));

    return {
      division: div,
      label: divisionLabels[div],
      color: DIVISION_COLORS[div],
      states,
      totalItems: divItems.length,
    };
  });
}

// --- Exports ---

export function getInventoryItems(filters?: InventoryFilter): Promise<InventoryItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...allItems];

      if (filters?.category) {
        result = result.filter((i) => i.category === filters.category);
      }
      if (filters?.subCategory) {
        result = result.filter((i) => i.subCategory === filters.subCategory);
      }
      if (filters?.strainType) {
        result = result.filter((i) => i.strainType === filters.strainType);
      }
      if (filters?.readinessState) {
        result = result.filter((i) => i.readinessState === filters.readinessState);
      }
      if (filters?.division) {
        result = result.filter((i) => i.division === filters.division);
      }
      if (filters?.thcRange) {
        result = result.filter(
          (i) =>
            i.thcPercent !== undefined &&
            i.thcPercent >= filters.thcRange!.min &&
            i.thcPercent <= filters.thcRange!.max
        );
      }
      if (filters?.cbdRange) {
        result = result.filter(
          (i) =>
            i.cbdPercent !== undefined &&
            i.cbdPercent >= filters.cbdRange!.min &&
            i.cbdPercent <= filters.cbdRange!.max
        );
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (i) =>
            i.productName.toLowerCase().includes(q) ||
            i.strainName.toLowerCase().includes(q) ||
            i.batchNumber.toLowerCase().includes(q) ||
            i.sku.toLowerCase().includes(q)
        );
      }

      resolve(result);
    }, 300);
  });
}

export function getInventoryMetrics(): Promise<InventoryMetrics> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(computeMetrics()), 300);
  });
}

export function getInventoryByState(): Promise<InventoryByState[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(computeMetrics().stateDistribution), 200);
  });
}

export function getInventoryByCategory(): Promise<InventoryByCategory[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(computeCategorySummary()), 200);
  });
}

export function getInventoryPipeline(): Promise<PipelineGroup[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(computePipelineGroups()), 300);
  });
}
