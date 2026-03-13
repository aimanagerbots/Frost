'use client';

import { ArrowLeft, UsersRound, MapPin, Mail } from 'lucide-react';
import { AccentCard, StatusBadge, LoadingSkeleton } from '@/components';
import { useAccountGroup, useGroupAccounts } from '../hooks';

interface AccountGroupDetailProps {
  groupId: string;
  onBack: () => void;
}

export function AccountGroupDetail({ groupId, onBack }: AccountGroupDetailProps) {
  const { data: group, isLoading: groupLoading } = useAccountGroup(groupId);
  const { data: accounts = [], isLoading: accountsLoading } = useGroupAccounts(groupId);

  if (groupLoading) return <LoadingSkeleton variant="card" />;
  if (!group) return null;

  return (
    <div className="space-y-4">
      {/* Back button + header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-default text-text-muted transition-colors hover:bg-card-hover hover:text-text-default"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: '#F59E0B15' }}
          >
            <UsersRound className="h-5 w-5" style={{ color: '#F59E0B' }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-bright">{group.name}</h2>
            <div className="flex items-center gap-2">
              <StatusBadge
                variant={group.type === 'territory' ? 'info' : group.type === 'rep' ? 'success' : 'warning'}
                label={group.type.charAt(0).toUpperCase() + group.type.slice(1)}
              />
              {group.assignedRep && (
                <span className="text-xs text-text-muted">Rep: {group.assignedRep}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <AccentCard accentColor="#F59E0B" padding="sm">
          <p className="text-xs text-text-muted">Total Accounts</p>
          <p className="text-xl font-bold text-text-bright">{group.accountCount}</p>
        </AccentCard>
        <AccentCard accentColor="#F59E0B" padding="sm">
          <p className="text-xs text-text-muted">Type</p>
          <p className="text-xl font-bold text-text-bright capitalize">{group.type}</p>
        </AccentCard>
        {group.assignedRep && (
          <AccentCard accentColor="#F59E0B" padding="sm">
            <p className="text-xs text-text-muted">Assigned Rep</p>
            <p className="text-sm font-semibold text-text-bright">{group.assignedRep}</p>
          </AccentCard>
        )}
      </div>

      {/* Accounts list */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
          Member Accounts
        </h3>
        {accountsLoading ? (
          <LoadingSkeleton variant="list" />
        ) : (
          <div className="space-y-2">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-xl border border-default bg-card p-4 transition-colors hover:bg-card-hover"
              >
                <div className="min-w-0">
                  <p className="font-medium text-text-bright">{account.clientName}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {account.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {account.email}
                    </span>
                  </div>
                </div>
                <StatusBadge
                  status={account.status === 'active' ? 'active' : 'inactive'}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
