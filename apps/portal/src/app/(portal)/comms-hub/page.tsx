'use client';

import { MessageCircle } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components';

export default function CommsHubPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={MessageCircle}
        title="Comms Hub"
        subtitle="Chat with your rep, AI assistant, support, and channel settings"
      />
      <div className="flex items-center justify-center rounded-xl border border-border-default bg-card p-16">
        <div className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-text-muted/30" />
          <p className="mt-4 font-display text-lg font-semibold text-text-bright">
            Coming in Phase 3
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Unified messaging with dual-channel AI — portal and SMS
          </p>
        </div>
      </div>
    </div>
  );
}
