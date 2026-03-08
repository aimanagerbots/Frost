'use client';

import { StatusBadge } from '@/components';
import type { BriefingItem } from '@/modules/crm/types';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Eye,
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Target,
  ShieldAlert,
} from 'lucide-react';
import { useState } from 'react';

const CRM_ACCENT = '#F59E0B';

const TYPE_ICONS: Record<BriefingItem['type'], typeof Sparkles> = {
  reorder: Target,
  payment: DollarSign,
  health: TrendingDown,
  competitive: ShieldAlert,
  opportunity: Sparkles,
  pipeline: AlertTriangle,
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

interface AIBriefingCardProps {
  items: BriefingItem[];
  userName?: string;
}

export function AIBriefingCard({ items, userName = 'Jake' }: AIBriefingCardProps) {
  const [collapsed, setCollapsed] = useState(false);

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="rounded-xl border border-default bg-elevated"
      style={{ borderLeftWidth: 4, borderLeftColor: CRM_ACCENT }}
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${CRM_ACCENT}20` }}
          >
            <Sparkles className="h-4.5 w-4.5" style={{ color: CRM_ACCENT }} />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-text-bright">
              {greeting}, {userName}
            </h2>
            <p className="text-xs text-text-muted">{dateStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">
            {items.length} action item{items.length !== 1 ? 's' : ''}
          </span>
          {collapsed ? (
            <ChevronDown className="h-4 w-4 text-text-muted" />
          ) : (
            <ChevronUp className="h-4 w-4 text-text-muted" />
          )}
        </div>
      </button>

      {/* Items */}
      {!collapsed && (
        <div className="space-y-1 px-5 pb-4">
          {items.map((item) => {
            const TypeIcon = TYPE_ICONS[item.type];
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg bg-card/50 p-3"
              >
                <TypeIcon
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: CRM_ACCENT }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-default">{item.message}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusBadge
                      variant={SEVERITY_VARIANT[item.severity]}
                      label={item.severity}
                      size="sm"
                    />
                    {item.actions.map((action) => {
                      const ActionIcon = ACTION_ICONS[action.action] || Eye;
                      return (
                        <button
                          key={action.label}
                          className="flex items-center gap-1 rounded-md bg-elevated px-2 py-1 text-xs text-text-muted transition-colors hover:bg-card-hover hover:text-text-default"
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
      )}
    </div>
  );
}
