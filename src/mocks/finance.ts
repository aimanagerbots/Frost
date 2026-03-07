import type {
  Invoice,
  InvoiceStatus,
  ARAgingBucket,
  FinanceMetrics,
  RevenueDataPoint,
  RevenueByCategoryPoint,
} from '@/modules/finance/types';

const INVOICES: Invoice[] = [
  // --- 15 Paid ---
  {
    id: 'inv-001',
    orderNumber: 'ORD-2401',
    accountName: 'Greenfield Dispensary',
    accountId: 'acc-001',
    amount: 8750,
    status: 'paid',
    issuedDate: '2026-01-10',
    dueDate: '2026-02-09',
    paidDate: '2026-01-28',
    paidAmount: 8750,
    method: 'ACH',
    daysOutstanding: 0,
  },
  {
    id: 'inv-002',
    orderNumber: 'ORD-2412',
    accountName: 'Greenfield Dispensary',
    accountId: 'acc-001',
    amount: 6200,
    status: 'paid',
    issuedDate: '2026-01-22',
    dueDate: '2026-02-21',
    paidDate: '2026-02-10',
    paidAmount: 6200,
    method: 'ACH',
    daysOutstanding: 0,
  },
  {
    id: 'inv-003',
    orderNumber: 'ORD-2430',
    accountName: 'Greenfield Dispensary',
    accountId: 'acc-001',
    amount: 12400,
    status: 'paid',
    issuedDate: '2026-02-05',
    dueDate: '2026-03-07',
    paidDate: '2026-02-22',
    paidAmount: 12400,
    method: 'Wire',
    daysOutstanding: 0,
  },
  {
    id: 'inv-004',
    orderNumber: 'ORD-2405',
    accountName: 'Pacific Leaf Co.',
    accountId: 'acc-002',
    amount: 5400,
    status: 'paid',
    issuedDate: '2026-01-12',
    dueDate: '2026-02-11',
    paidDate: '2026-01-30',
    paidAmount: 5400,
    method: 'Check',
    daysOutstanding: 0,
  },
  {
    id: 'inv-005',
    orderNumber: 'ORD-2418',
    accountName: 'Pacific Leaf Co.',
    accountId: 'acc-002',
    amount: 9100,
    status: 'paid',
    issuedDate: '2026-01-28',
    dueDate: '2026-02-27',
    paidDate: '2026-02-14',
    paidAmount: 9100,
    method: 'ACH',
    daysOutstanding: 0,
  },
  {
    id: 'inv-006',
    orderNumber: 'ORD-2440',
    accountName: 'Pacific Leaf Co.',
    accountId: 'acc-002',
    amount: 7300,
    status: 'paid',
    issuedDate: '2026-02-10',
    dueDate: '2026-03-12',
    paidDate: '2026-02-28',
    paidAmount: 7300,
    method: 'ACH',
    daysOutstanding: 0,
  },
  {
    id: 'inv-007',
    orderNumber: 'ORD-2408',
    accountName: 'Summit Cannabis',
    accountId: 'acc-003',
    amount: 4200,
    status: 'paid',
    issuedDate: '2026-01-15',
    dueDate: '2026-02-14',
    paidDate: '2026-02-02',
    paidAmount: 4200,
    method: 'ACH',
    daysOutstanding: 0,
  },
  {
    id: 'inv-008',
    orderNumber: 'ORD-2425',
    accountName: 'Summit Cannabis',
    accountId: 'acc-003',
    amount: 11500,
    status: 'paid',
    issuedDate: '2026-02-01',
    dueDate: '2026-03-03',
    paidDate: '2026-02-18',
    paidAmount: 11500,
    method: 'Wire',
    daysOutstanding: 0,
  },
  {
    id: 'inv-009',
    orderNumber: 'ORD-2410',
    accountName: 'Olympic Greens',
    accountId: 'acc-004',
    amount: 3800,
    status: 'paid',
    issuedDate: '2026-01-18',
    dueDate: '2026-02-17',
    paidDate: '2026-02-05',
    paidAmount: 3800,
    method: 'Check',
    daysOutstanding: 0,
  },
  {
    id: 'inv-010',
    orderNumber: 'ORD-2438',
    accountName: 'Olympic Greens',
    accountId: 'acc-004',
    amount: 6900,
    status: 'paid',
    issuedDate: '2026-02-08',
    dueDate: '2026-03-10',
    paidDate: '2026-02-25',
    paidAmount: 6900,
    method: 'ACH',
    daysOutstanding: 0,
  },
  {
    id: 'inv-011',
    orderNumber: 'ORD-2415',
    accountName: 'Capitol Hill Cannabis',
    accountId: 'acc-005',
    amount: 14800,
    status: 'paid',
    issuedDate: '2026-01-25',
    dueDate: '2026-02-24',
    paidDate: '2026-02-12',
    paidAmount: 14800,
    method: 'Wire',
    daysOutstanding: 0,
  },
  {
    id: 'inv-012',
    orderNumber: 'ORD-2442',
    accountName: 'Capitol Hill Cannabis',
    accountId: 'acc-005',
    amount: 2900,
    status: 'paid',
    issuedDate: '2026-02-12',
    dueDate: '2026-03-14',
    paidDate: '2026-03-01',
    paidAmount: 2900,
    method: 'ACH',
    daysOutstanding: 0,
  },
  {
    id: 'inv-013',
    orderNumber: 'ORD-2420',
    accountName: 'Cascade Wellness',
    accountId: 'acc-006',
    amount: 5600,
    status: 'paid',
    issuedDate: '2026-01-30',
    dueDate: '2026-03-01',
    paidDate: '2026-02-16',
    paidAmount: 5600,
    method: 'ACH',
    daysOutstanding: 0,
  },
  {
    id: 'inv-014',
    orderNumber: 'ORD-2432',
    accountName: 'Bellingham Bloom',
    accountId: 'acc-007',
    amount: 3200,
    status: 'paid',
    issuedDate: '2026-02-06',
    dueDate: '2026-03-08',
    paidDate: '2026-02-24',
    paidAmount: 3200,
    method: 'Check',
    daysOutstanding: 0,
  },
  {
    id: 'inv-015',
    orderNumber: 'ORD-2445',
    accountName: 'Evergreen Wellness',
    accountId: 'acc-008',
    amount: 7800,
    status: 'paid',
    issuedDate: '2026-02-15',
    dueDate: '2026-03-17',
    paidDate: '2026-03-04',
    paidAmount: 7800,
    method: 'ACH',
    daysOutstanding: 0,
  },
  // --- 5 Pending ---
  {
    id: 'inv-016',
    orderNumber: 'ORD-2450',
    accountName: 'Olympic Greens',
    accountId: 'acc-004',
    amount: 8200,
    status: 'pending',
    issuedDate: '2026-02-20',
    dueDate: '2026-03-22',
    daysOutstanding: 14,
  },
  {
    id: 'inv-017',
    orderNumber: 'ORD-2455',
    accountName: 'Capitol Hill Cannabis',
    accountId: 'acc-005',
    amount: 3400,
    status: 'pending',
    issuedDate: '2026-02-25',
    dueDate: '2026-03-27',
    daysOutstanding: 9,
  },
  {
    id: 'inv-018',
    orderNumber: 'ORD-2460',
    accountName: 'Cascade Wellness',
    accountId: 'acc-006',
    amount: 11800,
    status: 'pending',
    issuedDate: '2026-02-28',
    dueDate: '2026-03-30',
    daysOutstanding: 6,
  },
  {
    id: 'inv-019',
    orderNumber: 'ORD-2462',
    accountName: 'Bellingham Bloom',
    accountId: 'acc-007',
    amount: 4500,
    status: 'pending',
    issuedDate: '2026-03-01',
    dueDate: '2026-03-31',
    daysOutstanding: 5,
  },
  {
    id: 'inv-020',
    orderNumber: 'ORD-2465',
    accountName: 'Summit Cannabis',
    accountId: 'acc-003',
    amount: 6800,
    status: 'pending',
    issuedDate: '2026-03-03',
    dueDate: '2026-04-02',
    daysOutstanding: 3,
  },
  // --- 3 Overdue ---
  {
    id: 'inv-021',
    orderNumber: 'ORD-2380',
    accountName: 'Rainier Remedies',
    accountId: 'acc-009',
    amount: 5200,
    status: 'overdue',
    issuedDate: '2025-12-05',
    dueDate: '2026-01-04',
    daysOutstanding: 62,
  },
  {
    id: 'inv-022',
    orderNumber: 'ORD-2395',
    accountName: 'Rainier Remedies',
    accountId: 'acc-009',
    amount: 7800,
    status: 'overdue',
    issuedDate: '2025-12-22',
    dueDate: '2026-01-21',
    daysOutstanding: 45,
  },
  {
    id: 'inv-023',
    orderNumber: 'ORD-2402',
    accountName: 'Emerald City Cannabis',
    accountId: 'acc-010',
    amount: 7400,
    status: 'overdue',
    issuedDate: '2026-01-08',
    dueDate: '2026-01-28',
    daysOutstanding: 38,
  },
  // --- 2 Partial ---
  {
    id: 'inv-024',
    orderNumber: 'ORD-2390',
    accountName: 'Harbor Cannabis',
    accountId: 'acc-011',
    amount: 9500,
    status: 'partial',
    issuedDate: '2025-12-18',
    dueDate: '2026-01-17',
    paidDate: '2026-01-10',
    paidAmount: 6650,
    method: 'ACH',
    daysOutstanding: 49,
  },
  {
    id: 'inv-025',
    orderNumber: 'ORD-2422',
    accountName: 'Harbor Cannabis',
    accountId: 'acc-011',
    amount: 6800,
    status: 'partial',
    issuedDate: '2026-01-30',
    dueDate: '2026-03-01',
    paidDate: '2026-02-20',
    paidAmount: 4080,
    method: 'Check',
    daysOutstanding: 5,
  },
];

