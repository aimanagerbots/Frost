'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Validation ──────────────────────────────────────────────────

const MIN_LENGTH = 1;
const MAX_LENGTH = 50;

function validateTemplateName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length < MIN_LENGTH) return 'Template name is required';
  if (trimmed.length > MAX_LENGTH)
    return `Name must be ${MAX_LENGTH} characters or fewer`;
  return null;
}

// ─── Props ───────────────────────────────────────────────────────

interface ShopSaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

// ─── Component ───────────────────────────────────────────────────

export function ShopSaveTemplateModal({
  isOpen,
  onClose,
  onSave,
}: ShopSaveTemplateModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state and focus when modal opens
  const [prevOpen, setPrevOpen] = useState(isOpen);
  if (isOpen && !prevOpen) {
    setName('');
    setError(null);
  }
  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
  }

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateTemplateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSave(name.trim());
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal card */}
      <div
        className="relative z-10 w-full max-w-md rounded-xl border border-border-default bg-card p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Save order template"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-text-muted transition-colors hover:bg-white/[0.06] hover:text-text-default"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <h3 className="text-lg font-semibold text-text-bright">
          Save as Template
        </h3>
        <p className="mt-1 text-sm text-text-muted">
          Give your current cart a name to reorder quickly later.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5">
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Template Name
            </span>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              maxLength={MAX_LENGTH}
              placeholder="e.g., Weekly Restock"
              className={cn(
                'mt-1.5 w-full rounded-lg border bg-elevated px-3 py-2.5 text-sm text-text-default placeholder:text-text-muted focus:outline-none',
                error
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-border-default focus:border-accent-primary/50'
              )}
            />
          </label>

          {/* Character count + error */}
          <div className="mt-1.5 flex items-center justify-between">
            {error ? (
              <p className="text-xs text-red-400">{error}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-text-muted">
              {name.length}/{MAX_LENGTH}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border-default px-4 py-2.5 text-sm font-medium text-text-default transition-colors hover:bg-white/[0.04]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-primary-hover"
            >
              <Save className="h-4 w-4" />
              Save Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
