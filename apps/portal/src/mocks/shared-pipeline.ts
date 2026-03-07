// Shared data constants for cross-module consistency across Orders, Fulfillment, and Delivery

export interface PipelineAccount {
  id: string;
  name: string;
  address: string;
  city: string;
  contact: string;
  phone: string;
  license: string;
  paymentPreference: 'ach' | 'cod' | 'check';
}

export const PIPELINE_ACCOUNTS: PipelineAccount[] = [
  { id: 'acct-greenfield', name: 'Greenfield Dispensary', address: '4521 University Way NE', city: 'Seattle', contact: 'Sarah Chen', phone: '(206) 555-0134', license: 'WA-LIC-00147', paymentPreference: 'ach' },
  { id: 'acct-emerald-city', name: 'Emerald City Cannabis', address: '8401 164th Ave NE', city: 'Redmond', contact: 'Marcus Reid', phone: '(425) 555-0291', license: 'WA-LIC-00203', paymentPreference: 'ach' },
  { id: 'acct-capitol-hill', name: 'Capitol Hill Collective', address: '1520 Broadway', city: 'Seattle', contact: 'Tanya Brooks', phone: '(206) 555-0178', license: 'WA-LIC-00089', paymentPreference: 'ach' },
  { id: 'acct-pacific-leaf', name: 'Pacific Leaf', address: '2701 Pacific Ave', city: 'Tacoma', contact: 'David Kim', phone: '(253) 555-0412', license: 'WA-LIC-00312', paymentPreference: 'cod' },
  { id: 'acct-rainier', name: 'Rainier Remedies', address: '5601 Rainier Ave S', city: 'Tacoma', contact: 'Jorge Martinez', phone: '(253) 555-0267', license: 'WA-LIC-00455', paymentPreference: 'check' },
  { id: 'acct-puget-sound', name: 'Puget Sound Provisions', address: '2815 S Jackson St', city: 'Olympia', contact: 'Karen Williams', phone: '(360) 555-0189', license: 'WA-LIC-00521', paymentPreference: 'ach' },
  { id: 'acct-summit', name: 'Summit Cannabis Co.', address: '1200 Harris Ave', city: 'Bellingham', contact: 'Ryan Park', phone: '(360) 555-0342', license: 'WA-LIC-00678', paymentPreference: 'ach' },
  { id: 'acct-cascade', name: 'Cascade Wellness', address: '1303 N Washington St', city: 'Spokane', contact: 'Lisa Nguyen', phone: '(509) 555-0156', license: 'WA-LIC-00734', paymentPreference: 'ach' },
  { id: 'acct-olympic', name: 'Olympic Greens', address: '521 Capitol Way S', city: 'Olympia', contact: 'Mike Anderson', phone: '(360) 555-0423', license: 'WA-LIC-00198', paymentPreference: 'cod' },
  { id: 'acct-harbor', name: 'Harbor Cannabis', address: '301 E 1st St', city: 'Port Angeles', contact: 'Beth Sullivan', phone: '(360) 555-0587', license: 'WA-LIC-00891', paymentPreference: 'cod' },
];

export const PIPELINE_REPS = ['Jake Morrison', 'Priya Patel', 'Carlos Ruiz'] as const;

export const FULFILLMENT_ASSIGNEES = ['Tyler Ross', 'Aisha Williams', 'Marcus Chen', 'Sofia Ramirez'] as const;

export interface PipelineDriver {
  id: string;
  name: string;
  phone: string;
  vehicleId: string;
  vehicleName: string;
}

export const PIPELINE_DRIVERS: PipelineDriver[] = [
  { id: 'drv-001', name: 'James Cooper', phone: '(206) 555-0147', vehicleId: 'veh-001', vehicleName: 'Van #1 — 2023 Ford Transit' },
  { id: 'drv-002', name: 'Roberto Flores', phone: '(206) 555-0283', vehicleId: 'veh-002', vehicleName: 'Van #2 — 2024 Mercedes Sprinter' },
  { id: 'drv-003', name: 'Carlos Mendez', phone: '(253) 555-0391', vehicleId: 'veh-003', vehicleName: 'Van #3 — 2023 RAM ProMaster' },
  { id: 'drv-004', name: 'Sarah Kim', phone: '(360) 555-0512', vehicleId: 'veh-004', vehicleName: 'Van #4 — 2024 Ford Transit' },
];

export interface PipelineProduct {
  sku: string;
  name: string;
  category: 'flower' | 'preroll' | 'vaporizer' | 'concentrate' | 'edible' | 'beverage';
  subCategory: string;
  packageSize: string;
  unitPrice: number;
  shelfLocation: string;
}

