'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getProjects, getProjectMetrics } from '@/mocks/projects';
import type { ProjectFilter, Project } from '@/modules/projects/types';

export function useProjects(filters?: ProjectFilter) {
  return useDemoQuery({
    queryKey: ['projects', 'list', filters],
    demoQueryFn: () => getProjects(filters),
    emptyValue: [] as Project[],
  });
}

export function useProjectMetrics() {
  return useDemoQuery({
    queryKey: ['projects', 'metrics'],
    demoQueryFn: () => getProjectMetrics(),
    emptyValue: { active: 0, onTrack: 0, behind: 0, completedThisQuarter: 0 },
  });
}
