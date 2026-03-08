'use client';

import { useQuery } from '@tanstack/react-query';
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
import type { InvoiceStatus, BillStatus } from '@/modules/finance/types';

export function useSpeedometers() {
  return useQuery({ queryKey: ['finance', 'speedometers'], queryFn: getSpeedometers });
}

export function useCFOBriefing() {
  return useQuery({ queryKey: ['finance', 'cfo-briefing'], queryFn: getCFOBriefing });
}

export function usePLStatement(period?: string) {
  return useQuery({ queryKey: ['finance', 'pl', period], queryFn: () => getPLStatement(period) });
}

export function useCashFlowStatement() {
  return useQuery({ queryKey: ['finance', 'cashflow'], queryFn: getCashFlowStatement });
}

export function useBalanceSheet() {
  return useQuery({ queryKey: ['finance', 'balance-sheet'], queryFn: getBalanceSheet });
}

export function useCashFlowProjections() {
  return useQuery({ queryKey: ['finance', 'cashflow-projections'], queryFn: getCashFlowProjections });
}

export function useInvoices(filters?: { status?: InvoiceStatus; search?: string }) {
  return useQuery({ queryKey: ['finance', 'invoices', filters], queryFn: () => getInvoices(filters) });
}

export function useARMetrics() {
  return useQuery({ queryKey: ['finance', 'ar-metrics'], queryFn: getARMetrics });
}

export function useARAging() {
  return useQuery({ queryKey: ['finance', 'ar-aging'], queryFn: getARAging });
}

export function useVendors() {
  return useQuery({ queryKey: ['finance', 'vendors'], queryFn: getVendors });
}

export function useBills(filters?: { status?: BillStatus; search?: string }) {
  return useQuery({ queryKey: ['finance', 'bills', filters], queryFn: () => getBills(filters) });
}

export function useAPMetrics() {
  return useQuery({ queryKey: ['finance', 'ap-metrics'], queryFn: getAPMetrics });
}
