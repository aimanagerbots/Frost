import type {
  Product, Batch, Strain, QAResult, Discount, InventoryRoom,
  ProductLine, InventoryCategory, CatalogGroup, Backorder,
  QALot, QASample, EmployeeSample, Disposal, ProductTag,
  ConversionRule, ProductionRun, NonCannabisItem, ManageMenuRow,
} from '@/modules/inventory/types';

function p(o: Omit<Product, never>): Product { return o as Product; }
function b(o: Omit<Batch, never>): Batch { return o as Batch; }

// ─── Products (25 items) ──────────────────────────────────────────────────────
export const MOCK_PRODUCTS: Product[] = [
  p({ id: 'p-001', sku: 'FL-PP-3.5G', name: 'Premium Flower - Platinum Pineapple 3.5g', labelName: 'Platinum Pineapple 3.5g', inventoryType: 6, productLine: 'Premium Flower', subProductLine: 'Sativa', packageSize: '3.5g', labelTemplate: 'Standard Flower', strain: 'Platinum Pineapple', unitPrice: 45, expiryMonths: 12, catalogGroup: 'Retail', catalogName: 'Premium Flower Collection', category: 'flower', subCategory: 'Indoor', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Award-winning sativa dominant with tropical pineapple and citrus notes.', productDisclaimer: 'For use only by persons 21+. Keep out of reach of children.', images: [], overrideQaValues: false, qaValues: { cbd: 0.5, cbda: 0.6, thc: 28.4, thca: 31.2, total: 30.1 }, availableForSale: 144, allocated: 24, onHold: 12, totalInStock: 180, status: 'active' }),
  p({ id: 'p-002', sku: 'FL-GC-3.5G', name: 'Premium Flower - Green Crack 3.5g', labelName: 'Green Crack 3.5g', inventoryType: 6, productLine: 'Premium Flower', subProductLine: 'Sativa', packageSize: '3.5g', labelTemplate: 'Standard Flower', strain: 'Green Crack', unitPrice: 42, expiryMonths: 12, catalogGroup: 'Retail', catalogName: 'Premium Flower Collection', category: 'flower', subCategory: 'Indoor', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Classic energetic sativa with mango and citrus terpene profile.', productDisclaimer: 'For use only by persons 21+. Keep out of reach of children.', images: [], overrideQaValues: false, qaValues: { cbd: 0.4, cbda: 0.5, thc: 24.1, thca: 26.8, total: 25.9 }, availableForSale: 96, allocated: 36, onHold: 0, totalInStock: 132, status: 'active' }),
  p({ id: 'p-003', sku: 'FL-MB-3.5G', name: 'Premium Flower - Moonbow 3.5g', labelName: 'Moonbow 3.5g', inventoryType: 6, productLine: 'Premium Flower', subProductLine: 'Hybrid', packageSize: '3.5g', labelTemplate: 'Standard Flower', strain: 'Moonbow', unitPrice: 48, expiryMonths: 12, catalogGroup: 'Retail', catalogName: 'Premium Flower Collection', category: 'flower', subCategory: 'Indoor', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Exotic hybrid with notes of grape, berry, and gas. Dense frosty buds.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 0.3, cbda: 0.4, thc: 30.2, thca: 33.5, total: 32.1 }, availableForSale: 72, allocated: 12, onHold: 6, totalInStock: 90, status: 'active' }),
  p({ id: 'p-004', sku: 'FL-OC-3.5G', name: 'Premium Flower - Orange Crush 3.5g', labelName: 'Orange Crush 3.5g', inventoryType: 6, productLine: 'Premium Flower', subProductLine: 'Sativa', packageSize: '3.5g', labelTemplate: 'Standard Flower', strain: 'Orange Crush', unitPrice: 40, expiryMonths: 12, catalogGroup: 'Retail', catalogName: 'Premium Flower Collection', category: 'flower', subCategory: 'Indoor', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Bright citrus forward sativa with uplifting energetic effects.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 0.6, cbda: 0.7, thc: 22.8, thca: 25.3, total: 24.4 }, availableForSale: 120, allocated: 48, onHold: 0, totalInStock: 168, status: 'active' }),
  p({ id: 'p-005', sku: 'FL-SK-3.5G', name: 'Premium Flower - Skatalite 3.5g', labelName: 'Skatalite 3.5g', inventoryType: 6, productLine: 'Premium Flower', subProductLine: 'Indica', packageSize: '3.5g', labelTemplate: 'Standard Flower', strain: 'Skatalite', unitPrice: 44, expiryMonths: 12, catalogGroup: 'Retail', catalogName: 'Premium Flower Collection', category: 'flower', subCategory: 'Indoor', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Relaxing indica with earthy pine and sweet berry notes.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 0.8, cbda: 0.9, thc: 26.5, thca: 29.4, total: 28.2 }, availableForSale: 60, allocated: 18, onHold: 6, totalInStock: 84, status: 'active' }),
  p({ id: 'p-006', sku: 'FL-WF-3.5G', name: 'Premium Flower - White Fire OG 3.5g', labelName: 'White Fire OG 3.5g', inventoryType: 6, productLine: 'Premium Flower', subProductLine: 'Hybrid', packageSize: '3.5g', labelTemplate: 'Standard Flower', strain: 'White Fire OG', unitPrice: 46, expiryMonths: 12, catalogGroup: 'Retail', catalogName: 'Premium Flower Collection', category: 'flower', subCategory: 'Indoor', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Potent hybrid with fuel, earth, and sweet citrus aromas.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 0.4, cbda: 0.5, thc: 29.8, thca: 33.1, total: 31.5 }, availableForSale: 84, allocated: 24, onHold: 0, totalInStock: 108, status: 'active' }),
  p({ id: 'p-007', sku: 'FL-PP-7G', name: 'Premium Flower - Platinum Pineapple 7g', labelName: 'Platinum Pineapple 7g', inventoryType: 6, productLine: 'Premium Flower', subProductLine: 'Sativa', packageSize: '7g', labelTemplate: 'Standard Flower', strain: 'Platinum Pineapple', unitPrice: 80, expiryMonths: 12, catalogGroup: 'Retail', catalogName: 'Premium Flower Collection', category: 'flower', subCategory: 'Indoor', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Award-winning sativa in a larger 7g format.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 0.5, cbda: 0.6, thc: 28.4, thca: 31.2, total: 30.1 }, availableForSale: 48, allocated: 12, onHold: 0, totalInStock: 60, status: 'active' }),
  p({ id: 'p-008', sku: 'PR-PP-1G', name: 'RTM | Preroll Material - Platinum Pineapple 1g', labelName: 'Platinum Pineapple Preroll 1g', inventoryType: 28, productLine: 'RTM | Preroll Material', subProductLine: 'Sativa', packageSize: '1g', labelTemplate: 'Preroll', strain: 'Platinum Pineapple', unitPrice: 12, expiryMonths: 6, catalogGroup: 'Retail', catalogName: 'Preroll Collection', category: 'preroll', subCategory: 'Singles', minOrderLimit: 5, marketIncrementQuantity: 5, showAsDOHCompliant: true, productDescription: 'Single 1g preroll of premium Platinum Pineapple flower.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 0.5, cbda: 0.6, thc: 27.8, thca: 30.8, total: 29.5 }, availableForSale: 240, allocated: 60, onHold: 0, totalInStock: 300, status: 'active' }),
  p({ id: 'p-009', sku: 'PR-GC-1G', name: 'RTM | Preroll Material - Green Crack 1g', labelName: 'Green Crack Preroll 1g', inventoryType: 28, productLine: 'RTM | Preroll Material', subProductLine: 'Sativa', packageSize: '1g', labelTemplate: 'Preroll', strain: 'Green Crack', unitPrice: 11, expiryMonths: 6, catalogGroup: 'Retail', catalogName: 'Preroll Collection', category: 'preroll', subCategory: 'Singles', minOrderLimit: 5, marketIncrementQuantity: 5, showAsDOHCompliant: true, productDescription: 'Single 1g preroll of classic Green Crack.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 0.4, cbda: 0.5, thc: 23.5, thca: 26.1, total: 25.2 }, availableForSale: 180, allocated: 40, onHold: 20, totalInStock: 240, status: 'active' }),
  p({ id: 'p-010', sku: 'PR-MB-2PK', name: 'RTM | Preroll Material - Moonbow 2-Pack', labelName: 'Moonbow Preroll 2pk', inventoryType: 28, productLine: 'RTM | Preroll Material', subProductLine: 'Hybrid', packageSize: '2-pack 0.75g', labelTemplate: 'Preroll Multi', strain: 'Moonbow', unitPrice: 18, expiryMonths: 6, catalogGroup: 'Retail', catalogName: 'Preroll Collection', category: 'preroll', subCategory: 'Multi-Pack', minOrderLimit: 5, marketIncrementQuantity: 5, showAsDOHCompliant: true, productDescription: '2-pack of 0.75g Moonbow prerolls.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 0.3, cbda: 0.4, thc: 29.6, thca: 32.8, total: 31.4 }, availableForSale: 120, allocated: 24, onHold: 0, totalInStock: 144, status: 'active' }),
  p({ id: 'p-011', sku: 'CN-PP-LR1G', name: 'RTM | Hydrocarbon Concentrate - Platinum Pineapple Live Resin 1g', labelName: 'PP Live Resin 1g', inventoryType: 17, productLine: 'RTM | Extraction Material', subProductLine: 'Live Resin', packageSize: '1g', labelTemplate: 'Concentrate', strain: 'Platinum Pineapple', unitPrice: 55, expiryMonths: 18, catalogGroup: 'Retail', catalogName: 'Concentrate Collection', category: 'concentrate', subCategory: 'Live Resin', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Fresh-frozen live resin extraction. Full terpene profile preserved.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 1.2, cbda: 1.4, thc: 68.5, thca: 75.2, total: 74.1 }, availableForSale: 48, allocated: 12, onHold: 0, totalInStock: 60, status: 'active' }),
  p({ id: 'p-012', sku: 'CN-MB-BD1G', name: 'RTM | Hydrocarbon Concentrate - Moonbow Badder 1g', labelName: 'Moonbow Badder 1g', inventoryType: 17, productLine: 'RTM | Extraction Material', subProductLine: 'Badder', packageSize: '1g', labelTemplate: 'Concentrate', strain: 'Moonbow', unitPrice: 52, expiryMonths: 18, catalogGroup: 'Retail', catalogName: 'Concentrate Collection', category: 'concentrate', subCategory: 'Badder', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Whipped badder consistency. Exceptional flavor and potency.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 0.8, cbda: 0.9, thc: 72.3, thca: 79.8, total: 78.2 }, availableForSale: 36, allocated: 6, onHold: 0, totalInStock: 42, status: 'active' }),
  p({ id: 'p-013', sku: 'VP-GC-CART', name: 'RTM | Vaporizer - Green Crack Cart 1g', labelName: 'Green Crack Vape Cart 1g', inventoryType: 24, productLine: 'RTM | Vaporizer Material', subProductLine: '510 Cartridge', packageSize: '1g', labelTemplate: 'Cartridge', strain: 'Green Crack', unitPrice: 48, expiryMonths: 12, catalogGroup: 'Retail', catalogName: 'Vaporizer Collection', category: 'vaporizer', subCategory: '510 Cart', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'CO2 oil in a 510 thread ceramic cartridge.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 2.1, cbda: 0.3, thc: 80.4, thca: 2.2, total: 85.3 }, availableForSale: 0, allocated: 0, onHold: 0, totalInStock: 0, status: 'not-for-sale' }),
  p({ id: 'p-014', sku: 'ED-OC-GUM10', name: 'Solid Infused Edible - Orange Crush Gummies 10pk', labelName: 'Orange Crush Gummies 10pk', inventoryType: 22, productLine: 'Edible Line', subProductLine: 'Gummies', packageSize: '10-pack 10mg', labelTemplate: 'Edible Standard', strain: 'N/A', unitPrice: 25, expiryMonths: 6, catalogGroup: 'Retail', catalogName: 'Edible Collection', category: 'edible', subCategory: 'Gummies', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: '10 gummies at 10mg THC each. Orange citrus flavor.', productDisclaimer: 'For use only by persons 21+. Start low and go slow.', images: [], overrideQaValues: true, qaValues: { cbd: 0.0, cbda: 0.0, thc: 10.0, thca: 0.0, total: 10.0 }, availableForSale: 200, allocated: 30, onHold: 10, totalInStock: 240, status: 'active' }),
  p({ id: 'p-015', sku: 'BV-FS-TNC30', name: 'Tincture - Full Spectrum 1500mg 30ml', labelName: 'Full Spectrum Tincture 1500mg', inventoryType: 35, productLine: 'Wellness Line', subProductLine: 'Tinctures', packageSize: '30ml', labelTemplate: 'Tincture', strain: 'Blend', unitPrice: 65, expiryMonths: 24, catalogGroup: 'Retail', catalogName: 'Wellness Collection', category: 'beverage', subCategory: 'Tincture', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Full spectrum CO2 extracted tincture in MCT oil. 50mg THC per mL.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: true, qaValues: { cbd: 15.0, cbda: 0.0, thc: 50.0, thca: 0.0, total: 65.0 }, availableForSale: 80, allocated: 10, onHold: 0, totalInStock: 90, status: 'active' }),
  p({ id: 'p-016', sku: 'BDL-PP-3.5G', name: 'RTP | Budlets - Platinum Pineapple 3.5g', labelName: 'PP Budlets 3.5g', inventoryType: 6, productLine: 'RTP | Budlets', subProductLine: 'Sativa', packageSize: '3.5g', labelTemplate: 'Standard Flower', strain: 'Platinum Pineapple', unitPrice: 32, expiryMonths: 12, catalogGroup: 'Value', catalogName: 'Budlet Collection', category: 'flower', subCategory: 'Budlets', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Value-tier Budlets of Platinum Pineapple at 3.5g.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 0.4, cbda: 0.5, thc: 22.0, thca: 24.4, total: 23.3 }, availableForSale: 88, allocated: 16, onHold: 0, totalInStock: 104, status: 'active' }),
  p({ id: 'p-017', sku: 'BDL-MB-3.5G', name: 'RTP | Budlets - Moonbow 3.5g', labelName: 'Moonbow Budlets 3.5g', inventoryType: 6, productLine: 'RTP | Budlets', subProductLine: 'Hybrid', packageSize: '3.5g', labelTemplate: 'Standard Flower', strain: 'Moonbow', unitPrice: 34, expiryMonths: 12, catalogGroup: 'Value', catalogName: 'Budlet Collection', category: 'flower', subCategory: 'Budlets', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Value-tier Moonbow Budlets at 3.5g.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 0.3, cbda: 0.4, thc: 25.0, thca: 27.7, total: 26.5 }, availableForSale: 64, allocated: 8, onHold: 0, totalInStock: 72, status: 'active' }),
  p({ id: 'p-018', sku: 'BDL-OC-3.5G', name: 'RTP | Budlets - Orange Crush 3.5g', labelName: 'Orange Crush Budlets 3.5g', inventoryType: 6, productLine: 'RTP | Budlets', subProductLine: 'Sativa', packageSize: '3.5g', labelTemplate: 'Standard Flower', strain: 'Orange Crush', unitPrice: 30, expiryMonths: 12, catalogGroup: 'Value', catalogName: 'Budlet Collection', category: 'flower', subCategory: 'Budlets', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Value-tier Orange Crush Budlets at 3.5g.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 0.6, cbda: 0.7, thc: 19.8, thca: 22.0, total: 21.1 }, availableForSale: 0, allocated: 0, onHold: 0, totalInStock: 0, status: 'not-for-sale' }),
  p({ id: 'p-019', sku: 'BDL-SK-3.5G', name: 'RTP | Budlets - Skatalite 3.5g', labelName: 'Skatalite Budlets 3.5g', inventoryType: 6, productLine: 'RTP | Budlets', subProductLine: 'Indica', packageSize: '3.5g', labelTemplate: 'Standard Flower', strain: 'Skatalite', unitPrice: 33, expiryMonths: 12, catalogGroup: 'Value', catalogName: 'Budlet Collection', category: 'flower', subCategory: 'Budlets', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Value-tier Skatalite Budlets at 3.5g.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 0.7, cbda: 0.8, thc: 23.4, thca: 26.0, total: 24.8 }, availableForSale: 56, allocated: 8, onHold: 4, totalInStock: 68, status: 'active' }),
  p({ id: 'p-020', sku: 'CN-WF-ROS1G', name: 'RTM | Fresh Frozen - White Fire OG Rosin 1g', labelName: 'WFO Live Rosin 1g', inventoryType: 38, productLine: 'RTM | Extraction Material', subProductLine: 'Rosin', packageSize: '1g', labelTemplate: 'Concentrate', strain: 'White Fire OG', unitPrice: 70, expiryMonths: 18, catalogGroup: 'Retail', catalogName: 'Concentrate Collection', category: 'concentrate', subCategory: 'Live Rosin', minOrderLimit: 1, marketIncrementQuantity: 1, showAsDOHCompliant: true, productDescription: 'Solventless live rosin from fresh-frozen White Fire OG.', productDisclaimer: 'For use only by persons 21+.', images: [], overrideQaValues: false, qaValues: { cbd: 0.6, cbda: 0.8, thc: 65.4, thca: 72.1, total: 70.2 }, availableForSale: 24, allocated: 6, onHold: 0, totalInStock: 30, status: 'active' }),
];

// ─── Batches (12 items) ───────────────────────────────────────────────────────
export const MOCK_BATCHES: Batch[] = [
  b({ id: 'b-001', barcode: 'GF41598605597285', productName: 'Premium Flower - Platinum Pineapple', room: 'Vault A', batchDate: '2026-02-15', qaStatus: 'passed', available: 144, unitsForSale: 144, unitsOnHold: 12, unitsAllocated: 24, unitsInStock: 180, status: 'available' }),
  b({ id: 'b-002', barcode: 'GF41598605545594', productName: 'Premium Flower - Green Crack', room: 'Vault A', batchDate: '2026-02-18', qaStatus: 'passed', available: 96, unitsForSale: 96, unitsOnHold: 0, unitsAllocated: 36, unitsInStock: 132, status: 'available' }),
  b({ id: 'b-003', barcode: 'WA.J415BB6.IN2NAB', productName: 'Premium Flower - Moonbow', room: 'Vault B', batchDate: '2026-02-20', qaStatus: 'passed', available: 72, unitsForSale: 72, unitsOnHold: 6, unitsAllocated: 12, unitsInStock: 90, status: 'available' }),
  b({ id: 'b-004', barcode: 'GF41598605601122', productName: 'RTM | Preroll Material - Platinum Pineapple', room: 'Pack Staging', batchDate: '2026-02-22', qaStatus: 'passed', available: 240, unitsForSale: 240, unitsOnHold: 0, unitsAllocated: 60, unitsInStock: 300, status: 'available' }),
  b({ id: 'b-005', barcode: 'GF41598605611233', productName: 'RTM | Hydrocarbon Concentrate - PP Live Resin', room: 'Cold Storage', batchDate: '2026-02-10', qaStatus: 'passed', available: 48, unitsForSale: 48, unitsOnHold: 0, unitsAllocated: 12, unitsInStock: 60, status: 'available' }),
  b({ id: 'b-006', barcode: 'GF41598605622344', productName: 'Premium Flower - Orange Crush', room: 'Vault A', batchDate: '2026-02-25', qaStatus: null, available: 0, unitsForSale: 0, unitsOnHold: 0, unitsAllocated: 0, unitsInStock: 120, status: 'not-for-sale' }),
  b({ id: 'b-007', barcode: 'GF41598605633455', productName: 'RTM | Vaporizer - Green Crack Cart', room: 'Cold Storage', batchDate: '2026-01-30', qaStatus: 'failed', available: 0, unitsForSale: 0, unitsOnHold: 0, unitsAllocated: 0, unitsInStock: 0, status: 'excluded' }),
  b({ id: 'b-008', barcode: 'GF41598605644566', productName: 'Edible - Orange Crush Gummies', room: 'Pack Staging', batchDate: '2026-02-28', qaStatus: 'passed', available: 200, unitsForSale: 200, unitsOnHold: 10, unitsAllocated: 30, unitsInStock: 240, status: 'available' }),
  b({ id: 'b-009', barcode: 'GF41598605655677', productName: 'Premium Flower - Skatalite', room: 'Vault B', batchDate: '2026-02-12', qaStatus: 'passed', available: 60, unitsForSale: 60, unitsOnHold: 6, unitsAllocated: 18, unitsInStock: 84, status: 'available' }),
  b({ id: 'b-010', barcode: 'GF41598605666788', productName: 'RTM | Preroll Material - Green Crack', room: 'Pack Staging', batchDate: '2026-02-24', qaStatus: 'pending', available: 0, unitsForSale: 0, unitsOnHold: 20, unitsAllocated: 40, unitsInStock: 240, status: 'not-for-sale' }),
  b({ id: 'b-011', barcode: 'GF41598605677899', productName: 'Tincture - Full Spectrum 1500mg', room: 'Cold Storage', batchDate: '2026-01-20', qaStatus: 'passed', available: 80, unitsForSale: 80, unitsOnHold: 0, unitsAllocated: 10, unitsInStock: 90, status: 'available' }),
  b({ id: 'b-012', barcode: 'GF41598605688900', productName: 'Budlets - White Fire OG', room: 'Vault A', batchDate: '2026-03-01', qaStatus: null, available: 0, unitsForSale: 0, unitsOnHold: 0, unitsAllocated: 0, unitsInStock: 0, status: 'not-for-sale' }),
];

// ─── Strains (16 items) ───────────────────────────────────────────────────────
export const MOCK_STRAINS: Strain[] = [
  { id: 's-001', name: 'Platinum Pineapple', image: null, isActive: true },
  { id: 's-002', name: 'Green Crack', image: null, isActive: true },
  { id: 's-003', name: 'Moonbow', image: null, isActive: true },
  { id: 's-004', name: 'Orange Crush', image: null, isActive: true },
  { id: 's-005', name: 'Skatalite', image: null, isActive: true },
  { id: 's-006', name: 'White Fire OG', image: null, isActive: true },
  { id: 's-007', name: 'Wedding Cake', image: null, isActive: true },
  { id: 's-008', name: 'Blue Dream', image: null, isActive: true },
  { id: 's-009', name: 'Gorilla Glue #4', image: null, isActive: true },
  { id: 's-010', name: 'OG Kush', image: null, isActive: true },
  { id: 's-011', name: 'GSC (Girl Scout Cookies)', image: null, isActive: true },
  { id: 's-012', name: 'Zkittlez', image: null, isActive: true },
  { id: 's-013', name: 'Jack Herer', image: null, isActive: false },
  { id: 's-014', name: 'Gelato', image: null, isActive: false },
  { id: 's-015', name: 'Chemdawg', image: null, isActive: false },
  { id: 's-016', name: 'Sour Diesel', image: null, isActive: false },
];

// ─── QA Results (12 items) ────────────────────────────────────────────────────
export const MOCK_QA_RESULTS: QAResult[] = [
  { id: 'qa-001', qaLot: 'GF41598605597285', subLot: 'GF41598605597285-A', status: 'passed', inventoryType: 6, strain: 'Platinum Pineapple', dateOfManufacture: '2026-02-15', dateOfHarvest: '2026-01-28', cbd: 0.5, cbda: 0.6, thc: 28.4, thca: 31.2, total: 30.1, pdfUrl: '/coa/GF41598605597285.pdf', changedBy: 'Sarah K.', dateChanged: '2026-02-20' },
  { id: 'qa-002', qaLot: 'GF41598605545594', subLot: 'GF41598605545594-A', status: 'passed', inventoryType: 6, strain: 'Green Crack', dateOfManufacture: '2026-02-18', dateOfHarvest: '2026-02-01', cbd: 0.4, cbda: 0.5, thc: 24.1, thca: 26.8, total: 25.9, pdfUrl: '/coa/GF41598605545594.pdf', changedBy: 'Sarah K.', dateChanged: '2026-02-23' },
  { id: 'qa-003', qaLot: 'WA.J415BB6.IN2NAB', subLot: 'WA.J415BB6.IN2NAB-A', status: 'passed', inventoryType: 6, strain: 'Moonbow', dateOfManufacture: '2026-02-20', dateOfHarvest: '2026-02-03', cbd: 0.3, cbda: 0.4, thc: 30.2, thca: 33.5, total: 32.1, pdfUrl: '/coa/WA.J415BB6.IN2NAB.pdf', changedBy: 'Mike T.', dateChanged: '2026-02-25' },
  { id: 'qa-004', qaLot: 'GF41598605611233', subLot: 'GF41598605611233-A', status: 'passed', inventoryType: 17, strain: 'Platinum Pineapple', dateOfManufacture: '2026-02-10', dateOfHarvest: '2026-01-15', cbd: 1.2, cbda: 1.4, thc: 68.5, thca: 75.2, total: 74.1, pdfUrl: '/coa/GF41598605611233.pdf', changedBy: 'Sarah K.', dateChanged: '2026-02-15' },
  { id: 'qa-005', qaLot: 'GF41598605622344', subLot: 'GF41598605622344-A', status: 'pending', inventoryType: 6, strain: 'Orange Crush', dateOfManufacture: '2026-02-25', dateOfHarvest: '2026-02-08', cbd: 0, cbda: 0, thc: 0, thca: 0, total: 0, pdfUrl: null, changedBy: '—', dateChanged: '2026-03-01' },
  { id: 'qa-006', qaLot: 'GF41598605633455', subLot: 'GF41598605633455-A', status: 'failed', inventoryType: 24, strain: 'Green Crack', dateOfManufacture: '2026-01-30', dateOfHarvest: '2026-01-10', cbd: 2.1, cbda: 0.3, thc: 78.4, thca: 2.2, total: 82.3, pdfUrl: '/coa/GF41598605633455.pdf', changedBy: 'Mike T.', dateChanged: '2026-02-05' },
  { id: 'qa-007', qaLot: 'GF41598605644566', subLot: 'GF41598605644566-A', status: 'passed', inventoryType: 22, strain: 'N/A', dateOfManufacture: '2026-02-28', dateOfHarvest: '—', cbd: 0.0, cbda: 0.0, thc: 10.0, thca: 0.0, total: 10.0, pdfUrl: '/coa/GF41598605644566.pdf', changedBy: 'Sarah K.', dateChanged: '2026-03-05' },
  { id: 'qa-008', qaLot: 'GF41598605655677', subLot: 'GF41598605655677-A', status: 'passed', inventoryType: 6, strain: 'Skatalite', dateOfManufacture: '2026-02-12', dateOfHarvest: '2026-01-25', cbd: 0.8, cbda: 0.9, thc: 26.5, thca: 29.4, total: 28.2, pdfUrl: '/coa/GF41598605655677.pdf', changedBy: 'Mike T.', dateChanged: '2026-02-18' },
  { id: 'qa-009', qaLot: 'GF41598605666788', subLot: 'GF41598605666788-A', status: 'pending', inventoryType: 28, strain: 'Green Crack', dateOfManufacture: '2026-02-24', dateOfHarvest: '2026-02-05', cbd: 0, cbda: 0, thc: 0, thca: 0, total: 0, pdfUrl: null, changedBy: '—', dateChanged: '2026-03-02' },
  { id: 'qa-010', qaLot: 'GF41598605677899', subLot: 'GF41598605677899-A', status: 'passed', inventoryType: 35, strain: 'Blend', dateOfManufacture: '2026-01-20', dateOfHarvest: '—', cbd: 15.0, cbda: 0.0, thc: 50.0, thca: 0.0, total: 65.0, pdfUrl: '/coa/GF41598605677899.pdf', changedBy: 'Sarah K.', dateChanged: '2026-01-28' },
  { id: 'qa-011', qaLot: 'GF41598605688900', subLot: 'GF41598605688900-A', status: 'passed', inventoryType: 6, strain: 'White Fire OG', dateOfManufacture: '2026-03-01', dateOfHarvest: '2026-02-12', cbd: 0.4, cbda: 0.5, thc: 29.8, thca: 33.1, total: 31.5, pdfUrl: '/coa/GF41598605688900.pdf', changedBy: 'Mike T.', dateChanged: '2026-03-06' },
  { id: 'qa-012', qaLot: 'GF41598605699011', subLot: 'GF41598605699011-A', status: 'pending', inventoryType: 6, strain: 'Skatalite', dateOfManufacture: '2026-03-05', dateOfHarvest: '2026-02-18', cbd: 0, cbda: 0, thc: 0, thca: 0, total: 0, pdfUrl: null, changedBy: '—', dateChanged: '2026-03-10' },
];

// ─── Discounts (6 items) ──────────────────────────────────────────────────────
export const MOCK_DISCOUNTS: Discount[] = [
  { id: 'd-001', name: 'Spring Launch 10%', fromDate: '2026-03-01', toDate: '2026-03-31', discountType: 'percent', discountAmount: 10, description: 'Spring launch promotion for all retail accounts.', appliesToAllProducts: true, appliesToAllClients: true, status: 'active' },
  { id: 'd-002', name: 'Premium Flower $5 Off', fromDate: '2026-03-10', toDate: '2026-03-20', discountType: 'amount', discountAmount: 5, description: 'Flash sale on premium flower line.', appliesToAllProducts: false, appliesToAllClients: true, status: 'active' },
  { id: 'd-003', name: 'New Account Welcome 15%', fromDate: '2026-01-01', toDate: '2026-12-31', discountType: 'percent', discountAmount: 15, description: 'Welcome discount for newly onboarded retail accounts.', appliesToAllProducts: true, appliesToAllClients: false, status: 'active' },
  { id: 'd-004', name: 'Q1 Closeout 20%', fromDate: '2026-02-01', toDate: '2026-02-28', discountType: 'percent', discountAmount: 20, description: 'End of Q1 clearance on slow-moving SKUs.', appliesToAllProducts: false, appliesToAllClients: true, status: 'expired' },
  { id: 'd-005', name: 'Concentrate Bundle $10 Off', fromDate: '2026-04-01', toDate: '2026-04-15', discountType: 'amount', discountAmount: 10, description: 'Upcoming concentrate promotion for April.', appliesToAllProducts: false, appliesToAllClients: true, status: 'upcoming' },
  { id: 'd-006', name: 'Loyalty 5%', fromDate: '2026-01-01', toDate: '2026-12-31', discountType: 'percent', discountAmount: 5, description: 'Ongoing loyalty discount for accounts with 12+ month history.', appliesToAllProducts: true, appliesToAllClients: false, status: 'active' },
];

// ─── Inventory Rooms (8 items) ────────────────────────────────────────────────
export const MOCK_ROOMS: InventoryRoom[] = [
  { id: 'r-001', name: 'Greenhouse A', roomType: 'grow', capacity: 200, currentOccupancy: 90, assignedBatches: 3 },
  { id: 'r-002', name: 'Greenhouse B', roomType: 'grow', capacity: 200, currentOccupancy: 60, assignedBatches: 2 },
  { id: 'r-003', name: 'Greenhouse C', roomType: 'grow', capacity: 150, currentOccupancy: 30, assignedBatches: 1 },
  { id: 'r-004', name: 'Dry Room 1', roomType: 'dry', capacity: 50, currentOccupancy: 24, assignedBatches: 2 },
  { id: 'r-005', name: 'Dry Room 2', roomType: 'dry', capacity: 50, currentOccupancy: 18, assignedBatches: 1 },
  { id: 'r-006', name: 'Cure Room A', roomType: 'cure', capacity: 40, currentOccupancy: 30, assignedBatches: 2 },
  { id: 'r-007', name: 'Vault A', roomType: 'storage', capacity: 500, currentOccupancy: 300, assignedBatches: 4 },
  { id: 'r-008', name: 'Pack Staging', roomType: 'staging', capacity: 200, currentOccupancy: 120, assignedBatches: 3 },
];

// ─── Product Lines (6 items) ──────────────────────────────────────────────────
export const MOCK_PRODUCT_LINES: ProductLine[] = [
  { id: 'pl-001', name: 'Premium Flower', subLines: ['Sativa', 'Indica', 'Hybrid'], activeProducts: 6 },
  { id: 'pl-002', name: 'RTP | Budlets', subLines: ['Sativa', 'Indica', 'Hybrid'], activeProducts: 4 },
  { id: 'pl-003', name: 'RTM | Preroll Material', subLines: ['Sativa', 'Indica', 'Hybrid', 'Multi-Pack'], activeProducts: 3 },
  { id: 'pl-004', name: 'RTM | Extraction Material', subLines: ['Live Resin', 'Badder', 'Rosin', 'Kief'], activeProducts: 3 },
  { id: 'pl-005', name: 'RTM | Vaporizer Material', subLines: ['510 Cartridge', 'All-In-One', 'Pod'], activeProducts: 1 },
  { id: 'pl-006', name: 'Wellness Line', subLines: ['Tinctures', 'Capsules', 'Topicals'], activeProducts: 2 },
];

// ─── Categories (6 items) ─────────────────────────────────────────────────────
export const MOCK_CATEGORIES: InventoryCategory[] = [
  { id: 'cat-001', name: 'Flower', inventoryType: 6, activeProducts: 11 },
  { id: 'cat-002', name: 'Preroll', inventoryType: 28, activeProducts: 3 },
  { id: 'cat-003', name: 'Vaporizer', inventoryType: 24, activeProducts: 1 },
  { id: 'cat-004', name: 'Concentrate', inventoryType: 17, activeProducts: 3 },
  { id: 'cat-005', name: 'Edible', inventoryType: 22, activeProducts: 1 },
  { id: 'cat-006', name: 'Beverage / Tincture', inventoryType: 35, activeProducts: 1 },
];

// ─── Catalog Groups (4 items) ─────────────────────────────────────────────────
export const MOCK_CATALOG_GROUPS: CatalogGroup[] = [
  { id: 'cg-001', groupName: 'Retail Catalog', catalogName: 'Main Retail', productCount: 20, active: true },
  { id: 'cg-002', groupName: 'Premium Collection', catalogName: 'Premium Flower Collection', productCount: 6, active: true },
  { id: 'cg-003', groupName: 'Value Line', catalogName: 'Budlet Collection', productCount: 4, active: true },
  { id: 'cg-004', groupName: 'Wellness', catalogName: 'Wellness Collection', productCount: 2, active: false },
];

// ─── Backorders (5 items) ─────────────────────────────────────────────────────
export const MOCK_BACKORDERS: Backorder[] = [
  { id: 'bo-001', orderNumber: 'ORD-2026-0441', clientName: 'Zoobees Doobees', productName: 'Premium Flower - Moonbow 3.5g', qtyOrdered: 48, qtyAvailable: 24, fulfillmentPriority: 'fifo', dateCreated: '2026-03-08', expectedFulfillment: '2026-03-15', qaStatus: 'passed', status: 'partial' },
  { id: 'bo-002', orderNumber: 'ORD-2026-0442', clientName: 'Green Harbor Dispensary', productName: 'RTM | Vaporizer - Green Crack Cart 1g', qtyOrdered: 60, qtyAvailable: 0, fulfillmentPriority: 'fifo', dateCreated: '2026-03-09', expectedFulfillment: '2026-03-20', qaStatus: 'failed', status: 'pending' },
  { id: 'bo-003', orderNumber: 'ORD-2026-0443', clientName: 'Northern Leaf', productName: 'RTM | Preroll Material - Green Crack 1g', qtyOrdered: 120, qtyAvailable: 120, fulfillmentPriority: 'highest-qa', dateCreated: '2026-03-05', expectedFulfillment: '2026-03-12', qaStatus: 'passed', status: 'fulfilled' },
  { id: 'bo-004', orderNumber: 'ORD-2026-0444', clientName: 'Cascade Cannabis Co.', productName: 'Edible - Orange Crush Gummies 10pk', qtyOrdered: 80, qtyAvailable: 40, fulfillmentPriority: 'fifo', dateCreated: '2026-03-10', expectedFulfillment: '2026-03-18', qaStatus: 'passed', status: 'partial' },
  { id: 'bo-005', orderNumber: 'ORD-2026-0445', clientName: 'Pine Street Provisioning', productName: 'Tincture - Full Spectrum 1500mg', qtyOrdered: 30, qtyAvailable: 0, fulfillmentPriority: 'newest-first', dateCreated: '2026-03-11', expectedFulfillment: '2026-03-22', qaStatus: 'pending', status: 'pending' },
];

// ─── QA Lots (8 items) ────────────────────────────────────────────────────────
export const MOCK_QA_LOTS: QALot[] = [
  { id: 'ql-001', lotNumber: 'GF41598605597285', assignedBatches: 2, testLab: 'Confidence Analytics', submittedDate: '2026-02-16', resultStatus: 'passed', expirationDate: '2027-02-16' },
  { id: 'ql-002', lotNumber: 'GF41598605545594', assignedBatches: 1, testLab: 'SC Labs WA', submittedDate: '2026-02-19', resultStatus: 'passed', expirationDate: '2027-02-19' },
  { id: 'ql-003', lotNumber: 'WA.J415BB6.IN2NAB', assignedBatches: 1, testLab: 'Confidence Analytics', submittedDate: '2026-02-21', resultStatus: 'passed', expirationDate: '2027-02-21' },
  { id: 'ql-004', lotNumber: 'GF41598605622344', assignedBatches: 1, testLab: 'SC Labs WA', submittedDate: '2026-03-01', resultStatus: 'pending', expirationDate: '—' },
  { id: 'ql-005', lotNumber: 'GF41598605633455', assignedBatches: 1, testLab: 'Confidence Analytics', submittedDate: '2026-01-31', resultStatus: 'failed', expirationDate: '—' },
  { id: 'ql-006', lotNumber: 'GF41598605644566', assignedBatches: 1, testLab: 'Phytalab WA', submittedDate: '2026-03-01', resultStatus: 'passed', expirationDate: '2026-09-01' },
  { id: 'ql-007', lotNumber: 'GF41598605666788', assignedBatches: 1, testLab: 'SC Labs WA', submittedDate: '2026-03-02', resultStatus: 'pending', expirationDate: '—' },
  { id: 'ql-008', lotNumber: 'GF41598605699011', assignedBatches: 1, testLab: 'Confidence Analytics', submittedDate: '2026-03-06', resultStatus: 'pending', expirationDate: '—' },
];

// ─── QA Samples (6 items) ─────────────────────────────────────────────────────
export const MOCK_QA_SAMPLES: QASample[] = [
  { id: 'qs-001', sampleId: 'SMPL-2026-0301', productName: 'Premium Flower - Orange Crush', batchNumber: 'GF41598605622344', lab: 'SC Labs WA', submissionDate: '2026-03-01', expectedReturn: '2026-03-08', status: 'in-testing' },
  { id: 'qs-002', sampleId: 'SMPL-2026-0302', productName: 'RTM | Preroll Material - Green Crack', batchNumber: 'GF41598605666788', lab: 'Confidence Analytics', submissionDate: '2026-03-02', expectedReturn: '2026-03-09', status: 'in-testing' },
  { id: 'qs-003', sampleId: 'SMPL-2026-0303', productName: 'Premium Flower - Skatalite', batchNumber: 'GF41598605699011', lab: 'Confidence Analytics', submissionDate: '2026-03-06', expectedReturn: '2026-03-13', status: 'submitted' },
  { id: 'qs-004', sampleId: 'SMPL-2026-0285', productName: 'Premium Flower - Platinum Pineapple', batchNumber: 'GF41598605597285', lab: 'SC Labs WA', submissionDate: '2026-02-16', expectedReturn: '2026-02-23', status: 'passed' },
  { id: 'qs-005', sampleId: 'SMPL-2026-0277', productName: 'RTM | Vaporizer - Green Crack Cart', batchNumber: 'GF41598605633455', lab: 'Confidence Analytics', submissionDate: '2026-01-31', expectedReturn: '2026-02-07', status: 'failed' },
  { id: 'qs-006', sampleId: 'SMPL-2026-0290', productName: 'Edible - Orange Crush Gummies', batchNumber: 'GF41598605644566', lab: 'Phytalab WA', submissionDate: '2026-03-01', expectedReturn: '2026-03-07', status: 'passed' },
];

// ─── Employee Samples (5 items) ───────────────────────────────────────────────
export const MOCK_EMPLOYEE_SAMPLES: EmployeeSample[] = [
  { id: 'es-001', employeeName: 'Jake Torres', productSampled: 'Premium Flower - Platinum Pineapple 3.5g', date: '2026-03-10', quantity: 1, purpose: 'quality-control', approvedBy: 'Manager: Lisa Chen' },
  { id: 'es-002', employeeName: 'Maria Vasquez', productSampled: 'Edible - Orange Crush Gummies 10pk', date: '2026-03-09', quantity: 1, purpose: 'education', approvedBy: 'Manager: Lisa Chen' },
  { id: 'es-003', employeeName: 'Devon Reed', productSampled: 'RTM | Hydrocarbon Concentrate - PP Live Resin 1g', date: '2026-03-08', quantity: 1, purpose: 'quality-control', approvedBy: 'Manager: Tom Park' },
  { id: 'es-004', employeeName: 'Kenji Nakamura', productSampled: 'Premium Flower - Moonbow 3.5g', date: '2026-03-07', quantity: 1, purpose: 'demo', approvedBy: 'Manager: Tom Park' },
  { id: 'es-005', employeeName: 'Aisha Johnson', productSampled: 'Tincture - Full Spectrum 1500mg 30ml', date: '2026-03-06', quantity: 1, purpose: 'education', approvedBy: 'Manager: Lisa Chen' },
];

// ─── Disposals (5 items) ──────────────────────────────────────────────────────
export const MOCK_DISPOSALS: Disposal[] = [
  { id: 'dis-001', disposalId: 'DSP-2026-0041', productName: 'RTM | Vaporizer - Green Crack Cart 1g', batchNumber: 'GF41598605633455', quantity: 60, unit: 'units', disposalReason: 'compliance', disposalMethod: 'On-Site Compost', date: '2026-02-10', employee: 'Mike T.', witness: 'Sarah K.' },
  { id: 'dis-002', disposalId: 'DSP-2026-0035', productName: 'Trim Waste - Platinum Pineapple', batchNumber: 'B2026-0280', quantity: 2.5, unit: 'lbs', disposalReason: 'waste', disposalMethod: 'Licensed Waste Hauler', date: '2026-02-05', employee: 'Jake T.', witness: 'Devon R.' },
  { id: 'dis-003', disposalId: 'DSP-2026-0028', productName: 'Premium Flower - Gorilla Glue Damaged', batchNumber: 'B2026-0281', quantity: 12, unit: 'units', disposalReason: 'damage', disposalMethod: 'On-Site Compost', date: '2026-01-28', employee: 'Sarah K.', witness: 'Mike T.' },
  { id: 'dis-004', disposalId: 'DSP-2026-0020', productName: 'Preroll - OG Kush 1g (Expired)', batchNumber: 'B2026-0200', quantity: 24, unit: 'units', disposalReason: 'expiration', disposalMethod: 'Licensed Waste Hauler', date: '2026-01-20', employee: 'Devon R.', witness: 'Jake T.' },
  { id: 'dis-005', disposalId: 'DSP-2026-0015', productName: 'Fan Leaf / Stem Waste', batchNumber: 'B2026-0270', quantity: 5.2, unit: 'lbs', disposalReason: 'waste', disposalMethod: 'On-Site Compost', date: '2026-01-15', employee: 'Mike T.', witness: 'Sarah K.' },
];

// ─── Product Tags (6 items) ───────────────────────────────────────────────────
export const MOCK_PRODUCT_TAGS: ProductTag[] = [
  { id: 'pt-001', name: 'Staff Pick', color: '#8B5CF6', assignedProducts: 4 },
  { id: 'pt-002', name: 'New Arrival', color: '#22C55E', assignedProducts: 3 },
  { id: 'pt-003', name: 'Limited Run', color: '#F59E0B', assignedProducts: 2 },
  { id: 'pt-004', name: 'DOH Compliant', color: '#3B82F6', assignedProducts: 19 },
  { id: 'pt-005', name: 'Featured', color: '#EC4899', assignedProducts: 5 },
  { id: 'pt-006', name: 'Clearance', color: '#EF4444', assignedProducts: 1 },
];

// ─── Conversion Rules (4 items) ───────────────────────────────────────────────
export const MOCK_CONVERSIONS: ConversionRule[] = [
  { id: 'cv-001', fromProduct: 'Flower Lot (Bulk Lbs)', toProduct: 'Premium Flower 3.5g Units', conversionRatio: 130.06, unit: 'lbs → units', active: true },
  { id: 'cv-002', fromProduct: 'Flower Lot (Bulk Lbs)', toProduct: 'Preroll 1g Units', conversionRatio: 453.6, unit: 'lbs → units', active: true },
  { id: 'cv-003', fromProduct: 'Concentrate (Bulk g)', toProduct: 'Vaporizer Cart 1g Units', conversionRatio: 0.9, unit: 'g → units', active: true },
  { id: 'cv-004', fromProduct: 'Flower Lot (Bulk Lbs)', toProduct: 'Budlets 3.5g Units', conversionRatio: 130.06, unit: 'lbs → units', active: false },
];

// ─── Production Runs (5 items) ────────────────────────────────────────────────
export const MOCK_PRODUCTION_RUNS: ProductionRun[] = [
  { id: 'pr-001', runId: 'PRD-2026-0041', productName: 'Preroll - Platinum Pineapple 1g (300 units)', bomComponents: ['Flower: PP 300g', 'Tubes: 300x', 'Labels: 300x'], quantityProduced: 300, date: '2026-03-08', status: 'complete' },
  { id: 'pr-002', runId: 'PRD-2026-0042', productName: 'Gummies - Orange Crush 10pk (200 units)', bomComponents: ['THC Distillate: 20g', 'Gummy Base: 4kg', 'Packaging: 200x'], quantityProduced: 200, date: '2026-03-09', status: 'complete' },
  { id: 'pr-003', runId: 'PRD-2026-0043', productName: 'Flower - Moonbow 3.5g (72 units)', bomComponents: ['Flower: MB 252g', 'Mylar Bags: 72x', 'Labels: 72x'], quantityProduced: 0, date: '2026-03-11', status: 'in-progress' },
  { id: 'pr-004', runId: 'PRD-2026-0044', productName: 'Vape Cart - Green Crack 1g (60 units)', bomComponents: ['CO2 Oil: 60ml', 'Cart Hardware: 60x', 'Labels: 60x'], quantityProduced: 0, date: '2026-03-14', status: 'planned' },
  { id: 'pr-005', runId: 'PRD-2026-0045', productName: 'Budlets - White Fire OG 3.5g (84 units)', bomComponents: ['Flower: WFO 294g', 'Bags: 84x', 'Labels: 84x'], quantityProduced: 0, date: '2026-03-16', status: 'planned' },
];

// ─── Non-Cannabis Materials (10 items) ───────────────────────────────────────
export const MOCK_NON_CANNABIS: NonCannabisItem[] = [
  { id: 'nc-001', name: '3.5g Child-Resistant Mylar Bags', category: 'packaging', sku: 'PKG-MYLAR-3.5G', currentStock: 2400, unit: 'units', reorderPoint: 500, reorderQuantity: 2000, supplier: 'CannaPack Supply Co.', lastOrdered: '2026-02-15', status: 'in-stock', unitCost: 0.18 },
  { id: 'nc-002', name: '7g Child-Resistant Mylar Bags', category: 'packaging', sku: 'PKG-MYLAR-7G', currentStock: 800, unit: 'units', reorderPoint: 300, reorderQuantity: 1000, supplier: 'CannaPack Supply Co.', lastOrdered: '2026-02-10', status: 'in-stock', unitCost: 0.22 },
  { id: 'nc-003', name: '1g Preroll Tubes (Black)', category: 'containers', sku: 'CTN-TUBE-1G', currentStock: 150, unit: 'units', reorderPoint: 500, reorderQuantity: 2000, supplier: 'WA Packaging Solutions', lastOrdered: '2026-01-20', status: 'critical', unitCost: 0.12 },
  { id: 'nc-004', name: 'Flower Labels (3.5g)', category: 'labels', sku: 'LBL-FL-3.5G', currentStock: 3200, unit: 'units', reorderPoint: 1000, reorderQuantity: 5000, supplier: 'ProLabel Inc.', lastOrdered: '2026-02-20', status: 'in-stock', unitCost: 0.08 },
  { id: 'nc-005', name: 'Concentrate Container 1g (Glass)', category: 'containers', sku: 'CTN-GLASS-1G', currentStock: 420, unit: 'units', reorderPoint: 200, reorderQuantity: 1000, supplier: 'Glass Vault Supply', lastOrdered: '2026-02-01', status: 'in-stock', unitCost: 0.45 },
  { id: 'nc-006', name: 'Vape Cart Hardware 510 1ml', category: 'other', sku: 'VPH-510-1ML', currentStock: 60, unit: 'units', reorderPoint: 200, reorderQuantity: 500, supplier: 'CCell Direct', lastOrdered: '2026-02-28', status: 'low', unitCost: 2.20 },
  { id: 'nc-007', name: 'Gummy Packaging 10-Pack Boxes', category: 'packaging', sku: 'PKG-GUMMY-10PK', currentStock: 900, unit: 'units', reorderPoint: 300, reorderQuantity: 1000, supplier: 'CannaPack Supply Co.', lastOrdered: '2026-02-25', status: 'in-stock', unitCost: 0.35 },
  { id: 'nc-008', name: 'Tincture Dropper Bottles 30ml', category: 'containers', sku: 'CTN-DROP-30ML', currentStock: 240, unit: 'units', reorderPoint: 100, reorderQuantity: 500, supplier: 'Glass Vault Supply', lastOrdered: '2026-01-30', status: 'in-stock', unitCost: 0.80 },
  { id: 'nc-009', name: 'Tamper-Evident Seals', category: 'labels', sku: 'LBL-TAMPER', currentStock: 5000, unit: 'units', reorderPoint: 2000, reorderQuantity: 10000, supplier: 'ProLabel Inc.', lastOrdered: '2026-02-18', status: 'in-stock', unitCost: 0.03 },
  { id: 'nc-010', name: 'Retail Dispensary Bags (8x10)', category: 'packaging', sku: 'PKG-RETAIL-SM', currentStock: 0, unit: 'units', reorderPoint: 500, reorderQuantity: 2000, supplier: 'WA Packaging Solutions', lastOrdered: '2026-02-05', status: 'out-of-stock', unitCost: 0.15 },
];

// ─── Manage Menu Rows ─────────────────────────────────────────────────────────
const backorderAmounts = [0, 0, 6, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0];
const lastAdjustedDates = [
  '2026-03-11', '2026-03-10', '2026-03-09', '2026-03-08', '2026-03-07',
  '2026-03-06', '2026-03-05', '2026-03-04', '2026-03-03', '2026-03-02',
  '2026-03-01', '2026-02-28', '2026-02-27', '2026-02-26', '2026-02-25',
  '2026-02-24', '2026-02-23', '2026-02-22', '2026-02-21', '2026-02-20',
];
const portalAvailability = [
  true, true, true, true, true, true, true, true, true, false,
  true, true, false, true, true, true, true, false, true, true,
];
export const MOCK_MANAGE_MENU: ManageMenuRow[] = MOCK_PRODUCTS.map((prod, i) => ({
  id: prod.id,
  productName: prod.name,
  inventoryType: prod.inventoryType,
  availableForSale: prod.availableForSale,
  allocated: prod.allocated,
  unitsOnBackorder: backorderAmounts[i] ?? 0,
  onHold: prod.onHold,
  totalInStock: prod.totalInStock,
  unitPrice: prod.unitPrice,
  status: prod.status,
  lastAdjusted: lastAdjustedDates[i] ?? '2026-02-20',
  availableOnPortal: portalAvailability[i] ?? true,
} as ManageMenuRow));
