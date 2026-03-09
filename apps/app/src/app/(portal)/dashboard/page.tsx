'use client';

import { Package, Truck, CreditCard, MessageSquare, Store, TrendingUp, ShoppingCart, AlertTriangle } from 'lucide-react';
import { usePortalAuth, usePortalOrders, usePortalStoreOrders } from '@/modules/portal/shared/hooks';
import { PortalPageHeader } from '@/modules/portal/shared/components/PortalPageHeader';
import { PortalCard } from '@/modules/portal/shared/components/PortalCard';

export default function PortalDashboardPage() {
  const { currentAccount } = usePortalAuth();
  const { data: orders } = usePortalOrders(currentAccount?.id ?? '');
  const { stats } = usePortalStoreOrders();

  const activeOrders = orders?.filter((o) =>
    ['confirmed', 'in-production', 'packaged', 'fulfilled', 'shipped'].includes(o.status)
  ).length ?? 0;

  const metrics = [
    { label: 'Active Orders', value: activeOrders, icon: Package, color: '#3B82F6' },
    { label: 'Store Orders Today', value: stats?.ordersToday ?? 0, icon: Store, color: '#8B5CF6' },
    { label: 'Outstanding Balance', value: `$${(currentAccount?.outstandingBalance ?? 0).toLocaleString()}`, icon: CreditCard, color: currentAccount?.outstandingBalance ? '#EF4444' : '#22C55E' },
    { label: 'Unread Messages', value: currentAccount?.unreadMessages ?? 0, icon: MessageSquare, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={TrendingUp}
        title="Dashboard"
        subtitle={`Welcome back, ${currentAccount?.primaryContact.name.split(' ')[0] ?? 'there'}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <PortalCard key={metric.label}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${metric.color}15` }}
              >
                <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{metric.label}</p>
                <p className="text-xl font-semibold text-gray-900">{metric.value}</p>
              </div>
            </div>
          </PortalCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortalCard>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-amber-500" />
            Quick Actions
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Browse the shop to place a new wholesale order</p>
            <p>• Check your store orders for consumer pickups</p>
            <p>• Ask the AI assistant for reorder suggestions</p>
          </div>
        </PortalCard>

        {currentAccount?.outstandingBalance ? (
          <PortalCard>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Payment Alert
            </h3>
            <p className="text-sm text-gray-600">
              You have an outstanding balance of <span className="font-semibold text-red-600">${currentAccount.outstandingBalance.toLocaleString()}</span>.
              Please visit the Payments section to resolve.
            </p>
          </PortalCard>
        ) : (
          <PortalCard>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Account Health
            </h3>
            <p className="text-sm text-gray-600">
              Your account is in great standing with a health score of{' '}
              <span className="font-semibold text-green-600">{currentAccount?.healthScore ?? 0}/100</span>.
              Keep it up!
            </p>
          </PortalCard>
        )}
      </div>
    </div>
  );
}
