'use client';

import { Mail } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components/PortalPageHeader';
import { PortalCard } from '@/modules/portal/shared/components/PortalCard';

export default function PortalMessagesPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={Mail}
        title="Messages"
        subtitle="Chat with your Frost sales representative"
      />
      <PortalCard>
        <div className="text-center py-12">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Message Center</h3>
          <p className="text-sm text-gray-500">Direct messaging with your assigned sales rep for order questions, product inquiries, and account support.</p>
        </div>
      </PortalCard>
    </div>
  );
}
