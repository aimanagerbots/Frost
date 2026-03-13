'use client';

import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useRooms } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';
import { InvStatusBadge } from '../InventoryStatusBadge';
const ACCENT = '#8B5CF6';

const ROOM_TYPE_COLORS: Record<string, string> = {
  grow:    '#22c55e',
  dry:     '#f59e0b',
  cure:    '#06b6d4',
  storage: '#8b5cf6',
  staging: '#ec4899',
};

const ROOM_TYPE_TABS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'grow', label: 'Grow' },
  { key: 'dry', label: 'Dry' },
  { key: 'cure', label: 'Cure' },
  { key: 'storage', label: 'Storage' },
  { key: 'staging', label: 'Staging' },
];

const ROOM_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'grow', label: 'Grow' },
  { value: 'dry', label: 'Dry' },
  { value: 'cure', label: 'Cure' },
  { value: 'storage', label: 'Storage' },
  { value: 'staging', label: 'Staging' },
];

function deriveStatus(pct: number): string {
  if (pct > 80) return 'at-capacity';
  if (pct > 50) return 'active';
  return 'available';
}

const inputCls = 'h-9 w-full rounded-lg border border-default bg-elevated px-3 text-[13px] text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none';
const selectCls = 'h-9 w-full appearance-none rounded-lg border border-default bg-elevated px-3 text-[13px] text-text-default focus:border-[#8B5CF6] focus:outline-none';

export function RoomsTab() {
  const { data: rooms, isLoading } = useRooms();
  const [filterTab, setFilterTab] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ name: '', roomType: '' as string, capacity: '' });

  if (isLoading) return <LoadingSkeleton variant="table" />;

  const filtered = (rooms ?? []).filter(r => filterTab === 'all' || r.roomType === filterTab);

  return (
    <div className="space-y-3">
      {/* Action button row */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-muted">{filtered.length} rooms</p>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium hover:bg-card"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          + Add Room
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-default bg-base p-1">
          {ROOM_TYPE_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key)}
              className="rounded-md px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors"
              style={filterTab === tab.key
                ? { backgroundColor: ACCENT + '20', color: ACCENT }
                : { color: 'var(--color-text-muted)' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-default">
                {['Room Name', 'Type', 'Capacity', 'Occupancy', 'Batches', 'Utilization', 'Status'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(room => {
                const pct = Math.round((room.currentOccupancy / room.capacity) * 100);
                const color = ROOM_TYPE_COLORS[room.roomType] ?? ACCENT;
                const status = deriveStatus(pct);
                return (
                  <tr key={room.id} className="border-b border-default transition-colors hover:bg-card-hover">
                    <td className="px-4 py-2 text-[13px] font-medium text-text-default">{room.name}</td>
                    <td className="px-4 py-2">
                      <span className="rounded-full px-2 py-0.5 text-[11px] font-medium capitalize"
                        style={{ backgroundColor: color + '20', color }}>
                        {room.roomType}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-[13px] tabular-nums text-text-default">{room.capacity}</td>
                    <td className="px-4 py-2 text-[13px] tabular-nums text-text-default">{room.currentOccupancy}</td>
                    <td className="px-4 py-2 text-[13px] tabular-nums text-text-default">{room.assignedBatches}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-elevated">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: pct > 80 ? '#ef4444' : color }} />
                        </div>
                        <span className="text-[11px] tabular-nums text-text-muted">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2"><InvStatusBadge status={status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="py-12 text-center text-sm text-text-muted">No rooms found.</div>
        )}
      </div>

      {/* Add Room Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col border-l border-default bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-default px-6 py-4">
              <h3 className="text-sm font-semibold text-text-default">Add Room</h3>
              <button onClick={() => setDrawerOpen(false)} className="text-text-muted hover:text-text-default">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Room Name <span style={{ color: ACCENT }}>*</span></label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Greenhouse D" className={inputCls} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Room Type <span style={{ color: ACCENT }}>*</span></label>
                  <select value={form.roomType} onChange={e => setForm(f => ({ ...f, roomType: e.target.value }))} className={selectCls}>
                    <option value="">Select type…</option>
                    {ROOM_TYPE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Capacity <span style={{ color: ACCENT }}>*</span></label>
                  <input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} placeholder="200" className={inputCls} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 border-t border-default px-6 py-4">
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-medium text-white"
                style={{ backgroundColor: ACCENT }}
              >
                <Save size={14} />
                Save Room
              </button>
              <button onClick={() => setDrawerOpen(false)} className="flex h-9 items-center gap-1.5 rounded-lg border border-default px-4 text-xs text-text-muted hover:text-text-default">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
