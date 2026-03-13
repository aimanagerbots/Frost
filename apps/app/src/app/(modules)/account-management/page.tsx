'use client';

import { UserCog } from 'lucide-react';
import { SectionHeader, EmptyState } from '@/components';

export default function AccountManagementPage() {
  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={UserCog} title="Account Management" accentColor="#94A3B8" />
      <EmptyState
        icon={UserCog}
        title="Account Management"
        description="Manage account settings and permissions coming soon."
        accentColor="#94A3B8"
      />
    </div>
  );
}
