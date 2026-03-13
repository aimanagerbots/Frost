'use client';

import { Megaphone, Image, TrendingUp, Eye, MousePointer } from 'lucide-react';
import { StatusBadge } from '@/components';
import { useCultiveraMarketing } from '../../hooks/useCultiveraMarketing';
import { useCultiveraStore } from '../../store';
import { AdCampaignModal } from './AdCampaignModal';

const ACCENT = '#22D3EE';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ctr(impressions: number, clicks: number): string {
  if (!impressions) return '—';
  return ((clicks / impressions) * 100).toFixed(2) + '%';
}

export function CultiveraMarketing() {
  const { data, isLoading } = useCultiveraMarketing();
  const { selectedCampaignId, selectCampaign } = useCultiveraStore();

  if (isLoading || !data) {
    return <div className="h-64 rounded-xl bg-card animate-pulse" />;
  }

  const { campaigns } = data;
  const activeCampaign = campaigns.find((c) => c.status === 'active');
  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId) ?? null;

  return (
    <div className="space-y-4">
      {/* Active Campaign Banner */}
      {activeCampaign ? (
        <div
          className="rounded-xl border p-5 cursor-pointer hover:opacity-95 transition-opacity"
          style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}
          onClick={() => selectCampaign(activeCampaign.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${ACCENT}20`, color: ACCENT }}>
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold text-white">Sponsored Brand — Active</span>
                  <StatusBadge status="active" />
                </div>
                <p className="text-xs text-text-muted">
                  {formatDate(activeCampaign.startDate)} — {formatDate(activeCampaign.endDate)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-white">${activeCampaign.spend.toLocaleString()}</p>
              <p className="text-xs text-text-muted">of ${activeCampaign.budget.toLocaleString()} budget</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t" style={{ borderColor: `${ACCENT}20` }}>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" style={{ color: ACCENT }} />
              <div>
                <p className="text-sm font-bold text-white">{activeCampaign.impressions.toLocaleString()}</p>
                <p className="text-xs text-text-muted">Impressions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4" style={{ color: ACCENT }} />
              <div>
                <p className="text-sm font-bold text-white">{activeCampaign.clicks.toLocaleString()}</p>
                <p className="text-xs text-text-muted">Clicks</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" style={{ color: ACCENT }} />
              <div>
                <p className="text-sm font-bold text-white">{ctr(activeCampaign.impressions, activeCampaign.clicks)}</p>
                <p className="text-xs text-text-muted">CTR</p>
              </div>
            </div>
          </div>

          {/* Budget bar */}
          <div className="mt-4">
            <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.min((activeCampaign.spend / activeCampaign.budget) * 100, 100)}%`, background: ACCENT }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-default bg-card p-5 text-center py-8">
          <Megaphone className="h-8 w-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No active campaign</p>
          <p className="text-xs text-text-muted mt-1">Contact your Cultivera rep to book a sponsored brand slot or banner ad.</p>
        </div>
      )}

      {/* All Campaigns Table */}
      <div className="rounded-xl border border-default bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-default">
          <h3 className="text-sm font-semibold text-white">All Campaigns</h3>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-default bg-card-hover">
              <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Type</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Dates</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Spend / Budget</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Impressions</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">CTR</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => {
              const TypeIcon = campaign.type === 'sponsored-brand' ? Megaphone : Image;
              const typeColor = campaign.type === 'sponsored-brand' ? ACCENT : '#F59E0B';
              return (
                <tr
                  key={campaign.id}
                  className="border-b border-default last:border-0 hover:bg-card-hover transition-colors cursor-pointer"
                  onClick={() => selectCampaign(campaign.id)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4" style={{ color: typeColor }} />
                      <span className="text-xs font-medium text-white">
                        {campaign.type === 'sponsored-brand' ? 'Sponsored Brand' : 'Banner Ad'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-text-muted">{formatDate(campaign.startDate)} — {formatDate(campaign.endDate)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge
                      status={campaign.status === 'active' ? 'active' : campaign.status === 'upcoming' ? 'scheduled' : 'delivered'}
                    />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-xs font-semibold text-white">${campaign.spend.toLocaleString()}</span>
                    <span className="text-xs text-text-muted"> / ${campaign.budget.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-xs text-white">{campaign.impressions.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="text-xs text-white">{ctr(campaign.impressions, campaign.clicks)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); selectCampaign(campaign.id); }}
                      className="rounded-md px-2.5 py-1 text-xs font-medium border border-default text-text-muted hover:text-white hover:bg-card-hover transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Campaign Modal */}
      {selectedCampaign && (
        <AdCampaignModal campaign={selectedCampaign} onClose={() => selectCampaign(null)} />
      )}
    </div>
  );
}
