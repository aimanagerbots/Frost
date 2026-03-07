'use client';

import { useState } from 'react';
import { BarChart3, Package, AlertTriangle, Zap, Mail, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SectionHeader,
  MetricCard,
  StatusBadge,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from '@/components';
import { useVMIAccounts, useVMIMetrics } from '../hooks';
import { useVMIDailyEmails } from '../hooks/useVMIAccounts';
import { VMIAccountDetail } from './VMIAccountDetail';
import type { VMIAccount, VMIDailyEmail } from '../types';

const ACCENT = '#EF4444';

function AccountCard({
  account,
  selected,
  onSelect,
}: {
  account: VMIAccount;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5',
        selected
          ? 'border-[#EF4444]/50 bg-[#EF4444]/10'
          : 'border-default bg-card hover:bg-card-hover'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-text-bright">{account.accountName}</h3>
          <p className="mt-0.5 text-xs text-text-muted">
            Enrolled {new Date(account.enrolledDate).toLocaleDateString()}
          </p>
        </div>
        {account.reorderAlerts > 0 && (
          <StatusBadge
            label={`${account.reorderAlerts} alerts`}
            variant="danger"
            size="sm"
            dot
            pulse
          />
        )}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div>
          <div className="text-lg font-bold text-text-bright">{account.skuCount}</div>
          <div className="text-xs text-text-muted">SKUs</div>
        </div>
        <div>
          <div className="text-lg font-bold text-text-bright">{account.totalVelocity}</div>
          <div className="text-xs text-text-muted">Units/Day</div>
        </div>
        <div>
          <div className={cn('text-lg font-bold', account.reorderAlerts > 0 ? 'text-danger' : 'text-text-bright')}>
            {account.reorderAlerts}
          </div>
          <div className="text-xs text-text-muted">Reorders</div>
        </div>
      </div>
      <div className="mt-2 text-xs text-text-muted">
        Last restock: {new Date(account.lastRestockDate).toLocaleDateString()}
      </div>
    </button>
  );
}

function DailyEmailCard({ email }: { email: VMIDailyEmail }) {
  return (
    <div className="rounded-xl border border-default bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" style={{ color: ACCENT }} />
          <h4 className="text-sm font-semibold text-text-bright">{email.accountName}</h4>
        </div>
        <span className="text-xs text-text-muted">Rep: {email.repName}</span>
      </div>

      {/* Reorder Items */}
      {email.reorderItems.length > 0 && (
        <div className="mb-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-danger">
            <AlertTriangle className="h-3.5 w-3.5" />
            Reorder Recommendations
          </div>
          <div className="space-y-1">
            {email.reorderItems.map((item) => (
              <div
                key={item.sku}
                className="flex items-center justify-between rounded-lg bg-elevated px-2.5 py-1.5 text-xs"
              >
                <span className="text-text-default">{item.productName}</span>
                <span className="font-semibold text-danger">+{item.reorderQty} units</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitive Alerts */}
      {email.competitiveAlerts.length > 0 && (
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-warning">
            <Zap className="h-3.5 w-3.5" />
            Competitive Alerts
          </div>
          <div className="space-y-1">
            {email.competitiveAlerts.map((alert, i) => (
              <div
                key={i}
                className="rounded-lg bg-elevated px-2.5 py-1.5 text-xs text-text-muted"
              >
                {alert}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-1 text-xs text-text-muted">
        <Clock className="h-3 w-3" />
        Generated {new Date(email.generatedAt).toLocaleTimeString()}
      </div>
    </div>
  );
}

export function VMIPage() {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const { data: accounts, isLoading: accountsLoading, error: accountsError, refetch: refetchAccounts } = useVMIAccounts();
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useVMIMetrics();

  const { data: dailyEmails, error: emailsError, refetch: refetchEmails } = useVMIDailyEmails();

  const selectedAccount = accounts?.find((a) => a.accountId === selectedAccountId);

  if (metricsLoading || accountsLoading) {
    return <LoadingSkeleton variant="card" count={3} />;
  }

  if (accountsError || metricsError || emailsError) {
    return (
      <ErrorState
        title="Failed to load VMI data"
        message={(accountsError || metricsError || emailsError)?.message}
        onRetry={() => { refetchAccounts(); refetchMetrics(); refetchEmails(); }}
      />
    );
  }

  if (!accounts?.length) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No VMI accounts"
        description="No vendor managed inventory accounts are enrolled yet."
        accentColor={ACCENT}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={BarChart3}
        title="Vendor Managed Inventory"
        subtitle="Track sell-through, stock levels, and market share across enrolled accounts"
        accentColor={ACCENT}
      />

      {/* Metrics Row */}
      {metrics && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            label="Enrolled Accounts"
            value={metrics.enrolledAccounts}
            accentColor={ACCENT}
          />
          <MetricCard
            label="Total SKUs"
            value={metrics.totalSKUs}
            accentColor={ACCENT}
          />
          <MetricCard
            label="Reorder Alerts"
            value={metrics.reorderAlerts}
            accentColor={metrics.reorderAlerts > 0 ? '#EF4444' : ACCENT}
            trend={metrics.reorderAlerts > 0 ? { value: metrics.reorderAlerts, direction: 'up' } : undefined}
          />
          <MetricCard
            label="Avg Daily Velocity"
            value={`${metrics.avgDailyVelocity} u/d`}
            accentColor={ACCENT}
            trend={{ value: 5, direction: 'up' }}
          />
          <MetricCard
            label="Fill Rate"
            value={`${metrics.fillRate}%`}
            accentColor={ACCENT}
            trend={{ value: 2, direction: 'up' }}
          />
        </div>
      )}

      {/* Account Cards */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-bright">
          <Package className="h-4 w-4" style={{ color: ACCENT }} />
          Enrolled Accounts
        </h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {(accounts ?? []).map((account) => (
            <AccountCard
              key={account.accountId}
              account={account}
              selected={selectedAccountId === account.accountId}
              onSelect={() =>
                setSelectedAccountId(
                  selectedAccountId === account.accountId ? null : account.accountId
                )
              }
            />
          ))}
        </div>
      </div>

      {/* Account Detail */}
      {selectedAccount && (
        <VMIAccountDetail
          accountId={selectedAccount.accountId}
          accountName={selectedAccount.accountName}
          onClose={() => setSelectedAccountId(null)}
        />
      )}

      {/* Daily Email Preview */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-bright">
          <Mail className="h-4 w-4" style={{ color: ACCENT }} />
          Daily Email Preview
        </h2>
        <p className="mb-3 text-xs text-text-muted">
          Automated morning briefing sent to account reps with reorder recommendations and competitive intelligence.
        </p>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {dailyEmails?.map((email) => (
            <DailyEmailCard key={email.accountId} email={email} />
          ))}
        </div>
      </div>
    </div>
  );
}
