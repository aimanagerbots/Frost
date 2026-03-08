import { Suspense } from 'react';
import { CRMLayout } from '@/modules/crm/components';
import { LoadingSkeleton } from '@/components';

export default function CRMPage() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="card" count={4} />}>
      <CRMLayout />
    </Suspense>
  );
}
