'use client';

import { useState } from 'react';
import { Save, Trash2, Loader2 } from 'lucide-react';
import { useCreateUser, useUpdateUser, useDeactivateUser } from '@/modules/users/hooks/useUserMutations';
import { ROLE_LABELS, DEPARTMENT_LABELS } from '@/modules/auth/types';
import type { UserRole, Department } from '@/modules/auth/types';
import type { UserProfile } from '@/modules/users/types';

interface UserFormProps {
  user: UserProfile | null;
  isCreating: boolean;
  onSuccess: () => void;
}

const ALL_ROLES = Object.keys(ROLE_LABELS) as UserRole[];
const ALL_DEPARTMENTS = Object.keys(DEPARTMENT_LABELS) as Department[];

export function UserForm({ user, isCreating, onSuccess }: UserFormProps) {
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>(user?.role ?? 'viewer');
  const [department, setDepartment] = useState(user?.department ?? '');
  const [title, setTitle] = useState(user?.title ?? '');
  const [error, setError] = useState<string | null>(null);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deactivateUser = useDeactivateUser();

  const isSaving = createUser.isPending || updateUser.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (isCreating && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      if (isCreating) {
        await createUser.mutateAsync({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
          role,
          department: department || null,
          title: title.trim() || null,
        });
      } else if (user) {
        await updateUser.mutateAsync({
          userId: user.id,
          data: {
            full_name: fullName.trim(),
            role,
            department: department || null,
            title: title.trim() || null,
          },
        });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user.');
    }
  }

  async function handleDeactivate() {
    if (!user) return;
    try {
      await deactivateUser.mutateAsync(user.id);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate user.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-muted">
          Full Name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border border-border-default bg-base px-3 py-2 text-sm text-text-bright placeholder-text-muted/50 outline-none focus:border-[#94A3B8] transition-colors"
          placeholder="e.g. Sarah Chen"
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-muted">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isCreating}
          className="w-full rounded-lg border border-border-default bg-base px-3 py-2 text-sm text-text-bright placeholder-text-muted/50 outline-none focus:border-[#94A3B8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="e.g. sarah@frost.com"
        />
      </div>

      {/* Password (create only) */}
      {isCreating && (
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-muted">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border-default bg-base px-3 py-2 text-sm text-text-bright placeholder-text-muted/50 outline-none focus:border-[#94A3B8] transition-colors"
            placeholder="Minimum 8 characters"
          />
        </div>
      )}

      {/* Role */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-muted">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-lg border border-border-default bg-base px-3 py-2 text-sm text-text-bright outline-none focus:border-[#94A3B8] transition-colors"
        >
          {ALL_ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </div>

      {/* Department */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-muted">
          Department
        </label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full rounded-lg border border-border-default bg-base px-3 py-2 text-sm text-text-bright outline-none focus:border-[#94A3B8] transition-colors"
        >
          <option value="">None</option>
          {ALL_DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {DEPARTMENT_LABELS[d]}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-muted">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-border-default bg-base px-3 py-2 text-sm text-text-bright placeholder-text-muted/50 outline-none focus:border-[#94A3B8] transition-colors"
          placeholder="e.g. Account Executive"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-border-default">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:brightness-110 disabled:opacity-50"
          style={{ backgroundColor: '#94A3B8' }}
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isCreating ? 'Create User' : 'Save Changes'}
        </button>

        {!isCreating && user?.is_active && (
          <button
            type="button"
            onClick={handleDeactivate}
            disabled={deactivateUser.isPending}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
          >
            {deactivateUser.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            Deactivate
          </button>
        )}
      </div>
    </form>
  );
}