const AR_AGING: ARAgingBucket[] = [
  { label: 'Current', count: 12, amount: 45200, color: '#22C55E' },
  { label: '30-Day', count: 6, amount: 28400, color: '#F59E0B' },
  { label: '60-Day', count: 4, amount: 12100, color: '#F97316' },
  { label: '90+', count: 3, amount: 8300, color: '#EF4444' },
];

const FINANCE_METRICS: FinanceMetrics = {
  totalAR: 94000,
  overdueAmount: 20400,
  revenueThisMonth: 1240000,
  revenuePriorMonth: 1220000,
  avgDaysToPay: 18,
  collectionRate: 94.2,
};

const REVENUE_BY_PERIOD: RevenueDataPoint[] = [
  { month: 'Apr 2025', revenue: 980000 },
  { month: 'May 2025', revenue: 1010000 },
  { month: 'Jun 2025', revenue: 1040000 },
  { month: 'Jul 2025', revenue: 1020000 },
  { month: 'Aug 2025', revenue: 1080000 },
  { month: 'Sep 2025', revenue: 1120000 },
  { month: 'Oct 2025', revenue: 1100000 },
  { month: 'Nov 2025', revenue: 1150000 },
  { month: 'Dec 2025', revenue: 1180000 },
  { month: 'Jan 2026', revenue: 1200000 },
  { month: 'Feb 2026', revenue: 1220000 },
  { month: 'Mar 2026', revenue: 1240000 },
];