export const PIPELINE_PRODUCTS: PipelineProduct[] = [
  // Flower
  { sku: 'FROST-FL-WC-35', name: 'Wedding Cake Premium Flower', category: 'flower', subCategory: 'Premium', packageSize: '3.5g', unitPrice: 28, shelfLocation: 'Aisle A, Shelf 2, Bin 5' },
  { sku: 'FROST-FL-BD-35', name: 'Blue Dream Flower', category: 'flower', subCategory: 'Standard', packageSize: '3.5g', unitPrice: 24, shelfLocation: 'Aisle A, Shelf 1, Bin 2' },
  { sku: 'FROST-FL-GL-35', name: 'Gelato Flower', category: 'flower', subCategory: 'Premium', packageSize: '3.5g', unitPrice: 28, shelfLocation: 'Aisle A, Shelf 2, Bin 3' },
  { sku: 'FROST-FL-OK-35', name: 'OG Kush Flower', category: 'flower', subCategory: 'Standard', packageSize: '3.5g', unitPrice: 22, shelfLocation: 'Aisle A, Shelf 3, Bin 1' },
  // Preroll
  { sku: 'FROST-PR-BD-1G', name: 'Blue Dream Infused Preroll', category: 'preroll', subCategory: 'Infused', packageSize: '1g', unitPrice: 10, shelfLocation: 'Aisle B, Shelf 1, Bin 3' },
  { sku: 'FROST-PR-WC-5PK', name: 'Wedding Cake Preroll 5-Pack', category: 'preroll', subCategory: 'Standard', packageSize: '5pk', unitPrice: 32, shelfLocation: 'Aisle B, Shelf 2, Bin 6' },
  { sku: 'FROST-PR-GS-5PK', name: 'GSC Infused Preroll 5-Pack', category: 'preroll', subCategory: 'Infused', packageSize: '5pk', unitPrice: 38, shelfLocation: 'Aisle B, Shelf 2, Bin 9' },
  // Vaporizer
  { sku: 'FROST-VZ-GL-1G', name: 'Gelato Live Resin 510 Cart', category: 'vaporizer', subCategory: 'Live Resin Cart', packageSize: '1g', unitPrice: 32, shelfLocation: 'Aisle C, Shelf 2, Bin 1' },
  { sku: 'FROST-VZ-SD-05', name: 'Sour Diesel Disposable', category: 'vaporizer', subCategory: 'Disposable', packageSize: '0.5g', unitPrice: 28, shelfLocation: 'Aisle C, Shelf 1, Bin 5' },
  { sku: 'FROST-VZ-BD-1G', name: 'Blue Dream 510 Cart', category: 'vaporizer', subCategory: 'Distillate Cart', packageSize: '1g', unitPrice: 26, shelfLocation: 'Aisle C, Shelf 2, Bin 4' },
  // Concentrate
  { sku: 'FROST-CN-GL-LR', name: 'Gelato Live Resin', category: 'concentrate', subCategory: 'Live Resin', packageSize: '1g', unitPrice: 38, shelfLocation: 'Aisle C, Shelf 4, Bin 7' },
  { sku: 'FROST-CN-OK-WX', name: 'OG Kush Wax', category: 'concentrate', subCategory: 'Wax', packageSize: '1g', unitPrice: 26, shelfLocation: 'Aisle C, Shelf 3, Bin 6' },
  { sku: 'FROST-CN-GL-DI', name: 'Gelato Diamonds', category: 'concentrate', subCategory: 'Diamonds', packageSize: '1g', unitPrice: 48, shelfLocation: 'Aisle C, Shelf 4, Bin 2' },
  // Edible
  { sku: 'FROST-ED-ZK-10', name: 'Watermelon Zkittlez Gummies', category: 'edible', subCategory: 'Gummies', packageSize: '10pk (100mg)', unitPrice: 14, shelfLocation: 'Aisle D, Shelf 3, Bin 8' },
  { sku: 'FROST-ED-CH-4PK', name: 'Dark Chocolate Bites', category: 'edible', subCategory: 'Chocolates', packageSize: '4pk (40mg)', unitPrice: 18, shelfLocation: 'Aisle D, Shelf 1, Bin 4' },
  { sku: 'FROST-ED-MN-TIN', name: 'Peppermint Mints Tin', category: 'edible', subCategory: 'Mints', packageSize: '40pk (200mg)', unitPrice: 12, shelfLocation: 'Aisle D, Shelf 2, Bin 3' },
  // Beverage
  { sku: 'FROST-BV-LM-CAN', name: 'Lemon Fizz CBD Seltzer', category: 'beverage', subCategory: 'RTD Can', packageSize: '12oz', unitPrice: 8, shelfLocation: 'Aisle E, Shelf 1, Bin 2' },
  { sku: 'FROST-BV-BL-CAN', name: 'Blueberry Lemonade Seltzer', category: 'beverage', subCategory: 'RTD Can', packageSize: '12oz', unitPrice: 8, shelfLocation: 'Aisle E, Shelf 1, Bin 4' },
  { sku: 'FROST-BV-IT-6PK', name: 'Iced Tea Infused 6-Pack', category: 'beverage', subCategory: 'Multi-Pack', packageSize: '6pk', unitPrice: 36, shelfLocation: 'Aisle E, Shelf 2, Bin 5' },
];

export function accountById(id: string): PipelineAccount | undefined {
  return PIPELINE_ACCOUNTS.find((a) => a.id === id);
}

export function productBySku(sku: string): PipelineProduct | undefined {
  return PIPELINE_PRODUCTS.find((p) => p.sku === sku);
}
