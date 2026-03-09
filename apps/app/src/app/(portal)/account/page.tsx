'use client';

import { User } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components/PortalPageHeader';
import { PortalCard } from '@/modules/portal/shared/components/PortalCard';

export default function PortalAccountPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={User}
        title="My Account"
        subtitle="Manage your business profile, contacts, and preferences"
      />
      <PortalCard>
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Account Settings</h3>
          <p className="text-sm text-gray-500">Update business details, manage portal users, delivery preferences, and notification settings.</p>
        </div>
      </PortalCard>
    </div>
  );
}
