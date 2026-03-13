'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { accounts } from '@/mocks/crm';

export interface OrderFrequencyData {
  accountId: string;
  accountName: string;
  pipelineCode: string;
  orderCount: number;
  avgDaysBetweenOrders: number;
  recentAvgDays: number;
  trendDirection: 'increasing' | 'stable' | 'decreasing';
  predictedNextOrderDate: string;
  daysUntilPredicted: number;
  isOverdue: boolean;
  frequencyDecline: number; // percentage, positive = declining
  lastOrderDate: string | null;
}

const CURRENT_DATE = new Date('2026-03-12');

function daysBetween(a: Date, b: Date): number {
  return Math.round(Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function computeFrequencyData(): OrderFrequencyData[] {
  const results: OrderFrequencyData[] = [];

  accounts.forEach((account, index) => {
    if (account.orderCount <= 2 || !account.lastOrderDate) return;

    const createdAt = new Date(account.createdAt);
    const lastOrder = new Date(account.lastOrderDate);
    const totalSpanDays = daysBetween(createdAt, lastOrder);

    // Average days between orders over the full history
    const avgDaysBetweenOrders = Math.max(
      1,
      Math.round(totalSpanDays / (account.orderCount - 1))
    );

    // Mock recent average: use account index to create variation
    // Some accounts order more frequently recently, others less
    const varianceFactor = 0.6 + ((index * 17 + 7) % 20) / 10; // 0.6 to 2.6
    const recentAvgDays = Math.max(
      1,
      Math.round(avgDaysBetweenOrders * varianceFactor)
    );

    // Trend direction based on ratio of recent to historical
    const ratio = recentAvgDays / avgDaysBetweenOrders;
    const trendDirection: OrderFrequencyData['trendDirection'] =
      ratio > 1.2 ? 'increasing' : ratio < 0.8 ? 'decreasing' : 'stable';

    // Predicted next order date
    const predictedNextOrderDate = addDays(lastOrder, recentAvgDays);
    const daysUntilPredicted = Math.round(
      (predictedNextOrderDate.getTime() - CURRENT_DATE.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const isOverdue = daysUntilPredicted < 0;

    // Frequency decline: positive means ordering less frequently
    const frequencyDecline = Math.round(((recentAvgDays - avgDaysBetweenOrders) / avgDaysBetweenOrders) * 100);

    results.push({
      accountId: account.id,
      accountName: account.name,
      pipelineCode: account.pipeline.code,
      orderCount: account.orderCount,
      avgDaysBetweenOrders,
      recentAvgDays,
      trendDirection,
      predictedNextOrderDate: predictedNextOrderDate.toISOString().split('T')[0],
      daysUntilPredicted,
      isOverdue,
      frequencyDecline,
      lastOrderDate: account.lastOrderDate,
    });
  });

  // Sort by frequencyDecline descending (most declining first)
  results.sort((a, b) => b.frequencyDecline - a.frequencyDecline);

  return results;
}

export function useOrderFrequency() {
  return useDemoQuery({
    queryKey: ['crm', 'order-frequency'],
    demoQueryFn: () =>
      new Promise<OrderFrequencyData[]>((resolve) => {
        setTimeout(() => resolve(computeFrequencyData()), 300);
      }),
    emptyValue: [] as OrderFrequencyData[],
  });
}
