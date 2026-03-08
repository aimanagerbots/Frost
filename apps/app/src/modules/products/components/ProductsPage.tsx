'use client';

import { useState } from 'react';
import { Lightbulb, Calendar, User, TrendingUp } from 'lucide-react';
import {
  SectionHeader,
  MetricCard,
  StatusBadge,
  DrawerPanel,
  LoadingSkeleton,
  ErrorState,
  EmptyState,
} from '@/components';
import { useProductConcepts, useRDMetrics } from '@/modules/products/hooks';
import type { ProductConcept, ProductCategory, ProductStage } from '@/modules/products/types';
import { ACCENT } from '@/design/colors';


const STAGES: { key: ProductStage; label: string; color: string }[] = [
  { key: 'ideation', label: 'Ideation', color: '#5BB8E6' },
  { key: 'formulation', label: 'Formulation', color: '#5BB8E6' },
  { key: 'sample', label: 'Sample', color: '#5BB8E6' },
  { key: 'testing', label: 'Testing', color: '#5BB8E6' },
  { key: 'approved', label: 'Approved', color: '#5BB8E6' },
  { key: 'launched', label: 'Launched', color: '#5BB8E6' },
];

const CATEGORY_VARIANT: Record<
  ProductCategory,
  'success' | 'warning' | 'info' | 'default' | 'danger' | 'muted'
> = {
  flower: 'success',
  preroll: 'warning',
  vaporizer: 'info',
  concentrate: 'default',
  edible: 'danger',
  beverage: 'muted',
};

export function ProductsPage() {
  const [selectedConcept, setSelectedConcept] = useState<ProductConcept | null>(null);

  const { data: concepts, isLoading: conceptsLoading, error: conceptsError, refetch: refetchConcepts } = useProductConcepts();
  const { data: metrics, isLoading: metricsLoading, error: metricsError, refetch: refetchMetrics } = useRDMetrics();

  const isLoading = conceptsLoading || metricsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton variant="text" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <LoadingSkeleton variant="card" count={4} />
        </div>
        <LoadingSkeleton variant="card" count={6} />
      </div>
    );
  }

  if (conceptsError || metricsError) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load products data"
          message={(conceptsError || metricsError)?.message}
          onRetry={() => { refetchConcepts(); refetchMetrics(); }}
        />
      </div>
    );
  }

  const conceptsByStage = (stage: ProductStage) =>
    (concepts ?? []).filter((c) => c.stage === stage);

  return (
    <div className="space-y-6 p-6">
      <SectionHeader
        icon={Lightbulb}
        title="Product Planning & R&D"
        subtitle="Concept pipeline from ideation to launch"
        accentColor={ACCENT}
      />

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard
          label="Concepts in Pipeline"
          value={metrics?.conceptsInPipeline ?? 0}
          accentColor={ACCENT}
        />
        <MetricCard
          label="Avg Time to Launch"
          value={metrics?.avgTimeToLaunch ?? '—'}
          accentColor={ACCENT}
        />
        <MetricCard
          label="Launches This Quarter"
          value={metrics?.launchesThisQuarter ?? 0}
          accentColor={ACCENT}
        />
        <MetricCard
          label="Success Rate"
          value={`${metrics?.successRate ?? 0}%`}
          accentColor={ACCENT}
          trend={{ value: 5, direction: 'up' }}
        />
      </div>

      {/* Empty state */}
      {(!concepts || concepts.length === 0) && (
        <EmptyState
          icon={Lightbulb}
          title="No product concepts"
          description="Start by adding a new product concept to the pipeline."
          accentColor={ACCENT}
        />
      )}

      {/* Pipeline grid */}
      {concepts && concepts.length > 0 && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {STAGES.map((stage) => {
          const stageConcepts = conceptsByStage(stage.key);
          return (
            <div key={stage.key} className="flex flex-col gap-2">
              {/* Column header */}
              <div
                className="rounded-t-lg border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-2"
                style={{ borderTopColor: stage.color, borderTopWidth: 3 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-text-muted)]">
                    {stage.label}
                  </span>
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: stage.color }}
                  >
                    {stageConcepts.length}
                  </span>
                </div>
              </div>

              {/* Concept cards */}
              <div className="flex flex-col gap-2">
                {stageConcepts.map((concept) => (
                  <button
                    key={concept.id}
                    type="button"
                    onClick={() => setSelectedConcept(concept)}
                    className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-3 text-left transition-colors hover:border-[#5BB8E6] cursor-pointer"
                  >
                    <h4 className="text-sm font-medium leading-snug text-[var(--text-text-default)]">
                      {concept.name}
                    </h4>
                    <div className="mt-2">
                      <StatusBadge
                        variant={CATEGORY_VARIANT[concept.category]}
                        label={concept.category}
                        size="sm"
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-[var(--text-text-muted)]">
                      <User className="h-3 w-3" />
                      <span>{concept.assignee}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-[var(--text-text-muted)]">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(concept.targetLaunch).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    {concept.estimatedMargin != null && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-[var(--text-text-muted)]">
                        <TrendingUp className="h-3 w-3" />
                        <span>{concept.estimatedMargin}% margin</span>
                      </div>
                    )}
                  </button>
                ))}

                {stageConcepts.length === 0 && (
                  <div className="rounded-lg border border-dashed border-[var(--border-default)] px-3 py-6 text-center text-xs text-[var(--text-text-muted)]">
                    No concepts
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>}

      {/* Detail drawer */}
      <DrawerPanel
        open={!!selectedConcept}
        onClose={() => setSelectedConcept(null)}
        title={selectedConcept?.name ?? 'Product Concept'}
        width="md"
      >
        {selectedConcept && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                variant={CATEGORY_VARIANT[selectedConcept.category]}
                label={selectedConcept.category}
                size="md"
              />
              <StatusBadge
                variant="info"
                label={selectedConcept.stage}
                size="md"
                dot
              />
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-text-muted)]">
                Description
              </label>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-text-default)]">
                {selectedConcept.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-text-muted)]">
                  Target Launch
                </label>
                <p className="mt-1 text-sm text-[var(--text-text-default)]">
                  {new Date(selectedConcept.targetLaunch).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-text-muted)]">
                  Assignee
                </label>
                <p className="mt-1 text-sm text-[var(--text-text-default)]">
                  {selectedConcept.assignee}
                </p>
              </div>
            </div>

            {selectedConcept.estimatedMargin != null && (
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-text-muted)]">
                  Estimated Margin
                </label>
                <p className="mt-1 text-sm text-[var(--text-text-default)]">
                  {selectedConcept.estimatedMargin}%
                </p>
              </div>
            )}

            {selectedConcept.strainName && (
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-text-muted)]">
                  Strain
                </label>
                <p className="mt-1 text-sm text-[var(--text-text-default)]">
                  {selectedConcept.strainName}
                </p>
              </div>
            )}

            {selectedConcept.targetAccounts && selectedConcept.targetAccounts.length > 0 && (
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-text-muted)]">
                  Target Accounts
                </label>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {selectedConcept.targetAccounts.map((account) => (
                    <span
                      key={account}
                      className="rounded-full bg-[var(--bg-elevated)] px-2.5 py-0.5 text-xs text-[var(--text-text-muted)]"
                    >
                      {account}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedConcept.notes && (
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-text-muted)]">
                  Notes
                </label>
                <p className="mt-1 text-sm leading-relaxed text-[var(--text-text-default)]">
                  {selectedConcept.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </DrawerPanel>
    </div>
  );
}
