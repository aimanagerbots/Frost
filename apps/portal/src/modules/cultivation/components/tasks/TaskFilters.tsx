'use client';

interface TaskFiltersProps {
  rooms: { id: string; name: string }[];
  selectedRoom: string;
  selectedPriority: string;
  sortBy: 'dueDate' | 'priority';
  onRoomChange: (room: string) => void;
  onPriorityChange: (priority: string) => void;
  onSortChange: (sort: 'dueDate' | 'priority') => void;
}

const PRIORITIES: { value: string; label: string }[] = [
  { value: '', label: 'All Priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function TaskFilters({
  rooms,
  selectedRoom,
  selectedPriority,
  sortBy,
  onRoomChange,
  onPriorityChange,
  onSortChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={selectedRoom}
        onChange={(e) => onRoomChange(e.target.value)}
        className="rounded-lg border border-default bg-card px-3 py-1.5 text-xs text-text-default outline-none"
      >
        <option value="">All Rooms</option>
        {rooms.map((r) => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <select
        value={selectedPriority}
        onChange={(e) => onPriorityChange(e.target.value)}
        className="rounded-lg border border-default bg-card px-3 py-1.5 text-xs text-text-default outline-none"
      >
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      <div className="flex items-center rounded-lg border border-default bg-card">
        <button
          onClick={() => onSortChange('dueDate')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            sortBy === 'dueDate' ? 'text-[#22C55E]' : 'text-text-muted hover:text-text-default'
          }`}
        >
          By Date
        </button>
        <button
          onClick={() => onSortChange('priority')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            sortBy === 'priority' ? 'text-[#22C55E]' : 'text-text-muted hover:text-text-default'
          }`}
        >
          By Priority
        </button>
      </div>
    </div>
  );
}
