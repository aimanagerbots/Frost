'use client';

import { Users } from 'lucide-react';
import { AccentCard, LoadingSkeleton, EmptyState } from '@/components';
import { useRecentClients } from '../hooks';

const ACCENT = '#F59E0B';

interface RecentClientsPanelProps {
  myAccountsOnly: boolean;
  currentRep: string;
}

export function RecentClientsPanel({ myAccountsOnly, currentRep }: RecentClientsPanelProps) {
  const { data, isLoading } = useRecentClients(myAccountsOnly, currentRep);

  if (isLoading) return <LoadingSkeleton variant="list" />;

  return (
    <AccentCard accentColor={ACCENT} padding="md">
      <div className="space-y-5">
        {/* Top Accounts Up For Reorder */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-bright">
            Top Accounts Up For Reorder
          </h3>
          {!data || data.topReorder.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Data"
              description="No reorder accounts."
              accentColor={ACCENT}
            />
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-default text-left text-text-muted">
                  <th className="pb-2 font-medium">Account</th>
                  <th className="pb-2 text-center font-medium">No# Orders</th>
                  <th className="pb-2 text-right font-medium">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.topReorder.map((a) => (
                  <tr key={a.accountName}>
                    <td className="py-2 text-text-default">{a.accountName}</td>
                    <td className="py-2 text-center text-text-muted">{a.orderCount}</td>
                    <td className="py-2 text-right text-text-muted">{a.lastOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top Ordering Clients */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-bright">
            Top Ordering Clients
          </h3>
          {!data || data.topOrdering.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Data"
              description="No ordering clients."
              accentColor={ACCENT}
            />
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-default text-left text-text-muted">
                  <th className="pb-2 font-medium">Account</th>
                  <th className="pb-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.topOrdering.map((c) => (
                  <tr key={c.accountName}>
                    <td className="py-2 text-text-default">{c.accountName}</td>
                    <td className="py-2 text-right font-medium text-text-bright">
                      ${c.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AccentCard>
  );
}
