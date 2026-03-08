import { useQuery } from '@tanstack/react-query';
import { getEmails, getEmailMetrics } from '@/mocks/email';
import type { EmailFolder } from '@/modules/email/types';

export function useEmails(folder?: EmailFolder) {
  return useQuery({
    queryKey: ['email', 'list', folder],
    queryFn: () => getEmails(folder),
  });
}

export function useEmailMetrics() {
  return useQuery({
    queryKey: ['email', 'metrics'],
    queryFn: getEmailMetrics,
  });
}
