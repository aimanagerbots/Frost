'use client';

import { useEffect, useCallback } from 'react';
import { X, Megaphone, Image, Calendar, Mail } from 'lucide-react';
import { StatusBadge } from '@/components';
import type { AdCampaign } from '../../types';

interface AdCampaignModalProps {
  campaign: AdCampaign;
  onClose: () => void;
}

const ACCENT = '#22D3EE';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ctr(impressions: number, clicks: number): string {
  if (!impressions) return '—';
  return ((clicks / impressions) * 100).toFixed(2) + '%';
}

export function AdCampaignModal({ campaign, onClose }: AdCampaignModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const typeColor = campaign.type === 'sponsored-brand' ? ACCENT : '#F59E0B';
  const typeLabel = campaign.type === 'sponsored-brand' ? 'Sponsored Brand' : 'Banner Ad';
  const TypeIcon = campaign.type === 'sponsored-brand' ? Megaphone : Image;
  const budgetPct = campaign.budget > 0 ? Math.min((campaign.spend / campaign.budget) * 100, 100) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-default bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-default">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: `${typeColor}15`, color: typeColor }}
            >
              <TypeIcon className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{typeLabel}</h2>
                <StatusBadge
                  status={campaign.status === 'active' ? 'active' : campaign.status === 'upcoming' ? 'scheduled' : 'delivered'}
                />
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {formatDate(campaign.startDate)} — {formatDate(campaign.endDate)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-card-hover transition-colors text-text-muted hover:text-white" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Budget progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">Budget</span>
              <span className="text-xs text-white font-semibold">
                ${campaign.spend.toLocaleString()} <span className="text-text-muted font-normal">of ${campaign.budget.toLocaleString()}</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${budgetPct}%`, background: typeColor }}
              />
            </div>
            <p className="text-xs text-text-muted mt-1">{budgetPct.toFixed(0)}% spent</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-elevated px-3 py-3 text-center">
              <p className="text-lg font-bold text-white">{campaign.impressions.toLocaleString()}</p>
              <p className="text-xs text-text-muted mt-0.5">Impressions</p>
            </div>
            <div className="rounded-xl bg-elevated px-3 py-3 text-center">
              <p className="text-lg font-bold text-white">{campaign.clicks.toLocaleString()}</p>
              <p className="text-xs text-text-muted mt-0.5">Clicks</p>
            </div>
            <div className="rounded-xl bg-elevated px-3 py-3 text-center">
              <p className="text-lg font-bold text-white">{ctr(campaign.impressions, campaign.clicks)}</p>
              <p className="text-xs text-text-muted mt-0.5">CTR</p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-3 rounded-lg border border-default px-4 py-3">
            <Calendar className="h-4 w-4 text-text-muted flex-shrink-0" />
            <div>
              <p className="text-xs text-text-muted">Campaign window</p>
              <p className="text-sm font-semibold text-white">{formatDate(campaign.startDate)} — {formatDate(campaign.endDate)}</p>
            </div>
          </div>

          {/* Notes */}
          {campaign.notes && (
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Notes</p>
              <p className="text-sm text-white leading-relaxed">{campaign.notes}</p>
            </div>
          )}

          {/* Contact */}
          <a
            href="mailto:sales@cultiverapro.com"
            className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-xs font-semibold border border-default text-text-muted hover:text-white hover:bg-card-hover transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            Contact Cultivera Rep
          </a>
        </div>
      </div>
    </div>
  );
}
