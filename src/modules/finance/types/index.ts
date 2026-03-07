export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'partial';

export interface Invoice {
  [key: string]: unknown;
  id: string;
  orderNumber: string;
  accountName: string;
  accountId: string;
  amount: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  paidAmount?: number;
  method?: string;
  daysOutstanding: number;
}

export interface ARAgingBucket {
  label: string;
  count: number;
  amount: number;
  color: string;
}

export interface FinanceMetrics {
  totalAR: number;
  overdueAmount: number;
  revenueThisMonth: number;
  revenuePriorMonth: number;
  avgDaysToPay: number;
  collectionRate: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface RevenueByCategoryPoint {
  category: string;
  revenue: number;
  percentage: number;
}
