'use client';

import { DrawerPanel, StatusBadge } from '@/components';
import type { WinLossEntry } from '../../types';
import { DollarSign, Calendar, Building2, Package, FileText } from 'lucide-react';

const OUTCOME_VARIANT: Record<string, 'success' | 'danger' | 'warning'> = {
  won: 'success',
  lost: 'danger',
  churned: 'warning',
};

const REASON_LABELS: Record<string, string> = {
  pricing: 'Pricing',
  'product-quality': 'Product Quality',
  delivery: 'Delivery',
  competitor: 'Competitor',
  relationship: 'Relationship',
  compliance: 'Compliance',
  closure: 'Store Closure',
  other: 'Other',
};

interface WinLossDrawerProps {
  entry: WinLossEntry | null;
  onClose: () => void;
}

export function WinLossDrawer({ entry, onClose }: WinLossDrawerProps) {
  if (!entry) return null;

  return (
    <DrawerPanel open={!!entry} onClose={onClose} title={`${entry.outcome === 'won' ? 'Win' : entry.outcome === 'lost' ? 'Loss' : 'Churn'} — ${entry.accountName}`} width="lg">
      <div className="space-y-6">
        {/* Header badges */}
        <div className="flex flex-wrap gap-2">
          <StatusBadge variant={OUTCOME_VARIANT[entry.outcome]} label={entry.outcome} />
          <StatusBadge variant="info" label={REASON_LABELS[entry.reasonCategory] || entry.reasonCategory} />
          {entry.competitor && <StatusBadge variant="danger" label={`vs ${entry.competitor}`} />}
        </div>

        {/* Key info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Calendar className="h-4 w-4" />
            <span>{new Date(entry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <DollarSign className="h-4 w-4" />
            <span className={`font-medium ${entry.outcome === 'won' ? 'text-success' : 'text-danger'}`}>
              {entry.outcome === 'won' ? '+' : '-'}${entry.revenueImpact.toLocaleString()}/mo
            </span>
          </div>
        </div>

        {/* Reason */}
        <div className="rounded-xl border border-default bg-base p-4">
          <h4 className="mb-2 text-sm font-medium text-bright">Reason</h4>
          <p className="text-sm text-default leading-relaxed">{entry.reason}</p>
        </div>

        {/* Products affected */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-bright">
            <Package className="h-4 w-4" /> Products Affected
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {entry.productsAffected.map((p) => (
              <StatusBadge key={p} variant="muted" label={p} size="sm" />
            ))}
          </div>
        </div>

        {/* Competitor analysis */}
        {entry.competitor && (
          <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-bright">
              <Building2 className="h-4 w-4 text-danger" /> Competitor
            </h4>
            <p className="text-sm text-default">{entry.competitor}</p>
          </div>
        )}

        {/* Detailed notes */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-bright">
            <FileText className="h-4 w-4" /> Notes & Lessons Learned
          </h4>
          <p className="text-sm text-muted leading-relaxed">{entry.notes}</p>
        </div>
      </div>
    </DrawerPanel>
  );
}
