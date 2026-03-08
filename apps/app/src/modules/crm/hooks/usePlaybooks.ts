'use client';

import { useQuery } from '@tanstack/react-query';
import { getPlaybooks, getPlaybookExecutions } from '@/mocks/crm-intelligence';

export function usePlaybooks() {
  return useQuery({
    queryKey: ['crm', 'playbooks'],
    queryFn: () => getPlaybooks(),
  });
}

export function usePlaybookExecutions() {
  return useQuery({
    queryKey: ['crm', 'playbook-executions'],
    queryFn: () => getPlaybookExecutions(),
  });
}
