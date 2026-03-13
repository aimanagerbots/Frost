'use client';

import { useQuery } from '@tanstack/react-query';
import { accounts, interactions } from '@/mocks/crm';

const CURRENT_DATE = '2026-03-12';
const TRACKED_CHANNELS = ['phone', 'email', 'sms', 'meeting', 'whatsapp'] as const;
const COLD_THRESHOLD = 14;

export interface NurtureChannelStatus {
  channel: string;
  lastDate: string | null;
  count: number;
  daysSince: number | null;
}

export interface NurtureAccountStatus {
  accountId: string;
  accountName: string;
  assignedRepId: string;
  daysSinceLastContact: number | null;
  channelBreakdown: NurtureChannelStatus[];
  isGoingCold: boolean;
  coldSeverity: 'critical' | 'high' | 'medium' | null;
  totalTouchpoints: number;
  avgTouchpointsPerMonth: number;
  healthScore: number;
  pipelineCode: string;
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 86_400_000;
  return Math.floor(
    (new Date(b).getTime() - new Date(a).getTime()) / msPerDay
  );
}

function computeNurtureStatuses(): NurtureAccountStatus[] {
  const now = new Date(CURRENT_DATE);

  return accounts.map((account) => {
    const accountInteractions = interactions.filter(
      (i) =>
        i.accountId === account.id &&
        (TRACKED_CHANNELS as readonly string[]).includes(i.channel)
    );

    // Channel breakdown
    const channelBreakdown: NurtureChannelStatus[] = TRACKED_CHANNELS.map(
      (channel) => {
        const channelItems = accountInteractions.filter(
          (i) => i.channel === channel
        );
        if (channelItems.length === 0) {
          return { channel, lastDate: null, count: 0, daysSince: null };
        }
        const sorted = [...channelItems].sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        const lastDate = sorted[0].timestamp;
        return {
          channel,
          lastDate,
          count: channelItems.length,
          daysSince: daysBetween(lastDate, CURRENT_DATE),
        };
      }
    );

    // Overall last contact
    let daysSinceLastContact: number | null = null;
    if (accountInteractions.length > 0) {
      const mostRecent = accountInteractions.reduce((latest, i) =>
        new Date(i.timestamp).getTime() > new Date(latest.timestamp).getTime()
          ? i
          : latest
      );
      daysSinceLastContact = daysBetween(mostRecent.timestamp, CURRENT_DATE);
    }

    // Cold detection
    const isGoingCold =
      daysSinceLastContact === null || daysSinceLastContact > COLD_THRESHOLD;
    let coldSeverity: 'critical' | 'high' | 'medium' | null = null;
    if (daysSinceLastContact === null) {
      coldSeverity = 'critical';
    } else if (daysSinceLastContact > 30) {
      coldSeverity = 'critical';
    } else if (daysSinceLastContact > 21) {
      coldSeverity = 'high';
    } else if (daysSinceLastContact > COLD_THRESHOLD) {
      coldSeverity = 'medium';
    }

    // Touchpoint metrics
    const totalTouchpoints = accountInteractions.length;
    const monthsActive = Math.max(
      1,
      (now.getTime() - new Date(account.createdAt).getTime()) /
        (30 * 86_400_000)
    );
    const avgTouchpointsPerMonth = totalTouchpoints / monthsActive;

    return {
      accountId: account.id,
      accountName: account.name,
      assignedRepId: account.assignedRepId,
      daysSinceLastContact,
      channelBreakdown,
      isGoingCold,
      coldSeverity,
      totalTouchpoints,
      avgTouchpointsPerMonth: Math.round(avgTouchpointsPerMonth * 10) / 10,
      healthScore: account.healthScore,
      pipelineCode: account.pipeline.code,
    };
  });
}

export function useNurtureStatus() {
  return useQuery({
    queryKey: ['crm', 'nurture'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      const statuses = computeNurtureStatuses();
      // Sort coldest first (null = never contacted = top)
      statuses.sort((a, b) => {
        const aDays = a.daysSinceLastContact ?? Infinity;
        const bDays = b.daysSinceLastContact ?? Infinity;
        return bDays - aDays;
      });
      return statuses;
    },
  });
}
