'use client';

import { useState, useMemo } from 'react';
import { Plus, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStrains } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';
import type { Strain } from '@/modules/inventory/types';

const ACCENT = '#8B5CF6';
const PER_PAGE_OPTIONS = [10, 25, 50];

function StrainRow({ strain }: { strain: Strain }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(strain.name);
  const [active, setActive] = useState(strain.isActive);

  const handleSave = () => { setEditing(false); };
  const handleCancel = () => { setName(strain.name); setActive(strain.isActive); setEditing(false); };

  return (
    <tr
      className="border-b border-default transition-colors hover:bg-card-hover"
      onDoubleClick={() => setEditing(true)}
    >
      <td className="px-4 py-2">
        {editing ? (
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            className="h-7 w-full rounded border border-[#8B5CF6]/60 bg-elevated px-2 text-[13px] text-text-default focus:outline-none"
          />
        ) : (
          <span className="text-[13px] text-text-default">{name}</span>
        )}
      </td>
      <td className="px-4 py-2">
        <div className="h-8 w-8 rounded-full border border-default bg-elevated" />
      </td>
      <td className="px-4 py-2">
        {editing ? (
          <button
            onClick={() => setActive(!active)}
            className="flex h-5 w-5 items-center justify-center rounded border"
            style={active
              ? { borderColor: ACCENT, backgroundColor: ACCENT + '30' }
              : { borderColor: 'var(--color-border-default)' }}
          >
            {active && <Check size={10} style={{ color: ACCENT }} />}
          </button>
        ) : (
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={
              active
                ? { backgroundColor: '#22c55e20', color: '#22c55e' }
                : { backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)' }
            }
          >
            {active ? 'Active' : 'Inactive'}
          </span>
        )}
      </td>
      <td className="px-4 py-2 text-right">
        {editing ? (
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="rounded px-2 py-1 text-[11px] font-medium"
              style={{ backgroundColor: ACCENT + '20', color: ACCENT }}
            >
              <Check size={13} />
            </button>
            <button
              onClick={handleCancel}
              className="rounded px-2 py-1 text-[11px] text-text-muted hover:text-text-default"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-[11px] text-text-muted opacity-0 hover:text-text-default group-hover:opacity-100"
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  );
}

export function StrainsTab() {
  const { data: strains, isLoading } = useStrains();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  const total = strains?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const paged = useMemo(() => {
    const start = (page - 1) * perPage;
    return (strains ?? []).slice(start, start + perPage);
  }, [strains, page, perPage]);

  if (isLoading) return <LoadingSkeleton variant="table" />;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-muted">
          {total} strains · Double-click a row to edit inline
        </p>
        <button
          onClick={() => setShowAdd(true)}
          className="flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] font-medium bg-transparent hover:bg-card"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          <Plus size={13} />
          Add Strain
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-default">
              {['Strain Name', 'Image', 'Is Active', ''].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {showAdd && (
              <tr className="border-b border-[#8B5CF6]/20 bg-[#8B5CF6]/5">
                <td className="px-4 py-2">
                  <input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Strain name…"
                    autoFocus
                    className="h-7 w-full rounded border border-[#8B5CF6]/60 bg-elevated px-2 text-[13px] text-text-default placeholder:text-text-muted focus:outline-none"
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="h-8 w-8 rounded-full border border-dashed border-[#8B5CF6]/40" />
                </td>
                <td className="px-4 py-2 text-[13px] text-text-muted">Active</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setShowAdd(false); setNewName(''); }}
                      className="rounded px-2 py-1 text-[11px]"
                      style={{ backgroundColor: ACCENT + '20', color: ACCENT }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setShowAdd(false); setNewName(''); }}
                      className="text-[11px] text-text-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {paged.map(strain => (
              <StrainRow key={strain.id} strain={strain} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination bar */}
      <div className="flex items-center justify-between rounded-lg border border-default bg-card px-4 py-2">
        <span className="text-[13px] text-text-muted">
          Showing {Math.min((page - 1) * perPage + 1, total)}-{Math.min(page * perPage, total)} of {total}
        </span>
        <div className="flex items-center gap-3">
          <select
            value={perPage}
            onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="h-7 appearance-none rounded border border-default bg-elevated px-2 text-[13px] text-text-default focus:border-[#8B5CF6] focus:outline-none"
          >
            {PER_PAGE_OPTIONS.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-7 items-center gap-1 rounded border border-default px-2 text-[13px] text-text-muted transition-colors hover:text-text-default disabled:opacity-40"
            >
              <ChevronLeft size={13} />
              Prev
            </button>
            <span className="px-2 text-[13px] text-text-default">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-7 items-center gap-1 rounded border border-default px-2 text-[13px] text-text-muted transition-colors hover:text-text-default disabled:opacity-40"
            >
              Next
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
