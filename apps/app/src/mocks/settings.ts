import type { CompanyProfile, Integration, NotificationPreference, CommunicationChannel } from '@/modules/settings/types';

const companyProfile: CompanyProfile = {
  name: 'Frost Farms LLC',
  license: 'WSLCB-420-2024-0892',
  address: '14205 NE 36th St',
  city: 'Bellevue',
  state: 'WA',
  zip: '98007',
  phone: '(425) 555-0142',
  email: 'operations@frostfarms.com',
  timezone: 'America/Los_Angeles',
};

const integrations: Integration[] = [
  { id: 'int-1', name: 'Headset.io', type: 'data', status: 'connected', lastSync: '5 min ago', description: 'Market data and analytics platform' },
  { id: 'int-2', name: 'Growlink', type: 'data', status: 'connected', lastSync: '2 min ago', description: 'IoT grow room monitoring' },
  { id: 'int-3', name: 'Trolmaster', type: 'data', status: 'connected', lastSync: '10 min ago', description: 'Climate control automation' },
  { id: 'int-4', name: 'HE Anderson', type: 'data', status: 'connected', lastSync: '1 hour ago', description: 'Distribution management' },
  { id: 'int-5', name: 'Google Calendar', type: 'calendar', status: 'connected', lastSync: '1 min ago', description: 'Team calendar sync' },
  { id: 'int-6', name: 'Zoom', type: 'communication', status: 'connected', description: 'Video conferencing' },
  { id: 'int-7', name: 'Twilio', type: 'communication', status: 'configured', description: 'SMS and voice communications' },
  { id: 'int-8', name: 'SendGrid', type: 'communication', status: 'configured', description: 'Email delivery service' },
  { id: 'int-9', name: 'WhatsApp Business', type: 'communication', status: 'pending', description: 'Customer messaging channel' },
  { id: 'int-10', name: 'Telegram', type: 'communication', status: 'connected', description: 'Bot notifications @Frostbot11_bot' },
  { id: 'int-11', name: 'Discord', type: 'communication', status: 'disconnected', description: 'Team communication' },
  { id: 'int-12', name: 'Slack', type: 'communication', status: 'disconnected', description: 'Workspace messaging' },
];

const notificationPreferences: NotificationPreference[] = [
  { category: 'Orders & Payments', email: true, sms: true, inApp: true, push: true },
  { category: 'Inventory Alerts', email: true, sms: false, inApp: true, push: true },
  { category: 'CRM & Sales', email: true, sms: false, inApp: true, push: false },
  { category: 'Operations', email: false, sms: false, inApp: true, push: false },
  { category: 'System', email: true, sms: true, inApp: true, push: true },
];

const communicationChannels: CommunicationChannel[] = [
  { id: 'ch-1', name: 'Web', type: 'Web App', enabled: true, status: 'active', details: 'Always on' },
  { id: 'ch-2', name: 'Phone / SMS', type: 'Telephony', enabled: true, status: 'active', details: 'Via Twilio' },
  { id: 'ch-3', name: 'Email', type: 'Email', enabled: true, status: 'active', details: 'Via SendGrid' },
  { id: 'ch-4', name: 'WhatsApp', type: 'Messaging', enabled: false, status: 'pending', details: 'Pending setup' },
  { id: 'ch-5', name: 'Telegram', type: 'Messaging', enabled: true, status: 'active', details: '@Frostbot11_bot' },
  { id: 'ch-6', name: 'Signal', type: 'Messaging', enabled: false, status: 'inactive' },
  { id: 'ch-7', name: 'Discord', type: 'Messaging', enabled: false, status: 'inactive' },
  { id: 'ch-8', name: 'Slack', type: 'Messaging', enabled: false, status: 'inactive' },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getCompanyProfile(): Promise<CompanyProfile> {
  await delay(300);
  return { ...companyProfile };
}

export async function getIntegrations(): Promise<Integration[]> {
  await delay(300);
  return integrations.map((i) => ({ ...i }));
}

export async function getNotificationPreferences(): Promise<NotificationPreference[]> {
  await delay(300);
  return notificationPreferences.map((n) => ({ ...n }));
}

export async function getCommunicationChannels(): Promise<CommunicationChannel[]> {
  await delay(300);
  return communicationChannels.map((c) => ({ ...c }));
}
