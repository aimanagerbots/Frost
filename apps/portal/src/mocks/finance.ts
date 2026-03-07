import type {
  FinanceSpeedometer,
  CFOBriefingItem,
  PLStatement,
  CashFlowStatement,
  CashFlowProjection,
  BalanceSheet,
  Invoice,
  InvoiceStatus,
  ARMetrics,
  ARAgingBucket,
  Vendor,
  Bill,
  BillStatus,
  APMetrics,
} from '@/modules/finance/types';

// ─── Speedometer Gauges ───

const SPEEDOMETERS: FinanceSpeedometer[] = [
  {
    id: 'cash-health',
    label: 'Cash Health',
    score: 72,
    trend: 3,
    zone: 'green',
    factors: [
      { label: 'Bank Balance', value: '$142K', impact: 'positive' },
      { label: 'Monthly Burn', value: '$47K', impact: 'negative' },
      { label: 'Runway', value: '3.0 months', impact: 'neutral' },
      { label: 'Pending AR', value: '$68K', impact: 'positive' },
    ],
  },
  {
    id: 'revenue-velocity',
    label: 'Revenue Velocity',
    score: 78,
    trend: 5,
    zone: 'green',
    factors: [
      { label: 'MTD Revenue', value: '$1.24M', impact: 'positive' },
      { label: 'Target', value: '$1.15M', impact: 'positive' },
      { label: 'Order Pipeline', value: '$340K', impact: 'positive' },
      { label: 'Reorder Rate', value: '87%', impact: 'neutral' },
    ],
  },
  {
    id: 'margin-health',
    label: 'Margin Health',
    score: 65,
    trend: -2,
    zone: 'amber',
    factors: [
      { label: 'Gross Margin', value: '52%', impact: 'negative' },
      { label: 'Target', value: '55%', impact: 'neutral' },
      { label: 'COGS Trend', value: '+3%', impact: 'negative' },
      { label: 'Packaging Costs', value: '+8%', impact: 'negative' },
    ],
  },
  {
    id: 'collection-efficiency',
    label: 'Collection Efficiency',
    score: 58,
    trend: -4,
    zone: 'amber',
    factors: [
      { label: 'DSO', value: '3.8 days', impact: 'negative' },
      { label: 'Overdue Invoices', value: '3 ($16K)', impact: 'negative' },
      { label: 'Compliance Rate', value: '89%', impact: 'neutral' },
      { label: 'ACH Adoption', value: '48%', impact: 'neutral' },
    ],
  },
  {
    id: 'operational-efficiency',
    label: 'Operational Efficiency',
    score: 74,
    trend: 2,
    zone: 'green',
    factors: [
      { label: 'Revenue/Employee', value: '$82K', impact: 'positive' },
      { label: 'Cost/Unit Trend', value: '-4%', impact: 'positive' },
      { label: 'Capacity Util.', value: '82%', impact: 'positive' },
      { label: 'Delivery Efficiency', value: '+12%', impact: 'positive' },
    ],
  },
];

// ─── CFO Briefing ───

const CFO_BRIEFING: CFOBriefingItem[] = [
  {
    id: 'cfo-1',
    severity: 'critical',
    title: 'Cash Position Risk — Rainier Remedies',
    description:
      'Cash position will drop below $50K in 18 days if Rainier Remedies doesn\'t pay $12K overdue balance. Two invoices outstanding: $4,200 (day 7) and $3,800 (day 6).',
    metric: '$12K overdue',
    recommendation: 'Escalate to phone call and consider placing account on hold.',
  },
  {
    id: 'cfo-2',
    severity: 'warning',
    title: 'Packaging Material Cost Increase',
    description:
      'Packaging material costs up 8% month-over-month — jar supplier raised prices. Affecting gross margin by ~0.4%.',
    metric: '+8% MoM',
    recommendation: 'Consider alternate vendor. Pacific Packaging Co contract renewal is in 45 days.',
  },
  {
    id: 'cfo-3',
    severity: 'warning',
    title: 'Collection Efficiency Declining',
    description:
      'DSO increased from 3.2 to 3.8 days this month. Three accounts consistently paying on day 4-5 instead of day 1-2.',
    metric: 'DSO 3.8 days (+0.6)',
  },
  {
    id: 'cfo-4',
    severity: 'positive',
    title: 'Delivery Cost Optimization Working',
    description:
      'Revenue per delivery mile up 12% after route optimization — saving approximately $1,200/month in fuel and labor.',
    metric: '+12% rev/mile',
  },
  {
    id: 'cfo-5',
    severity: 'info',
    title: 'Gross Margin Above Industry Average',
    description:
      'Gross margin at 52% — above Washington cannabis wholesale average of 47%. Concentrate and vaporizer categories driving premium.',
    metric: '52% vs 47% avg',
  },
  {
    id: 'cfo-6',
    severity: 'info',
    title: 'Revenue Trajectory On Track',
    description:
      'At current trajectory, monthly revenue will hit $1.35M by end of Q2 — 8% above budget. Growth driven by category expansion at existing accounts.',
    metric: '$1.35M projected',
  },
  {
    id: 'cfo-7',
    severity: 'positive',
    title: 'Early Payment Discount Opportunity',
    description:
      'Offering 2% early payment discount could improve DSO by 1.5 days — worth approximately $4K/month in improved cash flow.',
    metric: '~$4K/mo impact',
    recommendation: 'Pilot with top 5 accounts next billing cycle.',
  },
];

// ─── P&L Statements ───

