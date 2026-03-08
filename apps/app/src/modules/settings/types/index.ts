export type SettingsTab = 'company' | 'integrations' | 'communications' | 'notifications' | 'api-keys' | 'appearance';
export type IntegrationStatus = 'connected' | 'configured' | 'pending' | 'disconnected';

export interface Integration {
  id: string;
  name: string;
  type: 'data' | 'communication' | 'calendar' | 'analytics';
  status: IntegrationStatus;
  lastSync?: string;
  description: string;
}

export interface NotificationPreference {
  category: string;
  email: boolean;
  sms: boolean;
  inApp: boolean;
  push: boolean;
}

export interface CompanyProfile {
  name: string;
  license: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  timezone: string;
}

export interface CommunicationChannel {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  status: 'active' | 'configured' | 'pending' | 'inactive';
  details?: string;
}
