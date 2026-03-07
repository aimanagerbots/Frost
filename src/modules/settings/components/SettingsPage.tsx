'use client';

import { useState } from 'react';
import { Settings, Building2, Plug, MessageSquare, Bell, Key, ExternalLink, RefreshCw, Check, X } from 'lucide-react';
import { SectionHeader, StatusBadge, LoadingSkeleton } from '@/components';
import { useCompanyProfile, useIntegrations, useNotificationPreferences, useCommunicationChannels } from '../hooks';
import type { SettingsTab, IntegrationStatus } from '../types';

const ACCENT = '#94A3B8';

const TABS: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: 'company', label: 'Company Profile', icon: Building2 },
  { key: 'integrations', label: 'Integrations', icon: Plug },
  { key: 'communications', label: 'Communications', icon: MessageSquare },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'api-keys', label: 'API Keys', icon: Key },
];

const STATUS_VARIANT: Record<IntegrationStatus, 'success' | 'warning' | 'info' | 'muted'> = {
  connected: 'success',
  configured: 'warning',
  pending: 'info',
  disconnected: 'muted',
};

const CHANNEL_STATUS_VARIANT: Record<string, 'success' | 'warning' | 'info' | 'muted'> = {
  active: 'success',
  configured: 'warning',
  pending: 'info',
  inactive: 'muted',
};

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('company');
  const company = useCompanyProfile();
  const integrations = useIntegrations();
  const notifications = useNotificationPreferences();
  const channels = useCommunicationChannels();

  return (
    <div className="space-y-6">
      <SectionHeader icon={Settings} title="Settings" subtitle="Manage your platform configuration" accentColor={ACCENT} />

      {/* Tab Bar */}
      <div className="flex gap-1 overflow-x-auto border-b border-[var(--border-default)] pb-0">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-b-2 text-[var(--text-bright)]'
                  : 'border-b-2 border-transparent text-[var(--text-muted)] hover:text-[var(--text-default)]'
              }`}
              style={isActive ? { borderBottomColor: ACCENT } : undefined}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'company' && <CompanyTab data={company.data} isLoading={company.isLoading} />}
      {activeTab === 'integrations' && <IntegrationsTab data={integrations.data} isLoading={integrations.isLoading} />}
      {activeTab === 'communications' && <CommunicationsTab data={channels.data} isLoading={channels.isLoading} />}
      {activeTab === 'notifications' && <NotificationsTab data={notifications.data} isLoading={notifications.isLoading} />}
      {activeTab === 'api-keys' && <ApiKeysTab />}
    </div>
  );
}

/* ─── Company Profile Tab ─── */
function CompanyTab({ data, isLoading }: { data: ReturnType<typeof useCompanyProfile>['data']; isLoading: boolean }) {
  if (isLoading || !data) return <LoadingSkeleton variant="card" count={2} />;

  const fields = [
    { label: 'Company Name', value: data.name },
    { label: 'License Number', value: data.license },
    { label: 'Address', value: `${data.address}, ${data.city}, ${data.state} ${data.zip}` },
    { label: 'Phone', value: data.phone },
    { label: 'Email', value: data.email },
    { label: 'Timezone', value: data.timezone },
  ];

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--text-bright)]">Company Information</h2>
        <button className="rounded-lg border border-[var(--border-default)] px-4 py-1.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-default)]">
          Edit
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">{field.label}</p>
            <p className="mt-1 text-sm text-[var(--text-default)]">{field.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Integrations Tab ─── */
function IntegrationsTab({ data, isLoading }: { data: ReturnType<typeof useIntegrations>['data']; isLoading: boolean }) {
  if (isLoading || !data) return <LoadingSkeleton variant="card" count={6} />;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((integration) => (
        <div
          key={integration.id}
          className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5"
        >
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-sm font-semibold text-[var(--text-bright)]">{integration.name}</h3>
            <StatusBadge
              variant={STATUS_VARIANT[integration.status]}
              label={integration.status}
              size="sm"
              dot
            />
          </div>
          <p className="mb-3 line-clamp-1 text-xs text-[var(--text-muted)]">{integration.description}</p>
          {integration.lastSync && (
            <div className="mb-3 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <RefreshCw className="h-3 w-3" />
              <span>Synced {integration.lastSync}</span>
            </div>
          )}
          <button className="flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-default)]">
            <ExternalLink className="h-3 w-3" />
            {integration.status === 'disconnected' ? 'Connect' : 'Configure'}
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─── Communications Tab ─── */
function CommunicationsTab({ data, isLoading }: { data: ReturnType<typeof useCommunicationChannels>['data']; isLoading: boolean }) {
  if (isLoading || !data) return <LoadingSkeleton variant="list" count={2} />;

  return (
    <div className="space-y-3">
      {data.map((channel) => (
        <div
          key={channel.id}
          className="flex items-center justify-between rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4"
        >
          <div className="flex items-center gap-4">
            <span className={`h-2.5 w-2.5 rounded-full ${channel.enabled ? 'bg-[var(--color-success)]' : 'bg-[var(--text-muted)]'}`} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[var(--text-bright)]">{channel.name}</h3>
                <StatusBadge
                  variant={CHANNEL_STATUS_VARIANT[channel.status] as 'success' | 'warning' | 'info' | 'muted'}
                  label={channel.status}
                  size="sm"
                />
              </div>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                {channel.type}{channel.details ? ` — ${channel.details}` : ''}
              </p>
            </div>
          </div>
          <div
            className={`h-6 w-11 rounded-full p-0.5 transition-colors ${
              channel.enabled ? 'bg-[var(--color-success)]' : 'bg-[var(--bg-elevated)]'
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                channel.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Notifications Tab ─── */
function NotificationsTab({ data, isLoading }: { data: ReturnType<typeof useNotificationPreferences>['data']; isLoading: boolean }) {
  if (isLoading || !data) return <LoadingSkeleton variant="table" />;

  const columns = ['Email', 'SMS', 'In-App', 'Push'] as const;
  const fieldMap = { Email: 'email', SMS: 'sms', 'In-App': 'inApp', Push: 'push' } as const;

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden">
      {/* Header row */}
      <div className="grid grid-cols-5 gap-4 border-b border-[var(--border-default)] bg-[var(--bg-elevated)] px-5 py-3">
        <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Category</div>
        {columns.map((col) => (
          <div key={col} className="text-center text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">{col}</div>
        ))}
      </div>
      {/* Data rows */}
      {data.map((pref, idx) => (
        <div
          key={pref.category}
          className={`grid grid-cols-5 gap-4 px-5 py-3 ${idx < data.length - 1 ? 'border-b border-[var(--border-default)]' : ''}`}
        >
          <div className="text-sm text-[var(--text-default)]">{pref.category}</div>
          {columns.map((col) => {
            const enabled = pref[fieldMap[col]];
            return (
              <div key={col} className="flex justify-center">
                {enabled ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-[var(--color-success)]/20">
                    <Check className="h-3.5 w-3.5 text-[var(--color-success)]" />
                  </div>
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-[var(--bg-elevated)]">
                    <X className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ─── API Keys Tab ─── */
function ApiKeysTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
        <h2 className="mb-4 text-lg font-semibold text-[var(--text-bright)]">API Key</h2>
        <div className="mb-4 flex items-center gap-3">
          <code className="flex-1 rounded-lg bg-[var(--bg-elevated)] px-4 py-2.5 font-mono text-sm text-[var(--text-default)]">
            sk-frost-••••••••••••••••••••••••x8f2
          </code>
          <button className="rounded-lg border border-[var(--border-default)] px-4 py-2 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-default)]">
            Regenerate
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Created</p>
            <p className="mt-1 text-sm text-[var(--text-default)]">Jan 15, 2026</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Last Used</p>
            <p className="mt-1 text-sm text-[var(--text-default)]">Mar 6, 2026 at 2:14 PM</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Usage Today</p>
            <p className="mt-1 text-sm text-[var(--text-default)]">142 requests</p>
          </div>
        </div>
      </div>
    </div>
  );
}