const REVENUE_BY_CATEGORY: RevenueByCategoryPoint[] = [
  { category: 'Flower', revenue: 471000, percentage: 38 },
  { category: 'Vaporizer', revenue: 273000, percentage: 22 },
  { category: 'Concentrate', revenue: 223000, percentage: 18 },
  { category: 'Preroll', revenue: 149000, percentage: 12 },
  { category: 'Edible', revenue: 87000, percentage: 7 },
  { category: 'Beverage', revenue: 37000, percentage: 3 },
];

const delay = () => new Promise<void>((r) => setTimeout(r, 300));

export async function getInvoices(
  filters?: { status?: InvoiceStatus; search?: string }
): Promise<Invoice[]> {
  await delay();
  let results = [...INVOICES];
  if (filters?.status) {
    results = results.filter((inv) => inv.status === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (inv) =>
        inv.orderNumber.toLowerCase().includes(q) ||
        inv.accountName.toLowerCase().includes(q)
    );
  }
  return results;
}

export async function getARaging(): Promise<ARAgingBucket[]> {
  await delay();
  return [...AR_AGING];
}

export async function getFinanceMetrics(): Promise<FinanceMetrics> {
  await delay();
  return { ...FINANCE_METRICS };
}

export async function getRevenueByPeriod(): Promise<RevenueDataPoint[]> {
  await delay();
  return [...REVENUE_BY_PERIOD];
}

export async function getRevenueByCategory(): Promise<RevenueByCategoryPoint[]> {
  await delay();
  return [...REVENUE_BY_CATEGORY];
}
