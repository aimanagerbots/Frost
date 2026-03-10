'use client';

import { cn } from '@frost/ui';

export type AccountTab = 'overview' | 'history' | 'rewards' | 'sweepstakes' | 'merch';

const TABS: readonly { id: AccountTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'history', label: 'Purchases' },
  { id: 'rewards', label: 'Rewards' },
  { id: 'sweepstakes', label: 'Sweepstakes' },
  { id: 'merch', label: 'Merch Shop' },
];

interface AccountTabsProps {
  active: AccountTab;
  onChange: (tab: AccountTab) => void;
}

export function AccountTabs({ active, onChange }: AccountTabsProps) {
  return (
    <div className="mb-8 overflow-x-auto scrollbar-hide">
      <div className="flex gap-1 border-b border-white/[0.06] min-w-max">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative px-5 py-3 text-sm font-semibold transition-colors',
                isActive
                  ? 'text-[#5BB8E6]'
                  : 'text-white/40 hover:text-white/70',
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5BB8E6] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
