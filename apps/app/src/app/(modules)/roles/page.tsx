'use client';

import { ShieldCheck } from 'lucide-react';
import { SectionHeader, EmptyState } from '@/components';

export default function RolesPage() {
  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={ShieldCheck} title="Roles" accentColor="#94A3B8" />
      <EmptyState
        icon={ShieldCheck}
        title="Roles"
        description="Manage user roles and permissions coming soon."
        accentColor="#94A3B8"
      />
    </div>
  );
}
