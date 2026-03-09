import type { PortalIntegration } from '../types';

export const AVAILABLE_INTEGRATIONS: PortalIntegration[] = [
  {
    id: 'dutchie',
    platform: 'dutchie',
    status: 'disconnected',
    label: 'Dutchie',
    description: 'Connect your Dutchie online menu and POS. Orders sync automatically.',
    logoIcon: 'ShoppingBag',
  },
  {
    id: 'jane',
    platform: 'jane',
    status: 'disconnected',
    label: 'Jane / iHeartJane',
    description: 'Sync orders from your Jane ecommerce menu.',
    logoIcon: 'Heart',
  },
  {
    id: 'treez',
    platform: 'treez',
    status: 'disconnected',
    label: 'Treez',
    description: 'Connect Treez POS for bidirectional order sync.',
    logoIcon: 'TreePine',
  },
  {
    id: 'flowhub',
    platform: 'flowhub',
    status: 'disconnected',
    label: 'Flowhub',
    description: 'Integrate with Flowhub POS and inventory.',
    logoIcon: 'Workflow',
  },
  {
    id: 'weedmaps',
    platform: 'weedmaps',
    status: 'disconnected',
    label: 'Weedmaps',
    description: 'Receive pickup orders from Weedmaps.',
    logoIcon: 'Map',
  },
  {
    id: 'leafly',
    platform: 'leafly',
    status: 'disconnected',
    label: 'Leafly',
    description: 'Sync Leafly pickup orders.',
    logoIcon: 'Leaf',
  },
  {
    id: 'custom',
    platform: 'custom-webhook',
    status: 'disconnected',
    label: 'Custom Webhook',
    description: 'Connect any system via webhook. We POST orders, you send status updates.',
    logoIcon: 'Webhook',
  },
  {
    id: 'text-bot',
    platform: 'text-bot',
    status: 'connected',
    label: 'Text Alerts (Default)',
    description: 'No integration needed. Orders arrive via SMS. Reply to manage.',
    logoIcon: 'MessageSquare',
  },
];

export function getIntegrationsForAccount(accountId: string): PortalIntegration[] {
  switch (accountId) {
    case 'acct-1':
      return AVAILABLE_INTEGRATIONS.map((integration) => {
        if (integration.platform === 'dutchie') {
          return {
            ...integration,
            status: 'connected' as const,
            connectedAt: '2025-09-01T10:00:00Z',
            lastSyncAt: '2026-03-08T14:30:00Z',
            config: { storeId: 'gf-dutchie-001' },
          };
        }
        if (integration.platform === 'jane') {
          return {
            ...integration,
            status: 'connected' as const,
            connectedAt: '2025-11-15T09:00:00Z',
            lastSyncAt: '2026-03-08T14:25:00Z',
            config: { storeId: 'gf-jane-001' },
          };
        }
        if (integration.platform === 'text-bot') {
          return { ...integration, status: 'connected' as const, connectedAt: '2025-06-15T10:00:00Z' };
        }
        return integration;
      });
    case 'acct-2':
    case 'acct-3':
    default:
      return AVAILABLE_INTEGRATIONS.map((integration) => {
        if (integration.platform === 'text-bot') {
          return { ...integration, status: 'connected' as const, connectedAt: '2025-08-20T10:00:00Z' };
        }
        return integration;
      });
  }
}
