'use client';

import { DrawerPanel, StatusBadge } from '@/components';
import type { AdCampaign } from '../../types/seo-events';
import { DollarSign, Eye, MousePointerClick, Target, AlertTriangle } from 'lucide-react';

interface AdDrawerProps {
  campaign: AdCampaign | null;
  onClose: () => void;
}

const PLATFORM_LABELS: Record<string, string> = {
  google: 'Google Ads',
  programmatic: 'Programmatic',
  'cannabis-specific': 'Cannabis Network',
  'email-retargeting': 'Email Retargeting',
};

const STATUS_VARIANTS: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'muted'> = {
  active: 'success',
  paused: 'warning',
  completed: 'muted',
  draft: 'info',
};

const COMPLIANCE_VARIANTS: Record<string, 'success' | 'warning' | 'danger'> = {
  approved: 'success',
  'pending-review': 'warning',
  flagged: 'danger',
};

export function AdDrawer({ campaign, onClose }: AdDrawerProps) {
  if (!campaign) return null;

  const ctr = campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(1) : '0.0';
  const budgetPct = campaign.budget > 0 ? Math.round((campaign.spent / campaign.budget) * 100) : 0;

  return (
    <DrawerPanel open={!!campaign} onClose={onClose} title={campaign.name} width="lg">
      <div className="space-y-5">
        {/* Status Row */}
        <div className="flex flex-wrap items-center gap-2">
          {(campaign.status === 'active' || campaign.status === 'draft')
            ? <StatusBadge status={campaign.status as 'active' | 'draft'} />
            : <StatusBadge variant={STATUS_VARIANTS[campaign.status] ?? 'muted'} label={campaign.status} dot />
          }
          <span className="rounded-full bg-elevated px-2.5 py-0.5 text-xs text-text-bright">{PLATFORM_LABELS[campaign.platform]}</span>
          {campaign.complianceStatus === 'approved'
            ? <StatusBadge status="approved" size="sm" />
            : <StatusBadge variant={COMPLIANCE_VARIANTS[campaign.complianceStatus] ?? 'muted'} label={campaign.complianceStatus} size="sm" />
          }
        </div>

        {/* Compliance Warning */}
        {campaign.complianceStatus === 'flagged' && campaign.complianceNote && (
          <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-danger" />
            <p className="text-sm text-danger">{campaign.complianceNote}</p>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="rounded-lg border border-default bg-elevated p-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Performance</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-text-muted" />
              <div>
                <p className="text-sm font-semibold text-text-bright">{campaign.impressions.toLocaleString()}</p>
                <span className="text-[11px] text-text-muted">Impressions</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MousePointerClick className="h-3.5 w-3.5 text-text-muted" />
              <div>
                <p className="text-sm font-semibold text-text-bright">{campaign.clicks.toLocaleString()}</p>
                <span className="text-[11px] text-text-muted">Clicks ({ctr}% CTR)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-3.5 w-3.5 text-text-muted" />
              <div>
                <p className="text-sm font-semibold text-text-bright">${campaign.cpc.toFixed(2)}</p>
                <span className="text-[11px] text-text-muted">CPC</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-text-muted" />
              <div>
                <p className="text-sm font-semibold text-text-bright">{campaign.conversions}</p>
                <span className="text-[11px] text-text-muted">Conversions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="rounded-lg border border-default bg-elevated p-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Budget</h4>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">${campaign.spent.toLocaleString()} spent</span>
            <span className="text-text-bright">${campaign.budget.toLocaleString()} budget</span>
          </div>
          <div className="h-2 w-full rounded-full bg-card">
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.min(budgetPct, 100)}%`, backgroundColor: budgetPct > 90 ? '#FB7185' : '#5BB8E6' }}
            />
          </div>
          <p className="text-xs text-text-muted">{budgetPct}% spent</p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] text-text-muted">Start Date</span>
            <p className="text-sm text-text-bright">{campaign.startDate}</p>
          </div>
          {campaign.endDate && (
            <div>
              <span className="text-[11px] text-text-muted">End Date</span>
              <p className="text-sm text-text-bright">{campaign.endDate}</p>
            </div>
          )}
        </div>
      </div>
    </DrawerPanel>
  );
}
