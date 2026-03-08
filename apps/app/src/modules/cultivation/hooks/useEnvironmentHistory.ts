'use client';

import { useQuery } from '@tanstack/react-query';
import { getEnvironmentHistory } from '@/mocks/cultivation';

export function useEnvironmentHistory(roomId: string) {
  return useQuery({
    queryKey: ['cultivation', 'environment-history', roomId],
    queryFn: () => getEnvironmentHistory(roomId),
    enabled: !!roomId,
  });
}