const PL_MONTHLY: PLStatement = {
  period: 'March 2026',
  periodType: 'monthly',
  revenue: [
    { category: 'Revenue', subcategory: 'Flower', actual: 471000, budget: 445000, variance: 26000, variancePct: 5.8, priorPeriod: 458000, ytd: 1392000 },
    { category: 'Revenue', subcategory: 'Prerolls', actual: 149000, budget: 140000, variance: 9000, variancePct: 6.4, priorPeriod: 142000, ytd: 438000 },
    { category: 'Revenue', subcategory: 'Vaporizers', actual: 273000, budget: 260000, variance: 13000, variancePct: 5.0, priorPeriod: 265000, ytd: 805000 },
    { category: 'Revenue', subcategory: 'Concentrates', actual: 223000, budget: 210000, variance: 13000, variancePct: 6.2, priorPeriod: 218000, ytd: 660000 },
    { category: 'Revenue', subcategory: 'Edibles', actual: 87000, budget: 80000, variance: 7000, variancePct: 8.8, priorPeriod: 82000, ytd: 254000 },
    { category: 'Revenue', subcategory: 'Beverages', actual: 37000, budget: 30000, variance: 7000, variancePct: 23.3, priorPeriod: 35000, ytd: 107000 },
    { category: 'Revenue', subcategory: 'Less: Discounts', actual: -18000, budget: -15000, variance: -3000, variancePct: -20.0, priorPeriod: -16000, ytd: -51000 },
    { category: 'Revenue', subcategory: 'Less: Returns', actual: -2000, budget: -2000, variance: 0, variancePct: 0, priorPeriod: -1800, ytd: -5800 },
  ],
  cogs: [
    { category: 'COGS', subcategory: 'Cannabis Materials', actual: 185000, budget: 175000, variance: -10000, variancePct: -5.7, priorPeriod: 178000, ytd: 545000 },
    { category: 'COGS', subcategory: 'Non-Cannabis Materials', actual: 98000, budget: 90000, variance: -8000, variancePct: -8.9, priorPeriod: 92000, ytd: 285000 },
    { category: 'COGS', subcategory: 'Direct Labor', actual: 195000, budget: 195000, variance: 0, variancePct: 0, priorPeriod: 192000, ytd: 580000 },
    { category: 'COGS', subcategory: 'Manufacturing Overhead', actual: 42000, budget: 40000, variance: -2000, variancePct: -5.0, priorPeriod: 40000, ytd: 123000 },
  ],
  grossProfit: 700000,
  grossMargin: 57.4,
  opex: [
    { category: 'OpEx', subcategory: 'Sales', actual: 88000, budget: 85000, variance: -3000, variancePct: -3.5, priorPeriod: 86000, ytd: 260000 },
    { category: 'OpEx', subcategory: 'Marketing', actual: 32000, budget: 35000, variance: 3000, variancePct: 8.6, priorPeriod: 30000, ytd: 94000 },
    { category: 'OpEx', subcategory: 'General & Admin', actual: 65000, budget: 65000, variance: 0, variancePct: 0, priorPeriod: 64000, ytd: 193000 },
    { category: 'OpEx', subcategory: 'Facilities', actual: 48000, budget: 48000, variance: 0, variancePct: 0, priorPeriod: 48000, ytd: 144000 },
    { category: 'OpEx', subcategory: 'Equipment', actual: 22000, budget: 20000, variance: -2000, variancePct: -10.0, priorPeriod: 20000, ytd: 63000 },
    { category: 'OpEx', subcategory: 'Delivery', actual: 35000, budget: 38000, variance: 3000, variancePct: 7.9, priorPeriod: 37000, ytd: 107000 },
    { category: 'OpEx', subcategory: 'Software', actual: 8000, budget: 8000, variance: 0, variancePct: 0, priorPeriod: 8000, ytd: 24000 },
    { category: 'OpEx', subcategory: 'Insurance', actual: 12000, budget: 12000, variance: 0, variancePct: 0, priorPeriod: 12000, ytd: 36000 },
    { category: 'OpEx', subcategory: 'Professional Services', actual: 15000, budget: 12000, variance: -3000, variancePct: -25.0, priorPeriod: 10000, ytd: 38000 },
  ],
  ebitda: 375000,
  ebitdaMargin: 30.7,
  depreciation: 18000,
  interest: 8000,
  netIncome: 349000,
  netMargin: 28.6,
};

