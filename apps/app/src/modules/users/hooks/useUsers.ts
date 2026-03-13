'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/modules/auth/store';
import { supabase } from '@/lib/supabase';
import type { UserProfile, UserPermissions } from '@/modules/users/types';

// Mock users for demo mode
const MOCK_USERS: UserProfile[] = [
  {
    id: 'u1', email: 'quinn@frost.com', full_name: 'Quinn Frost',
    role: 'admin', department: 'executive', title: 'CEO',
    avatar_url: null, language_preference: 'en', phone: '555-0100',
    is_active: true, created_at: '2025-01-15T00:00:00Z', updated_at: '2026-03-01T00:00:00Z',
  },
  {
    id: 'u2', email: 'marcus@frost.com', full_name: 'Marcus Rivera',
    role: 'manager', department: 'sales', title: 'VP of Sales',
    avatar_url: null, language_preference: 'en', phone: '555-0101',
    is_active: true, created_at: '2025-02-10T00:00:00Z', updated_at: '2026-02-20T00:00:00Z',
  },
  {
    id: 'u3', email: 'sarah@frost.com', full_name: 'Sarah Chen',
    role: 'sales_rep', department: 'sales', title: 'Account Executive',
    avatar_url: null, language_preference: 'en', phone: '555-0102',
    is_active: true, created_at: '2025-03-05T00:00:00Z', updated_at: '2026-03-05T00:00:00Z',
  },
  {
    id: 'u4', email: 'diego@frost.com', full_name: 'Diego Morales',
    role: 'cultivation_lead', department: 'cultivation', title: 'Head Grower',
    avatar_url: null, language_preference: 'es', phone: '555-0103',
    is_active: true, created_at: '2025-01-20T00:00:00Z', updated_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'u5', email: 'priya@frost.com', full_name: 'Priya Sharma',
    role: 'manufacturing_lead', department: 'manufacturing', title: 'Lab Director',
    avatar_url: null, language_preference: 'en', phone: '555-0104',
    is_active: true, created_at: '2025-04-01T00:00:00Z', updated_at: '2026-02-28T00:00:00Z',
  },
  {
    id: 'u6', email: 'james@frost.com', full_name: 'James Park',
    role: 'fulfillment_lead', department: 'fulfillment', title: 'Fulfillment Manager',
    avatar_url: null, language_preference: 'en', phone: '555-0105',
    is_active: true, created_at: '2025-05-15T00:00:00Z', updated_at: '2026-03-01T00:00:00Z',
  },
  {
    id: 'u7', email: 'lisa@frost.com', full_name: 'Lisa Nguyen',
    role: 'packaging_lead', department: 'packaging', title: 'Packaging Supervisor',
    avatar_url: null, language_preference: 'en', phone: '555-0106',
    is_active: true, created_at: '2025-06-10T00:00:00Z', updated_at: '2026-01-20T00:00:00Z',
  },
  {
    id: 'u8', email: 'carlos@frost.com', full_name: 'Carlos Vega',
    role: 'driver', department: 'delivery', title: 'Delivery Driver',
    avatar_url: null, language_preference: 'es', phone: '555-0107',
    is_active: true, created_at: '2025-07-01T00:00:00Z', updated_at: '2026-03-07T00:00:00Z',
  },
  {
    id: 'u9', email: 'emma@frost.com', full_name: 'Emma Williams',
    role: 'viewer', department: 'marketing', title: 'Marketing Coordinator',
    avatar_url: null, language_preference: 'en', phone: '555-0108',
    is_active: false, created_at: '2025-08-01T00:00:00Z', updated_at: '2026-02-01T00:00:00Z',
  },
];

export function useUsers() {
  const isDemoMode = useAuthStore((s) => s.isDemoMode);

  return useQuery({
    queryKey: ['users', 'list', isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 400));
        return MOCK_USERS;
      }

      if (!supabase) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');

      if (error) throw new Error(error.message);
      return data as UserProfile[];
    },
  });
}

export function useUserPermissions(userId: string | null) {
  const isDemoMode = useAuthStore((s) => s.isDemoMode);

  return useQuery({
    queryKey: ['users', 'permissions', userId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 300));
        const user = MOCK_USERS.find((u) => u.id === userId);
        const allSlugs = [
          'chat', 'dashboard', 'email', 'calendar', 'tasks', 'projects', 'meetings', 'docs', 'team',
          'content-creator', 'content-calendar', 'social', 'email-marketing', 'seo', 'events', 'paid-ads', 'merch',
          'crm', 'pipeline', 'orders', 'vmi', 'competitors',
          'inventory', 'cultivation', 'manufacturing', 'packaging', 'fulfillment', 'delivery', 'products',
          'finance', 'ar', 'ap', 'budget', 'labor', 'reports',
          'agents', 'approvals', 'council', 'insights', 'memory',
          'settings', 'users', 'system',
        ];
        const baseSlugs = [
          'chat', 'dashboard', 'email', 'calendar', 'tasks', 'projects', 'meetings', 'docs', 'team',
          'agents', 'approvals', 'insights', 'settings',
        ];
        const allowed = user?.role === 'admin' ? allSlugs : baseSlugs;
        return {
          user_id: userId!,
          role: user?.role ?? 'viewer',
          role_defaults: allowed,
          overrides: [],
          allowed_modules: allowed,
        } satisfies UserPermissions;
      }

      if (!supabase) throw new Error('Supabase not configured');

      // Get user's role + department
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('role, department')
        .eq('id', userId!)
        .single();

      if (profileErr) throw new Error(profileErr.message);

      // 1. Role base modules (workspace, intelligence, settings for everyone + admin extras)
      const { data: roleDefaults, error: rdErr } = await supabase
        .from('role_module_defaults')
        .select('module_slug')
        .eq('role', profile.role);

      if (rdErr) throw new Error(rdErr.message);
      const roleSlugs = (roleDefaults ?? []).map((r: { module_slug: string }) => r.module_slug);

      // 2. Department modules (which sidebar sections this user's department unlocks)
      let deptSlugs: string[] = [];
      if (profile.department) {
        const { data: deptModules, error: dmErr } = await supabase
          .from('department_modules')
          .select('module_slug')
          .eq('department', profile.department);

        if (dmErr) throw new Error(dmErr.message);
        deptSlugs = (deptModules ?? []).map((d: { module_slug: string }) => d.module_slug);
      }

      // 3. Per-user overrides (fine-tuning on top)
      const { data: overrides, error: ovErr } = await supabase
        .from('user_module_overrides')
        .select('module_slug, granted')
        .eq('user_id', userId!);

      if (ovErr) throw new Error(ovErr.message);
      const overrideList = (overrides ?? []).map((o: { module_slug: string; granted: boolean }) => ({
        module_slug: o.module_slug,
        granted: o.granted,
      }));

      // Resolve: role base + department modules + overrides
      const allowed = new Set([...roleSlugs, ...deptSlugs]);
      for (const o of overrideList) {
        if (o.granted) allowed.add(o.module_slug);
        else allowed.delete(o.module_slug);
      }

      return {
        user_id: userId!,
        role: profile.role,
        role_defaults: [...roleSlugs, ...deptSlugs],
        overrides: overrideList,
        allowed_modules: Array.from(allowed),
      } satisfies UserPermissions;
    },
    enabled: !!userId,
  });
}
