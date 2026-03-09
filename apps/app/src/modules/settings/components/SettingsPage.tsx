'use client';

import { useState } from 'react';
import { Settings, Building2, Plug, MessageSquare, Bell, Key, Palette, ExternalLink, RefreshCw, Check, X, Sun, Moon, AlignVerticalJustifyStart, AlignHorizontalJustifyStart, EyeOff } from 'lucide-react';
import { SectionHeader, StatusBadge, LoadingSkeleton, ErrorState, ModuleTabs } from '@/components';
import { useCompanyProfile, useIntegrations, useNotificationPreferences, useCommunicationChannels } from '../hooks';
import type { SettingsTab, IntegrationStatus } from '../types';
import { ACCENT } from '@/design/colors';
import { useUIPreferences } from '@/stores/ui-preferences';
import type { HoverIntensity } from '@/stores/ui-preferences';


const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'company', label: 'Company Profile', icon: Building2 },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'communications', label: 'Communications', icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'appearance', label: 'Appearance', icon: Palette },
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

  const settingsError = company.error || integrations.error || notifications.error || channels.error;
  if (settingsError) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load settings"
          message={settingsError.message}
          onRetry={() => { company.refetch(); integrations.refetch(); notifications.refetch(); channels.refetch(); }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader icon={Settings} title="Settings" subtitle="Manage your platform configuration" accentColor={ACCENT} />

      {/* Tab Bar */}
      <ModuleTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as SettingsTab)}
        accentColor={ACCENT}
      />

      {/* Tab Content */}
      {activeTab === 'company' && <CompanyTab data={company.data} isLoading={company.isLoading} />}
      {activeTab === 'integrations' && <IntegrationsTab data={integrations.data} isLoading={integrations.isLoading} />}
      {activeTab === 'communications' && <CommunicationsTab data={channels.data} isLoading={channels.isLoading} />}
      {activeTab === 'notifications' && <NotificationsTab data={notifications.data} isLoading={notifications.isLoading} />}
      {activeTab === 'api-keys' && <ApiKeysTab />}
      {activeTab === 'appearance' && <AppearanceTab />}
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
        <h2 className="text-lg font-semibold text-[var(--text-text-bright)]">Company Information</h2>
        <button className="rounded-lg border border-[var(--border-default)] px-4 py-1.5 text-sm text-[var(--text-text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-text-default)]">
          Edit
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-text-muted)]">{field.label}</p>
            <p className="mt-1 text-sm text-[var(--text-text-default)]">{field.value}</p>
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
            <h3 className="text-sm font-semibold text-[var(--text-text-bright)]">{integration.name}</h3>
            <StatusBadge
              variant={STATUS_VARIANT[integration.status]}
              label={integration.status}
              size="sm"
              dot
            />
          </div>
          <p className="mb-3 line-clamp-1 text-xs text-[var(--text-text-muted)]">{integration.description}</p>
          {integration.lastSync && (
            <div className="mb-3 flex items-center gap-1.5 text-xs text-[var(--text-text-muted)]">
              <RefreshCw className="h-3 w-3" />
              <span>Synced {integration.lastSync}</span>
            </div>
          )}
          <button className="flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs text-[var(--text-text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-text-default)]">
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
            <span className={`h-2.5 w-2.5 rounded-full ${channel.enabled ? 'bg-[var(--color-success)]' : 'bg-[var(--text-text-muted)]'}`} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[var(--text-text-bright)]">{channel.name}</h3>
                <StatusBadge
                  variant={CHANNEL_STATUS_VARIANT[channel.status] as 'success' | 'warning' | 'info' | 'muted'}
                  label={channel.status}
                  size="sm"
                />
              </div>
              <p className="mt-0.5 text-xs text-[var(--text-text-muted)]">
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
        <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-text-muted)]">Category</div>
        {columns.map((col) => (
          <div key={col} className="text-center text-xs font-medium uppercase tracking-wider text-[var(--text-text-muted)]">{col}</div>
        ))}
      </div>
      {/* Data rows */}
      {data.map((pref, idx) => (
        <div
          key={pref.category}
          className={`grid grid-cols-5 gap-4 px-5 py-3 ${idx < data.length - 1 ? 'border-b border-[var(--border-default)]' : ''}`}
        >
          <div className="text-sm text-[var(--text-text-default)]">{pref.category}</div>
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
                    <X className="h-3.5 w-3.5 text-[var(--text-text-muted)]" />
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
        <h2 className="mb-4 text-lg font-semibold text-[var(--text-text-bright)]">API Key</h2>
        <div className="mb-4 flex items-center gap-3">
          <code className="flex-1 rounded-lg bg-[var(--bg-elevated)] px-4 py-2.5 font-mono text-sm text-[var(--text-text-default)]">
            sk-frost-••••••••••••••••••••••••x8f2
          </code>
          <button className="rounded-lg border border-[var(--border-default)] px-4 py-2 text-sm text-[var(--text-text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-text-default)]">
            Regenerate
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-text-muted)]">Created</p>
            <p className="mt-1 text-sm text-[var(--text-text-default)]">Jan 15, 2026</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-text-muted)]">Last Used</p>
            <p className="mt-1 text-sm text-[var(--text-text-default)]">Mar 6, 2026 at 2:14 PM</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-text-muted)]">Usage Today</p>
            <p className="mt-1 text-sm text-[var(--text-text-default)]">142 requests</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Appearance Tab ─── */
