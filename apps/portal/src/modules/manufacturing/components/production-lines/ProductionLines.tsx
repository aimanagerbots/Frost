'use client';

import { LoadingSkeleton } from '@/components';
import { useProductionLines } from '../../hooks';
import { ProductionLineCard } from './ProductionLineCard';

export function ProductionLines() {
  const { data: lines, isLoading } = useProductionLines();

  if (isLoading) return <LoadingSkeleton variant="card" count={6} />;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lines?.map((line) => (
        <ProductionLineCard key={line.id} line={line} />
      ))}
    </div>
  );
}
