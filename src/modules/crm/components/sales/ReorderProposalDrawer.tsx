'use client';

import { useState } from 'react';
import { DrawerPanel, StatusBadge } from '@/components';
import type { ReorderProposal } from '../../types';

const CRM_ACCENT = '#F59E0B';

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

function sourceVariant(source: string) {
  switch (source) {
    case 'vmi-velocity': return 'info' as const;
    case 'cadence-analysis': return 'warning' as const;
    case 'manual': return 'muted' as const;
    default: return 'default' as const;
  }
}

function statusVariant(status: string) {
  switch (status) {
    case 'pending': return 'warning' as const;
    case 'approved': return 'info' as const;
    case 'sent': return 'info' as const;
    case 'ordered': return 'success' as const;
    case 'rejected': return 'danger' as const;
    default: return 'default' as const;
  }
}

const REJECT_REASONS = ['Not needed', 'Wrong products', 'Wrong timing', 'Pricing issue', 'Other'];

interface ReorderProposalDrawerProps {
  proposal: ReorderProposal | null;
  open: boolean;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
}

export function ReorderProposalDrawer({ proposal, open, onClose, onApprove, onReject }: ReorderProposalDrawerProps) {
  const [showRejectMenu, setShowRejectMenu] = useState(false);

  if (!proposal) return null;

  const isPending = proposal.status === 'pending';

  return (
    <DrawerPanel open={open} onClose={onClose} title="Reorder Proposal" width="lg">
      <div className="space-y-5">
        {/* Account summary */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-bright">{proposal.accountName}</h3>
            <p className="text-sm text-muted">{proposal.daysSinceLastOrder} days since last order</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge variant={statusVariant(proposal.status)} label={proposal.status} />
            <StatusBadge variant={sourceVariant(proposal.source)} label={proposal.source.replace(/-/g, ' ')} />
          </div>
        </div>

        {/* Confidence bar */}
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted">Confidence</span>
            <span className={`font-semibold ${proposal.confidence >= 80 ? 'text-success' : proposal.confidence >= 60 ? 'text-warning' : 'text-danger'}`}>
              {proposal.confidence}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${proposal.confidence}%`,
                backgroundColor: proposal.confidence >= 80 ? 'var(--success)' : proposal.confidence >= 60 ? 'var(--warning)' : 'var(--danger)',
              }}
            />
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="rounded-lg border border-default bg-elevated p-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">AI Reasoning</h4>
          <p className="text-sm leading-relaxed text-default">{proposal.reasoning}</p>
        </div>

        {/* Line items */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-bright">Proposed Products</h4>
          <div className="overflow-hidden rounded-lg border border-default">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-default bg-elevated text-xs text-muted">
                  <th className="px-3 py-2 text-left">Product</th>
                  <th className="px-3 py-2 text-right">Qty</th>
                  <th className="px-3 py-2 text-right">Unit Price</th>
                  <th className="px-3 py-2 text-right">Last Price</th>
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {proposal.proposedProducts.map((p) => {
                  const delta = p.unitPrice - p.lastOrderPrice;
                  return (
                    <tr key={p.sku} className="border-b border-default/50">
                      <td className="px-3 py-2">
                        <div className="font-medium text-default">{p.name}</div>
                        <div className="text-xs text-muted">{p.sku}</div>
                      </td>
                      <td className="px-3 py-2 text-right text-default">{p.qty}</td>
                      <td className="px-3 py-2 text-right text-default">{formatCurrency(p.unitPrice)}</td>
                      <td className="px-3 py-2 text-right">
                        <span className="text-default">{formatCurrency(p.lastOrderPrice)}</span>
                        {delta !== 0 && (
                          <span className={`ml-1 text-xs ${delta > 0 ? 'text-danger' : 'text-success'}`}>
                            {delta > 0 ? '+' : ''}{formatCurrency(delta)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-bright">
                        {formatCurrency(p.qty * p.unitPrice)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-elevated">
                  <td colSpan={4} className="px-3 py-2 text-right text-xs font-semibold text-muted">Total</td>
                  <td className="px-3 py-2 text-right text-sm font-bold text-bright">
                    {formatCurrency(proposal.totalValue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Draft email */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-bright">Draft Email</h4>
          <div className="whitespace-pre-wrap rounded-lg border border-default bg-elevated p-4 text-sm leading-relaxed text-default">
            {proposal.draftEmail}
          </div>
        </div>

        {/* Action buttons */}
        {isPending && (
          <div className="flex items-center gap-3 border-t border-default pt-4">
            <button
              onClick={() => onApprove?.(proposal.id)}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-black transition-colors hover:opacity-90"
              style={{ backgroundColor: CRM_ACCENT }}
            >
              Approve & Send
            </button>
            <div className="relative">
              <button
                onClick={() => setShowRejectMenu(!showRejectMenu)}
                className="rounded-lg border border-danger/30 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
              >
                Reject
              </button>
              {showRejectMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-48 rounded-lg border border-default bg-card p-1 shadow-xl">
                  {REJECT_REASONS.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => {
                        onReject?.(proposal.id, reason);
                        setShowRejectMenu(false);
                      }}
                      className="w-full rounded-md px-3 py-1.5 text-left text-sm text-default hover:bg-elevated transition-colors"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DrawerPanel>
  );
}
