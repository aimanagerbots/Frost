'use client';

import { useState } from 'react';
import { DrawerPanel, StatusBadge } from '@/components';
import type { Opportunity } from '../../types';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

function typeVariant(type: string) {
  switch (type) {
    case 'new-account': return 'success' as const;
    case 'reorder': return 'info' as const;
    case 'category-expansion': return 'warning' as const;
    default: return 'default' as const;
  }
}

interface OpportunityDrawerProps {
  opportunity: Opportunity | null;
  accountName?: string;
  open: boolean;
  onClose: () => void;
}

export function OpportunityDrawer({ opportunity, accountName, open, onClose }: OpportunityDrawerProps) {
  const [note, setNote] = useState('');

  const daysInStage = opportunity
    ? Math.floor((new Date().getTime() - new Date(opportunity.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (!opportunity) return null;

  return (
    <DrawerPanel open={open} onClose={onClose} title="Opportunity Detail" width="md">
      <div className="space-y-5">
        {/* Header */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <StatusBadge variant={typeVariant(opportunity.type)} label={opportunity.type.replace(/-/g, ' ')} />
          </div>
          <h3 className="text-lg font-semibold text-text-bright">{opportunity.title}</h3>
          {accountName && (
            <p className="mt-1 text-sm text-text-muted">{accountName}</p>
          )}
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-elevated p-3">
            <div className="text-xs text-text-muted">Estimated Value</div>
            <div className="text-lg font-bold text-text-bright">{formatCurrency(opportunity.estimatedValue)}</div>
          </div>
          <div className="rounded-lg bg-elevated p-3">
            <div className="text-xs text-text-muted">Probability</div>
            <div className="text-lg font-bold text-text-bright">{opportunity.probability}%</div>
          </div>
          <div className="rounded-lg bg-elevated p-3">
            <div className="text-xs text-text-muted">Stage</div>
            <div className="text-sm font-medium text-text-bright">{opportunity.stage}</div>
          </div>
          <div className="rounded-lg bg-elevated p-3">
            <div className="text-xs text-text-muted">Days in Stage</div>
            <div className="text-lg font-bold text-text-bright">{daysInStage}</div>
          </div>
        </div>

        {/* Expected close */}
        <div className="rounded-lg border border-default p-3">
          <div className="text-xs text-text-muted">Expected Close Date</div>
          <div className="text-sm font-medium text-text-bright">
            {new Date(opportunity.expectedCloseDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>

        {/* Stage timeline */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-text-bright">Stage Progress</h4>
          <div className="flex items-center gap-1">
            {['Prospect', 'Contacted', 'Engaged', 'Committed', 'Won'].map((stage, i) => {
              const currentIdx = ['Prospect', 'Contacted', 'Engaged', 'Committed', 'Won'].indexOf(opportunity.stage);
              const isActive = i <= (currentIdx >= 0 ? currentIdx : 0);
              return (
                <div key={stage} className="flex flex-1 flex-col items-center">
                  <div
                    className={`h-1.5 w-full rounded-full ${isActive ? '' : 'bg-elevated'}`}
                    style={isActive ? { backgroundColor: CRM_ACCENT } : undefined}
                  />
                  <span className="mt-1 text-[9px] text-text-muted">{stage}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        {opportunity.notes && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-text-bright">Notes</h4>
            <p className="text-sm text-text-muted">{opportunity.notes}</p>
          </div>
        )}

        {/* Add note */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-text-bright">Add Note</h4>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about this opportunity..."
            className="w-full rounded-lg border border-default bg-elevated px-3 py-2 text-sm text-text-default placeholder:text-text-muted outline-none focus:border-hover"
            rows={3}
          />
          <button
            onClick={() => setNote('')}
            disabled={!note.trim()}
            className="mt-2 rounded-lg px-4 py-2 text-sm font-medium text-black transition-colors disabled:opacity-50"
            style={{ backgroundColor: CRM_ACCENT }}
          >
            Save Note
          </button>
        </div>
      </div>
    </DrawerPanel>
  );
}
