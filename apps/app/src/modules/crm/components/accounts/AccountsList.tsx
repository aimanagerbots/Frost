'use client';

import { useState, useMemo } from 'react';
import { Building2 } from 'lucide-react';
import { DataTable, StatusBadge, LoadingSkeleton } from '@/components';
import { useAccounts, useSalesReps } from '../../hooks';
import { useCRMStore } from '../../store';
import { AccountsFilterBar, type AccountFilters } from './AccountsFilterBar';
import type { Account, SalesRep } from '../../types';
import { ACCENT as CRM_ACCENT } from '@/design/colors';


const DEFAULT_FILTERS: AccountFilters = {
  region: '',
  rep: '',
  healthTier: '',
  vmi: '',
  payment: '',
  category: '',
};

function healthVariant(score: number) {
  if (score >= 80) return 'success' as const;
  if (score >= 60) return 'info' as const;
  if (score >= 40) return 'warning' as const;
  return 'danger' as const;
}

function healthLabel(score: number) {
  if (score >= 80) return 'Thriving';
  if (score >= 60) return 'Healthy';
  if (score >= 40) return 'At-Risk';
  return 'Churning';
}

function paymentVariant(reliability: string) {
  switch (reliability) {
    case 'excellent': return 'success' as const;
    case 'good': return 'info' as const;
    case 'fair': return 'warning' as const;
    case 'poor': return 'danger' as const;
    default: return 'default' as const;
  }
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);
}

function formatDate(d: string | null): string {
  if (!d) return 'Never';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Flatten Account into a Record<string, unknown> for DataTable compatibility
interface AccountRow extends Record<string, unknown> {
  id: string;
  name: string;
  city: string;
  state: string;
  assignedRepId: string;
  lastOrderDate: string | null;
  thirtyDayRevenue: number;
  healthScore: number;
  vmiEnrolled: boolean;
  paymentReliability: string;
  contactNames: string;
  licenseNumber: string;
  _account: Account;
}

function toRow(account: Account): AccountRow {
  return {
    id: account.id,
    name: account.name,
    city: account.address.city,
    state: account.address.state,
    assignedRepId: account.assignedRepId,
    lastOrderDate: account.lastOrderDate,
    thirtyDayRevenue: account.thirtyDayRevenue,
    healthScore: account.healthScore,
    vmiEnrolled: account.vmiEnrolled,
    paymentReliability: account.paymentReliability,
    contactNames: account.contacts.map((c) => c.name).join(' '),
    licenseNumber: account.licenseNumber,
    _account: account,
  };
}

function matchesSearch(row: AccountRow, query: string): boolean {
  const q = query.toLowerCase();
  return (
    row.name.toLowerCase().includes(q) ||
    row.city.toLowerCase().includes(q) ||
    row.contactNames.toLowerCase().includes(q) ||
    row.licenseNumber.toLowerCase().includes(q)
  );
}

function matchesFilters(account: Account, filters: AccountFilters): boolean {
  if (filters.region && account.region !== filters.region) return false;
  if (filters.rep && account.assignedRepId !== filters.rep) return false;
  if (filters.vmi === 'yes' && !account.vmiEnrolled) return false;
  if (filters.vmi === 'no' && account.vmiEnrolled) return false;
  if (filters.payment && account.paymentReliability !== filters.payment) return false;

  if (filters.healthTier) {
    const s = account.healthScore;
    switch (filters.healthTier) {
      case 'thriving': if (s < 80) return false; break;
      case 'healthy': if (s < 60 || s >= 80) return false; break;
      case 'at-risk': if (s < 40 || s >= 60) return false; break;
      case 'churning': if (s >= 40) return false; break;
    }
  }

  if (filters.category) {
    const hasCategory = account.categoryMix.some(
      (cm) => cm.category.toLowerCase() === filters.category.toLowerCase() && cm.percentage > 0
    );
    if (!hasCategory) return false;
  }

  return true;
}

function getRepColumns(repMap: Map<string, SalesRep>) {
  return [
    {
      header: 'Account',
      accessor: 'name' as const,
      sortable: true,
      render: (row: AccountRow) => (
        <span className="font-semibold text-text-bright">{row.name}</span>
      ),
    },
    {
      header: 'City',
      accessor: 'city' as const,
      sortable: true,
      hideBelow: 'md' as const,
    },
    {
      header: 'Rep',
      accessor: 'assignedRepId' as const,
      sortable: true,
      hideBelow: 'md' as const,
      render: (row: AccountRow) => {
        const rep = repMap.get(row.assignedRepId);
        if (!rep) return <span className="text-text-muted">—</span>;
        const initials = rep.name.split(' ').map((n) => n[0]).join('').toUpperCase();
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-elevated text-[10px] font-medium text-text-muted">
              {initials}
            </div>
            <span className="text-text-default">{rep.name}</span>
          </div>
        );
      },
    },
    {
      header: 'Last Order',
      accessor: 'lastOrderDate' as const,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: AccountRow) => (
        <span className={row.lastOrderDate ? 'text-text-default' : 'text-text-muted'}>
          {formatDate(row.lastOrderDate)}
        </span>
      ),
    },
    {
      header: '30-Day Rev',
      accessor: 'thirtyDayRevenue' as const,
      sortable: true,
      render: (row: AccountRow) => (
        <span className="font-medium text-text-default">
          {formatCurrency(row.thirtyDayRevenue)}
        </span>
      ),
    },
    {
      header: 'Health',
      accessor: 'healthScore' as const,
      sortable: true,
      render: (row: AccountRow) => (
        <StatusBadge
          variant={healthVariant(row.healthScore)}
          label={`${row.healthScore} ${healthLabel(row.healthScore)}`}
          size="sm"
        />
      ),
    },
    {
      header: 'VMI',
      accessor: 'vmiEnrolled' as const,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: AccountRow) =>
        row.vmiEnrolled ? (
          <StatusBadge variant="success" label="VMI" size="sm" />
        ) : (
          <span className="text-text-muted">—</span>
        ),
    },
    {
      header: 'Payment',
      accessor: 'paymentReliability' as const,
      sortable: true,
      hideBelow: 'lg' as const,
      render: (row: AccountRow) => (
        <StatusBadge
          variant={paymentVariant(row.paymentReliability)}
          label={row.paymentReliability}
          size="sm"
        />
      ),
    },
  ];
}

