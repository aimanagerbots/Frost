import type {
  SalesAccount,
  SalesContact,
  SalesOrder,
  SalesOrderStatus,
  Cart,
  CartLineItem,
  BatchAllocation,
  Catalog,
  CatalogProduct,
  AccountGroup,
  SalesRepReport,
  OrderSummaryRow,
} from '@/modules/sales/types';

// ── Constants ────────────────────────────────────────────────────

const ACCOUNT_NAMES = [
  'Green Leaf Collective', 'Emerald City Cannabis', 'Puget Sound Provisions',
  'Cascade Wellness', 'Olympic Gardens', 'Northern Leaf', 'Zoobees Doobees',
  'Green Harbor Dispensary', 'Pine Street Provisioning', 'Capitol Cannabis Co.',
  'Rainier Buds', 'Sound Side Remedies', 'Pacific Roots', 'Evergreen Apothecary',
  'Whidbey Island Cannabis', 'Skagit Valley Green', 'Bellingham Bud Co.',
  'Tacoma Treehouse', 'Spokane Greens', 'Yakima Valley Dispensary',
  'Tri-Cities Cannabis', 'Olympia Organic', 'Seattle Premium Pot',
  'Redmond Remedies', 'Kirkland Kush', 'Bellevue Botanicals',
  'Federal Way Flowers', 'Issaquah Indicas', 'Renton Relief', 'Kent Cannabis Co.',
];

const SALES_REPS = ['Michael Perkins', 'Nichole Cluff', 'Richard Maloney', 'Stacia Hartwell', 'Support Cultivera'];

const WA_CITIES = [
  'Seattle', 'Tacoma', 'Spokane', 'Bellevue', 'Everett', 'Kent', 'Renton',
  'Federal Way', 'Yakima', 'Bellingham', 'Olympia', 'Redmond', 'Kirkland',
  'Issaquah', 'Bremerton', 'Pullman', 'Wenatchee', 'Ellensburg', 'Anacortes',
  'Mount Vernon', 'Sequim', 'Port Angeles', 'Walla Walla', 'Kennewick',
  'Richland', 'Pasco', 'Vancouver', 'Longview', 'Aberdeen', 'Centralia',
];

const WA_STREETS = [
  '1420 NW Market St', '3201 E Madison St', '715 Pike St', '2200 Westlake Ave N',
  '4501 University Way NE', '801 5th Ave S', '1225 1st Ave', '400 Pine St',
  '9025 Aurora Ave N', '600 Union St', '3510 Fremont Ave N', '2401 Utah Ave S',
  '1501 4th Ave', '5410 Rainier Ave S', '7301 Greenwood Ave N', '200 Taylor Ave N',
  '1100 Dexter Ave N', '8500 15th Ave NE', '4200 SW Admiral Way', '2901 3rd Ave',
  '1730 Minor Ave', '3601 Stone Way N', '4730 University Village Pl NE', '500 Mercer St',
  '6200 California Ave SW', '7500 35th Ave NE', '1200 12th Ave', '3400 Harbor Ave SW',
  '910 Maynard Ave S', '2120 N 45th St',
];

const PRODUCT_NAMES = [
  'Premium Flower - Platinum Pineapple 3.5g', 'Premium Flower - Green Crack 3.5g',
  'Premium Flower - Moonbow 3.5g', 'Premium Flower - Orange Crush 3.5g',
  'Premium Flower - Skatalite 3.5g', 'Premium Flower - White Fire OG 3.5g',
  'RTM | Preroll Material - Platinum Pineapple 1g', 'RTM | Preroll Material - Green Crack 1g',
  'RTM | Hydrocarbon Concentrate - PP Live Resin 1g', 'RTM | Hydrocarbon Concentrate - Moonbow Badder 1g',
  'Edible - Orange Crush Gummies 10pk', 'Tincture - Full Spectrum 1500mg 30ml',
  'RTP | Budlets - Platinum Pineapple 3.5g', 'RTP | Budlets - Moonbow 3.5g',
  'RTM | Fresh Frozen - White Fire OG Rosin 1g',
];

