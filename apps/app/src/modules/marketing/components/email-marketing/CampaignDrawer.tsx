'use client';

import { Mail, Users, Trophy, ArrowRight } from 'lucide-react';
import { DrawerPanel, StatusBadge, LoadingSkeleton } from '@/components';
import { useEmailCampaign } from '@/modules/marketing/hooks';
import { ACCENT } from '@/design/colors';


const STATUS_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'> = {
  draft: 'muted',
  scheduled: 'info',
  sending: 'warning',
  sent: 'success',
  paused: 'danger',
};

interface CampaignDrawerProps {
  campaignId: string | null;
  open: boolean;
  onClose: () => void;
}

export function CampaignDrawer({ campaignId, open, onClose }: CampaignDrawerProps) {
  const { data: campaign, isLoading } = useEmailCampaign(campaignId);

  return (
    <DrawerPanel open={open} onClose={onClose} title={campaign?.name ?? 'Campaign Detail'} width="lg">
      {isLoading ? (
        <LoadingSkeleton variant="card" count={3} />
      ) : !campaign ? (
        <p className="text-sm text-text-muted">Campaign not found.</p>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <StatusBadge label={campaign.status} variant={STATUS_VARIANT[campaign.status] ?? 'default'} />
              <span className="text-xs text-text-muted">
                {campaign.sentDate ? `Sent ${new Date(campaign.sentDate).toLocaleDateString()}` : campaign.scheduledDate ? `Scheduled ${new Date(campaign.scheduledDate).toLocaleDateString()}` : 'Draft'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-text-default">{campaign.name}</h3>
            <p className="mt-1 text-sm text-text-muted">Subject: {campaign.subject}</p>
            <p className="text-xs text-text-muted">{campaign.previewText}</p>
          </div>

          {/* Audience */}
          <div className="rounded-lg border border-default bg-base p-3">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4" style={{ color: ACCENT }} />
              <span className="text-sm font-medium text-text-default">Audience</span>
            </div>
            <p className="text-sm text-text-muted">{campaign.audienceSegment}</p>
            <p className="text-xs text-text-muted">{campaign.audienceSize.toLocaleString()} recipients</p>
          </div>

          {/* Performance Funnel */}
          {campaign.stats && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-text-default">Performance Funnel</h4>
              <div className="space-y-2">
                {[
                  { label: 'Sent', value: campaign.stats.sent, pct: 100 },
                  { label: 'Delivered', value: campaign.stats.delivered, pct: campaign.stats.sent > 0 ? (campaign.stats.delivered / campaign.stats.sent) * 100 : 0 },
                  { label: 'Opened', value: campaign.stats.opened, pct: campaign.stats.delivered > 0 ? (campaign.stats.opened / campaign.stats.delivered) * 100 : 0 },
                  { label: 'Clicked', value: campaign.stats.clicked, pct: campaign.stats.opened > 0 ? (campaign.stats.clicked / campaign.stats.opened) * 100 : 0 },
                  { label: 'Converted', value: campaign.stats.converted, pct: campaign.stats.clicked > 0 ? (campaign.stats.converted / campaign.stats.clicked) * 100 : 0 },
                ].map((step, i, arr) => (
                  <div key={step.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-muted">{step.label}</span>
                      <span className="text-xs font-medium text-text-default">
                        {step.value.toLocaleString()} ({step.pct.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-base">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.max(step.pct, 2)}%`,
                          backgroundColor: ACCENT,
                          opacity: 1 - i * 0.15,
                        }}
                      />
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <ArrowRight className="h-3 w-3 text-text-muted rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[
                  { label: 'Open Rate', value: `${campaign.stats.openRate}%` },
                  { label: 'Click Rate', value: `${campaign.stats.clickRate}%` },
                  { label: 'Bounce Rate', value: `${campaign.stats.bounceRate}%` },
                  { label: 'Unsubscribed', value: campaign.stats.unsubscribed },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-default bg-base p-2 text-center">
                    <p className="text-sm font-bold text-text-default">{stat.value}</p>
                    <p className="text-[10px] text-text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* A/B Test Results */}
          {campaign.abTest && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-text-default">A/B Test Results</h4>
              <div className="grid grid-cols-2 gap-3">
                {campaign.abTest.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`rounded-lg border p-3 ${variant.winner ? 'border-[#5BB8E6]/50 bg-[#5BB8E6]/5' : 'border-default bg-base'}`}
                  >
                    {variant.winner && (
                      <div className="mb-2 flex items-center gap-1">
                        <Trophy className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                        <span className="text-xs font-semibold" style={{ color: ACCENT }}>Winner</span>
                      </div>
                    )}
                    <p className="mb-2 text-xs font-medium text-text-default">
                      &ldquo;{variant.subject}&rdquo;
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-lg font-bold text-text-default">{variant.openRate}%</p>
                        <p className="text-[10px] text-text-muted">Open Rate</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-text-default">{variant.clickRate}%</p>
                        <p className="text-[10px] text-text-muted">Click Rate</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Preview */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-text-default">Message Preview</h4>
            <div className="rounded-lg border border-default bg-base p-4">
              <div className="mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-text-muted" />
                <span className="text-xs font-medium text-text-default">{campaign.subject}</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                {campaign.body.split('{{').map((part, i) => {
                  if (i === 0) return part;
                  const [token, ...rest] = part.split('}}');
                  return (
                    <span key={i}>
                      <span className="rounded bg-amber-500/20 px-1 text-amber-400">{`{{${token}}}`}</span>
                      {rest.join('}}')}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {campaign.status === 'sending' && (
              <button className="rounded-lg border border-default px-4 py-2 text-sm text-text-muted hover:text-text-default transition-colors">
                Pause Campaign
              </button>
            )}
            <button className="rounded-lg border border-default px-4 py-2 text-sm text-text-muted hover:text-text-default transition-colors">
              Duplicate
            </button>
          </div>
        </div>
      )}
    </DrawerPanel>
  );
}
