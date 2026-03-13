'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { MOCK_CATALOGS } from '@/mocks/sales';
import type { Catalog } from '@/modules/sales/types';

/** Fetch all catalogs */
export function useCatalogs() {
  return useDemoQuery<Catalog[]>({
    queryKey: ['catalogs'],
    demoQueryFn: () =>
      new Promise<Catalog[]>((resolve) =>
        setTimeout(() => resolve(MOCK_CATALOGS), 400)
      ),
    emptyValue: [] as Catalog[],
  });
}

/** Fetch a single catalog by ID */
export function useCatalog(catalogId: string | null) {
  return useDemoQuery<Catalog | undefined>({
    queryKey: ['catalog', catalogId],
    demoQueryFn: () =>
      new Promise<Catalog | undefined>((resolve) =>
        setTimeout(
          () => resolve(MOCK_CATALOGS.find((c) => c.id === catalogId)),
          300
        )
      ),
    emptyValue: undefined,
    enabled: !!catalogId,
  });
}