const PL_WEEKLY: PLStatement = {
  period: 'Week of Mar 3, 2026',
  periodType: 'weekly',
  revenue: [
    { category: 'Revenue', subcategory: 'Flower', actual: 108500, budget: 102700, variance: 5800, variancePct: 5.6, priorPeriod: 105600, ytd: 1392000 },
    { category: 'Revenue', subcategory: 'Prerolls', actual: 34300, budget: 32300, variance: 2000, variancePct: 6.2, priorPeriod: 32700, ytd: 438000 },
    { category: 'Revenue', subcategory: 'Vaporizers', actual: 62900, budget: 60000, variance: 2900, variancePct: 4.8, priorPeriod: 61100, ytd: 805000 },
    { category: 'Revenue', subcategory: 'Concentrates', actual: 51400, budget: 48500, variance: 2900, variancePct: 6.0, priorPeriod: 50200, ytd: 660000 },
    { category: 'Revenue', subcategory: 'Edibles', actual: 20000, budget: 18500, variance: 1500, variancePct: 8.1, priorPeriod: 18900, ytd: 254000 },
    { category: 'Revenue', subcategory: 'Beverages', actual: 8500, budget: 6900, variance: 1600, variancePct: 23.2, priorPeriod: 8100, ytd: 107000 },
    { category: 'Revenue', subcategory: 'Less: Discounts', actual: -4200, budget: -3500, variance: -700, variancePct: -20.0, priorPeriod: -3700, ytd: -51000 },
    { category: 'Revenue', subcategory: 'Less: Returns', actual: -460, budget: -460, variance: 0, variancePct: 0, priorPeriod: -420, ytd: -5800 },
  ],
  cogs: [
    { category: 'COGS', subcategory: 'Cannabis Materials', actual: 42600, budget: 40400, variance: -2200, variancePct: -5.4, priorPeriod: 41000, ytd: 545000 },
    { category: 'COGS', subcategory: 'Non-Cannabis Materials', actual: 22600, budget: 20800, variance: -1800, variancePct: -8.7, priorPeriod: 21200, ytd: 285000 },
    { category: 'COGS', subcategory: 'Direct Labor', actual: 44900, budget: 45000, variance: 100, variancePct: 0.2, priorPeriod: 44300, ytd: 580000 },
    { category: 'COGS', subcategory: 'Manufacturing Overhead', actual: 9700, budget: 9200, variance: -500, variancePct: -5.4, priorPeriod: 9200, ytd: 123000 },
  ],
  grossProfit: 161240,
  grossMargin: 57.5,
  opex: [
    { category: 'OpEx', subcategory: 'Sales', actual: 20300, budget: 19600, variance: -700, variancePct: -3.6, priorPeriod: 19800, ytd: 260000 },
    { category: 'OpEx', subcategory: 'Marketing', actual: 7400, budget: 8100, variance: 700, variancePct: 8.6, priorPeriod: 6900, ytd: 94000 },
    { category: 'OpEx', subcategory: 'General & Admin', actual: 15000, budget: 15000, variance: 0, variancePct: 0, priorPeriod: 14800, ytd: 193000 },
    { category: 'OpEx', subcategory: 'Facilities', actual: 11100, budget: 11100, variance: 0, variancePct: 0, priorPeriod: 11100, ytd: 144000 },
    { category: 'OpEx', subcategory: 'Equipment', actual: 5100, budget: 4600, variance: -500, variancePct: -10.9, priorPeriod: 4600, ytd: 63000 },
    { category: 'OpEx', subcategory: 'Delivery', actual: 8100, budget: 8800, variance: 700, variancePct: 8.0, priorPeriod: 8500, ytd: 107000 },
    { category: 'OpEx', subcategory: 'Software', actual: 1850, budget: 1850, variance: 0, variancePct: 0, priorPeriod: 1850, ytd: 24000 },
    { category: 'OpEx', subcategory: 'Insurance', actual: 2800, budget: 2800, variance: 0, variancePct: 0, priorPeriod: 2800, ytd: 36000 },
    { category: 'OpEx', subcategory: 'Professional Services', actual: 3500, budget: 2800, variance: -700, variancePct: -25.0, priorPeriod: 2300, ytd: 38000 },
  ],
  ebitda: 86090,
  ebitdaMargin: 30.7,
  depreciation: 4150,
  interest: 1850,
  netIncome: 80090,
  netMargin: 28.6,
};

const PL_DAILY: PLStatement = {
  period: 'March 7, 2026',
  periodType: 'daily',
  revenue: [
    { category: 'Revenue', subcategory: 'Flower', actual: 15200, budget: 14400, variance: 800, variancePct: 5.6, priorPeriod: 14800, ytd: 1392000 },
    { category: 'Revenue', subcategory: 'Prerolls', actual: 4800, budget: 4500, variance: 300, variancePct: 6.7, priorPeriod: 4600, ytd: 438000 },
    { category: 'Revenue', subcategory: 'Vaporizers', actual: 8800, budget: 8400, variance: 400, variancePct: 4.8, priorPeriod: 8600, ytd: 805000 },
    { category: 'Revenue', subcategory: 'Concentrates', actual: 7200, budget: 6800, variance: 400, variancePct: 5.9, priorPeriod: 7100, ytd: 660000 },
    { category: 'Revenue', subcategory: 'Edibles', actual: 2800, budget: 2600, variance: 200, variancePct: 7.7, priorPeriod: 2700, ytd: 254000 },
    { category: 'Revenue', subcategory: 'Beverages', actual: 1200, budget: 1000, variance: 200, variancePct: 20.0, priorPeriod: 1100, ytd: 107000 },
    { category: 'Revenue', subcategory: 'Less: Discounts', actual: -580, budget: -500, variance: -80, variancePct: -16.0, priorPeriod: -520, ytd: -51000 },
    { category: 'Revenue', subcategory: 'Less: Returns', actual: -65, budget: -65, variance: 0, variancePct: 0, priorPeriod: -60, ytd: -5800 },
  ],
  cogs: [
    { category: 'COGS', subcategory: 'Cannabis Materials', actual: 5980, budget: 5660, variance: -320, variancePct: -5.7, priorPeriod: 5760, ytd: 545000 },
    { category: 'COGS', subcategory: 'Non-Cannabis Materials', actual: 3170, budget: 2900, variance: -270, variancePct: -9.3, priorPeriod: 2980, ytd: 285000 },
    { category: 'COGS', subcategory: 'Direct Labor', actual: 6300, budget: 6300, variance: 0, variancePct: 0, priorPeriod: 6200, ytd: 580000 },
    { category: 'COGS', subcategory: 'Manufacturing Overhead', actual: 1360, budget: 1290, variance: -70, variancePct: -5.4, priorPeriod: 1290, ytd: 123000 },
  ],
  grossProfit: 22545,
  grossMargin: 57.3,
  opex: [
    { category: 'OpEx', subcategory: 'Sales', actual: 2840, budget: 2740, variance: -100, variancePct: -3.6, priorPeriod: 2780, ytd: 260000 },
    { category: 'OpEx', subcategory: 'Marketing', actual: 1030, budget: 1130, variance: 100, variancePct: 8.8, priorPeriod: 970, ytd: 94000 },
    { category: 'OpEx', subcategory: 'General & Admin', actual: 2100, budget: 2100, variance: 0, variancePct: 0, priorPeriod: 2070, ytd: 193000 },
    { category: 'OpEx', subcategory: 'Facilities', actual: 1550, budget: 1550, variance: 0, variancePct: 0, priorPeriod: 1550, ytd: 144000 },
    { category: 'OpEx', subcategory: 'Equipment', actual: 710, budget: 650, variance: -60, variancePct: -9.2, priorPeriod: 650, ytd: 63000 },
    { category: 'OpEx', subcategory: 'Delivery', actual: 1130, budget: 1230, variance: 100, variancePct: 8.1, priorPeriod: 1200, ytd: 107000 },
    { category: 'OpEx', subcategory: 'Software', actual: 260, budget: 260, variance: 0, variancePct: 0, priorPeriod: 260, ytd: 24000 },
    { category: 'OpEx', subcategory: 'Insurance', actual: 390, budget: 390, variance: 0, variancePct: 0, priorPeriod: 390, ytd: 36000 },
    { category: 'OpEx', subcategory: 'Professional Services', actual: 480, budget: 390, variance: -90, variancePct: -23.1, priorPeriod: 320, ytd: 38000 },
  ],
  ebitda: 12055,
  ebitdaMargin: 30.6,
  depreciation: 580,
  interest: 260,
  netIncome: 11215,
  netMargin: 28.5,
};

