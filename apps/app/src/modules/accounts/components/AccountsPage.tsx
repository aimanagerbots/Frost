'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Users, Filter, Download, Plus, ChevronDown } from 'lucide-react';
import { SectionHeader } from '@/components';
import { useAccount } from '../hooks';
import { AccountsTable } from './AccountsTable';
import { AccountDetail } from './AccountDetail';
import { QuickFiltersModal } from './QuickFiltersModal';
import { AddNonCannabisAccountModal } from './AddNonCannabisAccountModal';
import type { AccountListTab, SalesAccount } from '../types';

const ACCENT = '#F59E0B';

export function AccountsPage() {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [tab, setTab] = useState<AccountListTab>('all');
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showAddNonCannabis, setShowAddNonCannabis] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const { data: selectedAccount } = useAccount(selectedAccountId);

  // Close export dropdown on outside click
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
      setShowExportMenu(false);
    }
  }, []);

  useEffect(() => {
    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showExportMenu, handleClickOutside]);

  const handleRowClick = (account: SalesAccount) => {
    setSelectedAccountId(account.id);
  };

  const handleBack = () => {
    setSelectedAccountId(null);
  };

  // Detail view
  if (selectedAccountId && selectedAccount) {
    return (
      <div className="space-y-4">
        <AccountDetail account={selectedAccount} onBack={handleBack} />
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      <SectionHeader
        icon={Users}
        title="Accounts"
        subtitle="Manage retail accounts, contacts, and sales data"
        accentColor={ACCENT}
        actions={
          <div className="flex items-center gap-2">
            {/* Quick Filters */}
            <button
              onClick={() => setShowQuickFilters(true)}
              className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-2 text-sm text-text-muted transition-colors hover:bg-elevated"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Quick Filters</span>
            </button>

            {/* Add Non-Cannabis Account */}
            <button
              onClick={() => setShowAddNonCannabis(true)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: ACCENT }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Non-Cannabis Account</span>
            </button>

            {/* Export dropdown */}
            <div ref={exportRef} className="relative">
              <button
                onClick={() => setShowExportMenu((v) => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-2 text-sm text-text-muted transition-colors hover:bg-elevated"
              >
                <Download className="h-4 w-4" />
                Export
                <ChevronDown className="h-3 w-3" />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-default bg-card py-1 shadow-xl">
                  <button
                    onClick={() => setShowExportMenu(false)}
                    className="w-full px-3 py-2 text-left text-sm text-text-default transition-colors hover:bg-elevated"
                  >
                    Contact details
                  </button>
                  <button
                    onClick={() => setShowExportMenu(false)}
                    className="w-full px-3 py-2 text-left text-sm text-text-default transition-colors hover:bg-elevated"
                  >
                    Accounts
                  </button>
                </div>
              )}
            </div>
          </div>
        }
      />

      <AccountsTable tab={tab} onTabChange={setTab} onRowClick={handleRowClick} />

      {/* Modals */}
      <QuickFiltersModal open={showQuickFilters} onClose={() => setShowQuickFilters(false)} />
      <AddNonCannabisAccountModal open={showAddNonCannabis} onClose={() => setShowAddNonCannabis(false)} />
    </div>
  );
}
