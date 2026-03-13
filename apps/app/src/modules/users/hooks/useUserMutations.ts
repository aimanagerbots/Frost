'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/modules/auth/store';
import { supabase } from '@/lib/supabase';
import type { UserFormData, ModuleOverride } from '@/modules/users/types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

/** Call a Supabase Edge Function with the user's JWT */
async function edgeFn(
  fnName: string,
  opts: { method: string; path?: string; body?: unknown; token: string },
) {
  const url = `${SUPABASE_URL}/functions/v1/${fnName}${opts.path ?? ''}`;
  const res = await fetch(url, {
    method: opts.method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${opts.token}`,
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Edge function error ${res.status}: ${text}`);
  }
  return res.json();
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const session = useAuthStore((s) => s.session);
  const isDemoMode = useAuthStore((s) => s.isDemoMode);

  return useMutation({
    mutationFn: async (data: UserFormData) => {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 500));
        return { id: crypto.randomUUID(), ...data };
      }
      return edgeFn('manage-users', {
        method: 'POST',
        body: data,
        token: session!.access_token,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const session = useAuthStore((s) => s.session);
  const isDemoMode = useAuthStore((s) => s.isDemoMode);

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<UserFormData> & { is_active?: boolean } }) => {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 500));
        return { id: userId, ...data };
      }
      return edgeFn('manage-users', {
        method: 'PATCH',
        path: `/${userId}`,
        body: data,
        token: session!.access_token,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  const session = useAuthStore((s) => s.session);
  const isDemoMode = useAuthStore((s) => s.isDemoMode);

  return useMutation({
    mutationFn: async (userId: string) => {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 500));
        return { user_id: userId };
      }
      return edgeFn('manage-users', {
        method: 'DELETE',
        path: `/${userId}`,
        token: session!.access_token,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useSetUserOverrides() {
  const queryClient = useQueryClient();
  const session = useAuthStore((s) => s.session);
  const isDemoMode = useAuthStore((s) => s.isDemoMode);

  return useMutation({
    mutationFn: async ({ userId, overrides }: { userId: string; overrides: ModuleOverride[] }) => {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 500));
        return { user_id: userId, count: overrides.length };
      }

      if (!supabase) throw new Error('Supabase not configured');

      return edgeFn('manage-overrides', {
        method: 'PUT',
        path: `/${userId}`,
        body: { overrides },
        token: session!.access_token,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'permissions', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
}
