'use client';

import Link from 'next/link';
import { Mail, Phone, MessageSquare, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth } from '@/modules/portal/shared/hooks';

interface SupportRepCardProps {
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function SupportRepCard({ className }: SupportRepCardProps) {
  const { currentAccount } = usePortalAuth();

  if (!currentAccount) return null;

  const rep = currentAccount.assignedRep;

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="font-display text-sm font-semibold text-text-bright">
        Your Sales Rep
      </h2>

      <div className="rounded-xl border border-border-default bg-card p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-primary/15">
            <span className="font-display text-base font-bold text-accent-primary">
              {getInitials(rep.name)}
            </span>
            {/* Online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-green-500" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-bright">{rep.name}</p>
            <p className="text-xs text-text-muted">{rep.title}</p>

            <div className="mt-3 flex flex-col gap-1.5">
              <a
                href={`mailto:${rep.email}`}
                className="flex items-center gap-2 text-xs text-text-muted transition-colors hover:text-accent-primary"
              >
                <Mail className="h-3.5 w-3.5" />
                {rep.email}
              </a>
              <a
                href={`tel:${rep.phone}`}
                className="flex items-center gap-2 text-xs text-text-muted transition-colors hover:text-accent-primary"
              >
                <Phone className="h-3.5 w-3.5" />
                {rep.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex gap-2">
          <Link
            href="/messages"
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2',
              'bg-accent-primary/15 text-sm font-medium text-accent-primary',
              'transition-colors hover:bg-accent-primary/25'
            )}
          >
            <MessageSquare className="h-4 w-4" />
            Send Message
          </Link>
          <button
            type="button"
            disabled
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2',
              'bg-elevated text-sm font-medium text-text-muted cursor-not-allowed'
            )}
          >
            <CalendarClock className="h-4 w-4" />
            Schedule Call
          </button>
        </div>
      </div>
    </div>
  );
}
