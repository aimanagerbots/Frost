'use client';

import { useState, useCallback } from 'react';
import {
  BookOpen,
  Search,
  MessageSquare,
  Users,
  Clock,
  Hash,
  ChevronDown,
  ChevronRight,
  Send,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SectionHeader,
  StatusBadge,
  DrawerPanel,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from '@/components';
import { useKnowledgeBase, useCouncilSessions } from '../hooks';
import type { KnowledgeEntry, CouncilSession } from '../types';

const ACCENT = '#6366F1';

const CATEGORY_TABS = [
  { key: 'all', label: 'All' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'cultivation-sop', label: 'Cultivation SOPs' },
  { key: 'extraction-sop', label: 'Extraction SOPs' },
  { key: 'sales-playbook', label: 'Sales Playbooks' },
  { key: 'company-info', label: 'Company' },
  { key: 'hr-policy', label: 'HR Policy' },
] as const;

const CATEGORY_COLORS: Record<string, 'info' | 'success' | 'warning' | 'danger' | 'muted' | 'default'> = {
  'compliance': 'danger',
  'cultivation-sop': 'success',
  'extraction-sop': 'warning',
  'sales-playbook': 'info',
  'company-info': 'muted',
  'hr-policy': 'default',
};

const CATEGORY_LABELS: Record<string, string> = {
  'compliance': 'Compliance',
  'cultivation-sop': 'Cultivation SOP',
  'extraction-sop': 'Extraction SOP',
  'sales-playbook': 'Sales Playbook',
  'company-info': 'Company',
  'hr-policy': 'HR Policy',
};

const AGENT_COLORS: Record<string, string> = {
  Sales: '#F59E0B',
  Manufacturing: '#10B981',
  Compliance: '#EF4444',
  Analytics: '#06B6D4',
  Cultivation: '#22C55E',
};

function KnowledgeCard({
  entry,
  onClick,
}: {
  entry: KnowledgeEntry;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-default bg-card p-4 text-left transition-all duration-200 hover:bg-card-hover hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-text-bright line-clamp-2">
          {entry.title}
        </h3>
        <StatusBadge
          label={CATEGORY_LABELS[entry.category] ?? entry.category}
          variant={CATEGORY_COLORS[entry.category] ?? 'default'}
          size="sm"
        />
      </div>
      <p className="mt-2 text-xs text-text-default line-clamp-2">
        {entry.content.split('\n')[0]}
      </p>
      <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{new Date(entry.lastUpdated).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Hash className="h-3 w-3" />
          <span>{entry.referencedCount} references</span>
        </div>
      </div>
    </button>
  );
}

function SessionCard({
  session,
  isExpanded,
  onToggle,
}: {
  session: CouncilSession;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-default bg-card transition-all duration-200">
      <button
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left hover:bg-card-hover rounded-xl"
      >
        <div className="mt-0.5 shrink-0">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-text-muted" />
          ) : (
            <ChevronRight className="h-4 w-4 text-text-muted" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-text-bright">{session.question}</h3>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex -space-x-1">
              {session.agents.map((agent) => (
                <span
                  key={agent.name}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold text-white"
                  style={{ backgroundColor: AGENT_COLORS[agent.name] ?? '#6366F1' }}
                  title={agent.name}
                >
                  {agent.name[0]}
                </span>
              ))}
            </div>
            <span className="text-xs text-text-muted">
              {session.agents.length} agents
            </span>
            <span className="text-xs text-text-muted">
              {new Date(session.timestamp).toLocaleDateString()}
            </span>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-default px-4 pb-4 pt-3 space-y-3">
          {session.agents.map((agent) => (
            <div
              key={agent.name}
              className="rounded-lg border border-default bg-elevated p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                  style={{ backgroundColor: AGENT_COLORS[agent.name] ?? '#6366F1' }}
                >
                  {agent.name[0]}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: AGENT_COLORS[agent.name] ?? '#6366F1' }}
                >
                  {agent.name}
                </span>
              </div>
              <p className="text-sm text-text-default leading-relaxed">
                {agent.perspective}
              </p>
            </div>
          ))}

          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: `${ACCENT}15`, borderLeft: `3px solid ${ACCENT}` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4" style={{ color: ACCENT }} />
              <span className="text-sm font-semibold text-text-bright">
                Synthesis
              </span>
            </div>
            <p className="text-sm text-text-default leading-relaxed">
              {session.synthesis}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function CouncilPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
  const [councilInput, setCouncilInput] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoSessionId, setDemoSessionId] = useState<string | null>(null);

  const { data: entries, isLoading: entriesLoading, error: entriesError, refetch: refetchEntries } = useKnowledgeBase(
    activeCategory === 'all' ? undefined : activeCategory
  );
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError, refetch: refetchSessions } = useCouncilSessions();

  const toggleSession = useCallback((id: string) => {
    setExpandedSessions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleAskCouncil = useCallback(() => {
    if (!councilInput.trim() || !sessions?.length) return;
    setDemoLoading(true);
    setTimeout(() => {
      setDemoLoading(false);
      const firstSession = sessions[0];
      setDemoSessionId(firstSession.id);
      setExpandedSessions((prev) => new Set(prev).add(firstSession.id));
      setCouncilInput('');
    }, 2000);
  }, [councilInput, sessions]);

  const error = entriesError || sessionsError;

  if (error) {
    return (
      <ErrorState
        title="Failed to load council data"
        message={error.message}
        onRetry={() => { refetchEntries(); refetchSessions(); }}
      />
    );
  }

  if (!entriesLoading && !sessionsLoading && !entries?.length && !sessions?.length) {
    return (
      <div className="space-y-6">
        <SectionHeader
          icon={BookOpen}
          title="Council"
          subtitle="AI-powered knowledge base and multi-agent decision engine"
          accentColor={ACCENT}
        />
        <EmptyState
          icon={BookOpen}
          title="No knowledge entries or sessions"
          description="The knowledge base is empty and no council sessions have been recorded yet."
          accentColor={ACCENT}
        />
      </div>
    );
  }

  // Client-side search filter
  const filteredEntries = (entries ?? []).filter((entry) => {
    if (!searchQuery) return true;
    const lower = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(lower) ||
      entry.content.toLowerCase().includes(lower)
    );
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={BookOpen}
        title="Council"
        subtitle="AI-powered knowledge base and multi-agent decision engine"
        accentColor={ACCENT}
      />

      {/* Knowledge Base Section */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-bright">
          <BookOpen className="h-4 w-4" style={{ color: ACCENT }} />
          Knowledge Base
        </h2>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                activeCategory === tab.key
                  ? 'text-white'
                  : 'bg-elevated text-text-muted hover:text-text-default'
              )}
              style={
                activeCategory === tab.key
                  ? { backgroundColor: ACCENT }
                  : undefined
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-default bg-elevated py-2 pl-9 pr-3 text-sm text-text-default placeholder:text-text-muted focus:border-[#6366F1] focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
          />
        </div>

        {/* Entries Grid */}
        {entriesLoading ? (
          <LoadingSkeleton variant="card" count={6} />
        ) : filteredEntries.length === 0 ? (
          <div className="rounded-xl border border-default bg-card p-8 text-center">
            <p className="text-sm text-text-muted">No entries found</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredEntries.map((entry) => (
              <KnowledgeCard
                key={entry.id}
                entry={entry}
                onClick={() => setSelectedEntry(entry)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Council Sessions Section */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-bright">
          <MessageSquare className="h-4 w-4" style={{ color: ACCENT }} />
          Council Sessions
        </h2>

        {/* Ask the Council Input */}
        <div className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ask the Council a question..."
              value={councilInput}
              onChange={(e) => setCouncilInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAskCouncil();
              }}
              className="w-full rounded-lg border border-default bg-elevated py-2.5 pl-4 pr-3 text-sm text-text-default placeholder:text-text-muted focus:border-[#6366F1] focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
            />
          </div>
          <button
            onClick={handleAskCouncil}
            disabled={!councilInput.trim() || demoLoading}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: ACCENT }}
          >
            {demoLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Ask
          </button>
        </div>

        {demoLoading && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-default bg-card p-3">
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: ACCENT }} />
            <span className="text-sm text-text-muted">
              Council agents are deliberating...
            </span>
          </div>
        )}

        {demoSessionId && !demoLoading && (
          <div className="mb-4 rounded-lg border p-3 text-sm text-text-default" style={{ borderColor: ACCENT, backgroundColor: `${ACCENT}10` }}>
            Demo: Showing the most recent council session as an example response.
          </div>
        )}

        {/* Sessions List */}
        {sessionsLoading ? (
          <LoadingSkeleton variant="list" />
        ) : (
          <div className="space-y-3">
            {(sessions ?? []).map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isExpanded={expandedSessions.has(session.id)}
                onToggle={() => toggleSession(session.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Knowledge Entry Drawer */}
      <DrawerPanel
        open={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        title={selectedEntry?.title ?? ''}
        width="lg"
      >
        {selectedEntry && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <StatusBadge
                label={CATEGORY_LABELS[selectedEntry.category] ?? selectedEntry.category}
                variant={CATEGORY_COLORS[selectedEntry.category] ?? 'default'}
              />
            </div>

            <div className="space-y-3">
              {selectedEntry.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-sm text-text-default leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="border-t border-default pt-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Last updated: {new Date(selectedEntry.lastUpdated).toLocaleDateString()}</span>
                <span>Updated by: {selectedEntry.updatedBy}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <Hash className="h-3 w-3" />
                <span>Referenced {selectedEntry.referencedCount} times</span>
              </div>
            </div>
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
