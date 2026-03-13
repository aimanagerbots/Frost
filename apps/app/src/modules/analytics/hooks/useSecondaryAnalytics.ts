'use client';

import { useQuery } from '@tanstack/react-query';
import { accounts, salesReps } from '@/mocks/crm';

// ── Types ────────────────────────────────────────────────────────

export type AgingStatus = 'recent' | 'normal' | 'aging' | 'overdue';

export interface LastOrderedRow {
  accountName: string;
  lastOrderDate: string;
  daysSince: number;
  status: AgingStatus;
  assignedRep: string;
}

export interface MonthlyComparisonRow {
  month: string;
  currentYear: number;
  priorYear: number;
  change: number;
  changePercent: number;
}

export interface ProductLineSalesData {
  productLine: string;
  totalRevenue: number;
  accounts: { name: string; revenue: number; percentage: number }[];
}

export type InventoryStatus = 'critical' | 'low' | 'adequate' | 'surplus';

export interface ExpectedDaysRow {
  category: string;
  currentStock: number;
  dailyUsage: number;
  daysOfInventory: number;
  reorderPoint: number;
  status: InventoryStatus;
}

// ── Helpers ──────────────────────────────────────────────────────

const REP_MAP = Object.fromEntries(salesReps.map((r) => [r.id, r.name]));

function seededValue(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// ── Last Ordered By Account ──────────────────────────────────────

function generateLastOrdered(): LastOrderedRow[] {
  const referenceDate = new Date('2026-03-12');

  return accounts
    .filter((a) => a.lastOrderDate)
    .map((a) => {
      const lastDate = new Date(a.lastOrderDate!);
      const daysSince = Math.floor(
        (referenceDate.getTime() - lastDate.getTime()) / 86400000
      );
      let status: AgingStatus;
      if (daysSince <= 7) status = 'recent';
      else if (daysSince <= 14) status = 'normal';
      else if (daysSince <= 30) status = 'aging';
      else status = 'overdue';

      return {
        accountName: a.name,
        lastOrderDate: a.lastOrderDate!,
        daysSince,
        status,
        assignedRep: REP_MAP[a.assignedRepId] ?? 'Unassigned',
      };
    })
    .sort((a, b) => b.daysSince - a.daysSince);
}

export function useLastOrderedByAccount() {
  return useQuery({
    queryKey: ['analytics', 'last-ordered'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return generateLastOrdered();
    },
  });
}

// ── Monthly Sales Comparison ─────────────────────────────────────

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// Seasonal multipliers: higher in summer/fall harvest season
const SEASONAL = [0.85, 0.88, 0.95, 1.0, 1.05, 1.1, 1.15, 1.18, 1.12, 1.05, 0.92, 0.80];

function generateMonthlySalesComparison(): MonthlyComparisonRow[] {
  const currentBase = 180000;
  const priorBase = 155000;

  return MONTH_NAMES.map((month, i) => {
    const seasonFactor = SEASONAL[i];
    const currentVariation = 1 + (seededValue(i + 200) - 0.5) * 0.15;
    const priorVariation = 1 + (seededValue(i + 300) - 0.5) * 0.15;

    const currentYear = Math.round(currentBase * seasonFactor * currentVariation);
    const priorYear = Math.round(priorBase * seasonFactor * priorVariation);
    const change = currentYear - priorYear;
    const changePercent = Math.round((change / priorYear) * 1000) / 10;

    return { month, currentYear, priorYear, change, changePercent };
  });
}

export function useMonthlySalesComparison() {
  return useQuery({
    queryKey: ['analytics', 'monthly-comparison'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return generateMonthlySalesComparison();
    },
  });
}

// ── Product-Line Sales by Account ────────────────────────────────

const PRODUCT_LINES = ['flower', 'preroll', 'vaporizer', 'concentrate', 'edible', 'beverage'];

function generateProductLineSales(): ProductLineSalesData[] {
  return PRODUCT_LINES.map((productLine) => {
    const matchingAccounts = accounts
      .filter((a) => a.categoryMix.some((cm) => cm.category === productLine && cm.revenue > 0))
      .map((a) => {
        const match = a.categoryMix.find((cm) => cm.category === productLine);
        return {
          name: a.name,
          revenue: match?.revenue ?? 0,
          percentage: match?.percentage ?? 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    const totalRevenue = matchingAccounts.reduce((sum, a) => sum + a.revenue, 0);

    return { productLine, totalRevenue, accounts: matchingAccounts };
  });
}

export function useProductLineSalesByAccount() {
  return useQuery({
    queryKey: ['analytics', 'product-line-sales'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return generateProductLineSales();
    },
  });
}

// ── Expected Days of Inventory ───────────────────────────────────

const CATEGORY_LABELS = ['Flower', 'Preroll', 'Vaporizer', 'Concentrate', 'Edible', 'Beverage'];
const STOCKS = [4200, 2800, 1500, 1800, 3200, 900];
const DAILY_USAGES = [180, 95, 45, 60, 85, 22];
const REORDER_POINTS = [2500, 1400, 700, 900, 1200, 350];

function generateExpectedDays(): ExpectedDaysRow[] {
  return CATEGORY_LABELS.map((category, i) => {
    const currentStock = STOCKS[i];
    const dailyUsage = DAILY_USAGES[i];
    const daysOfInventory = Math.round(currentStock / dailyUsage);
    const reorderPoint = REORDER_POINTS[i];

    let status: InventoryStatus;
    if (daysOfInventory < 7) status = 'critical';
    else if (daysOfInventory < 14) status = 'low';
    else if (daysOfInventory < 30) status = 'adequate';
    else status = 'surplus';

    return { category, currentStock, dailyUsage, daysOfInventory, reorderPoint, status };
  });
}

export function useExpectedDaysOfInventory() {
  return useQuery({
    queryKey: ['analytics', 'expected-days'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return generateExpectedDays();
    },
  });
}
