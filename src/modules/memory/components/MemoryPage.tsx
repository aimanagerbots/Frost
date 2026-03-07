'use client';

import { useState, useMemo } from 'react';
import {
  Brain,
  Search,
  CheckCircle,
  Database,
  FileSearch,
  Shield,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { SectionHeader, StatusBadge, LoadingSkeleton, DrawerPanel, ErrorState, EmptyState } from '@/components';
import { useMemoryFacts } from '../hooks/useMemoryFacts';
import { useMemoryPatterns } from '../hooks/useMemoryPatterns';
import { useMemoryLayers } from '../hooks/useMemoryLayers';
import type { MemoryFact, MemoryPattern } from '../types';

const MEMORY_ACCENT = '#8B5CF6';

const CATEGORY_LABELS: Record<string, string> = {
  account: 'Account',
  product: 'Product',
  process: 'Process',
  market: 'Market',
  team: 'Team',
  compliance: 'Compliance',
};

const CATEGORY_VARIANT: Record<string, 'info' | 'warning' | 'success' | 'danger' | 'muted'> = {
  account: 'info',
  product: 'success',
  process: 'warning',
  market: 'info',
  team: 'muted',
  compliance: 'danger',
};

const LAYER_ICONS: Record<string, typeof Brain> = {
  'system-identity': Shield,
  'structured-facts': Database,
  'semantic-search': FileSearch,
};

function confidenceColor(c: number): string {
  if (c >= 80) return 'bg-emerald-500';
  if (c >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

function confidenceTextColor(c: number): string {
  if (c >= 80) return 'text-emerald-400';
  if (c >= 60) return 'text-amber-400';
  return 'text-red-400';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function MemoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedFact, setSelectedFact] = useState<MemoryFact | null>(null);
  const [expandedPatterns, setExpandedPatterns] = useState<Set<string>>(new Set());

  const { data: layers, isLoading: layersLoading, error: layersError, refetch: refetchLayers } = useMemoryLayers();
  const { data: allFacts, isLoading: factsLoading, error: factsError, refetch: refetchFacts } = useMemoryFacts();
  const { data: patterns, isLoading: patternsLoading, error: patternsError, refetch: refetchPatterns } = useMemoryPatterns();

  const filteredFacts = useMemo(() => {
    if (!allFacts) return [];
    let result = [...allFacts];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.content.toLowerCase().includes(q) ||
          f.source.toLowerCase().includes(q) ||
          f.sourceModule.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) {
      result = result.filter((f) => f.category === categoryFilter);
    }
    if (verifiedOnly) {
      result = result.filter((f) => f.verified);
    }
    return result;
  }, [allFacts, searchQuery, categoryFilter, verifiedOnly]);

  const togglePattern = (id: string) => {
    setExpandedPatterns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isLoading = layersLoading || factsLoading || patternsLoading;
  const error = layersError || factsError || patternsError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          icon={Brain}
          title="Memory"
          subtitle="AI knowledge base and learned patterns"
          accentColor={MEMORY_ACCENT}
        />
        <LoadingSkeleton variant="card" count={3} />
        <LoadingSkeleton variant="list" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load memory data"
        message={error.message}
        onRetry={() => { refetchLayers(); refetchFacts(); refetchPatterns(); }}
      />
    );
  }

  if (!allFacts?.length && !layers?.length && !patterns?.length) {
    return (
      <div className="space-y-6">
        <SectionHeader
          icon={Brain}
          title="Memory"
          subtitle="AI knowledge base and learned patterns"
          accentColor={MEMORY_ACCENT}
        />
        <EmptyState
          icon={Brain}
          title="No memories yet"
          description="The AI hasn't learned any facts or patterns yet. Data will appear as the system processes information."
          accentColor={MEMORY_ACCENT}
        />
      </div>
    );
  }

  const totalFacts = allFacts?.length ?? 0;
  const verifiedCount = allFacts?.filter((f) => f.verified).length ?? 0;
  const avgConfidence = totalFacts
    ? Math.round((allFacts?.reduce((s, f) => s + f.confidence, 0) ?? 0) / totalFacts)
    : 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Brain}
        title="Memory"
        subtitle="AI knowledge base and learned patterns"
        accentColor={MEMORY_ACCENT}
        stats={[
          { label: 'Total Facts', value: totalFacts.toString() },
          { label: 'Verified', value: verifiedCount.toString() },
          { label: 'Avg Confidence', value: `${avgConfidence}%` },
          { label: 'Patterns', value: (patterns?.length ?? 0).toString() },
        ]}
      />

      {/* Memory Layers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {layers?.map((layer) => {
          const LayerIcon = LAYER_ICONS[layer.name] ?? Database;
          return (
            <div
              key={layer.name}
              className="rounded-xl border border-default bg-card p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayerIcon size={18} style={{ color: MEMORY_ACCENT }} />
                  <h3 className="text-sm font-semibold text-text-bright">{layer.displayName}</h3>
                </div>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-text-muted">Active</span>
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{layer.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-default">
                  {layer.factCount.toLocaleString()} {layer.name === 'semantic-search' ? 'chunks' : 'facts'}
                </span>
                <span className="text-text-muted">Updated {formatDate(layer.lastUpdated)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search what the AI knows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-default bg-card py-2 pl-9 pr-4 text-sm text-text-default placeholder:text-text-muted focus:outline-none focus:ring-1"
            style={{ '--tw-ring-color': MEMORY_ACCENT } as React.CSSProperties}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-default bg-card px-3 py-1.5 text-xs text-text-default focus:outline-none"
          >
            <option value="">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded border-default"
            />
            Verified only
          </label>
          <span className="text-xs text-text-muted ml-auto">
            {filteredFacts.length} fact{filteredFacts.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* Facts Browser */}
      <div>
        <h2 className="text-lg font-semibold text-text-bright mb-3">Facts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filteredFacts.map((fact) => (
            <button
              key={fact.id}
              onClick={() => setSelectedFact(fact)}
              className="rounded-xl border border-default bg-card p-4 text-left hover:border-[var(--memory-accent)] transition-colors space-y-2"
              style={{ '--memory-accent': MEMORY_ACCENT } as React.CSSProperties}
            >
              <p className="text-sm text-text-default leading-relaxed">{fact.content}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge
                  label={CATEGORY_LABELS[fact.category]}
                  variant={CATEGORY_VARIANT[fact.category]}
                />
                <span className={`text-xs font-medium ${confidenceTextColor(fact.confidence)}`}>
                  {fact.confidence}%
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-white/10 min-w-[60px]">
                  <div
                    className={`h-full rounded-full ${confidenceColor(fact.confidence)}`}
                    style={{ width: `${fact.confidence}%` }}
                  />
                </div>
                {fact.verified && (
                  <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>
                  {fact.source} / {fact.sourceModule}
                </span>
                <span>Learned {formatDate(fact.learnedAt)}</span>
              </div>
            </button>
          ))}
        </div>
        {filteredFacts.length === 0 && (
          <div className="rounded-xl border border-default bg-card p-8 text-center">
            <p className="text-text-muted text-sm">No facts match the current filters.</p>
          </div>
        )}
      </div>

      {/* Patterns Section */}
      <div>
        <h2 className="text-lg font-semibold text-text-bright mb-3">Discovered Patterns</h2>
        <div className="space-y-3">
          {patterns?.map((pattern: MemoryPattern) => {
            const isExpanded = expandedPatterns.has(pattern.id);
            return (
              <div
                key={pattern.id}
                className="rounded-xl border border-default bg-card p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-text-bright">{pattern.title}</h3>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">
                      {pattern.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-medium ${confidenceTextColor(pattern.confidence)}`}>
                      {pattern.confidence}%
                    </span>
                    <div className="w-16 h-1.5 rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${confidenceColor(pattern.confidence)}`}
                        style={{ width: `${pattern.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => togglePattern(pattern.id)}
                    className="flex items-center gap-1 text-xs hover:text-text-default transition-colors"
                    style={{ color: MEMORY_ACCENT }}
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    {pattern.evidence.length} evidence points
                  </button>
                  <span className="text-xs text-text-muted">
                    Discovered {formatDate(pattern.discoveredAt)}
                  </span>
                </div>
                {isExpanded && (
                  <ul className="space-y-1 pt-1 border-t border-default">
                    {pattern.evidence.map((e, i) => (
                      <li key={i} className="text-xs text-text-default flex items-start gap-2 py-1">
                        <span className="text-text-muted mt-0.5">&#8226;</span>
                        {e}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fact Detail Drawer */}
      <DrawerPanel
        open={!!selectedFact}
        onClose={() => setSelectedFact(null)}
        title="Fact Details"
      >
        {selectedFact && (
          <div className="space-y-4">
            <p className="text-sm text-text-default leading-relaxed">{selectedFact.content}</p>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-text-muted block mb-1">Category</span>
                <StatusBadge
                  label={CATEGORY_LABELS[selectedFact.category]}
                  variant={CATEGORY_VARIANT[selectedFact.category]}
                />
              </div>

              <div>
                <span className="text-xs text-text-muted block mb-1">Confidence</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${confidenceTextColor(selectedFact.confidence)}`}>
                    {selectedFact.confidence}%
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${confidenceColor(selectedFact.confidence)}`}
                      style={{ width: `${selectedFact.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-text-muted block mb-1">Source</span>
                  <span className="text-sm text-text-default">{selectedFact.source}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block mb-1">Module</span>
                  <span className="text-sm text-text-default">{selectedFact.sourceModule}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-text-muted block mb-1">Learned</span>
                  <span className="text-sm text-text-default">{formatDate(selectedFact.learnedAt)}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block mb-1">Last Referenced</span>
                  <span className="text-sm text-text-default">
                    {selectedFact.lastReferenced
                      ? formatDate(selectedFact.lastReferenced)
                      : 'Never'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-text-muted block mb-1">Verified</span>
                <div className="flex items-center gap-1.5">
                  {selectedFact.verified ? (
                    <>
                      <CheckCircle size={14} className="text-emerald-400" />
                      <span className="text-sm text-emerald-400">Verified</span>
                    </>
                  ) : (
                    <span className="text-sm text-text-muted">Unverified</span>
                  )}
                </div>
              </div>

              {selectedFact.correctedBy && (
                <div>
                  <span className="text-xs text-text-muted block mb-1">Corrected By</span>
                  <span className="text-sm text-text-default">{selectedFact.correctedBy}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
