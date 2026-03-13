'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Warehouse } from 'lucide-react';
import { SectionHeader, LoadingSkeleton } from '@/components';
import { ManageMenuTab } from './manage-menu/ManageMenuTab';
import { BatchesTab } from './batches/BatchesTab';
import { NonCannabisTab } from './non-cannabis/NonCannabisTab';
import { ProductionTab } from './production/ProductionTab';
import { CategoriesTab } from './categories/CategoriesTab';
import { ProductLinesTab } from './product-lines/ProductLinesTab';
import { ProductsTab } from './products/ProductsTab';
import { CatalogGroupsTab } from './catalog-groups/CatalogGroupsTab';
import { StrainsTab } from './strains/StrainsTab';
import { RoomsTab } from './rooms/RoomsTab';
import { DiscountsTab } from './discounts/DiscountsTab';
import { BackordersTab } from './backorders/BackordersTab';
import { QAResultTab } from './qa-result/QAResultTab';
import { ConversionsTab } from './conversions/ConversionsTab';
import { ProductTagTab } from './product-tag/ProductTagTab';
import { QALotTab } from './qa-lot/QALotTab';
import { QASampleTab } from './qa-sample/QASampleTab';
import { EmployeeSampleTab } from './employee-sample/EmployeeSampleTab';
import { DisposalTab } from './disposal/DisposalTab';
import { useProducts } from '@/modules/inventory/hooks';

const ACCENT = '#8B5CF6';

function InventoryContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') ?? 'menu-batches';
  const { data: products } = useProducts();

  const totalSKUs = products?.length ?? 0;
  const totalForSale = products?.reduce((s, p) => s + p.availableForSale, 0) ?? 0;
  const outOfStock = products?.filter(p => p.totalInStock === 0).length ?? 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Warehouse}
        title="Inventory"
        subtitle="Products, batches, QA results, and compliance"
        accentColor={ACCENT}
        stats={[
          { label: 'SKUs', value: totalSKUs },
          { label: 'Available', value: totalForSale },
          { label: 'Out of Stock', value: outOfStock },
        ]}
      />

      {activeTab === 'menu-batches'          && <ManageMenuTab />}
      {activeTab === 'batches'               && <BatchesTab />}
      {activeTab === 'non-cannabis'          && <NonCannabisTab />}
      {activeTab === 'production-categories' && <ProductionTab />}
      {activeTab === 'categories'            && <CategoriesTab />}
      {activeTab === 'product-lines'         && <ProductLinesTab />}
      {activeTab === 'products-tab'          && <ProductsTab />}
      {activeTab === 'products-catalog'      && <CatalogGroupsTab />}
      {activeTab === 'strains'               && <StrainsTab />}
      {activeTab === 'rooms'                 && <RoomsTab />}
      {activeTab === 'discounts'             && <DiscountsTab />}
      {activeTab === 'back-orders'           && <BackordersTab />}
      {activeTab === 'qa-result'             && <QAResultTab />}
      {activeTab === 'conversions'           && <ConversionsTab />}
      {activeTab === 'product-tag'           && <ProductTagTab />}
      {activeTab === 'qa-lot'               && <QALotTab />}
      {activeTab === 'qa-sample'             && <QASampleTab />}
      {activeTab === 'employee-sample'       && <EmployeeSampleTab />}
      {activeTab === 'disposal'              && <DisposalTab />}
    </div>
  );
}

export function InventoryLayout() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="list" />}>
      <InventoryContent />
    </Suspense>
  );
}
