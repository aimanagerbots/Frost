'use client';

import { useState } from 'react';
import {
  ShoppingCart,
  Crown,
  Package,
  Tag,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth, usePortalCart, usePortalOrders, usePortalPromotions } from '@/modules/portal/shared/hooks';

interface AIContextPanelProps {
  className?: string;
}

interface CollapsibleSectionProps {
  icon: React.ReactNode;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  icon,
  title,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-border-default bg-card">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        {icon}
        <span className="flex-1 text-sm font-medium text-text-default">
          {title}
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-text-muted" />
        ) : (
          <ChevronRight className="h-4 w-4 text-text-muted" />
        )}
      </button>
      {open && <div className="border-t border-border-default px-4 py-3">{children}</div>}
    </div>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function AIContextPanel({ className }: AIContextPanelProps) {
  const { currentAccount } = usePortalAuth();
  const cart = usePortalCart();
  const { data: orders } = usePortalOrders(currentAccount?.id ?? '');
  const { data: promotions } = usePortalPromotions();

  const recentOrders = (orders ?? [])
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 3);

  const activePromos = (promotions ?? []).filter((p) => p.isActive);
  const tierLabel =
    currentAccount?.pricingTier === 1
      ? 'Tier 1 (Premium)'
      : currentAccount?.pricingTier === 2
        ? 'Tier 2 (Standard)'
        : 'Tier 3 (Basic)';

  return (
    <div className={cn('space-y-3', className)}>
      {/* Cart Summary */}
      <CollapsibleSection
        icon={<ShoppingCart className="h-4 w-4 text-accent-primary" />}
        title="Cart"
      >
        {cart.items.length === 0 ? (
          <p className="text-sm text-text-muted">Cart is empty</p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Items</span>
              <span className="font-medium text-text-default">
                {cart.totalItems()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Total</span>
              <span className="font-medium text-accent-primary">
                {formatCurrency(cart.totalPrice())}
              </span>
            </div>
            {cart.totalDiscount() > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Savings</span>
                <span className="font-medium text-green-400">
                  -{formatCurrency(cart.totalDiscount())}
                </span>
              </div>
            )}
          </div>
        )}
      </CollapsibleSection>

      {/* Account Tier */}
      <CollapsibleSection
        icon={<Crown className="h-4 w-4 text-amber-400" />}
        title="Account"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-muted">Pricing Tier</span>
            <span className="font-medium text-text-default">{tierLabel}</span>
          </div>
          {currentAccount && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Health</span>
                <span
                  className={cn(
                    'text-sm font-medium capitalize',
                    currentAccount.healthStatus === 'thriving' && 'text-green-400',
                    currentAccount.healthStatus === 'healthy' && 'text-blue-400',
                    currentAccount.healthStatus === 'at-risk' && 'text-amber-400',
                    currentAccount.healthStatus === 'churning' && 'text-red-400'
                  )}
                >
                  {currentAccount.healthStatus}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Balance</span>
                <span className="font-medium text-text-default">
                  {formatCurrency(currentAccount.outstandingBalance)}
                </span>
              </div>
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* Recent Orders */}
      <CollapsibleSection
        icon={<Package className="h-4 w-4 text-purple-400" />}
        title="Recent Orders"
        defaultOpen={false}
      >
        {recentOrders.length === 0 ? (
          <p className="text-sm text-text-muted">No recent orders</p>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium text-text-default">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-text-muted">
                    {new Date(order.orderDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className="text-text-muted">
                  {formatCurrency(order.total)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CollapsibleSection>

      {/* Active Promotions */}
      <CollapsibleSection
        icon={<Tag className="h-4 w-4 text-green-400" />}
        title="Promotions"
        defaultOpen={false}
      >
        {activePromos.length === 0 ? (
          <p className="text-sm text-text-muted">No active promotions</p>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-text-default">
              <span className="font-medium text-green-400">
                {activePromos.length}
              </span>{' '}
              active {activePromos.length === 1 ? 'promotion' : 'promotions'}
            </p>
            {activePromos.slice(0, 3).map((promo) => (
              <p key={promo.id} className="text-xs text-text-muted">
                {promo.badge} {promo.title}
              </p>
            ))}
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
}
