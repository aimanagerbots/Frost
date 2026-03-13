'use client';

import { AccentCard, StatusBadge } from '@/components';
import { useAlertRules } from '@/modules/crm/hooks';
import type { BriefingItem } from '@/modules/crm/types';
import {
  Sparkles,
  Phone,
  Mail,
  Eye,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Target,
} from 'lucide-react';

const ACCENT = '#F59E0B';

/** Only show sales-relevant briefing types */
const SALES_TYPES: BriefingItem['type'][] = ['reorder', 'payment', 'health'];

const TYPE_ICONS: Record<string, typeof Sparkles> = {
  reorder: Target,
  payment: DollarSign,
  health: TrendingDown,
  pipeline: AlertTriangle,
  opportunity: Sparkles,
  competitive: AlertTriangle,
};

const SEVERITY_VARIANT: Record<BriefingItem['severity'], 'danger' | 'warning' | 'info'> = {
  high: 'danger',
  medium: 'warning',
  low: 'info',
};

const ACTION_ICONS: Record<string, typeof Phone> = {
  call: Phone,
  email: Mail,
  view: Eye,
  escalate: AlertTriangle,
};

const MAX_ITEMS = 5;

export function SalesBriefingWidget() {
  const { data, isLoading } = useAlertRules();

  const items = (data?.briefingItems ?? [])
    .filter((item) => SALES_TYPES.includes(item.type))
    .slice(0, MAX_ITEMS);

  if (isLoading) {
    return (
      <AccentCard accentColor={ACCENT} padding="md" className="animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-elevated" />
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-elevated" />
            <div className="h-3 w-24 rounded bg-elevated" />
          </div>
        </div>
      </AccentCard>
    );
  }

  if (items.length === 0) return null;

  return (
    <AccentCard accentColor={ACCENT} className="bg-elevated">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${ACCENT}20` }}
        >
          <Sparkles className="h-4 w-4" style={{ color: ACCENT }} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-bright">
            AI Sales Briefing
          </h3>
          <p className="text-xs text-text-muted">
            {items.length} action item{items.length !== 1 ? 's' : ''} requiring attention
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-1 px-5 pb-4 pt-1">
        {items.map((item) => {
          const TypeIcon = TYPE_ICONS[item.type] ?? Sparkles;
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-xl bg-card/50 p-3"
            >
              <TypeIcon
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: ACCENT }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-text-default leading-relaxed">
                  {item.message}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <StatusBadge
                    variant={SEVERITY_VARIANT[item.severity]}
                    label={item.severity}
                    size="xs"
                  />
                  {item.actions.slice(0, 2).map((action) => {
                    const ActionIcon = ACTION_ICONS[action.action] ?? Eye;
                    return (
                      <button
                        key={action.label}
                        className="flex items-center gap-1 rounded-full bg-elevated px-2 py-0.5 text-[10px] text-text-muted transition-colors hover:bg-accent-hover hover:text-text-default"
                      >
                        <ActionIcon className="h-3 w-3" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AccentCard>
  );
}
