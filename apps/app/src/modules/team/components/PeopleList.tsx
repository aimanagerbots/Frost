'use client';

import type { TeamPerson } from '../hooks/useTeamDashboard';

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('');
}

/** Segmented progress bar — small blocks like a battery indicator */
function SegmentedProgress({ value, color }: { value: number; color: string }) {
  const totalSegments = 10;
  const filledSegments = Math.round((value / 100) * totalSegments);

  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: totalSegments }).map((_, i) => (
        <div
          key={i}
          className="h-3 w-2 rounded-[2px] transition-colors"
          style={{
            backgroundColor: i < filledSegments ? color : 'var(--bg-elevated)',
          }}
        />
      ))}
    </div>
  );
}

interface PeopleListProps {
  people: TeamPerson[];
}

export function PeopleList({ people }: PeopleListProps) {
  return (
    <div className="space-y-1">
      <h4 className="text-xs font-medium text-text-muted mb-3">People on the course</h4>
      {people.map((person) => (
        <div
          key={person.id}
          className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-accent-hover/50 transition-colors"
        >
          {/* Avatar */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: person.avatarColor }}
          >
            {getInitials(person.name)}
          </div>

          {/* Name & Role */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-bright truncate">{person.name}</p>
            <p className="text-[11px] text-text-muted truncate">{person.role}</p>
          </div>

          {/* Segmented Progress */}
          <SegmentedProgress value={person.progress} color={person.avatarColor} />

          {/* Percentage */}
          <span className="text-xs font-semibold text-text-bright tabular-nums w-8 text-right">
            {person.progress}%
          </span>
        </div>
      ))}
    </div>
  );
}
