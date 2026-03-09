'use client';

import { useState } from 'react';
import { DrawerPanel } from '@/components/DrawerPanel';
import { UserForm } from './UserForm';
import { PermissionEditor } from './PermissionEditor';
import type { UserProfile } from '@/modules/users/types';

interface UserDrawerProps {
  open: boolean;
  user: UserProfile | null;
  isCreating: boolean;
  onClose: () => void;
}

export function UserDrawer({ open, user, isCreating, onClose }: UserDrawerProps) {
  const [tab, setTab] = useState<'profile' | 'permissions'>('profile');

  const title = isCreating ? 'New User' : (user?.full_name ?? 'User');

  return (
    <DrawerPanel
      open={open}
      onClose={() => {
        setTab('profile');
        onClose();
      }}
      title={title}
      width="lg"
    >
      {/* Tab Switcher */}
      <div className="flex border-b border-border-default mb-6">
        <button
          onClick={() => setTab('profile')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
            tab === 'profile' ? 'text-text-bright' : 'text-text-muted hover:text-text-default'
          }`}
        >
          Profile
          {tab === 'profile' && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
              style={{ backgroundColor: '#94A3B8' }}
            />
          )}
        </button>
        {!isCreating && (
          <button
            onClick={() => setTab('permissions')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
              tab === 'permissions' ? 'text-text-bright' : 'text-text-muted hover:text-text-default'
            }`}
          >
            Permissions
            {tab === 'permissions' && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: '#94A3B8' }}
              />
            )}
          </button>
        )}
      </div>

      {/* Tab Content */}
      {tab === 'profile' && (
        <UserForm user={user} isCreating={isCreating} onSuccess={onClose} />
      )}
      {tab === 'permissions' && user && (
        <PermissionEditor userId={user.id} userRole={user.role} />
      )}
    </DrawerPanel>
  );
}
