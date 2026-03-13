'use client';

import { useState } from 'react';
import { Send, Save, Trash2, Loader2, X } from 'lucide-react';
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

const ROLE_SCOPES: Record<UserRole, string> = {
  admin: 'Full access to all modules, users, and configuration',
  manager: 'Can invite users, manage their department, view analytics',
  sales_rep: 'Accounts, orders, carts, catalogs, CRM, pipeline',
  cultivation_lead: 'Grow rooms, plants, harvests, genetics, environment',
  manufacturing_lead: 'Production lines, work orders, equipment, batches',
  packaging_lead: 'Packaging orders, lines, non-cannabis inventory',
  fulfillment_lead: 'Order fulfillment, packing operations, shipping',
  driver: 'Delivery routes, manifests, proof of delivery',
  viewer: 'Read-only access to assigned department modules',
};

export function UserForm({ user, isCreating, onSuccess }: UserFormProps) {
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [role, setRole] = useState<string>(user?.role ?? 'viewer');
  const [departments, setDepartments] = useState<string[]>(
    user?.departments ?? (user?.department ? [user.department] : [])
  );
  const [title, setTitle] = useState(user?.title ?? '');
  const [error, setError] = useState<string | null>(null);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deactivateUser = useDeactivateUser();

  const isSaving = createUser.isPending || updateUser.isPending;

  function toggleDepartment(dept: string) {
    setDepartments((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (departments.length === 0) {
      setError('Select at least one department.');
      return;
    }
    try {
      if (isCreating) {
        await createUser.mutateAsync({
          full_name: fullName.trim(),
          email: email.trim(),
          role,
          department: departments[0] || null,
          departments,
          title: title.trim() || null,
        });
      } else if (user) {
        await updateUser.mutateAsync({
          userId: user.id,
          data: {
            full_name: fullName.trim(),
            role,
            department: departments[0] || null,
            departments,
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
          placeholder="e.g. sarah@frostcannabis.co"
        />
      </div>

      {/* Invite notice */}
      {isCreating && (
        <div className="rounded-lg border border-[#5BB8E6]/20 bg-[#5BB8E6]/5 px-4 py-3 text-sm text-[#5BB8E6]/80">
          An invite email will be sent. The user will set their own password.
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
        {/* Scope description */}
        <p className="mt-1.5 text-xs text-text-muted">
          {ROLE_SCOPES[role as UserRole]}
        </p>
      </div>

      {/* Departments — multi-choice */}
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-muted">
          Departments
        </label>
        {/* Selected chips */}
        {departments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {departments.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDepartment(d)}
                className="inline-flex items-center gap-1 rounded-md bg-[#5BB8E6]/10 border border-[#5BB8E6]/20 px-2.5 py-1 text-xs font-medium text-[#5BB8E6] hover:bg-[#5BB8E6]/20 transition-colors"
              >
                {DEPARTMENT_LABELS[d as Department]}
                <X size={12} />
              </button>
            ))}
          </div>
        )}
        {/* Toggle grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {ALL_DEPARTMENTS.map((d) => {
            const isSelected = departments.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDepartment(d)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition-colors ${
                  isSelected
                    ? 'border-[#5BB8E6]/40 bg-[#5BB8E6]/10 text-[#5BB8E6]'
                    : 'border-border-default bg-base text-text-muted hover:border-border-default hover:bg-card-hover'
                }`}
              >
                {DEPARTMENT_LABELS[d]}
              </button>
            );
          })}
        </div>
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
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : isCreating ? <Send size={16} /> : <Save size={16} />}
          {isCreating ? 'Send Invite' : 'Save Changes'}
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
