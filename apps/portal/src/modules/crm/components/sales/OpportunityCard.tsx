'use client';

import { useState } from 'react';
import { StatusBadge } from '@/components';
import type { Opportunity } from '../../types';

const CRM_ACCENT = '#F59E0B';

function typeVariant(type: string) {
  switch (type) {
    case 'new-account': return 'success' as const;
    case 'reorder': return 'info' as const;
    case 'category-expansion': return 'warning' as const;
    default: return 'default' as const;
  }
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  accountName?: string;
  onClick?: () => void;
}

export function OpportunityCard({ opportunity, accountName, onClick }: OpportunityCardProps) {
  const [daysInStage] = useState(() =>
    Math.floor((Date.now() - new Date(opportunity.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
  );

  return (
    <div
      className="cursor-pointer rounded-lg border border-default bg-card p-3 transition-colors hover:bg-card-hover"
      onClick={onClick}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <StatusBadge variant={typeVariant(opportunity.type)} label={opportunity.type.replace(/-/g, ' ')} size="sm" />
        <span className="text-sm font-bold text-text-bright">{formatCurrency(opportunity.estimatedValue)}</span>
      </div>
      {accountName && (
        <div className="mb-1 text-xs font-semibold text-text-bright">{accountName}</div>
      )}
      <h4 className="mb-2 truncate text-xs text-text-muted">{opportunity.title}</h4>
      <div className="flex items-center justify-between text-[11px] text-text-muted">
        <span>{opportunity.probability}% prob</span>
        <span>{daysInStage}d in stage</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-elevated">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${opportunity.probability}%`,
            backgroundColor: CRM_ACCENT,
          }}
        />
      </div>
    </div>
  );
}
