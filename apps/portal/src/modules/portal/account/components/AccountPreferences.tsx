'use client';

import { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalAccount } from '@/modules/portal/shared/types';

interface AccountPreferencesProps {
  account: PortalAccount;
}

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const DELIVERY_WINDOWS = [
  '8:00 AM - 12:00 PM',
  '10:00 AM - 2:00 PM',
  '12:00 PM - 4:00 PM',
  '2:00 PM - 6:00 PM',
];

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-text-default">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-5 w-9 rounded-full transition-colors',
          checked ? 'bg-accent-primary' : 'bg-elevated'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform',
            checked && 'translate-x-4'
          )}
        />
      </button>
    </div>
  );
}

export function AccountPreferences({ account }: AccountPreferencesProps) {
  // Notification toggles
  const [emailNotifs, setEmailNotifs] = useState(
    account.notificationPreferences.method === 'email' ||
      account.notificationPreferences.method === 'both'
  );
  const [smsNotifs, setSmsNotifs] = useState(
    account.notificationPreferences.method === 'sms' ||
      account.notificationPreferences.method === 'both'
  );
  const [pushNotifs, setPushNotifs] = useState(true);

  // Delivery preferences
  const [preferredDays, setPreferredDays] = useState<string[]>(
    account.preferredDeliveryWindow.days
  );
  const [deliveryWindow, setDeliveryWindow] = useState(
    `${account.preferredDeliveryWindow.timeStart} - ${account.preferredDeliveryWindow.timeEnd}`
  );

  // Order defaults
  const [paymentMethod, setPaymentMethod] = useState<'ach' | 'echeck'>('ach');
  const [autoReorder, setAutoReorder] = useState(false);

  const [saved, setSaved] = useState(false);

  const toggleDay = (day: string) => {
    setPreferredDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="rounded-xl border border-border-default bg-card">
        <div className="flex items-center gap-2 border-b border-border-default px-6 py-4">
          <Settings className="h-4 w-4 text-accent-primary" />
          <h3 className="text-sm font-semibold text-text-bright">Notification Preferences</h3>
        </div>
        <div className="divide-y divide-border-default/50 px-6">
          <Toggle label="Email Notifications" checked={emailNotifs} onChange={setEmailNotifs} />
          <Toggle label="SMS Notifications" checked={smsNotifs} onChange={setSmsNotifs} />
          <Toggle label="Push Notifications" checked={pushNotifs} onChange={setPushNotifs} />
        </div>
      </div>

      {/* Delivery */}
      <div className="rounded-xl border border-border-default bg-card">
        <div className="flex items-center gap-2 border-b border-border-default px-6 py-4">
          <h3 className="text-sm font-semibold text-text-bright">Delivery Preferences</h3>
        </div>
        <div className="space-y-4 px-6 py-4">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Preferred Days
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                    preferredDays.includes(day)
                      ? 'border-accent-primary bg-accent-primary/15 text-accent-primary'
                      : 'border-border-default bg-elevated text-text-muted hover:text-text-default'
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Delivery Window
            </label>
            <select
              value={deliveryWindow}
              onChange={(e) => setDeliveryWindow(e.target.value)}
              className="w-full rounded-lg border border-border-default bg-elevated px-3 py-2 text-sm text-text-default outline-none transition-colors focus:border-accent-primary"
            >
              {DELIVERY_WINDOWS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Order Defaults */}
      <div className="rounded-xl border border-border-default bg-card">
        <div className="flex items-center gap-2 border-b border-border-default px-6 py-4">
          <h3 className="text-sm font-semibold text-text-bright">Order Defaults</h3>
        </div>
        <div className="space-y-4 px-6 py-4">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-muted">
              Default Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'ach' | 'echeck')}
              className="w-full rounded-lg border border-border-default bg-elevated px-3 py-2 text-sm text-text-default outline-none transition-colors focus:border-accent-primary"
            >
              <option value="ach">ACH Transfer</option>
              <option value="echeck">E-Check</option>
            </select>
          </div>
          <Toggle label="Auto-Reorder" checked={autoReorder} onChange={setAutoReorder} />
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={cn(
          'flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all',
          saved
            ? 'bg-emerald-500/15 text-emerald-400'
            : 'bg-accent-primary text-black hover:opacity-90'
        )}
      >
        <Save className="h-4 w-4" />
        {saved ? 'Saved!' : 'Save Preferences'}
      </button>
    </div>
  );
}
