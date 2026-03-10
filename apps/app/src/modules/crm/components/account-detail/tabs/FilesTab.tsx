'use client';

import { StatusBadge, LoadingSkeleton } from '@/components';
import { useAccountFiles } from '../../../hooks';
import { FileText, FileCheck, FileSpreadsheet, Shield, File, Upload } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FilesTabProps {
  accountId: string;
}

const FILE_TYPE_ICONS: Record<string, LucideIcon> = {
  coa: FileCheck,
  contract: FileText,
  invoice: FileSpreadsheet,
  license: Shield,
  other: File,
};

function fileTypeVariant(type: string) {
  switch (type) {
    case 'coa': return 'success' as const;
    case 'contract': return 'info' as const;
    case 'invoice': return 'warning' as const;
    case 'license': return 'default' as const;
    default: return 'muted' as const;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FilesTab({ accountId }: FilesTabProps) {
  const { data: files, isLoading } = useAccountFiles(accountId);

  if (isLoading) return <LoadingSkeleton variant="list" count={4} />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-sm text-text-muted transition-colors hover:bg-accent-hover hover:text-text-default">
          <Upload className="h-4 w-4" />
          Upload File
        </button>
      </div>

      <div className="rounded-xl bg-card">
        {(files || []).map((file, i) => {
          const Icon = FILE_TYPE_ICONS[file.type] || File;
          return (
            <div
              key={file.id}
              className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'border-t border-default/50' : ''}`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-elevated">
                <Icon className="h-4 w-4 text-text-muted" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-text-default">{file.name}</div>
                <div className="text-xs text-text-muted">
                  {file.uploadedBy} &middot;{' '}
                  {new Date(file.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <StatusBadge variant={fileTypeVariant(file.type)} label={file.type.toUpperCase()} size="sm" />
              <span className="text-xs text-text-muted">{formatFileSize(file.size)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
