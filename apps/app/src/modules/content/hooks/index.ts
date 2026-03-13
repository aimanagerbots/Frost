'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getContentPosts, getContentMetrics } from '@/mocks/content';
import type { ContentFilter, ContentPost } from '@/modules/content/types';

export function useContentPosts(filters?: ContentFilter) {
  return useDemoQuery({
    queryKey: ['content', 'posts', filters],
    demoQueryFn: () => getContentPosts(filters),
    emptyValue: [] as ContentPost[],
  });
}

export function useContentMetrics() {
  return useDemoQuery({
    queryKey: ['content', 'metrics'],
    demoQueryFn: () => getContentMetrics(),
    emptyValue: {
      postsThisMonth: 0,
      avgEngagement: '0%',
      emailOpenRate: '0%',
      scheduledCount: 0,
    },
  });
}
