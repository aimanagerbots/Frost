export type UserRole =
  | 'admin'
  | 'manager'
  | 'sales_rep'
  | 'cultivation_lead'
  | 'manufacturing_lead'
  | 'packaging_lead'
  | 'fulfillment_lead'
  | 'driver'
  | 'viewer';

export type Department =
  | 'executive'
  | 'sales'
  | 'cultivation'
  | 'manufacturing'
  | 'packaging'
  | 'fulfillment'
  | 'delivery'
  | 'finance'
  | 'marketing'
  | 'quality';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  department: Department | null;
  title: string | null;
  avatar_url: string | null;
  language_preference: string;
  phone: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface ResolvedPermissions {
  allowed_modules: string[];
}

export interface ModuleOverride {
  module_slug: string;
  granted: boolean;
}

export interface ModuleDefinition {
  slug: string;
  label: string;
  nav_group: string;
}

export interface UserPermissions {
  user_id: string;
  role: string;
  role_defaults: string[];
  overrides: ModuleOverride[];
  allowed_modules: string[];
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  manager: 'Manager',
  sales_rep: 'Sales Rep',
  cultivation_lead: 'Cultivation Lead',
  manufacturing_lead: 'Manufacturing Lead',
  packaging_lead: 'Packaging Lead',
  fulfillment_lead: 'Fulfillment Lead',
  driver: 'Driver',
  viewer: 'Viewer',
};

export const DEPARTMENT_LABELS: Record<Department, string> = {
  executive: 'Executive',
  sales: 'Sales',
  cultivation: 'Cultivation',
  manufacturing: 'Manufacturing',
  packaging: 'Packaging',
  fulfillment: 'Fulfillment',
  delivery: 'Delivery',
  finance: 'Finance',
  marketing: 'Marketing',
  quality: 'Quality',
};
