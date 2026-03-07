'use client';

import { useState, useMemo, useCallback } from 'react';
import { Plus, Trash2, Search, Save } from 'lucide-react';
import type { SegmentCriterion } from '@/modules/crm/types';
import { accounts } from '@/mocks/crm';
import { filterAccountsByCriteria } from '@/mocks/crm-segments';
import { SegmentPreview } from './SegmentPreview';

const FIELDS = [
  { value: 'region', label: 'Region', type: 'select' as const, options: ['Seattle Metro', 'Eastside & Tacoma', 'Spokane & Eastern WA', 'South Sound'] },
  { value: 'assignedRepId', label: 'Assigned Rep', type: 'select' as const, options: ['rep-jake', 'rep-priya', 'rep-carlos'] },
  { value: 'status', label: 'Status', type: 'select' as const, options: ['active', 'at-risk', 'churning', 'prospect', 'inactive'] },
  { value: 'healthScore', label: 'Health Score', type: 'number' as const },
  { value: 'thirtyDayRevenue', label: '30-Day Revenue', type: 'number' as const },
  { value: 'avgOrderValue', label: 'Avg Order Value', type: 'number' as const },
  { value: 'orderCount', label: 'Order Count', type: 'number' as const },
  { value: 'paymentReliability', label: 'Payment Reliability', type: 'select' as const, options: ['excellent', 'good', 'fair', 'poor'] },
  { value: 'vmiEnrolled', label: 'VMI Enrolled', type: 'select' as const, options: ['true', 'false'] },
  { value: 'categoryCount', label: 'Category Count', type: 'number' as const },
  { value: 'categoryMix.flower', label: 'Flower Mix %', type: 'number' as const },
  { value: 'categoryMix.preroll', label: 'Preroll Mix %', type: 'number' as const },
  { value: 'categoryMix.vaporizer', label: 'Vaporizer Mix %', type: 'number' as const },
  { value: 'categoryMix.concentrate', label: 'Concentrate Mix %', type: 'number' as const },
  { value: 'categoryMix.edible', label: 'Edible Mix %', type: 'number' as const },
];

const OPERATORS_BY_TYPE = {
  number: [
    { value: 'greater_than', label: '>' },
    { value: 'less_than', label: '<' },
    { value: 'equals', label: '=' },
  ],
  select: [
    { value: 'equals', label: 'is' },
    { value: 'not_equals', label: 'is not' },
    { value: 'in', label: 'is one of' },
  ],
};

