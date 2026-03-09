'use client';

import { User } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components';

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={User}
        title="My Account"
        subtitle="Manage your dispensary profile and preferences"
      />
      <div className="rounded-xl border border-border-default bg-card p-8 text-center text-text-muted">
        Account module coming in Phase 9...
      </div>
    </div>
  );
}
