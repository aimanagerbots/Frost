'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getPlaybooks, getPlaybookExecutions } from '@/mocks/crm-intelligence';
import type { Playbook, PlaybookExecution } from '@/modules/crm/types';

export function usePlaybooks() {
  return useDemoQuery({
    queryKey: ['crm', 'playbooks'],
    demoQueryFn: () => getPlaybooks(),
    emptyValue: [] as Playbook[],
  });
}

export function usePlaybookExecutions() {
  return useDemoQuery({
    queryKey: ['crm', 'playbook-executions'],
    demoQueryFn: () => getPlaybookExecutions(),
    emptyValue: [] as PlaybookExecution[],
  });
}
