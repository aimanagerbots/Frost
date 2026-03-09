'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/modules/auth/store';
import { apiFetch } from '@/lib/api';
import type { UserFormData, ModuleOverride } from '@/modules/users/types';

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
      return apiFetch('/api/auth/users/create', {
        method: 'POST',
        body: JSON.stringify(data),
        token: session?.access_token,
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
      return apiFetch(`/api/auth/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        token: session?.access_token,
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
      return apiFetch(`/api/auth/users/${userId}`, {
        method: 'DELETE',
        token: session?.access_token,
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
      return apiFetch(`/api/permissions/users/${userId}/overrides`, {
        method: 'PUT',
        body: JSON.stringify({ overrides }),
        token: session?.access_token,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'permissions', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
}
