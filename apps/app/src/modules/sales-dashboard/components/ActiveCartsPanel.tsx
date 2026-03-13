'use client';

import { ShoppingCart } from 'lucide-react';
import { AccentCard, LoadingSkeleton, EmptyState } from '@/components';
import { useActiveCartsSummary } from '../hooks';

const ACCENT = '#F59E0B';

interface ActiveCartsPanelProps {
  myAccountsOnly: boolean;
  currentRep: string;
}

export function ActiveCartsPanel({ myAccountsOnly, currentRep }: ActiveCartsPanelProps) {
  const { data, isLoading } = useActiveCartsSummary(myAccountsOnly, currentRep);

  if (isLoading) return <LoadingSkeleton variant="list" />;

  return (
    <AccentCard accentColor={ACCENT} padding="md">
      <h3 className="mb-4 text-center text-sm font-semibold text-text-bright">
        Active Carts
      </h3>

      {!data || data.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No Active Carts"
          description="No open carts at this time."
          accentColor={ACCENT}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-default text-left text-text-muted">
                <th className="pb-2 font-medium">Client / Started Date</th>
                <th className="pb-2 text-center font-medium">Items</th>
                <th className="pb-2 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((cart) => (
                <tr key={cart.id} className="group">
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      <ShoppingCart className="h-3 w-3 text-amber-400" />
                      <span className="font-medium text-amber-400">
                        {cart.clientName}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-text-muted">{cart.name}</p>
                  </td>
                  <td className="py-2.5 text-center text-text-default">
                    {cart.itemCount}
                  </td>
                  <td className="py-2.5 text-right font-medium text-amber-400">
                    ${cart.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AccentCard>
  );
}
