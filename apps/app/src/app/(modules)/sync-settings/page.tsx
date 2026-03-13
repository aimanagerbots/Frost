'use client';

import { Settings } from 'lucide-react';
import { SectionHeader, EmptyState } from '@/components';

export default function SyncSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={Settings} title="Sync Settings" accentColor="#94A3B8" />
      <EmptyState
        icon={Settings}
        title="Sync Settings"
        description="Configure Metrc and external sync settings coming soon."
        accentColor="#94A3B8"
      />
    </div>
  );
}
