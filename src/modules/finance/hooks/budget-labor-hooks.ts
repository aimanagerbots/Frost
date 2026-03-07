'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getBudgetByDivision,
  getBudgetScenarios,
  getCapexItems,
  getLaborData,
  getLaborMetrics,
  getLaborAllocation,
  getSchedulingData,
  getLaborRecommendations,
  getCostPerUnitTrends,
} from '@/mocks/finance-budget-labor';

export function useBudgetByDivision() {
  return useQuery({ queryKey: ['finance', 'budget-divisions'], queryFn: getBudgetByDivision });
}

export function useBudgetScenarios() {
  return useQuery({ queryKey: ['finance', 'budget-scenarios'], queryFn: getBudgetScenarios });
}

export function useCapexItems() {
  return useQuery({ queryKey: ['finance', 'capex'], queryFn: getCapexItems });
}

export function useLaborData() {
  return useQuery({ queryKey: ['finance', 'labor-data'], queryFn: getLaborData });
}

export function useLaborMetrics() {
  return useQuery({ queryKey: ['finance', 'labor-metrics'], queryFn: getLaborMetrics });
}

export function useLaborAllocation() {
  return useQuery({ queryKey: ['finance', 'labor-allocation'], queryFn: getLaborAllocation });
}

export function useSchedulingData() {
  return useQuery({ queryKey: ['finance', 'scheduling'], queryFn: getSchedulingData });
}

export function useLaborRecommendations() {
  return useQuery({ queryKey: ['finance', 'labor-recommendations'], queryFn: getLaborRecommendations });
}

export function useCostPerUnitTrends() {
  return useQuery({ queryKey: ['finance', 'cost-per-unit'], queryFn: getCostPerUnitTrends });
}
