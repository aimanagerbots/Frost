'use client';

import { MessageSquare } from 'lucide-react';
import { SectionHeader, EmptyState } from '@/components';

export default function NotificationsPage() {
  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={MessageSquare} title="Notifications" accentColor="#94A3B8" />
      <EmptyState
        icon={MessageSquare}
        title="Notifications"
        description="Configure system notification rules coming soon."
        accentColor="#94A3B8"
      />
    </div>
  );
}
