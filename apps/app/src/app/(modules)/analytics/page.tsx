import { Suspense } from 'react';
import { AnalyticsLayout } from '@/modules/analytics/components';
import { LoadingSkeleton } from '@/components';

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton variant="card" count={4} />}>
      <AnalyticsLayout />
    </Suspense>
  );
}
