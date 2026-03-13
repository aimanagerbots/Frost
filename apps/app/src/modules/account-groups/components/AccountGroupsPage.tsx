'use client';

import { useState } from 'react';
import { UsersRound, Plus } from 'lucide-react';
import { SectionHeader } from '@/components';
import { useAccountGroups } from '../hooks';
import { AccountGroupsTable } from './AccountGroupsTable';
import { AccountGroupDetail } from './AccountGroupDetail';
import { CreateGroupModal } from './CreateGroupModal';
import type { AccountGroup } from '@/modules/sales/types';

export function AccountGroupsPage() {
  const { data: groups = [], isLoading } = useAccountGroups();
  const [selectedGroup, setSelectedGroup] = useState<AccountGroup | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  if (selectedGroup) {
    return (
      <div className="space-y-4">
        <AccountGroupDetail
          groupId={selectedGroup.id}
          onBack={() => setSelectedGroup(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        icon={UsersRound}
        title="Account Groups"
        subtitle="Organize accounts by territory, rep, or custom criteria"
        accentColor="#F59E0B"
        actions={
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-black transition-colors hover:opacity-90"
            style={{ backgroundColor: '#F59E0B' }}
          >
            <Plus className="h-4 w-4" />
            Create Group
          </button>
        }
      />

      <AccountGroupsTable
        groups={groups}
        loading={isLoading}
        onSelect={setSelectedGroup}
      />

      <CreateGroupModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(data) => {
          // In Phase 0, just close the modal — no mutation
          console.log('Create group:', data);
        }}
      />
    </div>
  );
}
