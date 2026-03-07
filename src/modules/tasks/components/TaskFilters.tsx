'use client';

import { Search } from 'lucide-react';
import type { TaskFilter } from '@/modules/tasks/types';

interface TaskFiltersProps {
  filters: TaskFilter;
  onChange: (filters: TaskFilter) => void;
}

const selectClass =
  'rounded-lg border border-default bg-elevated px-2.5 py-1.5 text-xs text-default outline-none focus:border-hover';

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  function update(patch: Partial<TaskFilter>) {
    onChange({ ...filters, ...patch });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search ?? ''}
          onChange={(e) => update({ search: e.target.value || undefined })}
          className="rounded-lg border border-default bg-elevated py-1.5 pl-8 pr-3 text-xs text-default outline-none focus:border-hover w-48"
        />
      </div>

      {/* Status */}
      <select
        value={filters.status ?? ''}
        onChange={(e) => update({ status: (e.target.value || undefined) as TaskFilter['status'] })}
        className={selectClass}
      >
        <option value="">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
        <option value="blocked">Blocked</option>
      </select>

      {/* Priority */}
      <select
        value={filters.priority ?? ''}
        onChange={(e) => update({ priority: (e.target.value || undefined) as TaskFilter['priority'] })}
        className={selectClass}
      >
        <option value="">All Priorities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Assignee */}
      <select
        value={filters.assignee ?? ''}
        onChange={(e) => update({ assignee: e.target.value || undefined })}
        className={selectClass}
      >
        <option value="">All Assignees</option>
        <option value="Jake Morrison">Jake Morrison</option>
        <option value="Priya Patel">Priya Patel</option>
        <option value="Carlos Ruiz">Carlos Ruiz</option>
        <option value="Dana Whitfield">Dana Whitfield</option>
      </select>

      {/* Source */}
      <select
        value={filters.source ?? ''}
        onChange={(e) => update({ source: (e.target.value || undefined) as TaskFilter['source'] })}
        className={selectClass}
      >
        <option value="">All Sources</option>
        <option value="manual">Manual</option>
        <option value="work-order">Work Order</option>
        <option value="agent">Agent</option>
        <option value="meeting">Meeting</option>
      </select>

      {/* Module */}
      <select
        value={filters.module ?? ''}
        onChange={(e) => update({ module: e.target.value || undefined })}
        className={selectClass}
      >
        <option value="">All Modules</option>
        <option value="CRM">CRM</option>
        <option value="Manufacturing">Manufacturing</option>
        <option value="Packaging">Packaging</option>
        <option value="Fulfillment">Fulfillment</option>
        <option value="Delivery">Delivery</option>
        <option value="Inventory">Inventory</option>
        <option value="Cultivation">Cultivation</option>
        <option value="COA">COA</option>
        <option value="Products">Products</option>
      </select>
    </div>
  );
}
