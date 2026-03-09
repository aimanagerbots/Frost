'use client';

import { ROLE_LABELS } from '@/modules/auth/types';
import type { UserRole } from '@/modules/auth/types';

const ALL_ROLES = Object.keys(ROLE_LABELS) as UserRole[];

interface RolePresetSelectorProps {
  selectedRole: string;
  onChange: (role: string) => void;
}

export function RolePresetSelector({ selectedRole, onChange }: RolePresetSelectorProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-text-muted">
        Role Preset
      </label>
      <p className="mb-2 text-xs text-text-muted/60">
        The base permission set for this role. Toggle individual modules below to override.
      </p>
      <select
        value={selectedRole}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border-default bg-base px-3 py-2 text-sm text-text-bright outline-none focus:border-[#94A3B8] transition-colors"
      >
        {ALL_ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
    </div>
  );
}
