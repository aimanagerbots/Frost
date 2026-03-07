'use client';

import { useQuery } from '@tanstack/react-query';
import { getProjects, getProjectMetrics } from '@/mocks/projects';
import type { ProjectFilter } from '@/modules/projects/types';

export function useProjects(filters?: ProjectFilter) {
  return useQuery({
    queryKey: ['projects', 'list', filters],
    queryFn: () => getProjects(filters),
  });
}

export function useProjectMetrics() {
  return useQuery({
    queryKey: ['projects', 'metrics'],
    queryFn: () => getProjectMetrics(),
  });
}
