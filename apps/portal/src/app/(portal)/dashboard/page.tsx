'use client';

import {
  DashboardWelcome,
  DashboardScorecard,
  DashboardQuickActions,
  DashboardRecentOrders,
  DashboardWhatsHot,
  DashboardDrops,
  DashboardTierPreview,
  DashboardSavings,
  DashboardAlerts,
  DashboardRepCard,
  DashboardFeaturedProducts,
  DashboardStoreOrders,
  DashboardDeliveries,
} from '@/modules/portal/dashboard/components';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <DashboardWelcome />

      {/* Hero scorecard — anchoring psychology */}
      <DashboardScorecard />

      {/* Quick Actions */}
      <DashboardQuickActions />

      {/* Main grid — 3 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — wider */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardRecentOrders />
          <DashboardWhatsHot />
          <DashboardDrops />
        </div>

        {/* Right column — narrower */}
        <div className="space-y-6">
          <DashboardTierPreview />
          <DashboardSavings />
          <DashboardAlerts />
          <DashboardRepCard />
        </div>
      </div>

      {/* Full-width sections */}
      <DashboardFeaturedProducts />
      <DashboardStoreOrders />
      <DashboardDeliveries />
    </div>
  );
}
