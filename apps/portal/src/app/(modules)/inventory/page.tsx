import { Suspense } from 'react';
import { InventoryPage } from '@/modules/inventory/components';
import { LoadingSkeleton } from '@/components';

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="card" count={4} />}>
      <InventoryPage />
    </Suspense>
  );
}
