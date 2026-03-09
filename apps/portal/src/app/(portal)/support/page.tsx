'use client';

import { HelpCircle } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components';
import {
  SupportFAQ,
  SupportTicketForm,
  SupportReturnForm,
  SupportRepCard,
  SupportVendorDay,
  SupportMaterials,
  SupportResources,
} from '@/modules/portal/support/components';

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={HelpCircle}
        title="Support"
        subtitle="Get help, submit tickets, and browse resources"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left column — 60% */}
        <div className="space-y-8 lg:col-span-3">
          <SupportFAQ />
          <SupportTicketForm />
          <SupportReturnForm />
        </div>

        {/* Right column — 40% */}
        <div className="space-y-8 lg:col-span-2">
          <SupportRepCard />
          <SupportVendorDay />
          <SupportMaterials />
          <SupportResources />
        </div>
      </div>
    </div>
  );
}
