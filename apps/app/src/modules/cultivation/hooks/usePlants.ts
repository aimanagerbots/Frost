'use client';

import { useQuery } from '@tanstack/react-query';
import { getPlants } from '@/mocks/cultivation';

export function usePlants(filters?: { roomId?: string; stage?: string; health?: string; search?: string }) {
  return useQuery({
    queryKey: ['cultivation', 'plants', filters],
    queryFn: () => getPlants(filters),
  });
}
