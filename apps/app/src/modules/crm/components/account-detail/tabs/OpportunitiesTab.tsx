'use client';

import { StatusBadge, EmptyState, LoadingSkeleton } from '@/components';
import { useOpportunities } from '../../../hooks';
import { Target } from 'lucide-react';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


interface OpportunitiesTabProps {
  accountId: string;
}

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

export function OpportunitiesTab({ accountId }: OpportunitiesTabProps) {
  const { data: opportunities, isLoading } = useOpportunities({ accountId });

  if (isLoading) return <LoadingSkeleton variant="card" count={2} />;

  if (!opportunities || opportunities.length === 0) {
    return (
      <EmptyState
        icon={Target}
        title="No Opportunities"
        description="No open opportunities for this account."
        accentColor={CRM_ACCENT}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {opportunities.map((opp) => (
        <div key={opp.id} className="rounded-xl bg-card p-4">
          <div className="mb-2 flex items-start justify-between">
            <StatusBadge variant={typeVariant(opp.type)} label={opp.type.replace('-', ' ')} size="sm" />
            <span className="text-lg font-bold text-text-bright">{formatCurrency(opp.estimatedValue)}</span>
          </div>
          <h4 className="text-sm font-medium text-text-bright">{opp.title}</h4>
          <div className="mt-2 space-y-1 text-xs text-text-muted">
            <div className="flex justify-between">
              <span>Probability</span>
              <span className="text-text-default">{opp.probability}%</span>
            </div>
            <div className="flex justify-between">
              <span>Stage</span>
              <span className="text-text-default">{opp.stage}</span>
            </div>
            <div className="flex justify-between">
              <span>Expected Close</span>
              <span className="text-text-default">
                {new Date(opp.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
          {opp.notes && (
            <p className="mt-3 border-t border-default/50 pt-2 text-xs text-text-muted">{opp.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}
