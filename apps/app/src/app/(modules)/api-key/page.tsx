'use client';

import { Server } from 'lucide-react';
import { SectionHeader, EmptyState } from '@/components';

export default function ApiKeyPage() {
  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={Server} title="API Key" accentColor="#94A3B8" />
      <EmptyState
        icon={Server}
        title="API Key Management"
        description="Generate and manage API keys coming soon."
        accentColor="#94A3B8"
      />
    </div>
  );
}