// ─── Cash Flow Statement ───

const CASH_FLOW: CashFlowStatement = {
  period: 'March 2026 (MTD)',
  operating: [
    { label: 'Cash Received from Sales', amount: 1152000, category: 'inflow' },
    { label: 'Paid to Suppliers', amount: -283000, category: 'outflow' },
    { label: 'Lab Testing Fees', amount: -18000, category: 'outflow' },
    { label: 'Payroll & Labor', amount: -195000, category: 'outflow' },
    { label: 'Rent & Utilities', amount: -48000, category: 'outflow' },
    { label: 'Other Operating', amount: -97000, category: 'outflow' },
  ],
  investing: [
    { label: 'Equipment Purchases', amount: -15000, category: 'outflow' },
    { label: 'Technology / Software', amount: -3000, category: 'outflow' },
  ],
  financing: [
    { label: 'Loan Payment', amount: -8000, category: 'outflow' },
    { label: 'Owner Draw', amount: -25000, category: 'outflow' },
  ],
  netChange: 28000,
  beginningCash: 142000,
  endingCash: 170000,
};

// ─── Cash Flow Projections (12 weeks) ───

const CASH_FLOW_PROJECTIONS: CashFlowProjection[] = [
  { date: 'Mar 10', expected: 175000, best: 185000, worst: 162000, basis: 'Pending AR collections' },
  { date: 'Mar 17', expected: 182000, best: 198000, worst: 158000, basis: 'Order pipeline + AR' },
  { date: 'Mar 24', expected: 178000, best: 201000, worst: 148000, basis: 'Payroll cycle impact' },
  { date: 'Mar 31', expected: 185000, best: 210000, worst: 145000, basis: 'Month-end collections' },
  { date: 'Apr 7', expected: 180000, best: 212000, worst: 138000, basis: 'Q2 order pipeline' },
  { date: 'Apr 14', expected: 172000, best: 208000, worst: 128000, basis: 'Spring planting investment' },
  { date: 'Apr 21', expected: 165000, best: 205000, worst: 118000, basis: 'Cultivation equipment spend' },
  { date: 'Apr 28', expected: 158000, best: 200000, worst: 110000, basis: 'Seasonal trough' },
  { date: 'May 5', expected: 168000, best: 210000, worst: 120000, basis: 'Recovery begins' },
  { date: 'May 12', expected: 178000, best: 218000, worst: 132000, basis: 'New account revenue' },
  { date: 'May 19', expected: 190000, best: 228000, worst: 145000, basis: 'Summer demand ramp' },
  { date: 'May 26', expected: 202000, best: 240000, worst: 158000, basis: 'Full recovery + growth' },
];

// ─── Balance Sheet ───

const BALANCE_SHEET: BalanceSheet = {
  period: 'March 7, 2026',
  currentAssets: [
    { label: 'Cash & Equivalents', amount: 170000, priorPeriod: 142000 },
    { label: 'Accounts Receivable', amount: 68000, priorPeriod: 72000 },
    { label: 'Inventory — Raw Materials', amount: 85000, priorPeriod: 78000 },
    { label: 'Inventory — Work in Progress', amount: 120000, priorPeriod: 115000 },
    { label: 'Inventory — Finished Goods', amount: 95000, priorPeriod: 88000 },
    { label: 'Prepaid Expenses', amount: 12000, priorPeriod: 12000 },
  ],
  fixedAssets: [
    { label: 'Equipment (net)', amount: 180000, priorPeriod: 185000 },
    { label: 'Leasehold Improvements', amount: 95000, priorPeriod: 98000 },
    { label: 'Vehicles (net)', amount: 45000, priorPeriod: 48000 },
  ],
  totalAssets: 870000,
  currentLiabilities: [
    { label: 'Accounts Payable', amount: 42000, priorPeriod: 38000 },
    { label: 'Accrued Wages', amount: 32000, priorPeriod: 30000 },
    { label: 'Accrued Liabilities', amount: 15000, priorPeriod: 14000 },
    { label: 'Current Portion — Long-Term Debt', amount: 24000, priorPeriod: 24000 },
  ],
  longTermLiabilities: [
    { label: 'Long-Term Loan', amount: 140000, priorPeriod: 148000 },
  ],
  totalLiabilities: 253000,
  equity: [
    { label: 'Owner Equity', amount: 200000, priorPeriod: 200000 },
    { label: 'Retained Earnings', amount: 68000, priorPeriod: 42000 },
    { label: 'Current Period Net Income', amount: 349000, priorPeriod: 321000 },
  ],
  totalEquity: 617000,
};

// ─── Invoices (30) ───

