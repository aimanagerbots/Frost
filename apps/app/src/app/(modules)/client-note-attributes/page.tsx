'use client';

import { FileText } from 'lucide-react';
import { SectionHeader, EmptyState } from '@/components';

export default function ClientNoteAttributesPage() {
  return (
    <div className="space-y-6 p-6">
      <SectionHeader icon={FileText} title="Client Note Attributes" accentColor="#94A3B8" />
      <EmptyState
        icon={FileText}
        title="Client Note Attributes"
        description="Custom fields for client notes coming soon."
        accentColor="#94A3B8"
      />
    </div>
  );
}
