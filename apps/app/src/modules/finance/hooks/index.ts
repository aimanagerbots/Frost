'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import {
  getSpeedometers,
  getCFOBriefing,
  getPLStatement,
  getCashFlowStatement,
  getBalanceSheet,
  getCashFlowProjections,
  getInvoices,
  getARMetrics,
  getARAging,
  getVendors,
  getBills,
  getAPMetrics,
} from '@/mocks/finance';
import type {
  FinanceSpeedometer,
  CFOBriefingItem,
  PLStatement,
  CashFlowStatement,
  BalanceSheet,
  CashFlowProjection,
  Invoice,
  ARMetrics,
  ARAgingBucket,
  Vendor,
  Bill,
  APMetrics,
  InvoiceStatus,
  BillStatus,
} from '@/modules/finance/types';

export function useSpeedometers() {
  return useDemoQuery({
    queryKey: ['finance', 'speedometers'],
    demoQueryFn: getSpeedometers,
    emptyValue: [] as FinanceSpeedometer[],
  });
}

export function useCFOBriefing() {
  return useDemoQuery({
    queryKey: ['finance', 'cfo-briefing'],
    demoQueryFn: getCFOBriefing,
    emptyValue: [] as CFOBriefingItem[],
  });
}

export function usePLStatement(period?: string) {
  return useDemoQuery({
    queryKey: ['finance', 'pl', period],
    demoQueryFn: () => getPLStatement(period),
    emptyValue: {
      period: '',
      periodType: 'monthly',
      revenue: [],
      cogs: [],
      grossProfit: 0,
      grossMargin: 0,
      opex: [],
      ebitda: 0,
      ebitdaMargin: 0,
      depreciation: 0,
      interest: 0,
      netIncome: 0,
      netMargin: 0,
    } as PLStatement,
  });
}

export function useCashFlowStatement() {
  return useDemoQuery({
    queryKey: ['finance', 'cashflow'],
    demoQueryFn: getCashFlowStatement,
    emptyValue: {
      period: '',
      operating: [],
      investing: [],
      financing: [],
      netChange: 0,
      beginningCash: 0,
      endingCash: 0,
    } as CashFlowStatement,
  });
}

export function useBalanceSheet() {
  return useDemoQuery({
    queryKey: ['finance', 'balance-sheet'],
    demoQueryFn: getBalanceSheet,
    emptyValue: {
      period: '',
      currentAssets: [],
      fixedAssets: [],
      totalAssets: 0,
      currentLiabilities: [],
      longTermLiabilities: [],
      totalLiabilities: 0,
      equity: [],
      totalEquity: 0,
    } as BalanceSheet,
  });
}

export function useCashFlowProjections() {
  return useDemoQuery({
    queryKey: ['finance', 'cashflow-projections'],
    demoQueryFn: getCashFlowProjections,
    emptyValue: [] as CashFlowProjection[],
  });
}

export function useInvoices(filters?: { status?: InvoiceStatus; search?: string }) {
  return useDemoQuery({
    queryKey: ['finance', 'invoices', filters],
    demoQueryFn: () => getInvoices(filters),
    emptyValue: [] as Invoice[],
  });
}

export function useARMetrics() {
  return useDemoQuery({
    queryKey: ['finance', 'ar-metrics'],
    demoQueryFn: getARMetrics,
    emptyValue: {
      totalAR: 0,
      overdueAmount: 0,
      overdueCount: 0,
      dso: 0,
      dsoTrend: 0,
      complianceRate: 0,
      collectionVelocity: 0,
      projectedInflows30d: 0,
    } as ARMetrics,
  });
}

export function useARAging() {
  return useDemoQuery({
    queryKey: ['finance', 'ar-aging'],
    demoQueryFn: getARAging,
    emptyValue: [] as ARAgingBucket[],
  });
}

export function useVendors() {
  return useDemoQuery({
    queryKey: ['finance', 'vendors'],
    demoQueryFn: getVendors,
    emptyValue: [] as Vendor[],
  });
}

export function useBills(filters?: { status?: BillStatus; search?: string }) {
  return useDemoQuery({
    queryKey: ['finance', 'bills', filters],
    demoQueryFn: () => getBills(filters),
    emptyValue: [] as Bill[],
  });
}

export function useAPMetrics() {
  return useDemoQuery({
    queryKey: ['finance', 'ap-metrics'],
    demoQueryFn: getAPMetrics,
    emptyValue: {
      totalAP: 0,
      overdueAmount: 0,
      recurringMonthly: 0,
      upcomingThisWeek: 0,
      vendorCount: 0,
    } as APMetrics,
  });
}
