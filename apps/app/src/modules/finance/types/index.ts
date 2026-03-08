// Finance Module Types — V3

// ─── Speedometer Gauges ───

export type SpeedometerZone = 'green' | 'amber' | 'red';

export interface SpeedometerFactor {
  label: string;
  value: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface FinanceSpeedometer {
  id: string;
  label: string;
  score: number;
  trend: number;
  zone: SpeedometerZone;
  factors: SpeedometerFactor[];
}

// ─── Profit & Loss ───

export interface PLLineItem {
  category: string;
  subcategory: string;
  actual: number;
  budget: number;
  variance: number;
  variancePct: number;
  priorPeriod: number;
  ytd: number;
}

export type PLPeriodType = 'daily' | 'weekly' | 'monthly';

export interface PLStatement {
  period: string;
  periodType: PLPeriodType;
  revenue: PLLineItem[];
  cogs: PLLineItem[];
  grossProfit: number;
  grossMargin: number;
  opex: PLLineItem[];
  ebitda: number;
  ebitdaMargin: number;
  depreciation: number;
  interest: number;
  netIncome: number;
  netMargin: number;
}

// ─── Cash Flow ───

export interface CashFlowLine {
  label: string;
  amount: number;
  category: 'inflow' | 'outflow';
}

export interface CashFlowStatement {
  period: string;
  operating: CashFlowLine[];
  investing: CashFlowLine[];
  financing: CashFlowLine[];
  netChange: number;
  beginningCash: number;
  endingCash: number;
}

export interface CashFlowProjection {
  date: string;
  expected: number;
  best: number;
  worst: number;
  basis: string;
}

// ─── Balance Sheet ───

export interface BSLineItem {
  label: string;
  amount: number;
  priorPeriod: number;
}

export interface BalanceSheet {
  period: string;
  currentAssets: BSLineItem[];
  fixedAssets: BSLineItem[];
  totalAssets: number;
  currentLiabilities: BSLineItem[];
  longTermLiabilities: BSLineItem[];
  totalLiabilities: number;
  equity: BSLineItem[];
  totalEquity: number;
}

// ─── CFO Briefing ───

export type BriefingSeverity = 'critical' | 'warning' | 'info' | 'positive';

export interface CFOBriefingItem {
  id: string;
  severity: BriefingSeverity;
  title: string;
  description: string;
  metric?: string;
  recommendation?: string;
}

// ─── Invoices & AR ───

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'partial';

export type ComplianceStatus = 'compliant' | 'approaching' | 'overdue';

export interface Invoice {
  [key: string]: unknown;
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  accountId: string;
  accountName: string;
  amount: number;
  status: InvoiceStatus;
  issuedDate: string;
  deliveredDate: string;
  dueDate: string;
  paidDate?: string;
  paidAmount?: number;
  method?: string;
  daysOutstanding: number;
  dunningStage: number;
  lastReminderDate?: string;
  complianceStatus: ComplianceStatus;
  complianceDaysRemaining: number;
}

export interface ARMetrics {
  totalAR: number;
  overdueAmount: number;
  overdueCount: number;
  dso: number;
  dsoTrend: number;
  complianceRate: number;
  collectionVelocity: number;
  projectedInflows30d: number;
}

export interface ARAgingBucket {
  label: string;
  count: number;
  amount: number;
  percentage: number;
  color: string;
  trend: number;
}

// ─── Vendors & AP ───

export interface VendorScorecard {
  reliability: number;
  pricing: number;
  quality: number;
}

export interface Vendor {
  [key: string]: unknown;
  id: string;
  name: string;
  category: string;
  paymentTerms: string;
  ytdSpend: number;
  avgPaymentDays: number;
  lastOrderDate: string;
  scorecard: VendorScorecard;
}

export type BillStatus = 'pending' | 'paid' | 'overdue';

export interface Bill {
  [key: string]: unknown;
  id: string;
  vendorId: string;
  vendorName: string;
  description: string;
  amount: number;
  status: BillStatus;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  category: string;
}

export interface APMetrics {
  totalAP: number;
  overdueAmount: number;
  recurringMonthly: number;
  upcomingThisWeek: number;
  vendorCount: number;
}
