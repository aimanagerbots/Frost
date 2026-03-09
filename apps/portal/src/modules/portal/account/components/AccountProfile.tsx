'use client';

import { useState } from 'react';
import { Building2, Pencil, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PortalAccount } from '@/modules/portal/shared/types';

interface AccountProfileProps {
  account: PortalAccount;
}

interface FormState {
  businessName: string;
  dba: string;
  licenseNumber: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
  primaryContactName: string;
}

function formFromAccount(account: PortalAccount): FormState {
  return {
    businessName: account.businessName,
    dba: account.dba,
    licenseNumber: account.licenseNumber,
    street: account.address.street,
    city: account.address.city,
    state: account.address.state,
    zip: account.address.zip,
    email: account.primaryContact.email,
    phone: account.primaryContact.phone,
    primaryContactName: account.primaryContact.name,
  };
}

function Field({
  label,
  value,
  editing,
  onChange,
  className,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-xs font-medium uppercase tracking-wider text-text-muted">
        {label}
      </label>
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-border-default bg-elevated px-3 py-2 text-sm text-text-default outline-none transition-colors focus:border-accent-primary"
        />
      ) : (
        <p className="text-sm text-text-default">{value}</p>
      )}
    </div>
  );
}

export function AccountProfile({ account }: AccountProfileProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormState>(() => formFromAccount(account));

  const update = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    // Mock save -- just exit edit mode
    setEditing(false);
  };

  const handleCancel = () => {
    setForm(formFromAccount(account));
    setEditing(false);
  };

  return (
    <div className="rounded-xl border border-border-default bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-primary/10">
            <Building2 className="h-4.5 w-4.5 text-accent-primary" />
          </div>
          <h2 className="text-base font-semibold text-text-bright">Business Profile</h2>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border-default bg-elevated px-3 py-1.5 text-xs font-medium text-text-default transition-colors hover:border-accent-primary hover:text-accent-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 rounded-lg border border-border-default bg-elevated px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text-default"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-lg bg-accent-primary px-3 py-1.5 text-xs font-medium text-black transition-opacity hover:opacity-90"
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </button>
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="grid gap-5 p-6 md:grid-cols-2">
        <Field
          label="Business Name"
          value={form.businessName}
          editing={editing}
          onChange={update('businessName')}
        />
        <Field
          label="DBA"
          value={form.dba}
          editing={editing}
          onChange={update('dba')}
        />
        <Field
          label="License Number"
          value={form.licenseNumber}
          editing={editing}
          onChange={update('licenseNumber')}
        />
        <Field
          label="Primary Contact"
          value={form.primaryContactName}
          editing={editing}
          onChange={update('primaryContactName')}
        />
        <Field
          label="Street Address"
          value={form.street}
          editing={editing}
          onChange={update('street')}
          className="md:col-span-2"
        />
        <Field
          label="City"
          value={form.city}
          editing={editing}
          onChange={update('city')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="State"
            value={form.state}
            editing={editing}
            onChange={update('state')}
          />
          <Field
            label="ZIP"
            value={form.zip}
            editing={editing}
            onChange={update('zip')}
          />
        </div>
        <Field
          label="Email"
          value={form.email}
          editing={editing}
          onChange={update('email')}
        />
        <Field
          label="Phone"
          value={form.phone}
          editing={editing}
          onChange={update('phone')}
        />
      </div>

      {/* Account meta */}
      <div className="border-t border-border-default px-6 py-4">
        <div className="flex flex-wrap gap-6 text-xs text-text-muted">
          <span>
            Pricing Tier:{' '}
            <span className="font-medium text-accent-primary">Tier {account.pricingTier}</span>
          </span>
          <span>
            Health Score:{' '}
            <span className="font-medium text-text-default">{account.healthScore}/100</span>
          </span>
          <span>
            Member Since:{' '}
            <span className="font-medium text-text-default">{account.accountSince}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
