'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trophy, Clock, Ticket } from 'lucide-react';
import type { SweepstakesEntry } from '@/types/merch';

interface SweepstakeCardProps {
  entry: SweepstakesEntry;
  userPoints: number;
}

export function SweepstakeCard({ entry, userPoints }: SweepstakeCardProps) {
  const [entries, setEntries] = useState(entry.entries);
  const canEnter = entries < entry.maxEntries && userPoints >= entry.entryCost;

  const endsAt = new Date(entry.endsAt);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      {/* Image header */}
      <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-[#5BB8E6]/10 to-purple-500/10">
        <Image
          src={entry.imageUrl}
          alt={entry.title}
          width={64}
          height={64}
          className="h-16 w-16 object-contain opacity-30"
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white/70">
          <Clock className="h-3 w-3" />
          {daysLeft}d left
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 text-sm font-bold text-white">{entry.title}</h3>
        <p className="mb-3 text-xs leading-relaxed text-white/40">{entry.description}</p>

        {/* Prize */}
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-semibold text-amber-400">{entry.prize}</span>
        </div>

        {/* Entry info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-white/40">
            <Ticket className="h-3.5 w-3.5" />
            {entries}/{entry.maxEntries} entries
          </div>
          <button
            type="button"
            disabled={!canEnter}
            onClick={() => setEntries((e) => Math.min(e + 1, entry.maxEntries))}
            className="rounded-full bg-[#5BB8E6]/15 px-4 py-1.5 text-[11px] font-semibold text-[#5BB8E6] transition-colors hover:bg-[#5BB8E6]/25 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Enter ({entry.entryCost} pts)
          </button>
        </div>
      </div>
    </div>
  );
}
