'use client';

import { useState } from 'react';
import { TimelineView, DrawerPanel, LoadingSkeleton } from '@/components';
import { useInteractions } from '../../../hooks';
import {
  Phone,
  Mail,
  MessageSquare,
  Users,
  StickyNote,
  Bot,
  Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface InteractionsTabProps {
  accountId: string;
}

const CHANNEL_ICONS: Record<string, LucideIcon> = {
  phone: Phone,
  email: Mail,
  sms: MessageSquare,
  whatsapp: MessageSquare,
  meeting: Users,
  note: StickyNote,
  agent: Bot,
};

const SENTIMENT_COLORS: Record<string, string> = {
  positive: '#00E5A0',
  neutral: 'var(--text-text-muted)',
  negative: '#FB7185',
};

export function InteractionsTab({ accountId }: InteractionsTabProps) {
  const { data: interactions, isLoading } = useInteractions(accountId);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (isLoading) return <LoadingSkeleton variant="list" count={5} />;

  const items = (interactions || []).map((ix) => ({
    id: ix.id,
    timestamp: ix.timestamp,
    icon: CHANNEL_ICONS[ix.channel] || MessageSquare,
    iconColor: ix.sentiment ? SENTIMENT_COLORS[ix.sentiment] : undefined,
    title: ix.subject,
    description: ix.summary,
    user: ix.userId,
    channel: ix.channel,
  }));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#5BB8E6] px-3 py-1.5 text-sm font-medium text-black transition-colors hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Log Interaction
        </button>
      </div>

      <div className="rounded-xl border border-default bg-card p-4">
        <TimelineView items={items} />
      </div>

      <DrawerPanel
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Log Interaction"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-text-muted">Channel</label>
            <select className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default focus:border-hover focus:outline-none">
              <option>Phone</option>
              <option>Email</option>
              <option>SMS</option>
              <option>Meeting</option>
              <option>Note</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-text-muted">Summary</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none"
              placeholder="What was discussed..."
            />
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="rounded-lg bg-[#5BB8E6] px-4 py-2 text-sm font-medium text-black"
          >
            Save
          </button>
        </div>
      </DrawerPanel>
    </div>
  );
}
