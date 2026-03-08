import { Suspense } from 'react';
import { OrdersPage } from '@/modules/orders/components';
import { LoadingSkeleton } from '@/components';

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="card" count={3} />}>
      <OrdersPage />
    </Suspense>
  );
}