function AppearanceTab() {
  const {
    theme, setTheme,
    cardAccent, setCardAccent,
    tabStyle, setTabStyle,
    hoverIntensity, setHoverIntensity,
  } = useUIPreferences();

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div className="rounded-xl border border-default bg-card p-5">
        <h2 className="mb-1 text-lg font-semibold text-text-bright">Theme</h2>
        <p className="mb-4 text-xs text-text-muted">Switch between dark and light mode</p>
        <div className="flex gap-3">
          <OptionButton
            active={theme === 'dark'}
            onClick={() => setTheme('dark')}
            icon={<Moon size={16} />}
            label="Dark"
          />
          <OptionButton
            active={theme === 'light'}
            onClick={() => setTheme('light')}
            icon={<Sun size={16} />}
            label="Light"
          />
        </div>
      </div>

      {/* Card Accent */}
      <div className="rounded-xl border border-default bg-card p-5">
        <h2 className="mb-1 text-lg font-semibold text-text-bright">Card Accent</h2>
        <p className="mb-4 text-xs text-text-muted">Position of the colored accent bar on cards</p>
        <div className="flex gap-3">
          <OptionButton
            active={cardAccent === 'top'}
            onClick={() => setCardAccent('top')}
            icon={<AlignVerticalJustifyStart size={16} />}
            label="Top"
          />
          <OptionButton
            active={cardAccent === 'left'}
            onClick={() => setCardAccent('left')}
            icon={<AlignHorizontalJustifyStart size={16} />}
            label="Left"
          />
          <OptionButton
            active={cardAccent === 'off'}
            onClick={() => setCardAccent('off')}
            icon={<EyeOff size={16} />}
            label="Off"
          />
        </div>
        {/* Preview */}
        <div className="mt-4 flex gap-4">
          {['#5BB8E6', '#22C55E', '#F59E0B'].map((color) => (
            <div key={color} className="relative w-32 rounded-lg border border-default bg-base p-3">
              {cardAccent === 'top' && (
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg" style={{ backgroundColor: color }} />
              )}
              {cardAccent === 'left' && (
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{ backgroundColor: color }} />
              )}
              <div className="text-sm font-bold text-text-bright">$142K</div>
              <div className="text-[10px] text-text-muted">Revenue</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Style */}
      <div className="rounded-xl border border-default bg-card p-5">
        <h2 className="mb-1 text-lg font-semibold text-text-bright">Tab Style</h2>
        <p className="mb-4 text-xs text-text-muted">Navigation style for module subcategories</p>
        <div className="flex gap-3">
          <OptionButton
            active={tabStyle === 'pill'}
            onClick={() => setTabStyle('pill')}
            label="Pill"
          />
          <OptionButton
            active={tabStyle === 'underline'}
            onClick={() => setTabStyle('underline')}
            label="Underline"
          />
        </div>
        {/* Preview */}
        <div className="mt-4">
          {tabStyle === 'pill' ? (
            <div className="flex gap-1 rounded-xl border border-default bg-base p-1 w-fit">
              <div className="rounded-lg bg-elevated px-3 py-1.5 text-xs font-medium text-text-bright">Overview</div>
              <div className="px-3 py-1.5 text-xs font-medium text-text-muted">Inventory</div>
              <div className="px-3 py-1.5 text-xs font-medium text-text-muted">Alerts</div>
            </div>
          ) : (
            <div className="flex gap-1 border-b border-default w-fit">
              <div className="relative px-3 py-2 text-xs font-medium text-text-bright">
                Overview
                <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full" style={{ backgroundColor: ACCENT }} />
              </div>
              <div className="px-3 py-2 text-xs font-medium text-text-muted">Inventory</div>
              <div className="px-3 py-2 text-xs font-medium text-text-muted">Alerts</div>
            </div>
          )}
        </div>
      </div>

      {/* Hover Intensity */}
      <div className="rounded-xl border border-default bg-card p-5">
        <h2 className="mb-1 text-lg font-semibold text-text-bright">Hover Intensity</h2>
        <p className="mb-4 text-xs text-text-muted">How visible the frost blue hover effect is on interactive elements</p>
        <div className="flex gap-3">
          {([
            { value: 'subtle' as HoverIntensity, label: 'Subtle', desc: '5%' },
            { value: 'normal' as HoverIntensity, label: 'Normal', desc: '15%' },
            { value: 'strong' as HoverIntensity, label: 'Strong', desc: '30%' },
          ]).map((opt) => (
            <OptionButton
              key={opt.value}
              active={hoverIntensity === opt.value}
              onClick={() => setHoverIntensity(opt.value)}
              label={opt.label}
              description={opt.desc}
            />
          ))}
        </div>
        {/* Preview */}
        <div className="mt-4 flex gap-4">
          {(['subtle', 'normal', 'strong'] as const).map((level) => {
            const opacity = level === 'subtle' ? 0.05 : level === 'normal' ? 0.15 : 0.30;
            return (
              <div
                key={level}
                className="rounded-lg border border-default px-4 py-2 text-xs text-text-default"
                style={{ backgroundColor: `rgba(91, 184, 230, ${opacity})` }}
              >
                {level} hover
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Shared Option Button ─── */
function OptionButton({
  active,
  onClick,
  icon,
  label,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  description?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
        active
          ? 'border-accent-primary bg-accent-hover-strong text-text-bright'
          : 'border-default text-text-muted hover:bg-accent-hover hover:text-text-default'
      }`}
    >
      {icon}
      <span>{label}</span>
      {description && <span className="text-xs text-text-muted">({description})</span>}
    </button>
  );
}
