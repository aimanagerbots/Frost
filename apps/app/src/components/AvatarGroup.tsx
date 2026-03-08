'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

interface AvatarUser {
  name: string;
  imageUrl?: string;
}

interface AvatarGroupProps {
  users: AvatarUser[];
  max?: number;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#5BB8E6', '#4A8DB8', '#3D7A9E', '#00E5A0', '#FBBF24',
    '#FB7185', '#38BDF8', '#F59E0B', '#8B5CF6', '#06B6D4',
  ];
  return colors[Math.abs(hash) % colors.length];
}

function Avatar({ user, className }: { user: AvatarUser; className?: string }) {
  return user.imageUrl ? (
    <Image
      src={user.imageUrl}
      alt={user.name}
      width={32}
      height={32}
      className={cn(
        'h-8 w-8 rounded-full border-2 border-card object-cover',
        className
      )}
    />
  ) : (
    <div
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full border-2 border-card text-xs font-medium text-text-bright',
        className
      )}
      style={{ backgroundColor: hashColor(user.name) }}
      title={user.name}
    >
      {getInitials(user.name)}
    </div>
  );
}

export function AvatarGroup({ users, max = 3, className }: AvatarGroupProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const visible = users.slice(0, max);
  const remaining = users.slice(max);

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {visible.map((user) => (
        <Avatar key={user.name} user={user} />
      ))}
      {remaining.length > 0 && (
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-elevated text-xs font-medium text-text-muted">
            +{remaining.length}
          </div>
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg bg-elevated px-3 py-2 text-xs shadow-lg">
              {remaining.map((u) => (
                <div key={u.name} className="whitespace-nowrap text-text-default">
                  {u.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
