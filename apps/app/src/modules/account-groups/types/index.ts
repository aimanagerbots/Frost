// Re-export types from the shared sales types
export type { AccountGroup } from '@/modules/sales/types';

export type AccountGroupType = 'territory' | 'rep' | 'custom';

export interface CreateAccountGroupInput {
  name: string;
  type: AccountGroupType;
  accountIds: string[];
}
