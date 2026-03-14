'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserFormData, ModuleOverride } from '@/modules/users/types';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UserFormData) => {
      await new Promise((r) => setTimeout(r, 500));
      return { id: crypto.randomUUID(), ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<UserFormData> & { is_active?: boolean } }) => {
      await new Promise((r) => setTimeout(r, 500));
      return { id: userId, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await new Promise((r) => setTimeout(r, 500));
      return { user_id: userId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useArchiveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await new Promise((r) => setTimeout(r, 500));
      return { user_id: userId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      await new Promise((r) => setTimeout(r, 500));
      return { user_id: userId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useSetUserOverrides() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, overrides }: { userId: string; overrides: ModuleOverride[] }) => {
      await new Promise((r) => setTimeout(r, 500));
      return { user_id: userId, count: overrides.length };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', 'permissions', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
}
