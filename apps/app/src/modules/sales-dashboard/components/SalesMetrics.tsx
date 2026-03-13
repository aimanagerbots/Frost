'use client';

import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { MetricCard, LoadingSkeleton } from '@/components';
import { useSalesDashboardMetrics } from '../hooks';

const ACCENT = '#F59E0B';

interface SalesMetricsProps {
  myAccountsOnly: boolean;
  currentRep: string;
}

export function SalesMetrics({ myAccountsOnly, currentRep }: SalesMetricsProps) {
  const { data, isLoading } = useSalesDashboardMetrics(myAccountsOnly, currentRep);

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        icon={DollarSign}
        label="Today Sales"
        value={`$${data.ordersTodayTotal.toLocaleString()}`}
        subValue={`${data.ordersToday} Orders`}
        accentColor={ACCENT}
      />
      <MetricCard
        icon={TrendingUp}
        label="March Order Delivery"
        value={`$${data.ordersThisMonthTotal.toLocaleString()}`}
        subValue={`${data.ordersThisMonth} Orders`}
        accentColor="#22C55E"
      />
      <MetricCard
        icon={Users}
        label="Total Invoices MTD"
        value={`$${data.invoicesMTDTotal.toLocaleString()}`}
        subValue={`${data.invoicesMTD} Orders`}
        accentColor="#3B82F6"
      />
      <MetricCard
        icon={ShoppingCart}
        label="Future Sales"
        value={`$${data.futureSalesTotal.toLocaleString()}`}
        subValue={`${data.futureSalesOrders} Orders`}
        accentColor="#8B5CF6"
      />
    </div>
  );
}