interface CriterionRow {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface SegmentBuilderProps {
  onSave: (name: string, description: string, criteria: SegmentCriterion[]) => void;
  onCancel: () => void;
}

export function SegmentBuilder({ onSave, onCancel }: SegmentBuilderProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rows, setRows] = useState<CriterionRow[]>([
    { id: '1', field: 'healthScore', operator: 'greater_than', value: '' },
  ]);
  const [showPreview, setShowPreview] = useState(false);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: String(Date.now()), field: 'healthScore', operator: 'greater_than', value: '' },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, updates: Partial<CriterionRow>) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const updated = { ...r, ...updates };
        // Reset operator when field type changes
        if (updates.field) {
          const fieldDef = FIELDS.find((f) => f.value === updates.field);
          const ops = OPERATORS_BY_TYPE[fieldDef?.type ?? 'number'];
          if (!ops.find((o) => o.value === updated.operator)) {
            updated.operator = ops[0].value;
          }
          updated.value = '';
        }
        return updated;
      }),
    );
  };

  // Build criteria from rows
  const criteria = useMemo<SegmentCriterion[]>(() => {
    return rows
      .filter((r) => r.value !== '')
      .map((r) => {
        const fieldDef = FIELDS.find((f) => f.value === r.field);
        return {
          field: r.field,
          operator: r.operator as SegmentCriterion['operator'],
          value: fieldDef?.type === 'number' ? Number(r.value) : r.value,
          label: `${fieldDef?.label ?? r.field} ${r.operator.replace('_', ' ')} ${r.value}`,
        };
      });
  }, [rows]);

  // Live count
  const matchingAccounts = useMemo(() => {
    if (criteria.length === 0) return accounts;
    return filterAccountsByCriteria(criteria);
  }, [criteria]);

  const previewData = useMemo(
    () => ({
      accounts: matchingAccounts.map((a) => ({
        id: a.id,
        name: a.name,
        health: a.healthScore,
        revenue30d: a.thirtyDayRevenue,
        city: a.address.city,
      })),
      totalCount: matchingAccounts.length,
      totalRevenue: matchingAccounts.reduce((s, a) => s + a.thirtyDayRevenue, 0),
    }),
    [matchingAccounts],
  );

  const handleSave = useCallback(() => {
    if (!name.trim() || criteria.length === 0) return;
    onSave(name.trim(), description.trim(), criteria);
  }, [name, description, criteria, onSave]);

  return (
    <div className="space-y-4">
      {/* Name & Description */}
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Segment Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., High-Value Seattle Accounts"
            className="w-full rounded-lg border border-default bg-base px-3 py-2 text-sm text-default placeholder:text-muted focus:border-[#F59E0B]/50 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this segment..."
            rows={2}
            className="w-full resize-none rounded-lg border border-default bg-base px-3 py-2 text-sm text-default placeholder:text-muted focus:border-[#F59E0B]/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Criteria Rows */}
      <div>
        <label className="mb-2 block text-xs font-medium text-muted">Criteria</label>
        <div className="space-y-2">
          {rows.map((row, index) => {
            const fieldDef = FIELDS.find((f) => f.value === row.field);
            const fieldType = fieldDef?.type ?? 'number';
            const operators = OPERATORS_BY_TYPE[fieldType];

            return (
              <div key={row.id}>
                {index > 0 && (
                  <div className="my-1 flex items-center justify-center">
                    <span className="rounded bg-[#F59E0B]/10 px-2 py-0.5 text-[10px] font-semibold text-[#F59E0B]">
                      AND
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {/* Field */}
                  <select
                    value={row.field}
                    onChange={(e) => updateRow(row.id, { field: e.target.value })}
                    className="flex-1 rounded-lg border border-default bg-base px-2 py-1.5 text-xs text-default focus:border-[#F59E0B]/50 focus:outline-none"
                  >
                    {FIELDS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>

                  {/* Operator */}
                  <select
                    value={row.operator}
                    onChange={(e) => updateRow(row.id, { operator: e.target.value })}
                    className="w-24 rounded-lg border border-default bg-base px-2 py-1.5 text-xs text-default focus:border-[#F59E0B]/50 focus:outline-none"
                  >
                    {operators.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>

                  {/* Value */}
                  {fieldType === 'select' ? (
                    <select
                      value={row.value}
                      onChange={(e) => updateRow(row.id, { value: e.target.value })}
                      className="flex-1 rounded-lg border border-default bg-base px-2 py-1.5 text-xs text-default focus:border-[#F59E0B]/50 focus:outline-none"
                    >
                      <option value="">Select...</option>
                      {fieldDef?.options?.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={row.value}
                      onChange={(e) => updateRow(row.id, { value: e.target.value })}
                      placeholder="Value"
                      className="w-24 rounded-lg border border-default bg-base px-2 py-1.5 text-xs text-default placeholder:text-muted focus:border-[#F59E0B]/50 focus:outline-none"
                    />
                  )}

                  {/* Remove */}
                  {rows.length > 1 && (
                    <button
                      onClick={() => removeRow(row.id)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={addRow}
          className="mt-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted hover:bg-card hover:text-default transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Criterion
        </button>
      </div>

      {/* Live count */}
      <div className="flex items-center gap-3 rounded-lg border border-default bg-base p-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F59E0B]/10">
          <Search className="h-4 w-4 text-[#F59E0B]" />
        </div>
        <div className="text-sm">
          <span className="font-semibold text-bright">{previewData.totalCount}</span>
          <span className="text-muted"> accounts match</span>
          {previewData.totalRevenue > 0 && (
            <span className="text-muted">
              {' '}
              — ${previewData.totalRevenue.toLocaleString()} total revenue
            </span>
          )}
        </div>
        <button
          onClick={() => setShowPreview((p) => !p)}
          className="ml-auto rounded-lg border border-default px-3 py-1 text-xs text-muted hover:text-default transition-colors"
        >
          {showPreview ? 'Hide' : 'Preview'}
        </button>
      </div>

      {/* Preview table */}
      {showPreview && (
        <SegmentPreview
          accounts={previewData.accounts}
          totalCount={previewData.totalCount}
          totalRevenue={previewData.totalRevenue}
        />
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 border-t border-default pt-4">
        <button
          onClick={onCancel}
          className="rounded-lg border border-default px-4 py-2 text-sm text-muted hover:text-default transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim() || criteria.length === 0}
          className="flex items-center gap-2 rounded-lg bg-[#F59E0B] px-4 py-2 text-sm font-medium text-black hover:bg-[#F59E0B]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="h-4 w-4" />
          Save Segment
        </button>
      </div>
    </div>
  );
}
