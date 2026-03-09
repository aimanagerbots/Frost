import type { PortalPaymentMethod } from '../types';

// ── Helpers ──────────────────────────────────────────────────────────

const ACCT_1 = 'acct-1'; // Greenfield
const ACCT_2 = 'acct-2'; // Pacific Leaf
const ACCT_3 = 'acct-3'; // Cascade Wellness

// ══════════════════════════════════════════════════════════════════════
// GREENFIELD — 2 methods: ACH (default) + eCheck (backup)
// ══════════════════════════════════════════════════════════════════════

const greenfieldMethods: PortalPaymentMethod[] = [
  {
    id: 'pm-gf-01',
    type: 'ach',
    label: 'Columbia Bank — ACH',
    bankName: 'Columbia Bank',
    lastFour: '4521',
    isDefault: true,
  },
  {
    id: 'pm-gf-02',
    type: 'echeck',
    label: 'BECU — eCheck',
    bankName: 'BECU',
    lastFour: '7890',
    isDefault: false,
  },
];

// ══════════════════════════════════════════════════════════════════════
// PACIFIC LEAF — 1 method: ACH (default)
// ══════════════════════════════════════════════════════════════════════

const pacificLeafMethods: PortalPaymentMethod[] = [
  {
    id: 'pm-pl-01',
    type: 'ach',
    label: 'US Bank — ACH',
    bankName: 'US Bank',
    lastFour: '3344',
    isDefault: true,
  },
];

// ══════════════════════════════════════════════════════════════════════
// CASCADE WELLNESS — 1 method: eCheck (default)
// ══════════════════════════════════════════════════════════════════════

const cascadeMethods: PortalPaymentMethod[] = [
  {
    id: 'pm-cw-01',
    type: 'echeck',
    label: 'Washington Federal — eCheck',
    bankName: 'Washington Federal',
    lastFour: '6677',
    isDefault: true,
  },
];

// ══════════════════════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════════════════════

const methodsByAccount: Record<string, PortalPaymentMethod[]> = {
  [ACCT_1]: greenfieldMethods,
  [ACCT_2]: pacificLeafMethods,
  [ACCT_3]: cascadeMethods,
};

export function getPaymentMethodsForAccount(accountId: string): PortalPaymentMethod[] {
  return methodsByAccount[accountId] ?? [];
}
