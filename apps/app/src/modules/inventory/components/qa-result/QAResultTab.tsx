'use client';

import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Plus, Search, Upload, X } from 'lucide-react';
import { useQAResults, useStrains } from '@/modules/inventory/hooks';
import { LoadingSkeleton } from '@/components';
import { InvStatusBadge } from '../InventoryStatusBadge';
import { INVENTORY_TYPE_LABELS } from '@/modules/inventory/types';
import type { QAFilterTab, QAResult } from '@/modules/inventory/types';

const ACCENT = '#8B5CF6';

const FILTER_TABS: { id: QAFilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'passed', label: 'Passed' },
  { id: 'failed', label: 'Failed' },
  { id: 'pending', label: 'Pending' },
];

function AddQAResultDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col border-l border-default bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-default px-6 py-4">
          <h3 className="text-sm font-semibold text-text-default">Add New QA Result</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-default"><X size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {['QA Lot', 'Sub Lot', 'Inventory Type', 'Strain', 'Date of Manufacture', 'Date of Harvest',
              'CBD (%)', 'THC (%)', 'THCA (%)', 'CBDA (%)', 'Total (%)'].map(label => (
              <div key={label}>
                <label className="mb-1 block text-xs text-text-muted">{label}</label>
                <input className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none" placeholder={label + '\u2026'} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 border-t border-default px-6 py-4">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-xs font-medium text-white" style={{ backgroundColor: ACCENT }}>Save</button>
          <button onClick={onClose} className="rounded-lg border border-default px-4 py-2 text-xs text-text-muted">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function ImportWCIAModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'link' | 'file'>('link');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-default bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-default">Import WCIA Lab Result</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-default"><X size={16} /></button>
        </div>
        <div className="mb-4 flex gap-1 rounded-lg border border-default bg-base p-1">
          {(['link', 'file'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors"
              style={tab === t ? { backgroundColor: ACCENT + '20', color: ACCENT } : { color: 'var(--color-text-muted)' }}
            >{t}</button>
          ))}
        </div>
        {tab === 'link' ? (
          <div>
            <label className="mb-1 block text-xs text-text-muted">WCIA Result URL</label>
            <input placeholder="https://wcia.wa.gov/..." className="h-9 w-full rounded-lg border border-default bg-elevated px-3 text-xs text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none" />
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-default text-xs text-text-muted">
            Drop file here or click to upload
          </div>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-default px-4 py-2 text-xs text-text-muted">Cancel</button>
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-xs font-medium text-white" style={{ backgroundColor: ACCENT }}>Import</button>
        </div>
      </div>
    </div>
  );
}

function QARow({ result }: { result: QAResult }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="cursor-pointer border-b border-default transition-colors hover:bg-card-hover"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-2 text-[13px] font-mono text-text-default">{result.qaLot}</td>
        <td className="px-4 py-2 text-[13px] font-mono text-text-muted">{result.subLot}</td>
        <td className="px-4 py-2"><InvStatusBadge status={result.status} /></td>
        <td className="px-4 py-2 text-[13px] text-text-muted">
          {INVENTORY_TYPE_LABELS[result.inventoryType] ?? 'Type ' + result.inventoryType}
        </td>
        <td className="px-4 py-2 text-[13px] text-text-default">{result.strain}</td>
        <td className="px-4 py-2">
          <div className="space-y-0.5">
            <div className="text-[11px] text-text-muted">DOM: <span className="text-text-default">{result.dateOfManufacture}</span></div>
            <div className="text-[11px] text-text-muted">DOH: <span className="text-text-default">{result.dateOfHarvest === '\u2014' ? '\u2014' : result.dateOfHarvest}</span></div>
          </div>
        </td>
        <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-default">{result.cbd > 0 ? result.cbd.toFixed(2) + '%' : '\u2014'}</td>
        <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-default">{result.thc > 0 ? result.thc.toFixed(2) + '%' : '\u2014'}</td>
        <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-muted">{result.thca > 0 ? result.thca.toFixed(2) + '%' : '\u2014'}</td>
        <td className="px-4 py-2 text-right text-[13px] tabular-nums text-text-muted">{result.cbda > 0 ? result.cbda.toFixed(2) + '%' : '\u2014'}</td>
        <td className="px-4 py-2 text-right">
          <span className="text-[13px] font-semibold tabular-nums" style={{ color: result.total > 0 ? ACCENT : 'var(--color-text-muted)' }}>
            {result.total > 0 ? result.total.toFixed(2) + '%' : '\u2014'}
          </span>
        </td>
        <td className="px-4 py-2 text-right">
          {expanded
            ? <ChevronUp size={14} className="text-text-muted" />
            : <ChevronDown size={14} className="text-text-muted" />}
        </td>
      </tr>

      {expanded && (
        <tr className="border-b border-default bg-elevated/50">
          <td colSpan={12} className="px-6 py-4">
            <div className="flex flex-wrap items-start gap-6">
              <div className="rounded-lg border border-default bg-card p-4">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-text-muted">Change Info</div>
                <div className="space-y-1 text-[13px]">
                  <div><span className="text-text-muted">Changed By: </span><span className="text-text-default">{result.changedBy}</span></div>
                  <div><span className="text-text-muted">Date: </span><span className="text-text-default">{result.dateChanged}</span></div>
                </div>
              </div>
              {result.pdfUrl && (
                <a href={result.pdfUrl} className="inline-flex items-center gap-1.5 rounded-lg border border-default bg-card px-4 py-3 text-[13px] text-blue-400 hover:text-blue-300">
                  <FileText size={14} /> View COA PDF
                </a>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function QAResultTab() {
  const [activeTab, setActiveTab] = useState<QAFilterTab>('all');
  const [lotSearch, setLotSearch] = useState('');
  const [strainFilter, setStrainFilter] = useState('');
  const [invTypeFilter, setInvTypeFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const { data: results, isLoading } = useQAResults(activeTab);
  const { data: strains } = useStrains();

  if (isLoading) return <LoadingSkeleton variant="table" />;

  // Client-side filtering
  const filtered = (results ?? []).filter(r => {
    if (lotSearch && !r.qaLot.toLowerCase().includes(lotSearch.toLowerCase())) return false;
    if (strainFilter && r.strain !== strainFilter) return false;
    if (invTypeFilter && String(r.inventoryType) !== invTypeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-3">
      {showAdd && <AddQAResultDrawer onClose={() => setShowAdd(false)} />}
      {showImport && <ImportWCIAModal onClose={() => setShowImport(false)} />}

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setShowAdd(true)}
          className="flex h-8 items-center gap-1.5 border rounded-lg px-3 text-[13px] font-medium hover:bg-card"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          <Plus size={14} />
          Add New QA Result
        </button>
        <button
          onClick={() => setShowImport(true)}
          className="flex h-8 items-center gap-1.5 border rounded-lg px-3 text-[13px] font-medium hover:bg-card"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          <Upload size={13} />
          Import WCIA Lab Result
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          <input
            value={lotSearch}
            onChange={e => setLotSearch(e.target.value)}
            placeholder="Search by QA Lot\u2026"
            className="h-8 w-48 rounded-lg border border-default bg-card pl-8 pr-3 text-[13px] text-text-default placeholder:text-text-muted focus:border-[#8B5CF6] focus:outline-none"
          />
        </div>
        <select
          value={strainFilter}
          onChange={e => setStrainFilter(e.target.value)}
          className="h-8 appearance-none rounded-lg border border-default bg-card px-3 pr-7 text-[13px] text-text-muted focus:border-[#8B5CF6] focus:outline-none"
        >
          <option value="">All Strains</option>
          {(strains ?? []).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
        <select
          value={invTypeFilter}
          onChange={e => setInvTypeFilter(e.target.value)}
          className="h-8 appearance-none rounded-lg border border-default bg-card px-3 pr-7 text-[13px] text-text-muted focus:border-[#8B5CF6] focus:outline-none"
        >
          <option value="">All Inventory Types</option>
          {(Object.entries(INVENTORY_TYPE_LABELS) as [string, string][]).map(([code, label]) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-default bg-base p-1 scrollbar-none">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors"
            style={
              activeTab === tab.id
                ? { backgroundColor: ACCENT + '20', color: ACCENT }
                : { color: 'var(--color-text-muted)' }
            }
          >
            {tab.label}
            {tab.id !== 'all' && (
              <span className="ml-1.5 text-[11px] opacity-60">
                {filtered.filter(r => r.status === tab.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-default">
                {['QA Lot', 'Sub Lot', 'Status', 'Inventory Type', 'Strain', 'Farm Info', 'CBD', 'THC', 'THCA', 'CBDA', 'Total', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(result => (
                <QARow key={result.id} result={result} />
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <div className="py-12 text-center text-sm text-text-muted">No QA results found.</div>
        )}
      </div>
    </div>
  );
}
