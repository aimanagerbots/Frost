'use client';

import { Users, UserPlus, Shield, ShieldOff } from 'lucide-react';
import type { PortalAccount } from '@/modules/portal/shared/types';

interface AccountContactsProps {
  account: PortalAccount;
}

const ROLE_LABELS: Record<string, string> = {
  buyer: 'Buyer',
  owner: 'Owner',
  manager: 'Manager',
  budtender: 'Budtender',
};

export function AccountContacts({ account }: AccountContactsProps) {
  const contacts = account.contacts;

  return (
    <div className="rounded-xl border border-border-default bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-primary/10">
            <Users className="h-4.5 w-4.5 text-accent-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text-bright">Team Contacts</h2>
            <p className="text-xs text-text-muted">{contacts.length} team members</p>
          </div>
        </div>
        <div className="group relative">
          <button
            disabled
            className="flex items-center gap-1.5 rounded-lg border border-border-default bg-elevated px-3 py-1.5 text-xs font-medium text-text-muted opacity-50 cursor-not-allowed"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Invite Team Member
          </button>
          <div className="pointer-events-none absolute right-0 top-full z-10 mt-1 whitespace-nowrap rounded-lg border border-border-default bg-elevated px-3 py-1.5 text-xs text-text-muted opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            Coming soon
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-default text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Portal Access</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="border-b border-border-default/50 last:border-0 transition-colors hover:bg-elevated/50"
              >
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-default">
                      {contact.name}
                    </span>
                    {contact.isPrimary && (
                      <span className="rounded-full bg-accent-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-primary">
                        Primary
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-sm text-text-muted">
                    {ROLE_LABELS[contact.role] ?? contact.role}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-sm text-text-muted">{contact.email}</span>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-sm text-text-muted">{contact.phone}</span>
                </td>
                <td className="px-6 py-3.5">
                  {contact.hasPortalAccess ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                      <Shield className="h-3.5 w-3.5" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-text-muted">
                      <ShieldOff className="h-3.5 w-3.5" />
                      None
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
