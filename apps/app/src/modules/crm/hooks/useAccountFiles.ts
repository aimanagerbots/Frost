'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getAccountFiles } from '@/mocks/crm-details';
import type { AccountFile } from '@/modules/crm/types';

export function useAccountFiles(id: string) {
  return useDemoQuery({
    queryKey: ['crm', 'account-files', id],
    demoQueryFn: () => getAccountFiles(id),
    emptyValue: [] as AccountFile[],
    enabled: !!id,
  });
}
