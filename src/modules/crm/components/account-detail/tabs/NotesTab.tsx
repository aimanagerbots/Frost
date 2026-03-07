'use client';

import { useState } from 'react';
import { LoadingSkeleton } from '@/components';
import { useAccountNotes } from '../../../hooks';
import { Pin } from 'lucide-react';

interface NotesTabProps {
  accountId: string;
}

export function NotesTab({ accountId }: NotesTabProps) {
  const { data: notes, isLoading } = useAccountNotes(accountId);
  const [newNote, setNewNote] = useState('');
  const [localNotes, setLocalNotes] = useState<{ id: string; content: string; author: string; createdAt: string; pinned: boolean }[]>([]);

  if (isLoading) return <LoadingSkeleton variant="list" count={3} />;

  const allNotes = [
    ...localNotes,
    ...(notes || []),
  ].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleAdd = () => {
    if (!newNote.trim()) return;
    setLocalNotes((prev) => [
      {
        id: `local-${Date.now()}`,
        content: newNote.trim(),
        author: 'You',
        createdAt: new Date().toISOString(),
        pinned: false,
      },
      ...prev,
    ]);
    setNewNote('');
  };

  return (
    <div className="space-y-4">
      {/* Add note */}
      <div className="rounded-xl border border-default bg-card p-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          rows={3}
          placeholder="Add a note..."
          className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-default placeholder:text-muted focus:border-hover focus:outline-none"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={handleAdd}
            disabled={!newNote.trim()}
            className="rounded-lg bg-[#F59E0B] px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-[#F59E0B]/90 disabled:opacity-40"
          >
            Add Note
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div className="space-y-2">
        {allNotes.map((note) => (
          <div key={note.id} className="rounded-xl border border-default bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-default whitespace-pre-wrap">{note.content}</p>
              {note.pinned && <Pin className="h-4 w-4 shrink-0 text-[#F59E0B]" />}
            </div>
            <div className="mt-2 text-xs text-muted">
              {note.author} &middot;{' '}
              {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