const STRAINS = [
  'Platinum Pineapple', 'Green Crack', 'Moonbow', 'Orange Crush', 'Skatalite',
  'White Fire OG', 'Wedding Cake', 'Blue Dream', 'Gorilla Glue #4', 'OG Kush',
];

const CATEGORIES = ['flower', 'preroll', 'concentrate', 'edible', 'beverage', 'vaporizer'];

const DELIVERY_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TITLES = ['Buyer', 'Owner', 'Manager', 'Purchasing Agent', 'Store Manager', 'Inventory Manager'];

// ── Helpers ──────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randDate(startDays: number, endDays: number): string {
  const now = new Date('2026-03-12');
  const offset = randInt(startDays, endDays);
  const d = new Date(now.getTime() + offset * 86400000);
  return d.toISOString().split('T')[0];
}

function formatCurrency(n: number): number {
  return Math.round(n * 100) / 100;
}

function genLicense(): string {
  return String(randInt(100000, 999999));
}

// ── Accounts ─────────────────────────────────────────────────────

const PIPELINE_CODES = ['A5', 'A4', 'A3', 'A4', 'A2', 'A3', 'A5', 'A3', 'A2', 'A4', 'A3', 'A2', 'A1', 'A2', 'A1', 'A3', 'A1', 'A2', 'I1', 'I3', 'I2', 'I4', 'I5', 'R1', 'R2', 'R3', 'R1', 'A1', 'I2', 'R2'];

