'use client';

import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import type { UserProfile } from '@/modules/users/types';
import { ROLE_LABELS, DEPARTMENT_LABELS } from '@/modules/auth/types';
import type { UserRole, Department } from '@/modules/auth/types';

// DataTable requires T extends Record<string, unknown>
type UserRow = UserProfile & Record<string, unknown>;

const ROLE_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'> = {
  admin: 'danger',
  manager: 'warning',
  sales_rep: 'info',
  cultivation_lead: 'success',
  manufacturing_lead: 'success',
  packaging_lead: 'success',
  fulfillment_lead: 'success',
  driver: 'default',
  viewer: 'muted',
};

interface UserListProps {
  users: UserProfile[];
  onSelect: (user: UserProfile) => void;
}

export function UserList({ users, onSelect }: UserListProps) {
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers =
    roleFilter === 'all' ? users : users.filter((u) => u.role === roleFilter);

  const uniqueRoles = [...new Set(users.map((u) => u.role))].sort();

  const columns = [
    {
      header: 'Name',
      accessor: 'full_name' as const,
      sortable: true,
      render: (row: UserRow) => (
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{
              backgroundColor: row.is_active ? '#94A3B820' : '#EF444420',
              color: row.is_active ? '#94A3B8' : '#EF4444',
            }}
          >
            {row.full_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <span className="font-medium text-text-bright">{row.full_name}</span>
            <p className="text-xs text-text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role' as const,
      sortable: true,
      render: (row: UserRow) => (
        <StatusBadge
          label={ROLE_LABELS[row.role as UserRole] ?? row.role}
          variant={ROLE_VARIANT[row.role] ?? 'default'}
          size="sm"
        />
      ),
    },
    {
      header: 'Department',
      accessor: 'department' as const,
      sortable: true,
      hideBelow: 'md' as const,
      render: (row: UserRow) => (
        <span className="text-sm text-text-default">
          {row.department
            ? (DEPARTMENT_LABELS[row.department as Department] ?? row.department)
            : '—'}
        </span>
      ),
    },
    {
      header: 'Title',
      accessor: 'title' as const,
      sortable: false,
      hideBelow: 'lg' as const,
      render: (row: UserRow) => (
        <span className="text-sm text-text-muted">{row.title ?? '—'}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'is_active' as const,
      sortable: true,
      render: (row: UserRow) => (
        <StatusBadge
          label={row.is_active ? 'Active' : 'Inactive'}
          variant={row.is_active ? 'success' : 'muted'}
          size="sm"
          dot
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Role filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setRoleFilter('all')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            roleFilter === 'all'
              ? 'text-white'
              : 'text-text-muted hover:text-text-default hover:bg-accent-hover'
          }`}
          style={roleFilter === 'all' ? { backgroundColor: '#94A3B830', color: '#94A3B8' } : undefined}
        >
          All ({users.length})
        </button>
        {uniqueRoles.map((role) => {
          const count = users.filter((u) => u.role === role).length;
          const isActive = roleFilter === role;
          return (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-white'
                  : 'text-text-muted hover:text-text-default hover:bg-accent-hover'
              }`}
              style={isActive ? { backgroundColor: '#94A3B830', color: '#94A3B8' } : undefined}
            >
              {ROLE_LABELS[role as UserRole] ?? role} ({count})
            </button>
          );
        })}
      </div>

      <DataTable
        data={filteredUsers as UserRow[]}
        columns={columns}
        searchable
        searchPlaceholder="Search users..."
        onRowClick={(row) => onSelect(row as UserProfile)}
        emptyState={{ title: 'No users found', description: 'Try adjusting your filters' }}
      />
    </div>
  );
}
