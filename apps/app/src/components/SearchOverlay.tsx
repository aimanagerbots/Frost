'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  route: string;
}

export interface SearchGroup {
  label: string;
  items: SearchItem[];
}

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  onSelect: (item: SearchItem) => void;
  groups: SearchGroup[];
}

export function SearchOverlay({ open, onClose, onSelect, groups }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter items by query
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            (item.subtitle && item.subtitle.toLowerCase().includes(q)),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, query]);

  // Flat list of visible items for keyboard nav
  const flatItems = useMemo(() => filtered.flatMap((g) => g.items), [filtered]);

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlightIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Clamp highlight index
  useEffect(() => {
    if (highlightIndex >= flatItems.length) {
      setHighlightIndex(Math.max(0, flatItems.length - 1));
    }
  }, [flatItems.length, highlightIndex]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector('[data-highlighted="true"]');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [highlightIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightIndex((i) => Math.min(i + 1, flatItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (flatItems[highlightIndex]) onSelect(flatItems[highlightIndex]);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [flatItems, highlightIndex, onSelect, onClose],
  );

  if (!open) return null;

  let itemCounter = 0;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[15vh]"
      onClick={onClose}
    >
      <div
        className="mx-4 flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-default bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-default px-4 py-3">
          <Search size={18} className="shrink-0 text-text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightIndex(0);
            }}
            placeholder="Search modules, accounts, actions..."
            className="flex-1 bg-transparent text-sm text-text-default placeholder:text-text-muted outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-text-muted hover:text-text-default">
              <X size={16} />
            </button>
          )}
          <kbd className="hidden rounded bg-elevated px-1.5 py-0.5 text-[10px] font-medium text-text-muted sm:inline-block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-text-muted">No results found</div>
          ) : (
            filtered.map((group) => (
              <div key={group.label} className="mb-2">
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  {group.label}
                </div>
                {group.items.map((item) => {
                  const idx = itemCounter++;
                  const isHighlighted = idx === highlightIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      data-highlighted={isHighlighted}
                      onClick={() => onSelect(item)}
                      onMouseEnter={() => setHighlightIndex(idx)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        isHighlighted ? 'bg-elevated text-text-bright' : 'text-text-default hover:bg-accent-hover/50'
                      }`}
                    >
                      {Icon && <Icon size={16} className="shrink-0 text-text-muted" />}
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{item.title}</div>
                        {item.subtitle && (
                          <div className="truncate text-xs text-text-muted">{item.subtitle}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-default px-4 py-2 text-[11px] text-text-muted">
          <span>
            <kbd className="rounded bg-elevated px-1 py-0.5 font-medium">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="rounded bg-elevated px-1 py-0.5 font-medium">↵</kbd> select
          </span>
          <span>
            <kbd className="rounded bg-elevated px-1 py-0.5 font-medium">esc</kbd> close
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
