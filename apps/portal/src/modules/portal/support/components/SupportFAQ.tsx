'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PORTAL_FAQ } from '@/modules/portal/shared/mock-data';
import type { PortalFAQItem } from '@/modules/portal/shared/types';

interface SupportFAQProps {
  className?: string;
}

const CATEGORIES: Array<{
  value: PortalFAQItem['category'] | 'all';
  label: string;
}> = [
  { value: 'all', label: 'All' },
  { value: 'ordering', label: 'Ordering' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'payment', label: 'Payment' },
  { value: 'products', label: 'Products' },
  { value: 'account', label: 'Account' },
  { value: 'store-orders', label: 'Store Orders' },
];

export function SupportFAQ({ className }: SupportFAQProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<
    PortalFAQItem['category'] | 'all'
  >('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFAQ = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return PORTAL_FAQ.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch =
        !lowerSearch ||
        item.question.toLowerCase().includes(lowerSearch) ||
        item.answer.toLowerCase().includes(lowerSearch);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="font-display text-sm font-semibold text-text-bright">
        Frequently Asked Questions
      </h2>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            'w-full rounded-lg border border-border-default bg-elevated py-2.5 pl-10 pr-4',
            'text-sm text-text-default placeholder:text-text-muted',
            'outline-none transition-colors focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30'
          )}
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              activeCategory === cat.value
                ? 'bg-accent-primary/15 text-accent-primary'
                : 'bg-elevated text-text-muted hover:text-text-default'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion */}
      <div className="space-y-2">
        {filteredFAQ.length === 0 && (
          <div className="rounded-xl border border-border-default bg-card p-6 text-center text-sm text-text-muted">
            No questions found matching your search.
          </div>
        )}
        {filteredFAQ.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-xl border border-border-default bg-card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => handleToggle(item.id)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-elevated/50"
              >
                <span className="text-sm font-medium text-text-default">
                  {item.question}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-text-muted" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
                )}
              </button>
              {isExpanded && (
                <div className="border-t border-border-default px-4 py-3">
                  <p className="text-sm leading-relaxed text-text-muted">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
