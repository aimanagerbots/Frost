'use client';

import Link from 'next/link';
import { MessageSquare, Mail, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth } from '@/modules/portal/shared/hooks';
import { PortalCard } from '@/modules/portal/shared/components';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function DashboardRepCard() {
  const { currentAccount } = usePortalAuth();

  if (!currentAccount) return null;

  const rep = currentAccount.assignedRep;

  return (
    <PortalCard padding="sm" className="flex flex-col">
      <h3 className="px-2 pb-3 pt-1 font-display text-sm font-semibold text-text-bright">
        Your Sales Rep
      </h3>

      <div className="flex items-start gap-4 px-2">
        {/* Avatar */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-primary/15">
          <span className="font-display text-sm font-bold text-accent-primary">
            {getInitials(rep.name)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-bright">{rep.name}</p>
          <p className="text-xs text-text-muted">{rep.title}</p>

          <div className="mt-2 flex flex-col gap-1">
            <a
              href={`mailto:${rep.email}`}
              className="flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-accent-primary"
            >
              <Mail className="h-3 w-3" />
              {rep.email}
            </a>
            <a
              href={`tel:${rep.phone}`}
              className="flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-accent-primary"
            >
              <Phone className="h-3 w-3" />
              {rep.phone}
            </a>
          </div>
        </div>
      </div>

      <Link
        href="/messages"
        className={cn(
          'mx-2 mt-4 flex items-center justify-center gap-2 rounded-lg px-4 py-2',
          'bg-accent-primary/15 text-sm font-medium text-accent-primary',
          'transition-colors hover:bg-accent-primary/25'
        )}
      >
        <MessageSquare className="h-4 w-4" />
        Message
      </Link>
    </PortalCard>
  );
}
