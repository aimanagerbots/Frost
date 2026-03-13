'use client';

import { useQuery } from '@tanstack/react-query';
import { accounts, interactions } from '@/mocks/crm';
import type { Account, Interaction, BriefingItem } from '@/modules/crm/types';
import type { DashboardAlert } from '@/modules/dashboard/types';

export interface AlertContext {
  currentDate: Date;
  interactions: Interaction[];
}

export interface AlertTrigger {
  ruleId: string;
  accountId: string;
  accountName: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  type: BriefingItem['type'];
  suggestedActions: { label: string; action: string }[];
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  type: 'health' | 'sentiment' | 'reorder' | 'compliance' | 'pipeline';
  evaluate: (account: Account, context: AlertContext) => AlertTrigger | null;
}

const LICENSE_DAYS_SEEDS = [15, 45, 8, 60, 22, 90, 12, 35, 5, 50, 28, 70];

const alertRules: AlertRule[] = [
  {
    id: 'health-below-50',
    name: 'Health Below 50',
    description: 'Account health score has dropped below 50',
    type: 'health',
    evaluate: (account, _ctx) => {
      if (account.healthScore < 50) {
        return {
          ruleId: 'health-below-50',
          accountId: account.id,
          accountName: account.name,
          severity: 'high',
          message: `${account.name} health score is critically low at ${account.healthScore}/100. Immediate attention required.`,
          type: 'health',
          suggestedActions: [
            { label: 'View Account', action: 'view' },
            { label: 'Call Contact', action: 'call' },
            { label: 'Escalate', action: 'escalate' },
          ],
        };
      }
      return null;
    },
  },
  {
    id: 'health-declining',
    name: 'Health Declining',
    description: 'Account health trend is declining',
    type: 'health',
    evaluate: (account, _ctx) => {
      if (account.healthTrend === 'declining' && account.healthScore >= 50) {
        return {
          ruleId: 'health-declining',
          accountId: account.id,
          accountName: account.name,
          severity: 'medium',
          message: `${account.name} health trend is declining (currently ${account.healthScore}/100). Proactive outreach recommended.`,
          type: 'health',
          suggestedActions: [
            { label: 'View Health', action: 'view' },
            { label: 'Send Email', action: 'email' },
          ],
        };
      }
      return null;
    },
  },
  {
    id: 'sentiment-below-40',
    name: 'Sentiment Below 40',
    description: 'Account sentiment score has dropped below 40',
    type: 'sentiment',
    evaluate: (account, _ctx) => {
      if (account.sentimentScore !== undefined && account.sentimentScore < 40) {
        return {
          ruleId: 'sentiment-below-40',
          accountId: account.id,
          accountName: account.name,
          severity: 'high',
          message: `${account.name} sentiment is critically low at ${account.sentimentScore}/100. Recent interactions may be negative.`,
          type: 'health',
          suggestedActions: [
            { label: 'Review Interactions', action: 'view' },
            { label: 'Call Contact', action: 'call' },
            { label: 'Escalate', action: 'escalate' },
          ],
        };
      }
      return null;
    },
  },
  {
    id: 'reorder-overdue',
    name: 'Reorder Overdue',
    description: 'Account has not placed an order in over 21 days',
    type: 'reorder',
    evaluate: (account, ctx) => {
      if (!account.lastOrderDate || account.pipelineStatus !== 'active') return null;
      const lastOrder = new Date(account.lastOrderDate);
      const diffMs = ctx.currentDate.getTime() - lastOrder.getTime();
      const daysSince = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (daysSince > 21) {
        const isHigh = daysSince > 30;
        return {
          ruleId: 'reorder-overdue',
          accountId: account.id,
          accountName: account.name,
          severity: isHigh ? 'high' : 'medium',
          message: `${account.name} hasn't ordered in ${daysSince} days${isHigh ? ' — significantly overdue' : ''}. Last order: ${account.lastOrderDate}.`,
          type: 'reorder',
          suggestedActions: [
            { label: 'Send Reorder Proposal', action: 'email' },
            { label: 'Call Contact', action: 'call' },
            { label: 'View Orders', action: 'view' },
          ],
        };
      }
      return null;
    },
  },
  {
    id: 'license-expiring',
    name: 'Compliance: License Expiring',
    description: 'Account license is expiring within 30 days',
    type: 'compliance',
    evaluate: (account, _ctx) => {
      const index = accounts.indexOf(account);
      const daysRemaining = LICENSE_DAYS_SEEDS[index % 12];
      if (daysRemaining < 30) {
        return {
          ruleId: 'license-expiring',
          accountId: account.id,
          accountName: account.name,
          severity: 'high',
          message: `${account.name} license expires in ${daysRemaining} days (${account.licenseNumber}). Verify renewal status.`,
          type: 'pipeline',
          suggestedActions: [
            { label: 'View License', action: 'view' },
            { label: 'Email Reminder', action: 'email' },
            { label: 'Escalate', action: 'escalate' },
          ],
        };
      }
      return null;
    },
  },
  {
    id: 'going-cold',
    name: 'Going Cold',
    description: 'No interaction in over 14 days for active accounts',
    type: 'pipeline',
    evaluate: (account, ctx) => {
      if (account.pipelineStatus !== 'active') return null;
      const accountInteractions = ctx.interactions.filter(
        (i) => i.accountId === account.id
      );
      if (accountInteractions.length === 0) {
        return {
          ruleId: 'going-cold',
          accountId: account.id,
          accountName: account.name,
          severity: 'medium',
          message: `${account.name} has had no interactions recorded. Risk of going cold.`,
          type: 'opportunity',
          suggestedActions: [
            { label: 'Call Contact', action: 'call' },
            { label: 'Send Email', action: 'email' },
          ],
        };
      }
      const latestInteraction = accountInteractions.reduce((latest, i) =>
        new Date(i.timestamp) > new Date(latest.timestamp) ? i : latest
      );
      const diffMs =
        ctx.currentDate.getTime() - new Date(latestInteraction.timestamp).getTime();
      const daysSince = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (daysSince > 14) {
        return {
          ruleId: 'going-cold',
          accountId: account.id,
          accountName: account.name,
          severity: 'medium',
          message: `${account.name} — no interaction in ${daysSince} days. Last contact was ${latestInteraction.channel} on ${new Date(latestInteraction.timestamp).toLocaleDateString()}.`,
          type: 'opportunity',
          suggestedActions: [
            { label: 'Call Contact', action: 'call' },
            { label: 'Send Email', action: 'email' },
            { label: 'View History', action: 'view' },
          ],
        };
      }
      return null;
    },
  },
];

