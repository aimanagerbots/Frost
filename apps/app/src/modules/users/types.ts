import type { UserProfile, UserPermissions, ModuleDefinition, ModuleOverride } from '@/modules/auth/types';

export type { UserProfile, UserPermissions, ModuleDefinition, ModuleOverride };

export interface UserFormData {
  email: string;
  full_name: string;
  role: string;
  department: string | null;
  departments?: string[];
  title: string | null;
}

export interface UserMetrics {
  total: number;
  active: number;
  byRole: Record<string, number>;
}
