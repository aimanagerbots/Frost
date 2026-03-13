'use client';

import { Globe, Store, Trophy, TrendingUp, ShoppingCart, RefreshCw, Package } from 'lucide-react';
import { MARKETPLACE_STATS } from '@/mocks/cultivera';

const ACCENT = '#22D3EE';

export function CultiveraMarketplace() {
  const stats = MARKETPLACE_STATS;
  const cultiveraPct = ((stats.cultiveraManagedRetailers / stats.totalWALicensedRetailers) * 100).toFixed(0);

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-xl border border-default bg-card p-4 flex items-center gap-3">
          <Store className="h-8 w-8 flex-shrink-0" style={{ color: ACCENT }} />
          <div>
            <p className="text-2xl font-bold text-white">{stats.cultiveraManagedRetailers}</p>
            <p className="text-xs text-text-muted mt-0.5">Cultivera Retailers in WA</p>
            <p className="text-xs text-text-muted">{cultiveraPct}% of {stats.totalWALicensedRetailers} licensed</p>
          </div>
        </div>

        <div className="rounded-xl border border-default bg-card p-4 flex items-center gap-3">
          <Trophy className="h-8 w-8 flex-shrink-0 text-amber-400" />
          <div>
            <p className="text-2xl font-bold text-white">#{stats.frozenSupplierRank}</p>
            <p className="text-xs text-text-muted mt-0.5">Frost Supplier Rank</p>
            <p className="text-xs text-text-muted">out of {stats.cultiveraManagedRetailers} suppliers</p>
          </div>
        </div>

        <div className="rounded-xl border border-default bg-card p-4 flex items-center gap-3">
          <Package className="h-8 w-8 flex-shrink-0" style={{ color: ACCENT }} />
          <div>
            <p className="text-2xl font-bold text-white">{stats.activeListings}</p>
            <p className="text-xs text-text-muted mt-0.5">Active Listings</p>
            <p className="text-xs text-text-muted">on Cultivera marketplace</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-default bg-card p-4 flex items-center gap-3">
          <ShoppingCart className="h-6 w-6 flex-shrink-0" style={{ color: ACCENT }} />
          <div>
            <p className="text-xl font-bold text-white">${stats.avgOrderValue.toLocaleString()}</p>
            <p className="text-xs text-text-muted">Avg Order Value</p>
          </div>
        </div>
        <div className="rounded-xl border border-default bg-card p-4 flex items-center gap-3">
          <TrendingUp className="h-6 w-6 flex-shrink-0 text-green-400" />
          <div>
            <p className="text-xl font-bold text-white">{(stats.repeatBuyerRate * 100).toFixed(0)}%</p>
            <p className="text-xs text-text-muted">Repeat Buyer Rate</p>
          </div>
        </div>
      </div>

      {/* Context Narrative */}
      <div className="rounded-xl border border-default bg-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" style={{ color: ACCENT }} />
          <h3 className="text-sm font-semibold text-white">WA Market Landscape</h3>
        </div>
        <p className="text-sm text-text-muted leading-relaxed">
          Of Washington state&apos;s <strong className="text-white">{stats.totalWALicensedRetailers} licensed cannabis retailers</strong>,{' '}
          <strong className="text-white">~{stats.cultiveraManagedRetailers} (~{cultiveraPct}%)</strong> use Cultivera as their primary B2B ordering
          platform. This concentration makes Cultivera the dominant marketplace channel in the state — nearly all retailer purchasing activity flows
          through it.
        </p>
        <p className="text-sm text-text-muted leading-relaxed">
          Frost disconnected from Cultivera&apos;s inventory API to build its own AI-powered operations system. As a result, menu data must be
          manually synced daily via CSV export. Orders placed by retailers on Cultivera are automatically captured by the intake bot and logged here
          for review before being pushed into Frost&apos;s order management system.
        </p>
      </div>

      {/* Integration Status */}
      <div className="rounded-xl border border-default bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">Integration Status</h3>

        <div className="space-y-3">
          {[
            {
              label: 'Inventory API',
              status: 'disconnected',
              description: 'Disconnected — Frost uses its own inventory system',
              color: '#EF4444',
              icon: RefreshCw,
            },
            {
              label: 'Menu CSV Sync',
              status: 'active',
              description: 'Daily automated export at 6:00 AM PT',
              color: '#22C55E',
              icon: RefreshCw,
            },
            {
              label: 'Order Intake Bot',
              status: 'active',
              description: 'Polling for new orders — 2x daily',
              color: '#22C55E',
              icon: ShoppingCart,
            },
            {
              label: 'Marketplace Listing',
              status: 'active',
              description: `${stats.activeListings} active SKUs visible to ${stats.cultiveraManagedRetailers} retailers`,
              color: '#22C55E',
              icon: Store,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-text-muted">{item.description}</p>
                </div>
              </div>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: `${item.color}15`,
                  color: item.color,
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-xl border border-default bg-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white">Notes & Context</h3>
        <div className="rounded-lg bg-elevated px-4 py-3 space-y-2">
          <p className="text-xs text-text-muted leading-relaxed">
            • Top reorder accounts: <span className="text-white">Herbs House, Cannabis &amp; Glass, Diego Pellicer, Have a Heart</span>
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            • Cultivera charges a platform fee per transaction — negotiate rate annually at renewal (current: standard tier)
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            • Sponsored brand slots book 2–3 weeks in advance; banner ads available with shorter lead time
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            • WA WSLCB compliance: all orders placed via Cultivera are logged in their traceability system — ensure Frost orders mirror these records
          </p>
        </div>
      </div>
    </div>
  );
}
