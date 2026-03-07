'use client';

import { DrawerPanel, StatusBadge, DataTable } from '@/components';
import { useCampaign } from '../../hooks/useCampaign';
import type { CampaignRecipient } from '../../types';

const CRM_ACCENT = '#F59E0B';

const STATUS_VARIANT: Record<string, 'success' | 'info' | 'muted' | 'warning' | 'danger'> = {
  active: 'success',
  scheduled: 'info',
  completed: 'muted',
  paused: 'warning',
  draft: 'danger',
};

const TYPE_LABELS: Record<string, string> = {
  'morning-reorder': 'Morning Reorder',
  'product-launch': 'Product Launch',
  'win-back': 'Win-Back',
  seasonal: 'Seasonal',
  custom: 'Custom',
};

interface CampaignDrawerProps {
  campaignId: string | null;
  onClose: () => void;
}

export function CampaignDrawer({ campaignId, onClose }: CampaignDrawerProps) {
  const { data: campaign } = useCampaign(campaignId);

  if (!campaign) return null;

  const recipientColumns = [
    {
      header: 'Account',
      accessor: 'accountName' as const,
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status' as const,
      render: (row: CampaignRecipient & Record<string, unknown>) => {
        const variant = row.status === 'ordered' ? 'success' : row.status === 'responded' ? 'info' : row.status === 'opened' ? 'warning' : 'muted';
        return <StatusBadge variant={variant} label={row.status as string} size="sm" />;
      },
    },
    {
      header: 'Sent',
      accessor: 'sentAt' as const,
      render: (row: CampaignRecipient & Record<string, unknown>) =>
        row.sentAt ? new Date(row.sentAt as string).toLocaleDateString() : '—',
    },
    {
      header: 'Opened',
      accessor: 'openedAt' as const,
      render: (row: CampaignRecipient & Record<string, unknown>) =>
        row.openedAt ? new Date(row.openedAt as string).toLocaleTimeString() : '—',
    },
    {
      header: 'Responded',
      accessor: 'respondedAt' as const,
      render: (row: CampaignRecipient & Record<string, unknown>) =>
        row.respondedAt ? new Date(row.respondedAt as string).toLocaleTimeString() : '—',
    },
  ];

  const funnelStages = [
    { label: 'Sent', count: campaign.sentCount },
    { label: 'Opened', count: Math.round(campaign.sentCount * campaign.openRate / 100) },
    { label: 'Responded', count: Math.round(campaign.sentCount * campaign.responseRate / 100) },
    { label: 'Ordered', count: campaign.ordersGenerated },
  ];

  // Highlight message template tokens
  function renderTemplate(template: string) {
    return template.split(/(\{[^}]+\})/).map((part, i) =>
      part.startsWith('{') ? (
        <span key={i} className="rounded bg-amber-500/20 px-1 text-amber-400">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  return (
    <DrawerPanel open={!!campaignId} onClose={onClose} title={campaign.name} width="lg">
      <div className="space-y-6">
        {/* Header badges */}
        <div className="flex flex-wrap gap-2">
          <StatusBadge variant={STATUS_VARIANT[campaign.status]} label={campaign.status} />
          <StatusBadge variant="info" label={TYPE_LABELS[campaign.type] || campaign.type} />
          <StatusBadge variant="muted" label={campaign.channel} />
          <span className="text-xs text-muted">by {campaign.createdBy}</span>
        </div>

        {/* Performance funnel */}
        <div className="rounded-xl border border-default bg-base p-4">
          <h4 className="mb-3 text-sm font-medium text-bright">Conversion Funnel</h4>
          <div className="flex items-end gap-3">
            {funnelStages.map((stage, i) => {
              const maxCount = Math.max(...funnelStages.map((s) => s.count), 1);
              const height = Math.max(20, (stage.count / maxCount) * 100);
              return (
                <div key={stage.label} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-lg font-bold text-bright">{stage.count}</span>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${height}px`,
                      backgroundColor: `${CRM_ACCENT}${Math.round(30 + (i * 20)).toString(16).padStart(2, '0')}`,
                    }}
                  />
                  <span className="text-xs text-muted">{stage.label}</span>
                  {i > 0 && funnelStages[i - 1].count > 0 && (
                    <span className="text-xs text-muted">
                      {((stage.count / funnelStages[i - 1].count) * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-default bg-base p-3 text-center">
            <div className="text-lg font-bold text-bright">{campaign.openRate}%</div>
            <div className="text-xs text-muted">Open Rate</div>
          </div>
          <div className="rounded-lg border border-default bg-base p-3 text-center">
            <div className="text-lg font-bold text-bright">{campaign.responseRate}%</div>
            <div className="text-xs text-muted">Response Rate</div>
          </div>
          <div className="rounded-lg border border-default bg-base p-3 text-center">
            <div className="text-lg font-bold text-bright">${campaign.revenueAttributed.toLocaleString()}</div>
            <div className="text-xs text-muted">Revenue</div>
          </div>
        </div>

        {/* Message template */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-bright">Message Template</h4>
          <div className="whitespace-pre-wrap rounded-xl border border-default bg-base p-4 text-xs text-muted leading-relaxed">
            {renderTemplate(campaign.messageTemplate)}
          </div>
        </div>

        {/* Recipients */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-bright">Recipients ({campaign.recipients.length})</h4>
          <DataTable
            data={campaign.recipients.map((r) => ({ ...r })) as (CampaignRecipient & Record<string, unknown>)[]}
            columns={recipientColumns}
            pageSize={8}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {campaign.status === 'active' && (
            <button className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-sm text-amber-400 hover:bg-amber-500/30">
              Pause
            </button>
          )}
          {campaign.status === 'paused' && (
            <button className="rounded-lg bg-success/20 px-3 py-1.5 text-sm text-success hover:bg-success/30">
              Resume
            </button>
          )}
          <button className="rounded-lg bg-elevated px-3 py-1.5 text-sm text-muted hover:text-default">
            Duplicate
          </button>
        </div>
      </div>
    </DrawerPanel>
  );
}