const SEVERITY_ORDER: Record<AlertTrigger['severity'], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function toBriefingItem(trigger: AlertTrigger, index: number): BriefingItem {
  return {
    id: `alert-rule-${trigger.ruleId}-${trigger.accountId}-${index}`,
    message: trigger.message,
    type: trigger.type,
    severity: trigger.severity,
    accountId: trigger.accountId,
    actions: trigger.suggestedActions,
  };
}

function toDashboardAlert(trigger: AlertTrigger, index: number): DashboardAlert {
  const severityMap: Record<AlertTrigger['severity'], DashboardAlert['severity']> = {
    high: 'critical',
    medium: 'warning',
    low: 'info',
  };
  return {
    id: `proactive-${trigger.ruleId}-${trigger.accountId}-${index}`,
    severity: severityMap[trigger.severity],
    title: `${trigger.accountName} — ${alertRules.find((r) => r.id === trigger.ruleId)?.name ?? trigger.ruleId}`,
    description: trigger.message,
    module: 'CRM',
    route: `/crm?account=${trigger.accountId}`,
    timestamp: new Date('2026-03-12').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    dismissed: false,
  };
}

export function useAlertRules() {
  return useQuery({
    queryKey: ['crm', 'alert-rules'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const context: AlertContext = {
        currentDate: new Date('2026-03-12'),
        interactions,
      };

      const triggers: AlertTrigger[] = [];

      for (const account of accounts) {
        for (const rule of alertRules) {
          const result = rule.evaluate(account, context);
          if (result) {
            triggers.push(result);
          }
        }
      }

      triggers.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

      const briefingItems = triggers.map((t, i) => toBriefingItem(t, i));
      const dashboardAlerts = triggers.map((t, i) => toDashboardAlert(t, i));

      return {
        alerts: triggers,
        briefingItems,
        dashboardAlerts,
      };
    },
  });
}