const INVOICES: Invoice[] = [
  // --- 18 Paid ---
  { id: 'inv-001', invoiceNumber: 'INV-2026-001', orderNumber: 'ORD-2401', accountId: 'acc-001', accountName: 'Greenfield Dispensary', amount: 8750, status: 'paid', issuedDate: '2026-01-10', deliveredDate: '2026-01-12', dueDate: '2026-01-19', paidDate: '2026-01-14', paidAmount: 8750, method: 'ACH', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-002', invoiceNumber: 'INV-2026-002', orderNumber: 'ORD-2412', accountId: 'acc-001', accountName: 'Greenfield Dispensary', amount: 6200, status: 'paid', issuedDate: '2026-01-22', deliveredDate: '2026-01-24', dueDate: '2026-01-31', paidDate: '2026-01-26', paidAmount: 6200, method: 'ACH', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-003', invoiceNumber: 'INV-2026-003', orderNumber: 'ORD-2430', accountId: 'acc-001', accountName: 'Greenfield Dispensary', amount: 12400, status: 'paid', issuedDate: '2026-02-05', deliveredDate: '2026-02-07', dueDate: '2026-02-14', paidDate: '2026-02-10', paidAmount: 12400, method: 'ACH', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-004', invoiceNumber: 'INV-2026-004', orderNumber: 'ORD-2405', accountId: 'acc-002', accountName: 'Pacific Leaf', amount: 5400, status: 'paid', issuedDate: '2026-01-12', deliveredDate: '2026-01-14', dueDate: '2026-01-21', paidDate: '2026-01-16', paidAmount: 5400, method: 'COD', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-005', invoiceNumber: 'INV-2026-005', orderNumber: 'ORD-2418', accountId: 'acc-002', accountName: 'Pacific Leaf', amount: 9100, status: 'paid', issuedDate: '2026-01-28', deliveredDate: '2026-01-30', dueDate: '2026-02-06', paidDate: '2026-02-01', paidAmount: 9100, method: 'ACH', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-006', invoiceNumber: 'INV-2026-006', orderNumber: 'ORD-2440', accountId: 'acc-002', accountName: 'Pacific Leaf', amount: 7300, status: 'paid', issuedDate: '2026-02-10', deliveredDate: '2026-02-12', dueDate: '2026-02-19', paidDate: '2026-02-14', paidAmount: 7300, method: 'ACH', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-007', invoiceNumber: 'INV-2026-007', orderNumber: 'ORD-2408', accountId: 'acc-003', accountName: 'Summit Cannabis', amount: 4200, status: 'paid', issuedDate: '2026-01-15', deliveredDate: '2026-01-17', dueDate: '2026-01-24', paidDate: '2026-01-20', paidAmount: 4200, method: 'ACH', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-008', invoiceNumber: 'INV-2026-008', orderNumber: 'ORD-2425', accountId: 'acc-003', accountName: 'Summit Cannabis', amount: 11500, status: 'paid', issuedDate: '2026-02-01', deliveredDate: '2026-02-03', dueDate: '2026-02-10', paidDate: '2026-02-06', paidAmount: 11500, method: 'COD', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-009', invoiceNumber: 'INV-2026-009', orderNumber: 'ORD-2410', accountId: 'acc-004', accountName: 'Olympic Greens', amount: 3800, status: 'paid', issuedDate: '2026-01-18', deliveredDate: '2026-01-20', dueDate: '2026-01-27', paidDate: '2026-01-22', paidAmount: 3800, method: 'Check', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-010', invoiceNumber: 'INV-2026-010', orderNumber: 'ORD-2438', accountId: 'acc-004', accountName: 'Olympic Greens', amount: 6900, status: 'paid', issuedDate: '2026-02-08', deliveredDate: '2026-02-10', dueDate: '2026-02-17', paidDate: '2026-02-12', paidAmount: 6900, method: 'ACH', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-011', invoiceNumber: 'INV-2026-011', orderNumber: 'ORD-2415', accountId: 'acc-005', accountName: 'Capitol Hill Collective', amount: 14800, status: 'paid', issuedDate: '2026-01-25', deliveredDate: '2026-01-27', dueDate: '2026-02-03', paidDate: '2026-01-29', paidAmount: 14800, method: 'ACH', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-012', invoiceNumber: 'INV-2026-012', orderNumber: 'ORD-2442', accountId: 'acc-005', accountName: 'Capitol Hill Collective', amount: 2900, status: 'paid', issuedDate: '2026-02-12', deliveredDate: '2026-02-14', dueDate: '2026-02-21', paidDate: '2026-02-17', paidAmount: 2900, method: 'COD', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-013', invoiceNumber: 'INV-2026-013', orderNumber: 'ORD-2420', accountId: 'acc-006', accountName: 'Cascade Wellness', amount: 5600, status: 'paid', issuedDate: '2026-01-30', deliveredDate: '2026-02-01', dueDate: '2026-02-08', paidDate: '2026-02-04', paidAmount: 5600, method: 'ACH', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-014', invoiceNumber: 'INV-2026-014', orderNumber: 'ORD-2432', accountId: 'acc-007', accountName: 'Bellingham Bloom', amount: 3200, status: 'paid', issuedDate: '2026-02-06', deliveredDate: '2026-02-08', dueDate: '2026-02-15', paidDate: '2026-02-11', paidAmount: 3200, method: 'Check', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-015', invoiceNumber: 'INV-2026-015', orderNumber: 'ORD-2445', accountId: 'acc-008', accountName: 'Evergreen Wellness', amount: 7800, status: 'paid', issuedDate: '2026-02-15', deliveredDate: '2026-02-17', dueDate: '2026-02-24', paidDate: '2026-02-20', paidAmount: 7800, method: 'ACH', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-016', invoiceNumber: 'INV-2026-016', orderNumber: 'ORD-2448', accountId: 'acc-006', accountName: 'Cascade Wellness', amount: 4100, status: 'paid', issuedDate: '2026-02-18', deliveredDate: '2026-02-20', dueDate: '2026-02-27', paidDate: '2026-02-24', paidAmount: 4100, method: 'COD', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-017', invoiceNumber: 'INV-2026-017', orderNumber: 'ORD-2452', accountId: 'acc-007', accountName: 'Bellingham Bloom', amount: 5500, status: 'paid', issuedDate: '2026-02-22', deliveredDate: '2026-02-24', dueDate: '2026-03-03', paidDate: '2026-02-27', paidAmount: 5500, method: 'Check', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },
  { id: 'inv-018', invoiceNumber: 'INV-2026-018', orderNumber: 'ORD-2456', accountId: 'acc-008', accountName: 'Evergreen Wellness', amount: 9200, status: 'paid', issuedDate: '2026-02-25', deliveredDate: '2026-02-27', dueDate: '2026-03-06', paidDate: '2026-03-03', paidAmount: 9200, method: 'ACH', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 0 },

  // --- 6 Pending (within compliance window) ---
  { id: 'inv-019', invoiceNumber: 'INV-2026-019', orderNumber: 'ORD-2460', accountId: 'acc-004', accountName: 'Olympic Greens', amount: 8200, status: 'pending', issuedDate: '2026-03-01', deliveredDate: '2026-03-03', dueDate: '2026-03-10', daysOutstanding: 4, dunningStage: 0, complianceStatus: 'approaching', complianceDaysRemaining: 3 },
  { id: 'inv-020', invoiceNumber: 'INV-2026-020', orderNumber: 'ORD-2462', accountId: 'acc-005', accountName: 'Capitol Hill Collective', amount: 3400, status: 'pending', issuedDate: '2026-03-02', deliveredDate: '2026-03-04', dueDate: '2026-03-11', daysOutstanding: 3, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 4 },
  { id: 'inv-021', invoiceNumber: 'INV-2026-021', orderNumber: 'ORD-2465', accountId: 'acc-003', accountName: 'Summit Cannabis', amount: 6800, status: 'pending', issuedDate: '2026-03-03', deliveredDate: '2026-03-05', dueDate: '2026-03-12', daysOutstanding: 2, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 5 },
  { id: 'inv-022', invoiceNumber: 'INV-2026-022', orderNumber: 'ORD-2468', accountId: 'acc-001', accountName: 'Greenfield Dispensary', amount: 11200, status: 'pending', issuedDate: '2026-03-04', deliveredDate: '2026-03-06', dueDate: '2026-03-13', daysOutstanding: 1, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 5 },
  { id: 'inv-023', invoiceNumber: 'INV-2026-023', orderNumber: 'ORD-2470', accountId: 'acc-002', accountName: 'Pacific Leaf', amount: 14500, status: 'pending', issuedDate: '2026-03-05', deliveredDate: '2026-03-07', dueDate: '2026-03-14', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 5 },
  { id: 'inv-024', invoiceNumber: 'INV-2026-024', orderNumber: 'ORD-2472', accountId: 'acc-008', accountName: 'Evergreen Wellness', amount: 7900, status: 'pending', issuedDate: '2026-03-06', deliveredDate: '2026-03-07', dueDate: '2026-03-14', daysOutstanding: 0, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 5 },

  // --- 3 Overdue ---
  { id: 'inv-025', invoiceNumber: 'INV-2026-025', orderNumber: 'ORD-2454', accountId: 'acc-009', accountName: 'Rainier Remedies', amount: 4200, status: 'overdue', issuedDate: '2026-02-20', deliveredDate: '2026-02-24', dueDate: '2026-03-03', daysOutstanding: 7, dunningStage: 3, lastReminderDate: '2026-03-06', complianceStatus: 'overdue', complianceDaysRemaining: -4 },
  { id: 'inv-026', invoiceNumber: 'INV-2026-026', orderNumber: 'ORD-2457', accountId: 'acc-009', accountName: 'Rainier Remedies', amount: 3800, status: 'overdue', issuedDate: '2026-02-22', deliveredDate: '2026-02-26', dueDate: '2026-03-05', daysOutstanding: 6, dunningStage: 3, lastReminderDate: '2026-03-06', complianceStatus: 'overdue', complianceDaysRemaining: -2 },
  { id: 'inv-027', invoiceNumber: 'INV-2026-027', orderNumber: 'ORD-2446', accountId: 'acc-010', accountName: 'Emerald City Cannabis', amount: 4100, status: 'overdue', issuedDate: '2026-02-15', deliveredDate: '2026-02-19', dueDate: '2026-02-26', daysOutstanding: 9, dunningStage: 4, lastReminderDate: '2026-03-05', complianceStatus: 'overdue', complianceDaysRemaining: -9 },

  // --- 3 Partial ---
  { id: 'inv-028', invoiceNumber: 'INV-2026-028', orderNumber: 'ORD-2449', accountId: 'acc-011', accountName: 'Harbor Cannabis', amount: 9500, status: 'partial', issuedDate: '2026-02-18', deliveredDate: '2026-02-20', dueDate: '2026-02-27', paidDate: '2026-02-25', paidAmount: 6650, method: 'ACH', daysOutstanding: 8, dunningStage: 1, lastReminderDate: '2026-03-04', complianceStatus: 'overdue', complianceDaysRemaining: -8 },
  { id: 'inv-029', invoiceNumber: 'INV-2026-029', orderNumber: 'ORD-2458', accountId: 'acc-011', accountName: 'Harbor Cannabis', amount: 6800, status: 'partial', issuedDate: '2026-02-26', deliveredDate: '2026-02-28', dueDate: '2026-03-07', paidDate: '2026-03-05', paidAmount: 4080, method: 'Check', daysOutstanding: 2, dunningStage: 0, complianceStatus: 'approaching', complianceDaysRemaining: 2 },
  { id: 'inv-030', invoiceNumber: 'INV-2026-030', orderNumber: 'ORD-2464', accountId: 'acc-006', accountName: 'Cascade Wellness', amount: 5200, status: 'partial', issuedDate: '2026-03-01', deliveredDate: '2026-03-03', dueDate: '2026-03-10', paidDate: '2026-03-06', paidAmount: 2600, method: 'COD', daysOutstanding: 1, dunningStage: 0, complianceStatus: 'compliant', complianceDaysRemaining: 4 },
];

