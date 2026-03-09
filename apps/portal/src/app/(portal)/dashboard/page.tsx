'use client';

import {
  DashboardWelcome,
  DashboardQuickActions,
  DashboardNotificationsPreview,
  DashboardDeals,
  DashboardRecentOrders,
  DashboardDeliveries,
  DashboardStoreOrders,
  DashboardRecommendations,
  DashboardComingSoon,
  DashboardAccountSnapshot,
  DashboardFeaturedProducts,
  DashboardRepCard,
} from '@/modules/portal/dashboard/components';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome + Health */}
      <DashboardWelcome />

      {/* Account Snapshot — 4 metrics */}
      <DashboardAccountSnapshot />

      {/* Quick Actions */}
      <DashboardQuickActions />

      {/* Main grid — 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — wider */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardRecentOrders />
          <DashboardStoreOrders />
          <DashboardRecommendations />
        </div>

        {/* Right column — narrower */}
        <div className="space-y-6">
          <DashboardNotificationsPreview />
          <DashboardDeliveries />
          <DashboardDeals />
          <DashboardRepCard />
        </div>
      </div>

      {/* Featured Products — full width horizontal scroll */}
      <DashboardFeaturedProducts />

      {/* Coming Soon — production calendar preview */}
      <DashboardComingSoon />
    </div>
  );
}