export function generateAccounts(count = 30): SalesAccount[] {
  return ACCOUNT_NAMES.slice(0, count).map((name, i) => ({
    id: `sa-${String(i + 1).padStart(3, '0')}`,
    clientName: name,
    address: WA_STREETS[i % WA_STREETS.length],
    city: WA_CITIES[i % WA_CITIES.length],
    licenseUBI: genLicense(),
    email: `orders@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    status: i < 24 ? 'active' as const : 'inactive' as const,
    deliveryDays: pickN(DELIVERY_DAYS, randInt(1, 3)),
    amPm: i % 3 === 0 ? 'pm' as const : 'am' as const,
    specialInstructions: i % 4 === 0 ? 'Call 30 min before delivery' : '',
    labelBarcodePreference: i % 2 === 0 ? 'UPC' : 'QR Code',
    fulfillmentPriority: (['fifo', 'newest-first', 'highest-qa', 'lowest-qa'] as const)[i % 4],
    assignedSalesRep: SALES_REPS[i % SALES_REPS.length],
    contactCount: randInt(1, 5),
    orderCount: randInt(3, 65),
    pipelineCode: PIPELINE_CODES[i % PIPELINE_CODES.length],
  }));
}

// ── Contacts ─────────────────────────────────────────────────────

const FIRST_NAMES = ['Sarah', 'Mike', 'Jessica', 'David', 'Emily', 'James', 'Maria', 'Carlos', 'Lisa', 'Kevin',
  'Amanda', 'Robert', 'Jennifer', 'Thomas', 'Ashley', 'Daniel', 'Nicole', 'Brian', 'Stephanie', 'Jason',
  'Laura', 'Ryan', 'Megan', 'Chris', 'Amy', 'Eric', 'Rebecca', 'Andrew', 'Rachel', 'Justin',
  'Michelle', 'Nathan', 'Heather', 'Brandon', 'Amber', 'Tyler', 'Samantha', 'Jeremy', 'Christina', 'Aaron'];

const LAST_NAMES = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez',
  'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
  'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green'];

export function generateContacts(count = 40, accounts: SalesAccount[]): SalesContact[] {
  return Array.from({ length: count }, (_, i) => {
    const account = accounts[i % accounts.length];
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    return {
      id: `sc-${String(i + 1).padStart(3, '0')}`,
      accountId: account.id,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${account.clientName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      title: TITLES[i % TITLES.length],
      phone: `(${randInt(206, 509)}) ${randInt(200, 999)}-${String(randInt(1000, 9999))}`,
      phoneType: i % 3 === 0 ? 'Mobile' : i % 3 === 1 ? 'Office' : 'Direct',
      note: i % 5 === 0 ? 'Prefers email communication' : '',
    };
  });
}

// ── Orders ───────────────────────────────────────────────────────

const ORDER_STATUSES: SalesOrderStatus[] = ['submitted', 'sublotted', 'manifested', 'quarantined', 'invoiced', 'paid', 'partially-sublotted'];

export function generateOrders(count = 50, accounts: SalesAccount[]): SalesOrder[] {
  return Array.from({ length: count }, (_, i) => {
    const account = accounts[i % accounts.length];
    const status = ORDER_STATUSES[i % ORDER_STATUSES.length];
    const submittedDate = randDate(-60, -1);
    return {
      id: `so-${String(i + 1).padStart(3, '0')}`,
      orderNumber: `ORD-2026-${String(400 + i).padStart(4, '0')}`,
      submittedBy: SALES_REPS[i % SALES_REPS.length],
      submittedDate,
      clientName: account.clientName,
      city: account.city,
      status,
      manifestedDate: ['manifested', 'invoiced', 'paid'].includes(status) ? randDate(-30, -1) : undefined,
      estDeliveryDate: ['manifested', 'invoiced', 'paid'].includes(status) ? randDate(-15, 7) : undefined,
      releasedDate: status === 'paid' ? randDate(-10, -1) : undefined,
      orderTotal: formatCurrency(randInt(200, 15000)),
    };
  });
}

// ── Carts ────────────────────────────────────────────────────────

export function generateCarts(count = 15, accounts: SalesAccount[]): Cart[] {
  return Array.from({ length: count }, (_, i) => {
    const account = accounts[i % accounts.length];
    const lineItemCount = randInt(2, 8);
    const lineItems: CartLineItem[] = Array.from({ length: lineItemCount }, (_, j) => {
      const qty = randInt(5, 100);
      const price = formatCurrency(randInt(10, 70));
      return {
        id: `cli-${i}-${j}`,
        productName: PRODUCT_NAMES[j % PRODUCT_NAMES.length],
        strain: STRAINS[j % STRAINS.length],
        quantity: qty,
        unitPrice: price,
        lineTotal: formatCurrency(qty * price),
      };
    });
    const total = formatCurrency(lineItems.reduce((s, li) => s + li.lineTotal, 0));
    return {
      id: `cart-${String(i + 1).padStart(3, '0')}`,
      name: `Cart ${account.clientName.split(' ').slice(0, 2).join(' ')} ${randDate(-5, 0)}`,
      clientName: account.clientName,
      itemCount: lineItems.length,
      total,
      status: (['open', 'submitted', 'allocated'] as const)[i % 3],
      lineItems,
    };
  });
}

// ── Batch Allocations ────────────────────────────────────────────

export function generateBatchAllocations(count = 10): BatchAllocation[] {
  const ROOMS = ['Vault A', 'Vault B', 'Cold Storage', 'Pack Staging'];
  return Array.from({ length: count }, (_, i) => {
    const available = randInt(20, 200);
    const needed = randInt(10, 80);
    const allocated = Math.min(needed, available);
    return {
      batchId: `ba-${String(i + 1).padStart(3, '0')}`,
      batchDate: randDate(-60, -5),
      doh: randInt(5, 90),
      dom: randDate(-90, -30),
      use: i % 2 === 0 ? 'Medical' : 'Retail',
      barcode: `GF${randInt(40000000000000, 49999999999999)}`,
      room: ROOMS[i % ROOMS.length],
      available,
      allocated,
      needed,
      remaining: needed - allocated,
    };
  });
}

// ── Catalogs ─────────────────────────────────────────────────────

export function generateCatalogs(count = 5): Catalog[] {
  const CATALOG_NAMES = ['Premium Flower Collection', 'Preroll Collection', 'Concentrate Collection', 'Edible Collection', 'Wellness Collection'];
  return CATALOG_NAMES.slice(0, count).map((name, i) => {
    const productCount = randInt(3, 8);
    const products: CatalogProduct[] = Array.from({ length: productCount }, (_, j) => ({
      id: `cp-${i}-${j}`,
      name: PRODUCT_NAMES[(i * 3 + j) % PRODUCT_NAMES.length],
      strain: STRAINS[(i * 2 + j) % STRAINS.length],
      category: CATEGORIES[i % CATEGORIES.length],
      price: formatCurrency(randInt(10, 70)),
      available: randInt(0, 200),
    }));
    return {
      id: `cat-${String(i + 1).padStart(3, '0')}`,
      name,
      productCount: products.length,
      products,
    };
  });
}

// ── Account Groups ───────────────────────────────────────────────

export function generateAccountGroups(count = 8): AccountGroup[] {
  const GROUP_NAMES = [
    'Seattle Metro', 'East Side Accounts', 'South Sound Territory', 'Peninsula Region',
    'Spokane & Eastern WA', 'Michael\'s Accounts', 'Nichole\'s Accounts', 'Priority Accounts',
  ];
  const GROUP_TYPES: Array<'territory' | 'rep' | 'custom'> = ['territory', 'territory', 'territory', 'territory', 'territory', 'rep', 'rep', 'custom'];
  return GROUP_NAMES.slice(0, count).map((name, i) => ({
    id: `ag-${String(i + 1).padStart(3, '0')}`,
    name,
    type: GROUP_TYPES[i],
    accountCount: randInt(3, 12),
    assignedRep: GROUP_TYPES[i] === 'rep' ? SALES_REPS[i % SALES_REPS.length] : undefined,
  }));
}

// ── Sales Rep Reports ────────────────────────────────────────────

export function generateSalesRepReports(reps = SALES_REPS): SalesRepReport[] {
  return reps.map((repName) => ({
    repName,
    totalSales: formatCurrency(randInt(50000, 250000)),
    orderCount: randInt(20, 120),
    accountCount: randInt(5, 20),
    avgOrderValue: formatCurrency(randInt(800, 5000)),
    topAccount: pick(ACCOUNT_NAMES),
  }));
}

// ── Order Summary ────────────────────────────────────────────────

export function generateOrderSummary(count = 100): OrderSummaryRow[] {
  const accounts = generateAccounts(30);
  return Array.from({ length: count }, (_, i) => {
    const account = accounts[i % accounts.length];
    const status = ORDER_STATUSES[i % ORDER_STATUSES.length];
    const submittedDate = randDate(-90, -1);
    return {
      id: `os-${String(i + 1).padStart(3, '0')}`,
      orderNumber: `ORD-2026-${String(300 + i).padStart(4, '0')}`,
      tradeName: account.clientName,
      submittedBy: SALES_REPS[i % SALES_REPS.length],
      submittedDate,
      clientName: account.clientName,
      city: account.city,
      status,
      manifestedDate: ['manifested', 'invoiced', 'paid'].includes(status) ? randDate(-45, -1) : undefined,
      estDeliveryDate: ['manifested', 'invoiced', 'paid'].includes(status) ? randDate(-15, 14) : undefined,
      releasedDate: status === 'paid' ? randDate(-10, -1) : undefined,
      orderTotal: formatCurrency(randInt(200, 15000)),
    };
  });
}

// ── Pre-generated data (for consistent usage across hooks) ───────

export const MOCK_ACCOUNTS = generateAccounts(30);
export const MOCK_CONTACTS = generateContacts(40, MOCK_ACCOUNTS);
export const MOCK_ORDERS = generateOrders(50, MOCK_ACCOUNTS);
export const MOCK_CARTS = generateCarts(15, MOCK_ACCOUNTS);
export const MOCK_BATCH_ALLOCATIONS = generateBatchAllocations(10);
export const MOCK_CATALOGS = generateCatalogs(5);
export const MOCK_ACCOUNT_GROUPS = generateAccountGroups(8);
export const MOCK_SALES_REP_REPORTS = generateSalesRepReports();
export const MOCK_ORDER_SUMMARY = generateOrderSummary(100);
export { SALES_REPS };