// ─── AR Data ───

const AR_METRICS: ARMetrics = {
  totalAR: 68000,
  overdueAmount: 16000,
  overdueCount: 3,
  dso: 3.8,
  dsoTrend: -0.6,
  complianceRate: 89,
  collectionVelocity: 2.1,
  projectedInflows30d: 58000,
};

const AR_AGING: ARAgingBucket[] = [
  { label: 'Current (<5 days)', count: 18, amount: 52000, percentage: 76.5, color: '#22C55E', trend: 2 },
  { label: '6-14 days', count: 3, amount: 8000, percentage: 11.8, color: '#F59E0B', trend: -1 },
  { label: '15-30 days', count: 2, amount: 4200, percentage: 6.2, color: '#F97316', trend: 0 },
  { label: '30+ days', count: 1, amount: 4100, percentage: 6.0, color: '#EF4444', trend: -1 },
];

// ─── Vendors (12) ───

const VENDORS: Vendor[] = [
  { id: 'ven-001', name: 'Pacific Packaging Co', category: 'Packaging', paymentTerms: 'Net 30', ytdSpend: 24600, avgPaymentDays: 22, lastOrderDate: '2026-03-01', scorecard: { reliability: 92, pricing: 78, quality: 88 } },
  { id: 'ven-002', name: 'NW Nutrients Supply', category: 'Cultivation', paymentTerms: 'Net 15', ytdSpend: 11400, avgPaymentDays: 12, lastOrderDate: '2026-02-28', scorecard: { reliability: 95, pricing: 85, quality: 92 } },
  { id: 'ven-003', name: 'Confidence Analytics', category: 'Lab Testing', paymentTerms: 'Per Submission', ytdSpend: 7200, avgPaymentDays: 7, lastOrderDate: '2026-03-06', scorecard: { reliability: 98, pricing: 72, quality: 96 } },
  { id: 'ven-004', name: 'Washington Commercial Properties', category: 'Facilities', paymentTerms: 'Monthly', ytdSpend: 36000, avgPaymentDays: 1, lastOrderDate: '2026-03-01', scorecard: { reliability: 100, pricing: 70, quality: 85 } },
  { id: 'ven-005', name: 'Puget Sound Electric', category: 'Utilities', paymentTerms: 'Monthly', ytdSpend: 14400, avgPaymentDays: 5, lastOrderDate: '2026-03-01', scorecard: { reliability: 100, pricing: 65, quality: 90 } },
  { id: 'ven-006', name: 'Green Fleet Services', category: 'Vehicle Maintenance', paymentTerms: 'As Needed', ytdSpend: 3600, avgPaymentDays: 10, lastOrderDate: '2026-02-22', scorecard: { reliability: 88, pricing: 80, quality: 85 } },
  { id: 'ven-007', name: 'Cascade Insurance Group', category: 'Insurance', paymentTerms: 'Quarterly', ytdSpend: 3600, avgPaymentDays: 1, lastOrderDate: '2026-01-01', scorecard: { reliability: 100, pricing: 68, quality: 90 } },
  { id: 'ven-008', name: 'Cannabis Law Partners', category: 'Legal', paymentTerms: 'As Needed', ytdSpend: 7500, avgPaymentDays: 18, lastOrderDate: '2026-03-04', scorecard: { reliability: 95, pricing: 55, quality: 95 } },
  { id: 'ven-009', name: 'TechServe Solutions', category: 'IT / Software', paymentTerms: 'Monthly', ytdSpend: 2550, avgPaymentDays: 3, lastOrderDate: '2026-03-01', scorecard: { reliability: 97, pricing: 82, quality: 88 } },
  { id: 'ven-010', name: 'Boveda Inc', category: 'Packaging', paymentTerms: 'Net 30', ytdSpend: 3300, avgPaymentDays: 25, lastOrderDate: '2026-02-15', scorecard: { reliability: 94, pricing: 75, quality: 95 } },
  { id: 'ven-011', name: 'Steep Hill Labs', category: 'Lab Testing', paymentTerms: 'Per Submission', ytdSpend: 2400, avgPaymentDays: 7, lastOrderDate: '2026-02-20', scorecard: { reliability: 90, pricing: 78, quality: 92 } },
  { id: 'ven-012', name: 'Premier Janitorial', category: 'Facilities', paymentTerms: 'Weekly', ytdSpend: 4800, avgPaymentDays: 3, lastOrderDate: '2026-03-03', scorecard: { reliability: 92, pricing: 88, quality: 82 } },
];

