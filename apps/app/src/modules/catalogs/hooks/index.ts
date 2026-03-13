'use client';

import { useQuery } from '@tanstack/react-query';
import { MOCK_CATALOGS } from '@/mocks/sales';
import type { Catalog } from '@/modules/sales/types';

/** Fetch all catalogs */
export function useCatalogs() {
  return useQuery<Catalog[]>({
    queryKey: ['catalogs'],
    queryFn: () =>
      new Promise<Catalog[]>((resolve) =>
        setTimeout(() => resolve(MOCK_CATALOGS), 400)
      ),
  });
}

/** Fetch a single catalog by ID */
export function useCatalog(catalogId: string | null) {
  return useQuery<Catalog | undefined>({
    queryKey: ['catalog', catalogId],
    queryFn: () =>
      new Promise<Catalog | undefined>((resolve) =>
        setTimeout(
          () => resolve(MOCK_CATALOGS.find((c) => c.id === catalogId)),
          300
        )
      ),
    enabled: !!catalogId,
  });
}
