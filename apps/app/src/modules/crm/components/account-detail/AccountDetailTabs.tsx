'use client';

import { cn } from '@/lib/utils';
import {
  User,
  ShoppingCart,
  Activity,
  Package,
  MessageSquare,
  Target,
  CreditCard,
  Truck,
  FolderOpen,
  StickyNote,
} from 'lucide-react';
import type { AccountDetailTab } from '../../types';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


const TAB_CONFIG: { id: AccountDetailTab; label: string; icon: typeof User }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'purchases', label: 'Purchases', icon: ShoppingCart },
  { id: 'health', label: 'Health', icon: Activity },
  { id: 'vmi', label: 'VMI', icon: Package },
  { id: 'interactions', label: 'Interactions', icon: MessageSquare },
  { id: 'opportunities', label: 'Opportunities', icon: Target },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'deliveries', label: 'Deliveries', icon: Truck },
  { id: 'files', label: 'Files', icon: FolderOpen },
  { id: 'notes', label: 'Notes', icon: StickyNote },
];

interface AccountDetailTabsProps {
  activeTab: AccountDetailTab;
  onTabChange: (tab: AccountDetailTab) => void;
  vmiEnrolled: boolean;
}

export function AccountDetailTabs({ activeTab, onTabChange, vmiEnrolled }: AccountDetailTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl border border-default bg-card p-1.5">
      {TAB_CONFIG.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        const isVmiDisabled = id === 'vmi' && !vmiEnrolled;

        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              isActive
                ? 'text-black'
                : isVmiDisabled
                  ? 'text-text-muted/50 cursor-default'
                  : 'text-text-muted hover:bg-accent-hover hover:text-text-default'
            )}
            style={isActive ? { backgroundColor: CRM_ACCENT } : undefined}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
