'use client';

import { useQuery } from '@tanstack/react-query';
import { getContentPosts, getContentMetrics } from '@/mocks/content';
import type { ContentFilter } from '@/modules/content/types';

export function useContentPosts(filters?: ContentFilter) {
  return useQuery({
    queryKey: ['content', 'posts', filters],
    queryFn: () => getContentPosts(filters),
  });
}

export function useContentMetrics() {
  return useQuery({
    queryKey: ['content', 'metrics'],
    queryFn: () => getContentMetrics(),
  });
}
