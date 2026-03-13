'use client';

import { useMemo } from 'react';
import {
  MetricCard,
  DataTable,
  LoadingSkeleton,
  StatusBadge,
} from '@/components';
import { PipelineBadge } from '@/modules/pipeline/components/PipelineBadge';
import {
  useNurtureStatus,
  type NurtureAccountStatus,
  type NurtureChannelStatus,
} from '@/modules/crm/hooks/useNurtureStatus';
import {
  Users,
  AlertTriangle,
  Clock,
  HeartPulse,
  Phone,
  Mail,
  MessageSquare,
  Video,
  MessageCircle,
} from 'lucide-react';

const CRM_ACCENT = '#F59E0B';

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  phone: Phone,
  email: Mail,
  sms: MessageSquare,
  meeting: Video,
  whatsapp: MessageCircle,
};

function channelDayColor(daysSince: number | null): string {
  if (daysSince === null) return 'text-text-muted';
  if (daysSince <= 7) return 'text-green-400';
  if (daysSince <= 14) return 'text-amber-400';
  return 'text-red-400';
}

function daysSinceColor(days: number | null): string {
  if (days === null) return 'text-text-muted';
  if (days > 21) return 'text-red-400';
  if (days > 14) return 'text-amber-400';
  return 'text-green-400';
}

function ChannelGrid({ channels }: { channels: NurtureChannelStatus[] }) {
  return (
    <div className="flex gap-2">
      {channels.map((ch) => {
        const Icon = CHANNEL_ICONS[ch.channel] ?? MessageSquare;
        const colorClass = channelDayColor(ch.daysSince);
        return (
          <div
            key={ch.channel}
            className="flex flex-col items-center gap-0.5 rounded-lg bg-elevated px-2 py-1.5"
            title={`${ch.channel}: ${ch.daysSince !== null ? `${ch.daysSince}d ago` : 'never'} (${ch.count} total)`}
          >
            <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
            <span className={`text-[10px] font-medium ${colorClass}`}>
              {ch.daysSince !== null ? `${ch.daysSince}d` : '—'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

type NurtureRow = NurtureAccountStatus & Record<string, unknown>;

export function NurtureTracker() {
  const { data, isLoading } = useNurtureStatus();

  const metrics = useMemo(() => {
    if (!data) return null;
    const total = data.length;
    const goingCold = data.filter((a) => a.isGoingCold).length;
    const withContact = data.filter((a) => a.daysSinceLastContact !== null);
    const avgDays =
      withContact.length > 0
        ? Math.round(
            withContact.reduce(
              (sum, a) => sum + (a.daysSinceLastContact ?? 0),
              0
            ) / withContact.length
          )
        : 0;
    const healthy = total - goingCold;
    return { total, goingCold, avgDays, healthy };
  }, [data]);

  const coldAccounts = useMemo(
    () => (data ?? []).filter((a) => a.isGoingCold),
    [data]
  );

  const tableData: NurtureRow[] = useMemo(
    () =>
      (data ?? []).map((row) => ({
        ...row,
      })),
    [data]
  );

  const columns = useMemo(
    () => [
      {
        header: 'Account',
        accessor: 'accountName' as const,
        sortable: true,
        render: (row: NurtureRow) => (
          <span className="font-semibold text-text-bright">
            {row.accountName}
          </span>
        ),
      },
      {
        header: 'Days Since Contact',
        accessor: 'daysSinceLastContact' as const,
        sortable: true,
        render: (row: NurtureRow) => (
          <span className={`font-medium ${daysSinceColor(row.daysSinceLastContact)}`}>
            {row.daysSinceLastContact !== null
              ? `${row.daysSinceLastContact}d`
              : 'Never'}
          </span>
        ),
      },
      {
        header: 'Channels',
        accessor: (() => '') as (row: NurtureRow) => unknown,
        render: (row: NurtureRow) => (
          <ChannelGrid channels={row.channelBreakdown} />
        ),
        hideBelow: 'md' as const,
      },
      {
        header: 'Touchpoints',
        accessor: 'totalTouchpoints' as const,
        sortable: true,
        hideBelow: 'sm' as const,
      },
      {
        header: 'Pipeline',
        accessor: 'pipelineCode' as const,
        render: (row: NurtureRow) => (
          <PipelineBadge code={row.pipelineCode} />
        ),
        hideBelow: 'md' as const,
      },
      {
        header: 'Health',
        accessor: 'healthScore' as const,
        sortable: true,
        render: (row: NurtureRow) => (
          <span className="text-text-default">{row.healthScore}</span>
        ),
        hideBelow: 'sm' as const,
      },
      {
        header: 'Status',
        accessor: ((row: NurtureRow) =>
          row.isGoingCold ? row.coldSeverity : 'healthy') as (
          row: NurtureRow
        ) => unknown,
        sortable: true,
        render: (row: NurtureRow) =>
          row.isGoingCold ? (
            <StatusBadge
              variant={
                row.coldSeverity === 'critical'
                  ? 'danger'
                  : row.coldSeverity === 'high'
                    ? 'warning'
                    : 'default'
              }
              label={
                row.coldSeverity === 'critical'
                  ? 'Critical'
                  : row.coldSeverity === 'high'
                    ? 'Going Cold'
                    : 'Cooling'
              }
            />
          ) : (
            <StatusBadge variant="success" label="Healthy" />
          ),
      },
    ],
    []
  );

  if (isLoading) {
    return <LoadingSkeleton variant="table" />;
  }

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Total Accounts"
            value={metrics.total}
            accentColor={CRM_ACCENT}
            icon={Users}
          />
          <MetricCard
            label="Going Cold"
            value={metrics.goingCold}
            accentColor="#EF4444"
            icon={AlertTriangle}
          />
          <MetricCard
            label="Avg Days Between Contact"
            value={`${metrics.avgDays}d`}
            accentColor="#3B82F6"
            icon={Clock}
          />
          <MetricCard
            label="Healthy Engagement"
            value={metrics.healthy}
            accentColor="#22C55E"
            icon={HeartPulse}
          />
        </div>
      )}

      {/* Cold Accounts Alert */}
      {coldAccounts.length > 0 && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-semibold text-red-400">
              {coldAccounts.length} Account{coldAccounts.length !== 1 ? 's' : ''}{' '}
              Going Cold
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {coldAccounts.slice(0, 6).map((acct) => (
              <div
                key={acct.accountId}
                className="flex items-center justify-between rounded-lg bg-card px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-bright">
                    {acct.accountName}
                  </p>
                  <p className="text-xs text-text-muted">
                    {acct.daysSinceLastContact !== null
                      ? `${acct.daysSinceLastContact} days ago`
                      : 'Never contacted'}
                  </p>
                </div>
                <StatusBadge
                  variant={
                    acct.coldSeverity === 'critical'
                      ? 'danger'
                      : acct.coldSeverity === 'high'
                        ? 'warning'
                        : 'default'
                  }
                  label={acct.coldSeverity ?? 'cold'}
                  size="xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Data Table */}
      <DataTable
        data={tableData}
        columns={columns}
        searchable
        searchPlaceholder="Search accounts..."
        pageSize={15}
        emptyState={{
          title: 'No nurture data',
          description: 'No accounts found to track.',
          accentColor: CRM_ACCENT,
        }}
      />
    </div>
  );
}
