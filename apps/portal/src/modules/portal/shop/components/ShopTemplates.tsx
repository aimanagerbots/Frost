'use client';

import { useState } from 'react';
import {
  ChevronDown,
  FileText,
  Trash2,
  Upload,
  Save,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortalAuth, usePortalCart, usePortalProducts } from '@/modules/portal/shared/hooks';
import type { PortalOrderTemplate } from '@/modules/portal/shared/types';

// ─── Helpers ─────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

// ─── Props ───────────────────────────────────────────────────────

interface ShopTemplatesProps {
  onOpenSaveModal: () => void;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────

export function ShopTemplates({
  onOpenSaveModal,
  className,
}: ShopTemplatesProps) {
  const { currentAccount } = usePortalAuth();
  const { loadTemplate, items } = usePortalCart();
  const { data: products = [] } = usePortalProducts(currentAccount?.id);
  const [isOpen, setIsOpen] = useState(false);

  const templates = (currentAccount?.savedTemplates ?? []).filter(
    (t) => !deletedIds.has(t.id)
  );
  const hasCartItems = items.length > 0;

  function handleLoadTemplate(template: PortalOrderTemplate) {
    loadTemplate(template, products);
    setIsOpen(false);
  }

  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  function handleDeleteTemplate(templateId: string) {
    setDeletedIds((prev) => new Set([...prev, templateId]));
  }

  return (
    <div className={cn('relative', className)}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-border-default bg-card px-3 py-2 text-sm text-text-default transition-colors hover:bg-card-hover"
      >
        <FileText className="h-4 w-4 text-text-muted" />
        Templates
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-text-muted transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Click-away backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />

          <div className="absolute right-0 top-full z-40 mt-2 w-80 overflow-hidden rounded-xl border border-border-default bg-card shadow-2xl">
            {/* Header */}
            <div className="border-b border-border-default px-4 py-3">
              <p className="text-sm font-semibold text-text-bright">
                Order Templates
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                Save and reuse your favorite orders
              </p>
            </div>

            {/* Template list */}
            <div className="max-h-64 overflow-y-auto">
              {templates.length === 0 ? (
                <div className="flex flex-col items-center px-4 py-8">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.04]">
                    <FileText className="h-5 w-5 text-text-muted" />
                  </div>
                  <p className="text-sm text-text-muted">No saved templates</p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Build a cart and save it as a template
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border-default">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-default line-clamp-1">
                          {template.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-text-muted">
                          <span>
                            {template.items.length}{' '}
                            {template.items.length === 1 ? 'item' : 'items'}
                          </span>
                          <span className="text-white/10">&middot;</span>
                          <span>{formatCurrency(template.estimatedTotal)}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleLoadTemplate(template)}
                        className="shrink-0 rounded-md bg-accent-primary/15 px-2.5 py-1 text-xs font-medium text-accent-primary transition-colors hover:bg-accent-primary/25"
                        title="Load template into cart"
                      >
                        <Upload className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="shrink-0 rounded-md p-1 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                        title="Delete template"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save current cart */}
            <div className="border-t border-border-default px-4 py-3">
              <button
                type="button"
                disabled={!hasCartItems}
                onClick={() => {
                  setIsOpen(false);
                  onOpenSaveModal();
                }}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  hasCartItems
                    ? 'bg-elevated text-text-default hover:bg-white/[0.08]'
                    : 'cursor-not-allowed bg-elevated text-text-muted opacity-50'
                )}
              >
                <Save className="h-3.5 w-3.5" />
                Save Current Cart as Template
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
