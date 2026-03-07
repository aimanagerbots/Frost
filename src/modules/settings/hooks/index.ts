'use client';

import { useQuery } from '@tanstack/react-query';
import { getCompanyProfile, getIntegrations, getNotificationPreferences, getCommunicationChannels } from '@/mocks/settings';

export function useCompanyProfile() {
  return useQuery({ queryKey: ['settings', 'company'], queryFn: () => getCompanyProfile() });
}

export function useIntegrations() {
  return useQuery({ queryKey: ['settings', 'integrations'], queryFn: () => getIntegrations() });
}

export function useNotificationPreferences() {
  return useQuery({ queryKey: ['settings', 'notifications'], queryFn: () => getNotificationPreferences() });
}

export function useCommunicationChannels() {
  return useQuery({ queryKey: ['settings', 'communications'], queryFn: () => getCommunicationChannels() });
}
