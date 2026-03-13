'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/mocks/crm';
import type { CRMDashboardData } from '@/modules/crm/types';
import { useAuthStore } from '@/modules/auth/store';
import { apiFetch } from '@/lib/api';

interface APIDashboardMetrics {
  total_revenue: number;
  active_accounts: number;
  avg_order_value: number;
  at_risk_accounts: number;
  pipeline_overview: Record<string, number>;
  recent_activity: Array<Record<string, unknown>>;
}

function mapAPItoDashboard(api: APIDashboardMetrics): CRMDashboardData {
  return {
    metrics: {
      totalRevenue: api.total_revenue,
      revenueTrend: 0,
      activeAccounts: api.active_accounts,
      activeAccountsTrend: 0,
      avgOrderValue: api.avg_order_value,
      aovTrend: 0,
      ordersPending: 0,
      atRiskAccounts: api.at_risk_accounts,
      overduePayments: { count: 0, amount: 0 },
    },
    briefingItems: [],
    revenueByCategoryWeeks: [],
    healthDistribution: [],
    orderVolume: [],
    topAccounts: [],
    recentActivity: [],
    kpiMetrics: [],
    pipelineDistribution: [],
    recoveryFunnel: [],
  };
}

export function useCRMDashboard() {
  const { isDemoMode, session } = useAuthStore();

  return useQuery({
    queryKey: ['crm', 'dashboard'],
    queryFn: async () => {
      if (isDemoMode) return getDashboardData();
      const api = await apiFetch<APIDashboardMetrics>('/api/crm/dashboard', {
        token: session?.access_token,
      });
      return mapAPItoDashboard(api);
    },
  });
}
