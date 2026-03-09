'use client';

import { useState, useMemo } from 'react';
import { UserCog, Plus } from 'lucide-react';
import { SectionHeader } from '@/components/SectionHeader';
import { MetricCard } from '@/components/MetricCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { UserList } from './UserList';
import { UserDrawer } from './UserDrawer';
import { useUsers } from '@/modules/users/hooks/useUsers';
import type { UserProfile } from '@/modules/users/types';
import { ROLE_LABELS } from '@/modules/auth/types';

const ACCENT = '#94A3B8';

export function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { data: users, isLoading, error, refetch } = useUsers();

  const metrics = useMemo(() => {
    if (!users) return null;
    const active = users.filter((u) => u.is_active).length;
    const byRole: Record<string, number> = {};
    for (const u of users) {
      byRole[u.role] = (byRole[u.role] ?? 0) + 1;
    }
    return { total: users.length, active, inactive: users.length - active, byRole };
  }, [users]);

  // Find the most common role for the 4th metric card
  const topRole = useMemo(() => {
    if (!metrics?.byRole) return { role: 'viewer', count: 0 };
    const entries = Object.entries(metrics.byRole).sort(([, a], [, b]) => b - a);
    return entries.length > 0
      ? { role: entries[0][0], count: entries[0][1] }
      : { role: 'viewer', count: 0 };
  }, [metrics]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load users"
          message={error.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={UserCog}
        title="Users"
        subtitle="Manage accounts and module permissions"
        accentColor={ACCENT}
        actions={
          <button
            onClick={() => {
              setSelectedUser(null);
              setIsCreating(true);
            }}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:brightness-110"
            style={{ backgroundColor: ACCENT }}
          >
            <Plus size={16} />
            Add User
          </button>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Users" value={metrics?.total ?? 0} accentColor={ACCENT} />
        <MetricCard label="Active" value={metrics?.active ?? 0} accentColor="#22C55E" />
        <MetricCard label="Inactive" value={metrics?.inactive ?? 0} accentColor="#EF4444" />
        <MetricCard
          label={`Most Common: ${ROLE_LABELS[topRole.role as keyof typeof ROLE_LABELS] ?? topRole.role}`}
          value={topRole.count}
          accentColor="#5BB8E6"
        />
      </div>

      {/* User List */}
      <UserList
        users={users ?? []}
        onSelect={(user) => {
          setIsCreating(false);
          setSelectedUser(user);
        }}
      />

      {/* User Drawer */}
      <UserDrawer
        open={!!selectedUser || isCreating}
        user={selectedUser}
        isCreating={isCreating}
        onClose={() => {
          setSelectedUser(null);
          setIsCreating(false);
        }}
      />
    </div>
  );
}
