'use client';

import { useState } from 'react';
import { FileText, Download, Upload, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountDocumentsProps {
  className?: string;
}

interface MockFile {
  name: string;
  uploadDate: string;
  size: string;
}

const SECTIONS: { title: string; files: MockFile[] }[] = [
  {
    title: 'Licenses',
    files: [
      { name: 'Business License.pdf', uploadDate: '2025-12-15', size: '1.2 MB' },
      { name: 'Cannabis License.pdf', uploadDate: '2025-12-15', size: '2.4 MB' },
      { name: 'Local Permit.pdf', uploadDate: '2026-01-08', size: '890 KB' },
    ],
  },
  {
    title: 'Insurance',
    files: [
      { name: 'General Liability.pdf', uploadDate: '2026-01-20', size: '3.1 MB' },
      { name: 'Product Liability.pdf', uploadDate: '2026-01-20', size: '2.8 MB' },
    ],
  },
  {
    title: 'Tax Documents',
    files: [
      { name: 'W-9 Form.pdf', uploadDate: '2025-11-01', size: '420 KB' },
      { name: 'Resale Certificate.pdf', uploadDate: '2025-11-01', size: '310 KB' },
    ],
  },
];

export function AccountDocuments({ className }: AccountDocumentsProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Mock -- no actual upload
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Document sections */}
      {SECTIONS.map((section) => (
        <div
          key={section.title}
          className="rounded-xl border border-border-default bg-card"
        >
          <div className="flex items-center gap-2 border-b border-border-default px-6 py-3">
            <FolderOpen className="h-4 w-4 text-accent-primary" />
            <h3 className="text-sm font-semibold text-text-bright">{section.title}</h3>
            <span className="ml-auto text-xs text-text-muted">
              {section.files.length} file{section.files.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-border-default/50">
            {section.files.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-elevated/50"
              >
                <FileText className="h-4.5 w-4.5 flex-shrink-0 text-text-muted" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-default">
                    {file.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    Uploaded {file.uploadDate} &middot; {file.size}
                  </p>
                </div>
                <button className="flex-shrink-0 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-elevated hover:text-accent-primary">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Upload dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragOver
            ? 'border-accent-primary bg-accent-primary/5'
            : 'border-border-default bg-card hover:border-border-default/80'
        )}
      >
        <div
          className={cn(
            'mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-colors',
            dragOver ? 'bg-accent-primary/15' : 'bg-elevated'
          )}
        >
          <Upload
            className={cn(
              'h-5 w-5 transition-colors',
              dragOver ? 'text-accent-primary' : 'text-text-muted'
            )}
          />
        </div>
        <p className="text-sm font-medium text-text-default">
          Drag & drop files here
        </p>
        <p className="mt-1 text-xs text-text-muted">
          PDF, PNG, or JPG up to 10 MB
        </p>
        <button className="mt-4 rounded-lg border border-border-default bg-elevated px-4 py-1.5 text-xs font-medium text-text-default transition-colors hover:border-accent-primary hover:text-accent-primary">
          Browse Files
        </button>
      </div>
    </div>
  );
}
