'use client';

import { Headphones } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components';

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={Headphones}
        title="Support"
        subtitle="Get help, submit tickets, and browse resources"
      />
      <div className="rounded-xl border border-border-default bg-card p-8 text-center text-text-muted">
        Support module coming in Phase 11...
      </div>
    </div>
  );
}
