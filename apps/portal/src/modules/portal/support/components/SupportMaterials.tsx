'use client';

import { FileText, FileArchive, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SupportMaterialsProps {
  className?: string;
}

interface MaterialItem {
  id: string;
  name: string;
  format: 'PDF' | 'ZIP';
  size: string;
}

const MATERIALS: MaterialItem[] = [
  { id: 'mat-1', name: 'Product Catalog 2026', format: 'PDF', size: '12.4 MB' },
  { id: 'mat-2', name: 'Price Sheet — Tier 1/2/3', format: 'PDF', size: '2.1 MB' },
  { id: 'mat-3', name: 'Brand Guidelines', format: 'PDF', size: '8.7 MB' },
  { id: 'mat-4', name: 'Point of Sale Materials', format: 'ZIP', size: '45.2 MB' },
  { id: 'mat-5', name: 'Compliance Handbook', format: 'PDF', size: '3.3 MB' },
  { id: 'mat-6', name: 'Menu Templates', format: 'ZIP', size: '15.8 MB' },
];

export function SupportMaterials({ className }: SupportMaterialsProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="font-display text-sm font-semibold text-text-bright">
        Downloads &amp; Materials
      </h2>

      <div className="grid grid-cols-1 gap-2">
        {MATERIALS.map((item) => {
          const FileIcon = item.format === 'ZIP' ? FileArchive : FileText;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-border-default bg-card p-3.5 transition-colors hover:border-accent-primary/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-primary/10">
                <FileIcon className="h-5 w-5 text-accent-primary" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-default">
                  {item.name}
                </p>
                <p className="text-xs text-text-muted">
                  {item.format} &middot; {item.size}
                </p>
              </div>

              <button
                type="button"
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  'bg-elevated text-text-muted transition-colors',
                  'hover:bg-accent-primary/15 hover:text-accent-primary'
                )}
                title={`Download ${item.name}`}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