export function AccountsList() {
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: reps, isLoading: repsLoading } = useSalesReps();
  const { setSelectedAccountId, setBreadcrumbs } = useCRMStore();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<AccountFilters>(DEFAULT_FILTERS);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const repMap = useMemo(() => {
    const map = new Map<string, SalesRep>();
    reps?.forEach((r) => map.set(r.id, r));
    return map;
  }, [reps]);

  const regions = useMemo(() => {
    if (!accounts) return [];
    const set = new Set(accounts.map((a) => a.region));
    return Array.from(set).sort();
  }, [accounts]);

  const rows = useMemo(() => {
    if (!accounts) return [];
    return accounts
      .filter((a) => matchesFilters(a, filters))
      .map(toRow)
      .filter((r) => !search || matchesSearch(r, search));
  }, [accounts, filters, search]);

  const columns = useMemo(() => getRepColumns(repMap), [repMap]);

  if (accountsLoading || repsLoading) {
    return <LoadingSkeleton variant="table" />;
  }

  const handleRowClick = (row: AccountRow) => {
    setSelectedAccountId(row.id);
    setBreadcrumbs([
      { label: 'Accounts', tab: 'accounts', subModule: 'accounts' },
      { label: row.name },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search accounts, contacts, license..."
              className="w-64 rounded-lg border border-default bg-base py-2 pl-3 pr-3 text-sm text-text-default placeholder:text-text-muted focus:border-hover focus:outline-none"
            />
          </div>
          <AccountsFilterBar
            filters={filters}
            onFiltersChange={setFilters}
            regions={regions}
            reps={reps || []}
            visible={filtersVisible}
            onToggle={() => setFiltersVisible(!filtersVisible)}
          />
        </div>
        <span className="text-sm text-text-muted">{rows.length} accounts</span>
      </div>

      <DataTable<AccountRow>
        data={rows}
        columns={columns}
        onRowClick={handleRowClick}
        pageSize={15}
        emptyState={{
          icon: Building2,
          title: 'No accounts found',
          description: 'Try adjusting your search or filters.',
          accentColor: CRM_ACCENT,
        }}
      />
    </div>
  );
}
