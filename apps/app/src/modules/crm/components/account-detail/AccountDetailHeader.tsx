'use client';

import { useRouter } from 'next/navigation';
import { StatusBadge } from '@/components';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Phone,
  Mail,
  ClipboardList,
  MapPin,
  ShoppingCart,
  Truck,
  DollarSign,
} from 'lucide-react';
import type { Account, PipelineStatus } from '../../types';
import { PIPELINE_PHASE_LABELS } from '../../types';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


function trendIcon(trend: Account['healthTrend']) {
  switch (trend) {
    case 'improving': return <TrendingUp className="h-4 w-4 text-success" />;
    case 'declining': return <TrendingDown className="h-4 w-4 text-danger" />;
    default: return <Minus className="h-4 w-4 text-text-muted" />;
  }
}

function healthVariant(score: number) {
  if (score >= 80) return 'success' as const;
  if (score >= 60) return 'info' as const;
  if (score >= 40) return 'warning' as const;
  return 'danger' as const;
}

function statusVariant(status: Account['status']) {
  switch (status) {
    case 'active': return 'success' as const;
    case 'at-risk': return 'warning' as const;
    case 'churning': return 'danger' as const;
    case 'prospect': return 'info' as const;
    default: return 'muted' as const;
  }
}

function pipelineVariant(ps: PipelineStatus) {
  switch (ps) {
    case 'active': return 'success' as const;
    case 'inactive': return 'danger' as const;
    case 'recovery': return 'warning' as const;
  }
}

interface AccountDetailHeaderProps {
  account: Account;
  onBack: () => void;
}

export function AccountDetailHeader({ account, onBack }: AccountDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-default bg-card p-4 md:p-6">
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ backgroundColor: CRM_ACCENT }} />

      <div className="flex flex-col gap-4">
        {/* Top row: back + name */}
        <div className="flex items-start gap-3">
          <button
            onClick={onBack}
            className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-default text-text-muted transition-colors hover:bg-accent-hover hover:text-text-default"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold text-text-bright">{account.name}</h1>
            <p className="text-sm text-text-muted">
              {account.address.city}, {account.address.state}
              {account.dba && account.dba !== account.name && (
                <span> &middot; DBA: {account.dba}</span>
              )}
            </p>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            variant={healthVariant(account.healthScore)}
            label={`${account.healthScore}`}
            size="sm"
          />
          {trendIcon(account.healthTrend)}
          <StatusBadge
            variant={pipelineVariant(account.pipelineStatus)}
            label={`${account.pipelineStatus.toUpperCase()} P${account.pipelinePhase} — ${PIPELINE_PHASE_LABELS[account.pipelineStatus][account.pipelinePhase]}`}
            size="sm"
          />
          <StatusBadge
            variant={statusVariant(account.status)}
            label={account.status}
            size="sm"
          />
          {account.vmiEnrolled && (
            <StatusBadge variant="success" label="VMI" size="sm" />
          )}
          <StatusBadge
            variant="default"
            label={`Lic: ${account.licenseNumber}`}
            size="sm"
          />
        </div>

        {/* Info row */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
          <span>Account since {new Date(account.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          <span>&middot;</span>
          <span>{account.region}</span>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          {[
            { icon: Phone, label: 'Log Call' },
            { icon: Mail, label: 'Send Email' },
            { icon: ClipboardList, label: 'Create Task' },
            { icon: MapPin, label: 'View on Map' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-xs text-text-muted transition-colors hover:bg-accent-hover hover:text-text-default"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}

          <div className="mx-1 h-6 w-px bg-default" />

          {[
            { icon: ShoppingCart, label: 'View Orders', href: `/orders?account=${account.id}` },
            { icon: Truck, label: 'View Deliveries', href: `/delivery?account=${account.id}` },
            { icon: DollarSign, label: 'View Invoices', href: `/finance?account=${account.id}` },
          ].map(({ icon: Icon, label, href }) => (
            <button
              key={label}
              onClick={() => router.push(href)}
              className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-xs text-text-muted transition-colors hover:bg-accent-hover hover:text-text-default"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
