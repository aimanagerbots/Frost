'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getInvoices,
  getARaging,
  getFinanceMetrics,
  getRevenueByPeriod,
  getRevenueByCategory,
} from '@/mocks/finance';
import type { InvoiceStatus } from '@/modules/finance/types';

export function useInvoices(filters?: { status?: InvoiceStatus; search?: string }) {
  return useQuery({
    queryKey: ['finance', 'invoices', filters],
    queryFn: () => getInvoices(filters),
  });
}

export function useARaging() {
  return useQuery({
    queryKey: ['finance', 'ar-aging'],
    queryFn: () => getARaging(),
  });
}

export function useFinanceMetrics() {
  return useQuery({
    queryKey: ['finance', 'metrics'],
    queryFn: () => getFinanceMetrics(),
  });
}

export function useRevenueByPeriod() {
  return useQuery({
    queryKey: ['finance', 'revenue-period'],
    queryFn: () => getRevenueByPeriod(),
  });
}

export function useRevenueByCategory() {
  return useQuery({
    queryKey: ['finance', 'revenue-category'],
    queryFn: () => getRevenueByCategory(),
  });
}