// ─── Bills (20) ───

const BILLS: Bill[] = [
  // 12 Paid
  { id: 'bill-001', vendorId: 'ven-004', vendorName: 'Washington Commercial Properties', description: 'January rent', amount: 12000, status: 'paid', issuedDate: '2026-01-01', dueDate: '2026-01-01', paidDate: '2026-01-01', category: 'Facilities' },
  { id: 'bill-002', vendorId: 'ven-005', vendorName: 'Puget Sound Electric', description: 'January electricity', amount: 4800, status: 'paid', issuedDate: '2026-01-05', dueDate: '2026-01-20', paidDate: '2026-01-18', category: 'Utilities' },
  { id: 'bill-003', vendorId: 'ven-001', vendorName: 'Pacific Packaging Co', description: 'Jars, lids, labels — Jan batch', amount: 8200, status: 'paid', issuedDate: '2026-01-10', dueDate: '2026-02-09', paidDate: '2026-02-05', category: 'Packaging' },
  { id: 'bill-004', vendorId: 'ven-002', vendorName: 'NW Nutrients Supply', description: 'Nutrient solution Q1 order', amount: 3800, status: 'paid', issuedDate: '2026-01-15', dueDate: '2026-01-30', paidDate: '2026-01-28', category: 'Cultivation' },
  { id: 'bill-005', vendorId: 'ven-003', vendorName: 'Confidence Analytics', description: '12 COA submissions — January', amount: 2400, status: 'paid', issuedDate: '2026-01-31', dueDate: '2026-02-07', paidDate: '2026-02-05', category: 'Lab Testing' },
  { id: 'bill-006', vendorId: 'ven-004', vendorName: 'Washington Commercial Properties', description: 'February rent', amount: 12000, status: 'paid', issuedDate: '2026-02-01', dueDate: '2026-02-01', paidDate: '2026-02-01', category: 'Facilities' },
  { id: 'bill-007', vendorId: 'ven-005', vendorName: 'Puget Sound Electric', description: 'February electricity', amount: 4800, status: 'paid', issuedDate: '2026-02-05', dueDate: '2026-02-20', paidDate: '2026-02-18', category: 'Utilities' },
  { id: 'bill-008', vendorId: 'ven-009', vendorName: 'TechServe Solutions', description: 'Feb IT support + licenses', amount: 850, status: 'paid', issuedDate: '2026-02-01', dueDate: '2026-02-05', paidDate: '2026-02-03', category: 'IT / Software' },
  { id: 'bill-009', vendorId: 'ven-012', vendorName: 'Premier Janitorial', description: 'Feb cleaning — 4 visits', amount: 1600, status: 'paid', issuedDate: '2026-02-28', dueDate: '2026-03-03', paidDate: '2026-03-02', category: 'Facilities' },
  { id: 'bill-010', vendorId: 'ven-006', vendorName: 'Green Fleet Services', description: 'Van brake service + oil change', amount: 1200, status: 'paid', issuedDate: '2026-02-22', dueDate: '2026-03-04', paidDate: '2026-03-03', category: 'Vehicle Maintenance' },
  { id: 'bill-011', vendorId: 'ven-010', vendorName: 'Boveda Inc', description: 'Humidity packs — 2000 count', amount: 1100, status: 'paid', issuedDate: '2026-02-15', dueDate: '2026-03-17', paidDate: '2026-03-05', category: 'Packaging' },
  { id: 'bill-012', vendorId: 'ven-008', vendorName: 'Cannabis Law Partners', description: 'License renewal consultation', amount: 2500, status: 'paid', issuedDate: '2026-02-10', dueDate: '2026-02-28', paidDate: '2026-02-26', category: 'Legal' },

  // 5 Pending
  { id: 'bill-013', vendorId: 'ven-004', vendorName: 'Washington Commercial Properties', description: 'March rent', amount: 12000, status: 'pending', issuedDate: '2026-03-01', dueDate: '2026-03-01', category: 'Facilities' },
  { id: 'bill-014', vendorId: 'ven-001', vendorName: 'Pacific Packaging Co', description: 'Jars, lids, labels — Feb batch', amount: 8200, status: 'pending', issuedDate: '2026-02-28', dueDate: '2026-03-30', category: 'Packaging' },
  { id: 'bill-015', vendorId: 'ven-009', vendorName: 'TechServe Solutions', description: 'Mar IT support + licenses', amount: 850, status: 'pending', issuedDate: '2026-03-01', dueDate: '2026-03-05', category: 'IT / Software' },
  { id: 'bill-016', vendorId: 'ven-003', vendorName: 'Confidence Analytics', description: '10 COA submissions — February', amount: 2000, status: 'pending', issuedDate: '2026-02-28', dueDate: '2026-03-07', category: 'Lab Testing' },
  { id: 'bill-017', vendorId: 'ven-002', vendorName: 'NW Nutrients Supply', description: 'Nutrient restock — March', amount: 3800, status: 'pending', issuedDate: '2026-03-05', dueDate: '2026-03-20', category: 'Cultivation' },

  // 3 Overdue
  { id: 'bill-018', vendorId: 'ven-008', vendorName: 'Cannabis Law Partners', description: 'Compliance audit — Feb', amount: 2500, status: 'overdue', issuedDate: '2026-02-15', dueDate: '2026-03-01', category: 'Legal' },
  { id: 'bill-019', vendorId: 'ven-011', vendorName: 'Steep Hill Labs', description: '3 rush COA submissions', amount: 800, status: 'overdue', issuedDate: '2026-02-20', dueDate: '2026-02-27', category: 'Lab Testing' },
  { id: 'bill-020', vendorId: 'ven-012', vendorName: 'Premier Janitorial', description: 'Mar week 1 cleaning', amount: 400, status: 'overdue', issuedDate: '2026-03-03', dueDate: '2026-03-05', category: 'Facilities' },
];

