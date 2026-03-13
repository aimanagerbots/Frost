'use client';

import { useDemoQuery } from '@/lib/use-demo-query';
import { getCompanyProfile, getIntegrations, getNotificationPreferences, getCommunicationChannels } from '@/mocks/settings';
import type { CompanyProfile, Integration, NotificationPreference, CommunicationChannel } from '@/modules/settings/types';

export function useCompanyProfile() {
  return useDemoQuery({
    queryKey: ['settings', 'company'],
    demoQueryFn: () => getCompanyProfile(),
    emptyValue: {
      name: '',
      license: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: '',
      timezone: '',
    } as CompanyProfile,
  });
}

export function useIntegrations() {
  return useDemoQuery({
    queryKey: ['settings', 'integrations'],
    demoQueryFn: () => getIntegrations(),
    emptyValue: [] as Integration[],
  });
}

export function useNotificationPreferences() {
  return useDemoQuery({
    queryKey: ['settings', 'notifications'],
    demoQueryFn: () => getNotificationPreferences(),
    emptyValue: [] as NotificationPreference[],
  });
}

export function useCommunicationChannels() {
  return useDemoQuery({
    queryKey: ['settings', 'communications'],
    demoQueryFn: () => getCommunicationChannels(),
    emptyValue: [] as CommunicationChannel[],
  });
}
