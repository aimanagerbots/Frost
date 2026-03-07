'use client';

import { useState, useMemo } from 'react';
import { FileText, Download, Share2, FileSearch } from 'lucide-react';
import {
  SectionHeader,
  MetricCard,
  DataTable,
  StatusBadge,
  DrawerPanel,
  LoadingSkeleton,
} from '@/components';
import { useDocuments } from '../hooks';
import type { DocType, Document } from '../types';

const ACCENT = '#64748B';

const TYPE_FILTERS: { key: DocType | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'sop', label: 'SOP' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'contract', label: 'Contract' },
  { key: 'product-spec', label: 'Product Spec' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'financial', label: 'Financial' },
  { key: 'other', label: 'Other' },
];

const typeVariant = (t: DocType): 'info' | 'warning' | 'default' | 'success' | 'danger' | 'muted' => {
  const map: Record<DocType, 'info' | 'warning' | 'default' | 'success' | 'danger' | 'muted'> = {
    sop: 'info',
    compliance: 'warning',
    contract: 'default',
    'product-spec': 'success',
    marketing: 'danger',
    financial: 'muted',
    other: 'muted',
  };
  return map[t];
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTypeLabel(t: DocType): string {
  const map: Record<DocType, string> = {
    sop: 'SOP',
    compliance: 'Compliance',
    contract: 'Contract',
    'product-spec': 'Product Spec',
    marketing: 'Marketing',
    financial: 'Financial',
    other: 'Other',
  };
  return map[t];
}

export function DocsPage() {
  const [typeFilter, setTypeFilter] = useState<DocType | 'all'>('all');
  const [selected, setSelected] = useState<Document | null>(null);

  const filters = useMemo(
    () => (typeFilter === 'all' ? undefined : { type: typeFilter as DocType }),
    [typeFilter]
  );

  const { data: documents, isLoading } = useDocuments(filters);
  const { data: allDocs } = useDocuments();

  const sopCount = useMemo(
    () => allDocs?.filter((d) => d.type === 'sop').length ?? 0,
    [allDocs]
  );

  const recentCount = useMemo(() => {
    if (!allDocs) return 0;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return allDocs.filter((d) => new Date(d.uploadedAt) >= oneWeekAgo).length;
  }, [allDocs]);

  if (isLoading && !documents) return <LoadingSkeleton variant="card" count={3} />;

  const columns = [
    {
      header: 'Name',
      accessor: 'name' as const,
      sortable: true,
      render: (row: Document) => (
        <span className="font-medium text-text-bright">{row.name}</span>
      ),
    },
    {
      header: 'Type',
      accessor: 'type' as const,
      sortable: true,
      render: (row: Document) => (
        <StatusBadge label={formatTypeLabel(row.type)} variant={typeVariant(row.type)} size="sm" />
      ),
    },
    {
      header: 'Category',
      accessor: 'category' as const,
      sortable: true,
    },
    {
      header: 'Uploaded By',
      accessor: 'uploadedBy' as const,
      sortable: true,
    },
    {
      header: 'Date',
      accessor: 'uploadedAt' as const,
      sortable: true,
      render: (row: Document) => (
        <span className="text-text-muted">{formatDate(row.uploadedAt)}</span>
      ),
    },
    {
      header: 'Size',
      accessor: 'size' as const,
      sortable: true,
      render: (row: Document) => (
        <span className="text-text-muted">{formatFileSize(row.size)}</span>
      ),
    },
    {
      header: 'Version',
      accessor: 'version' as const,
      sortable: true,
      render: (row: Document) => (
        <span className="font-mono text-xs text-text-muted">v{row.version}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader icon={FileText} title="Documents" accentColor={ACCENT} />

      {/* Metrics */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <MetricCard label="Total Documents" value={allDocs?.length ?? 0} accentColor={ACCENT} />
        <MetricCard label="SOPs" value={sopCount} accentColor={ACCENT} />
        <MetricCard label="Updated This Week" value={recentCount} accentColor={ACCENT} />
      </div>

      {/* Type Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => {
          const isActive = typeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
              style={{
                backgroundColor: isActive ? `${ACCENT}20` : 'var(--bg-elevated)',
                color: isActive ? ACCENT : 'var(--text-text-muted)',
                border: `1px solid ${isActive ? ACCENT : 'var(--border-default)'}`,
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Data Table */}
      <DataTable
        data={documents ?? []}
        columns={columns}
        searchable
        searchPlaceholder="Search documents by name, tag, or description..."
        onRowClick={(row) => setSelected(row)}
        loading={isLoading}
        emptyState={{
          icon: FileSearch,
          title: 'No documents found',
          description: typeFilter !== 'all'
            ? `No documents of type "${typeFilter}"`
            : 'No documents match your search',
          accentColor: ACCENT,
        }}
      />

      {/* Detail Drawer */}
      <DrawerPanel
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
        width="md"
        footer={
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors bg-elevated text-text-default hover:bg-card-hover">
              <Download className="h-4 w-4" />
              Download
            </button>
            <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors bg-elevated text-text-default hover:bg-card-hover">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        }
      >
        {selected && (
          <div className="space-y-6">
            {/* Type Badge */}
            <StatusBadge label={formatTypeLabel(selected.type)} variant={typeVariant(selected.type)} />

            {/* Description */}
            {selected.description && (
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-2">Description</h4>
                <p className="text-sm text-text-default leading-relaxed">{selected.description}</p>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">Uploaded By</h4>
                <p className="text-sm text-text-default">{selected.uploadedBy}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">Date</h4>
                <p className="text-sm text-text-default">{formatDate(selected.uploadedAt)}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">File Size</h4>
                <p className="text-sm text-text-default">{formatFileSize(selected.size)}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">Version</h4>
                <p className="text-sm text-text-default">v{selected.version}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-1">Category</h4>
                <p className="text-sm text-text-default">{selected.category}</p>
              </div>
            </div>

            {/* Tags */}
            {selected.tags.length > 0 && (
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selected.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-elevated px-2.5 py-0.5 text-xs font-medium text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Linked Module */}
            {selected.linkedModule && (
              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-text-muted mb-2">Linked Module</h4>
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                  style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}
                >
                  {selected.linkedModule}
                </span>
              </div>
            )}
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
