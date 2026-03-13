'use client';

import { useState, Suspense } from 'react';
import {
  Navigation,
  Package,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  Zap,
  ShoppingBag,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useOrderStore } from '@/stores/order-store';
import { AccountTabs, type AccountTab } from './AccountTabs';
import { PointsCard } from './PointsCard';
import { SweepstakeCard } from './SweepstakeCard';
import { MerchBrowseClient } from '@/components/merch/MerchBrowseClient';
import {
  MOCK_LOYALTY,
  MOCK_PURCHASES,
  MOCK_SWEEPSTAKES,
  MOCK_POINTS_ACTIVITY,
  TIER_THRESHOLDS,
} from '@/mocks/account';
import { getMerchItems } from '@/mocks/merch';
import type { PointsActivity } from '@/types/merch';

export function AccountPageClient() {
  const [activeTab, setActiveTab] = useState<AccountTab>('overview');
  const customerName = useAuthStore((s) => s.customerName);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const userLocation = useOrderStore((s) => s.userLocation);
  const setUserLocation = useOrderStore((s) => s.setUserLocation);

  const handleLogout = () => {
    logout();
    router.push('/home');
  };

  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'My Location',
        });
      },
      () => {
        /* silently fail */
      },
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {customerName ? `Welcome back, ${customerName.split(' ')[0]}` : 'My Account'}
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Manage your rewards, purchases, and merch.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-full border border-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/40 transition-colors hover:border-red-500/30 hover:text-red-400"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>

      <AccountTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && <OverviewTab onLocate={handleLocate} hasLocation={userLocation !== null} />}
      {activeTab === 'history' && <PurchaseHistoryTab />}
      {activeTab === 'rewards' && <RewardsTab />}
      {activeTab === 'sweepstakes' && <SweepstakesTab />}
      {activeTab === 'merch' && <MerchShopTab />}
    </div>
  );
}

/* ── Overview Tab ── */

function OverviewTab({ onLocate, hasLocation }: { onLocate: () => void; hasLocation: boolean }) {
  return (
    <div className="space-y-6">
      <PointsCard loyalty={MOCK_LOYALTY} />

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          type="button"
          onClick={onLocate}
          className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-colors hover:border-[#5BB8E6]/30"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5BB8E6]/10">
            <Navigation className="h-5 w-5 text-[#5BB8E6]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {hasLocation ? 'Location Set' : 'Set My Location'}
            </p>
            <p className="text-[11px] text-white/30">Auto-find nearby stores</p>
          </div>
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
            <Package className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {MOCK_PURCHASES.length} Orders
            </p>
            <p className="text-[11px] text-white/30">Lifetime purchases</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
            <Gift className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {MOCK_SWEEPSTAKES.length} Active
            </p>
            <p className="text-[11px] text-white/30">Sweepstakes entries</p>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {MOCK_POINTS_ACTIVITY.slice(0, 5).map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Purchase History Tab ── */

function PurchaseHistoryTab() {
  return (
    <div className="space-y-4">
      {MOCK_PURCHASES.map((order) => (
        <div
          key={order.id}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5BB8E6]/10">
                <ShoppingBag className="h-4 w-4 text-[#5BB8E6]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {new Date(order.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-[11px] text-white/30">{order.storeLocation}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">${order.total}</p>
              <p className="text-[11px] text-[#5BB8E6]">+{order.pointsEarned} pts</p>
            </div>
          </div>

          <div className="space-y-1.5 border-t border-white/[0.04] pt-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-white/60">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-white/40">${item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Rewards Tab ── */

function RewardsTab() {
  const tiers = Object.values(TIER_THRESHOLDS);

  return (
    <div className="space-y-6">
      <PointsCard loyalty={MOCK_LOYALTY} />

      {/* Tier breakdown */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
          Loyalty Tiers
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {tiers.map((tier) => {
            const isCurrent = tier.label.toLowerCase() === MOCK_LOYALTY.tier;
            return (
              <div
                key={tier.label}
                className={`rounded-lg border p-4 ${
                  isCurrent
                    ? 'border-[#5BB8E6]/30 bg-[#5BB8E6]/5'
                    : 'border-white/[0.04] bg-white/[0.01]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: tier.color }}
                  />
                  <p className="text-sm font-bold text-white">{tier.label}</p>
                  {isCurrent && (
                    <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-[#5BB8E6]">
                      Current
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-white/30">
                  {tier.max === Infinity
                    ? `${tier.min.toLocaleString()}+ pts`
                    : `${tier.min.toLocaleString()} – ${tier.max.toLocaleString()} pts`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How to earn */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
          How to Earn
        </h3>
        <div className="space-y-3">
          <EarnRow icon={<ShoppingBag className="h-4 w-4" />} title="Every Purchase" desc="Earn 1 point per $1 spent at any Frost location" />
          <EarnRow icon={<Zap className="h-4 w-4" />} title="Featured Products" desc="2x points on weekly featured strains and products" />
          <EarnRow icon={<Gift className="h-4 w-4" />} title="Birthday Bonus" desc="200 bonus points on your birthday" />
        </div>
      </div>

      {/* Points activity */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
          Points Activity
        </h3>
        <div className="space-y-3">
          {MOCK_POINTS_ACTIVITY.map((activity) => (
            <ActivityRow key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EarnRow({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#5BB8E6]/10 text-[#5BB8E6]">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-white/40">{desc}</p>
      </div>
    </div>
  );
}

/* ── Sweepstakes Tab ── */

function SweepstakesTab() {
  return (
    <div>
      <p className="mb-6 text-sm text-white/40">
        Enter for chances to win exclusive Frost prizes. Each entry costs points from your balance.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_SWEEPSTAKES.map((sweep) => (
          <SweepstakeCard key={sweep.id} entry={sweep} userPoints={MOCK_LOYALTY.points} />
        ))}
      </div>
    </div>
  );
}

/* ── Merch Shop Tab ── */

function MerchShopTab() {
  const items = getMerchItems();
  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen px-6">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-sm text-white/40">
          Redeem your Frost points for exclusive merchandise, or purchase with cash.
        </p>
        <Suspense fallback={null}>
          <MerchBrowseClient items={[...items]} redeemMode />
        </Suspense>
      </div>
    </div>
  );
}

/* ── Shared: Activity row ── */

function ActivityRow({ activity }: { activity: PointsActivity }) {
  const isPositive = activity.points > 0;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full ${
            isPositive ? 'bg-green-500/10' : 'bg-red-500/10'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-green-400" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
          )}
        </div>
        <div>
          <p className="text-sm text-white/80">{activity.description}</p>
          <p className="text-[11px] text-white/30">
            {new Date(activity.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
      <span
        className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}
      >
        {isPositive ? '+' : ''}{activity.points}
      </span>
    </div>
  );
}
