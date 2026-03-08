'use client';

import { useState, useMemo } from 'react';
import { MetricCard, TimelineView } from '@/components';
import { useInteractions } from '../../hooks/useInteractions';
import { useAccounts } from '../../hooks/useAccounts';
import { useSalesReps } from '../../hooks/useSalesReps';
import { InteractionComposer } from './InteractionComposer';
import {
  Mail, Phone, MessageSquare, Users, Bot,
  Plus, Filter,
} from 'lucide-react';
import type { Interaction } from '../../types';
import type { LucideIcon } from 'lucide-react';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


const CHANNEL_ICONS: Record<Interaction['channel'], LucideIcon> = {
  email: Mail,
  phone: Phone,
  sms: MessageSquare,
  whatsapp: MessageSquare,
  meeting: Users,
  note: Mail,
  agent: Bot,
};

const CHANNEL_COLORS: Record<Interaction['channel'], string> = {
  email: '#5BB8E6',
  phone: '#5BB8E6',
  sms: '#5BB8E6',
  whatsapp: '#5BB8E6',
  meeting: '#5BB8E6',
  note: '#5BB8E6',
  agent: '#5BB8E6',
};

const ALL_CHANNELS: Interaction['channel'][] = ['email', 'phone', 'sms', 'meeting', 'whatsapp', 'note', 'agent'];
const DIRECTIONS = ['all', 'inbound', 'outbound'] as const;

export function InteractionsHub() {
  const { data: interactions, isLoading } = useInteractions();
  const { data: accounts } = useAccounts();
  const { data: reps } = useSalesReps();

  const [composerOpen, setComposerOpen] = useState(false);
  const [channelFilter, setChannelFilter] = useState<Set<Interaction['channel']>>(new Set());
  const [directionFilter, setDirectionFilter] = useState<typeof DIRECTIONS[number]>('all');
  const [accountFilter, setAccountFilter] = useState('');
  const [repFilter, setRepFilter] = useState('');
  const [localInteractions, setLocalInteractions] = useState<Partial<Interaction>[]>([]);

  const allInteractions = useMemo(() => {
    const base = interactions ?? [];
    const local = localInteractions.map((li, i) => ({
      id: `local-${i}`,
      accountId: li.accountId ?? '',
      contactId: li.contactId ?? null,
      channel: li.channel ?? 'note' as Interaction['channel'],
      direction: li.direction ?? 'outbound' as Interaction['direction'],
      subject: li.subject ?? '',
      summary: li.summary ?? '',
      content: li.content ?? '',
      userId: li.userId ?? 'rep-jake',
      agentId: li.agentId ?? null,
      timestamp: li.timestamp ?? new Date().toISOString(),
      sentiment: li.sentiment ?? null,
    }));
    return [...local, ...base];
  }, [interactions, localInteractions]);

  const filtered = useMemo(() => {
    return allInteractions.filter((int) => {
      if (channelFilter.size > 0 && !channelFilter.has(int.channel)) return false;
      if (directionFilter !== 'all' && int.direction !== directionFilter) return false;
      if (accountFilter && int.accountId !== accountFilter) return false;
      if (repFilter && int.userId !== repFilter) return false;
      return true;
    });
  }, [allInteractions, channelFilter, directionFilter, accountFilter, repFilter]);

  // Metrics
  const thisMonth = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return allInteractions.filter((i) => new Date(i.timestamp) >= start);
  }, [allInteractions]);

  const emailCount = thisMonth.filter((i) => i.channel === 'email').length;
  const callCount = thisMonth.filter((i) => i.channel === 'phone').length;
  const meetingCount = thisMonth.filter((i) => i.channel === 'meeting').length;
  const agentCount = thisMonth.filter((i) => i.channel === 'agent').length;

  const accountMap = useMemo(() => {
    const map: Record<string, string> = {};
    accounts?.forEach((a) => { map[a.id] = a.name; });
    return map;
  }, [accounts]);

  const repMap = useMemo(() => {
    const map: Record<string, string> = {};
    reps?.forEach((r) => { map[r.id] = r.name; });
    return map;
  }, [reps]);

  const timelineItems = filtered.map((int) => ({
    id: int.id,
    timestamp: int.timestamp,
    icon: CHANNEL_ICONS[int.channel],
    iconColor: CHANNEL_COLORS[int.channel],
    title: `${accountMap[int.accountId] || int.accountId} — ${int.subject}`,
    description: `${int.summary}${int.sentiment ? ` [${int.sentiment}]` : ''}`,
    user: repMap[int.userId] || int.userId,
    channel: `${int.channel} · ${int.direction}`,
  }));

  function toggleChannel(ch: Interaction['channel']) {
    setChannelFilter((prev) => {
      const next = new Set(prev);
      if (next.has(ch)) next.delete(ch);
      else next.add(ch);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="Total Interactions (Month)" value={thisMonth.length} accentColor={CRM_ACCENT} />
        <MetricCard label="Emails Sent" value={emailCount} accentColor="#5BB8E6" />
        <MetricCard label="Calls Made" value={callCount} accentColor="#5BB8E6" />
        <MetricCard label="Meetings Held" value={meetingCount} accentColor="#5BB8E6" />
        <MetricCard label="AI Agent Actions" value={agentCount} accentColor="#5BB8E6" />
      </div>

      {/* Filter bar + action */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-default bg-card p-4">
        <Filter className="h-4 w-4 text-text-muted" />

        {/* Channel multi-select */}
        <div className="flex flex-wrap gap-1.5">
          {ALL_CHANNELS.map((ch) => (
            <button
              key={ch}
              onClick={() => toggleChannel(ch)}
              className={`rounded-md px-2 py-1 text-xs capitalize transition-colors ${
                channelFilter.size === 0 || channelFilter.has(ch)
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-elevated text-text-muted hover:text-text-default'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-default" />

        {/* Direction */}
        <div className="flex gap-1.5">
          {DIRECTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDirectionFilter(d)}
              className={`rounded-md px-2 py-1 text-xs capitalize transition-colors ${
                directionFilter === d
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-elevated text-text-muted hover:text-text-default'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-default" />

        {/* Account filter */}
        <select
          value={accountFilter}
          onChange={(e) => setAccountFilter(e.target.value)}
          className="rounded-lg border border-default bg-base px-2 py-1 text-xs text-text-default focus:outline-none"
        >
          <option value="">All Accounts</option>
          {accounts?.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        {/* Rep filter */}
        <select
          value={repFilter}
          onChange={(e) => setRepFilter(e.target.value)}
          className="rounded-lg border border-default bg-base px-2 py-1 text-xs text-text-default focus:outline-none"
        >
          <option value="">All Reps</option>
          {reps?.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        <div className="flex-1" />

        <button
          onClick={() => setComposerOpen(true)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: CRM_ACCENT }}
        >
          <Plus className="h-4 w-4" />
          Log Interaction
        </button>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-default bg-card p-4">
        <h3 className="mb-4 text-sm font-medium text-text-bright">
          Activity Timeline
          <span className="ml-2 text-xs text-text-muted">({filtered.length} interactions)</span>
        </h3>
        <TimelineView items={timelineItems} loading={isLoading} />
      </div>

      {/* Composer drawer */}
      <InteractionComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSave={(int) => setLocalInteractions((prev) => [...prev, int])}
      />
    </div>
  );
}
