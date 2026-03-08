'use client';

const STATUS_COLORS = {
  online: 'bg-green-500',
  away: 'bg-amber-400',
  offline: 'bg-gray-500',
} as const;

function getInitials(name: string): string {
  if (name === 'You') return 'YO';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface MemberAvatarProps {
  name: string;
  status?: 'online' | 'away' | 'offline';
  size?: 'sm' | 'md';
}

export function MemberAvatar({ name, status, size = 'md' }: MemberAvatarProps) {
  const dim = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-8 w-8 text-xs';
  const dotDim = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5';

  return (
    <div className="relative shrink-0">
      <div
        className={`${dim} flex items-center justify-center rounded-full bg-elevated font-semibold text-text-muted`}
      >
        {getInitials(name)}
      </div>
      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${dotDim} rounded-full border-2 border-card ${STATUS_COLORS[status]}`}
        />
      )}
    </div>
  );
}