// ─── AP Metrics ───

const AP_METRICS: APMetrics = {
  totalAP: 42000,
  overdueAmount: 3800,
  recurringMonthly: 38000,
  upcomingThisWeek: 12000,
  vendorCount: 12,
};

// ─── Export Functions ───

const delay = () => new Promise<void>((r) => setTimeout(r, 300));

export async function getSpeedometers(): Promise<FinanceSpeedometer[]> {
  await delay();
  return [...SPEEDOMETERS];
}

export async function getCFOBriefing(): Promise<CFOBriefingItem[]> {
  await delay();
  return [...CFO_BRIEFING];
}

export async function getPLStatement(period?: string): Promise<PLStatement> {
  await delay();
  if (period === 'daily') return { ...PL_DAILY };
  if (period === 'weekly') return { ...PL_WEEKLY };
  return { ...PL_MONTHLY };
}

export async function getCashFlowStatement(): Promise<CashFlowStatement> {
  await delay();
  return { ...CASH_FLOW };
}

export async function getBalanceSheet(): Promise<BalanceSheet> {
  await delay();
  return { ...BALANCE_SHEET };
}

export async function getCashFlowProjections(): Promise<CashFlowProjection[]> {
  await delay();
  return [...CASH_FLOW_PROJECTIONS];
}

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
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.accountName.toLowerCase().includes(q) ||
        inv.orderNumber.toLowerCase().includes(q)
    );
  }
  return results;
}

export async function getARMetrics(): Promise<ARMetrics> {
  await delay();
  return { ...AR_METRICS };
}

export async function getARAging(): Promise<ARAgingBucket[]> {
  await delay();
  return [...AR_AGING];
}

export async function getVendors(): Promise<Vendor[]> {
  await delay();
  return [...VENDORS];
}

export async function getBills(
  filters?: { status?: BillStatus; search?: string }
): Promise<Bill[]> {
  await delay();
  let results = [...BILLS];
  if (filters?.status) {
    results = results.filter((b) => b.status === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (b) =>
        b.vendorName.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    );
  }
  return results;
}

export async function getAPMetrics(): Promise<APMetrics> {
  await delay();
  return { ...AP_METRICS };
}
