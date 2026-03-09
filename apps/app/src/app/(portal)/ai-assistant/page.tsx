'use client';

import { Sparkles } from 'lucide-react';
import { PortalPageHeader } from '@/modules/portal/shared/components/PortalPageHeader';
import { PortalCard } from '@/modules/portal/shared/components/PortalCard';

export default function PortalAIAssistantPage() {
  return (
    <div className="space-y-6">
      <PortalPageHeader
        icon={Sparkles}
        title="AI Assistant"
        subtitle="Get smart ordering suggestions and product recommendations"
      />
      <PortalCard>
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Ordering Assistant</h3>
          <p className="text-sm text-gray-500">Chat with our AI to get reorder suggestions, volume discount calculations, and product recommendations.</p>
        </div>
      </PortalCard>
    </div>
  );
}
