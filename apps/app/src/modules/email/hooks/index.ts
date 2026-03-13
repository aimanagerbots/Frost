import { useDemoQuery } from '@/lib/use-demo-query';
import { getEmails, getEmailMetrics } from '@/mocks/email';
import type { EmailFolder, Email, EmailMetrics } from '@/modules/email/types';

export function useEmails(folder?: EmailFolder) {
  return useDemoQuery({
    queryKey: ['email', 'list', folder],
    demoQueryFn: () => getEmails(folder),
    emptyValue: [] as Email[],
  });
}

export function useEmailMetrics() {
  return useDemoQuery<EmailMetrics>({
    queryKey: ['email', 'metrics'],
    demoQueryFn: getEmailMetrics,
    emptyValue: { unread: 0, todayReceived: 0, needsResponse: 0, avgResponseTime: '0 hrs' },
  });
}
