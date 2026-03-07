'use client';

import { StatusBadge } from '@/components';
import { Star, Phone, Mail } from 'lucide-react';
import type { Account } from '../../../types';

interface ProfileTabProps {
  account: Account;
}

function channelLabel(ch: string) {
  switch (ch) {
    case 'phone': return 'Phone';
    case 'email': return 'Email';
    case 'sms': return 'SMS';
    case 'whatsapp': return 'WhatsApp';
    default: return ch;
  }
}

function roleVariant(role: string) {
  switch (role) {
    case 'buyer': return 'info' as const;
    case 'owner': return 'success' as const;
    case 'manager': return 'warning' as const;
    case 'budtender': return 'default' as const;
    default: return 'muted' as const;
  }
}

export function ProfileTab({ account }: ProfileTabProps) {
  return (
    <div className="space-y-4">
      {/* Two-column grid: Business Info + Delivery Preferences */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Business Info */}
        <div className="rounded-xl border border-default bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-bright">Business Info</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-muted">Legal Name</dt>
              <dd className="text-text-default">{account.name}</dd>
            </div>
            {account.dba && account.dba !== account.name && (
              <div className="flex justify-between">
                <dt className="text-text-muted">DBA</dt>
                <dd className="text-text-default">{account.dba}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-text-muted">License</dt>
              <dd className="text-text-default">{account.licenseNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">License Exp.</dt>
              <dd className="text-text-default">
                {new Date(account.licenseExpiration).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Address</dt>
              <dd className="text-right text-text-default">
                {account.address.street}<br />
                {account.address.city}, {account.address.state} {account.address.zip}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Region</dt>
              <dd className="text-text-default">{account.region}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Status</dt>
              <dd><StatusBadge variant={account.status === 'active' ? 'success' : 'warning'} label={account.status} size="sm" /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Segments</dt>
              <dd className="flex flex-wrap justify-end gap-1">
                {account.segments.map((s) => (
                  <StatusBadge key={s} variant="default" label={s} size="sm" />
                ))}
              </dd>
            </div>
          </dl>
        </div>

        {/* Delivery Preferences */}
        <div className="rounded-xl border border-default bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-text-bright">Delivery Preferences</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-muted">Window</dt>
              <dd className="text-text-default">{account.deliveryPreferences.window}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Contact</dt>
              <dd className="text-text-default">{account.deliveryPreferences.contactName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Phone</dt>
              <dd className="text-text-default">{account.deliveryPreferences.contactPhone}</dd>
            </div>
            {account.deliveryPreferences.instructions && (
              <div>
                <dt className="text-text-muted">Instructions</dt>
                <dd className="mt-1 text-text-default">{account.deliveryPreferences.instructions}</dd>
              </div>
            )}
          </dl>

          <h3 className="mb-3 mt-6 text-sm font-semibold text-text-bright">Payment</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-muted">Preferred Method</dt>
              <dd className="text-text-default uppercase">{account.preferredPaymentMethod}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Reliability</dt>
              <dd>
                <StatusBadge
                  variant={account.paymentReliability === 'excellent' ? 'success' : account.paymentReliability === 'good' ? 'info' : account.paymentReliability === 'fair' ? 'warning' : 'danger'}
                  label={account.paymentReliability}
                  size="sm"
                />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Category Mix */}
      <div className="rounded-xl border border-default bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-bright">Category Mix</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {account.categoryMix.map((cm) => (
            <div key={cm.category} className="rounded-lg bg-elevated p-3 text-center">
              <div className="text-lg font-bold text-text-bright">{cm.percentage}%</div>
              <div className="text-xs capitalize text-text-muted">{cm.category}</div>
              <div className="mt-1 text-xs text-text-default">
                ${cm.revenue.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contacts */}
      <div className="rounded-xl border border-default bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-bright">
          Contacts ({account.contacts.length})
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {account.contacts.map((contact) => {
            const initials = contact.name.split(' ').map((n) => n[0]).join('').toUpperCase();
            return (
              <div
                key={contact.id}
                className="flex items-start gap-3 rounded-lg border border-default/50 bg-elevated p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-sm font-medium text-text-muted">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-bright">{contact.name}</span>
                    {contact.isPrimary && <Star className="h-3.5 w-3.5 text-[#F59E0B]" />}
                  </div>
                  <StatusBadge variant={roleVariant(contact.role)} label={contact.role} size="sm" />
                  <div className="mt-1.5 space-y-0.5 text-xs text-text-muted">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {contact.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </div>
                    <div className="text-xs text-text-muted">
                      Prefers {channelLabel(contact.preferredChannel)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
