'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
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
import type {
  BudgetDivision,
  BudgetScenario,
  CapexItem,
  TeamMemberCost,
  LaborMetrics,
  LaborAllocation,
  SchedulingData,
  LaborAIRecommendation,
  CostPerUnitDataPoint,
} from '@/modules/finance/types/budget-labor';

export function useBudgetByDivision() {
  return useDemoQuery({
    queryKey: ['finance', 'budget-divisions'],
    demoQueryFn: getBudgetByDivision,
    emptyValue: [] as BudgetDivision[],
  });
}

export function useBudgetScenarios() {
  return useDemoQuery({
    queryKey: ['finance', 'budget-scenarios'],
    demoQueryFn: getBudgetScenarios,
    emptyValue: [] as BudgetScenario[],
  });
}

export function useCapexItems() {
  return useDemoQuery({
    queryKey: ['finance', 'capex'],
    demoQueryFn: getCapexItems,
    emptyValue: [] as CapexItem[],
  });
}

export function useLaborData() {
  return useDemoQuery({
    queryKey: ['finance', 'labor-data'],
    demoQueryFn: getLaborData,
    emptyValue: [] as TeamMemberCost[],
  });
}

export function useLaborMetrics() {
  return useDemoQuery({
    queryKey: ['finance', 'labor-metrics'],
    demoQueryFn: getLaborMetrics,
    emptyValue: {
      totalHeadcount: 0,
      totalLaborCost: 0,
      costPerUnit: [],
      revenuePerEmployee: 0,
      overtimePercent: 0,
    } as LaborMetrics,
  });
}

export function useLaborAllocation() {
  return useDemoQuery({
    queryKey: ['finance', 'labor-allocation'],
    demoQueryFn: getLaborAllocation,
    emptyValue: [] as LaborAllocation[],
  });
}

export function useSchedulingData() {
  return useDemoQuery({
    queryKey: ['finance', 'scheduling'],
    demoQueryFn: getSchedulingData,
    emptyValue: [] as SchedulingData[],
  });
}

export function useLaborRecommendations() {
  return useDemoQuery({
    queryKey: ['finance', 'labor-recommendations'],
    demoQueryFn: getLaborRecommendations,
    emptyValue: [] as LaborAIRecommendation[],
  });
}

export function useCostPerUnitTrends() {
  return useDemoQuery({
    queryKey: ['finance', 'cost-per-unit'],
    demoQueryFn: getCostPerUnitTrends,
    emptyValue: [] as CostPerUnitDataPoint[],
  });
}
