'use client';

import { ExternalLink, RefreshCw, TrendingUp, Store, ShoppingCart, Trophy, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { MetricCard, StatusBadge } from '@/components';
import { useCultiveraDashboard } from '../../hooks/useCultiveraDashboard';
import { useCultiveraStore } from '../../store';
import type { SyncRun } from '../../types';

const ACCENT = '#22D3EE';

function syncStatusIcon(status: SyncRun['status']) {
  if (status === 'success') return <CheckCircle className="h-3.5 w-3.5 text-green-400" />;
  if (status === 'partial') return <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />;
  return <XCircle className="h-3.5 w-3.5 text-red-400" />;
}

function syncStatusLabel(status: SyncRun['status']): string {
  if (status === 'success') return 'success';
  if (status === 'partial') return 'partial';
  return 'failed';
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return `Today ${formatTime(iso)}`;
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday ${formatTime(iso)}`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + formatTime(iso);
}

export function CultiveraDashboard() {
  const { data, isLoading } = useCultiveraDashboard();
  const { setView } = useCultiveraStore();

  const syncStatus = data?.syncStatus;
  const botStatus = data?.botStatus;
  const marketplaceStats = data?.marketplaceStats;
  const recentRuns = data?.recentRuns ?? [];

  if (isLoading || !syncStatus || !botStatus || !marketplaceStats) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="WA Stores on Cultivera"
          value={marketplaceStats.cultiveraManagedRetailers.toLocaleString()}
          subValue={`of ${marketplaceStats.totalWALicensedRetailers} licensed`}
          icon={Store}
          accentColor={ACCENT}
        />
        <MetricCard
          label="Menu Last Synced"
          value={formatDate(syncStatus.lastRun.timestamp)}
          subValue={syncStatus.lastRun.status === 'success' ? `${syncStatus.lastRun.itemsSynced} items` : syncStatus.lastRun.errorMessage ?? ''}
          icon={RefreshCw}
          accentColor={syncStatus.lastRun.status === 'success' ? '#22C55E' : syncStatus.lastRun.status === 'partial' ? '#F59E0B' : '#EF4444'}
        />
        <MetricCard
          label="Orders Today"
          value={botStatus.ordersImportedToday.toString()}
          subValue={`${botStatus.pendingReview} pending review`}
          icon={ShoppingCart}
          accentColor={ACCENT}
        />
        <MetricCard
          label="Supplier Rank"
          value={`#${marketplaceStats.frozenSupplierRank}`}
          subValue={`of ${marketplaceStats.cultiveraManagedRetailers} suppliers`}
          icon={Trophy}
          accentColor="#F59E0B"
        />
      </div>

      {/* View on Cultivera CTA */}
      <div
        className="rounded-xl border px-5 py-4 flex items-center justify-between"
        style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}08` }}
      >
        <div>
          <p className="text-sm font-semibold text-white">Frost Menu on Cultivera Marketplace</p>
          <p className="text-xs text-text-muted mt-0.5">
            {marketplaceStats.activeListings} active listings · Rank #{marketplaceStats.frozenSupplierRank} in WA · Avg order ${marketplaceStats.avgOrderValue.toLocaleString()}
          </p>
        </div>
        <a
          href="https://wa.cultiverapro.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{ background: ACCENT, color: '#0A1628' }}
        >
          <span>View on Cultivera</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Two-column: Sync Health + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sync Health */}
        <div className="rounded-xl border border-default bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Sync Health</h3>
            <StatusBadge
              status={syncStatus.lastRun.status === 'success' ? 'active' : syncStatus.lastRun.status === 'partial' ? 'in-production' : 'failed'}
            />
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Last sync</span>
              <span className="text-white font-medium">{formatDate(syncStatus.lastRun.timestamp)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Next scheduled</span>
              <div className="flex items-center gap-1 text-white font-medium">
                <Clock className="h-3 w-3 text-text-muted" />
                <span>{formatDate(syncStatus.nextScheduled)}</span>
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Items in last run</span>
              <span className="text-white font-medium">{syncStatus.lastRun.itemsSynced} synced · {syncStatus.lastRun.itemsFailed} failed</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Total lifetime syncs</span>
              <span className="text-white font-medium">{syncStatus.totalLifetimeSyncs.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => setView('menu-sync')}
            className="w-full rounded-lg border border-default px-3 py-2 text-xs font-semibold text-white hover:bg-card-hover transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Go to Menu Sync
          </button>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-default bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Recent Sync Activity</h3>
            <span className="text-xs text-text-muted">Last {recentRuns.length} runs</span>
          </div>

          <div className="space-y-2">
            {recentRuns.map((run) => (
              <div key={run.id} className="flex items-start gap-3 py-2 border-b border-default last:border-0">
                <div className="mt-0.5 flex-shrink-0">
                  {syncStatusIcon(run.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-white capitalize">
                      {syncStatusLabel(run.status)}
                    </span>
                    <span className="text-xs text-text-muted flex-shrink-0">{relativeTime(run.timestamp)}</span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    {run.status === 'failed'
                      ? run.errorMessage
                      : `${run.itemsSynced} items synced${run.itemsFailed > 0 ? `, ${run.itemsFailed} failed` : ''} in ${run.duration}s`
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-default bg-card px-4 py-3 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 flex-shrink-0" style={{ color: ACCENT }} />
          <div>
            <p className="text-xs text-text-muted">Repeat Buyer Rate</p>
            <p className="text-base font-bold text-white">{(marketplaceStats.repeatBuyerRate * 100).toFixed(0)}%</p>
          </div>
        </div>
        <div className="rounded-xl border border-default bg-card px-4 py-3 flex items-center gap-3">
          <ShoppingCart className="h-5 w-5 flex-shrink-0" style={{ color: ACCENT }} />
          <div>
            <p className="text-xs text-text-muted">Avg Order Value</p>
            <p className="text-base font-bold text-white">${marketplaceStats.avgOrderValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-xl border border-default bg-card px-4 py-3 flex items-center gap-3">
          <Store className="h-5 w-5 flex-shrink-0" style={{ color: ACCENT }} />
          <div>
            <p className="text-xs text-text-muted">Active Listings</p>
            <p className="text-base font-bold text-white">{marketplaceStats.activeListings}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
