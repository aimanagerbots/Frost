'use client';

import { SectionHeader, EmptyState } from '@/components';
import { MessageSquare } from 'lucide-react';

export default function Chat() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Chat" accentColor="#06B6D4" icon={MessageSquare} />
      <EmptyState
        icon={MessageSquare}
        title="Coming Soon"
        description="AI-powered chat interface for team communication and assistant interactions."
        accentColor="#06B6D4"
      />
    </div>
  );
}
