'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { SectionHeader } from '@/components';
import { CatalogList } from './CatalogList';
import { CatalogDetail } from './CatalogDetail';

const ACCENT = '#F59E0B';

export function CatalogsPage() {
  const [selectedCatalogId, setSelectedCatalogId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={BookOpen}
        title="Catalogs"
        subtitle="Product catalogs and pricing for retail accounts"
        accentColor={ACCENT}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sidebar — catalog list */}
        <div className="lg:col-span-4 xl:col-span-3">
          <CatalogList
            selectedId={selectedCatalogId}
            onSelect={setSelectedCatalogId}
          />
        </div>

        {/* Main area — catalog detail / product table */}
        <div className="lg:col-span-8 xl:col-span-9">
          <CatalogDetail catalogId={selectedCatalogId} />
        </div>
      </div>
    </div>
  );
}
