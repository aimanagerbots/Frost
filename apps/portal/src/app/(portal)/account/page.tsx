'use client';

import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  FileText,
  Clock,
} from 'lucide-react';

const ACCOUNT_INFO = {
  name: 'Green Dreams Dispensary',
  license: 'C10-0000842-LIC',
  address: '4200 Cannabis Way, Suite 100, Denver, CO 80205',
  phone: '(303) 555-0142',
  email: 'orders@greendreams.co',
  website: 'greendreams.co',
  tier: 'Gold Partner',
  since: 'January 2024',
  rep: 'Marcus Rivera',
  repEmail: 'marcus@frost.com',
};

const DETAIL_ROWS = [
  { icon: Building2, label: 'Business Name', value: ACCOUNT_INFO.name },
  { icon: Shield, label: 'License Number', value: ACCOUNT_INFO.license },
  { icon: MapPin, label: 'Address', value: ACCOUNT_INFO.address },
  { icon: Phone, label: 'Phone', value: ACCOUNT_INFO.phone },
  { icon: Mail, label: 'Email', value: ACCOUNT_INFO.email },
  { icon: Globe, label: 'Website', value: ACCOUNT_INFO.website },
  { icon: FileText, label: 'Partner Tier', value: ACCOUNT_INFO.tier },
  { icon: Clock, label: 'Partner Since', value: ACCOUNT_INFO.since },
];

export default function AccountPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-text-bright font-display">Account</h1>
        <p className="text-sm text-text-muted mt-1">Your business profile and partner details</p>
      </div>

      {/* Profile card */}
      <div className="rounded-xl border border-border-default bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-primary/15 text-accent-primary text-lg font-bold font-display">
            GD
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-bright">{ACCOUNT_INFO.name}</h2>
            <span className="inline-flex items-center gap-1.5 mt-1 rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" />
              {ACCOUNT_INFO.tier}
            </span>
          </div>
        </div>

        <div className="divide-y divide-border-default">
          {DETAIL_ROWS.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="flex items-center gap-4 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                  <Icon className="h-4 w-4 text-text-muted" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-text-muted">{row.label}</p>
                  <p className="text-sm text-text-default mt-0.5">{row.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account rep */}
      <div className="rounded-xl border border-border-default bg-card p-6">
        <h2 className="text-sm font-semibold text-text-bright mb-4">Your Account Representative</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-primary/15 text-accent-primary text-sm font-bold">
            MR
          </div>
          <div>
            <p className="text-sm font-medium text-text-default">{ACCOUNT_INFO.rep}</p>
            <p className="text-xs text-text-muted">{ACCOUNT_INFO.repEmail}</p>
          </div>
          <button className="ml-auto rounded-lg border border-border-default px-4 py-2 text-sm text-text-muted hover:bg-card-hover transition-colors">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
}
