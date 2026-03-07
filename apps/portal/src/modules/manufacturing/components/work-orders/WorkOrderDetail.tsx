'use client';

import { X, Clock, User, Package, FileText } from 'lucide-react';
import { StatusBadge } from '@/components';
import { useWorkOrder } from '../../hooks';
import { useManufacturingStore } from '../../store';

const ACCENT = '#10B981';

const STATUS_MAP: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  queued: 'default',
  'in-progress': 'info',
  completed: 'success',
  blocked: 'danger',
};

export function WorkOrderDetail() {
  const { selectedWorkOrderId, selectWorkOrder } = useManufacturingStore();
  const { data: wo } = useWorkOrder(selectedWorkOrderId ?? '');

  if (!selectedWorkOrderId || !wo) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-default bg-base shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-default px-4 py-3">
        <div>
          <p className="text-xs font-mono text-text-muted">{wo.id}</p>
          <h2 className="text-sm font-semibold text-text-bright">{wo.title}</h2>
        </div>
        <button onClick={() => selectWorkOrder(null)} className="rounded-lg p-1.5 hover:bg-elevated">
          <X className="h-4 w-4 text-text-muted" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Status + Priority */}
        <div className="flex items-center gap-2">
          <StatusBadge variant={STATUS_MAP[wo.status] ?? 'default'} label={wo.status} size="sm" dot pulse={wo.status === 'in-progress'} />
          <StatusBadge variant={wo.priority === 'critical' ? 'danger' : wo.priority === 'high' ? 'warning' : 'info'} label={wo.priority} size="sm" />
        </div>

        {/* Progress */}
        {wo.status === 'in-progress' && (
          <div>
            <div className="flex justify-between text-xs text-text-muted">
              <span>Progress</span>
              <span>{wo.progress}%</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-elevated">
              <div className="h-full rounded-full" style={{ width: `${wo.progress}%`, backgroundColor: ACCENT }} />
            </div>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-text-default leading-relaxed">{wo.description}</p>

        {/* Readiness transition */}
        <div className="rounded-lg bg-elevated px-3 py-2">
          <p className="text-[10px] uppercase tracking-wider text-text-muted">State Transition</p>
          <p className="mt-1 text-sm text-text-bright">
            {wo.readinessStateFrom} <span className="text-text-muted">→</span> {wo.readinessStateTo}
          </p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Clock className="h-3.5 w-3.5" />
            <span>Est: {wo.estimatedMinutes} min</span>
          </div>
          {wo.actualMinutes && (
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Clock className="h-3.5 w-3.5" />
              <span>Actual: {wo.actualMinutes} min</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Package className="h-3.5 w-3.5" />
            <span>{wo.outputQuantity} {wo.outputUnit}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <FileText className="h-3.5 w-3.5" />
            <span>Batch: {wo.batchNumber}</span>
          </div>
        </div>

        {/* Workers */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Assigned Workers</p>
          <div className="flex flex-wrap gap-1.5">
            {wo.workers.map((w) => (
              <span key={w} className="flex items-center gap-1.5 rounded-full bg-elevated px-2 py-0.5 text-xs text-text-default">
                <User className="h-3 w-3" />
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* Input Materials */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Input Materials</p>
          <div className="space-y-1">
            {wo.inputMaterials.map((m) => (
              <div key={m.name} className="flex items-center justify-between rounded-lg bg-elevated px-3 py-1.5 text-xs">
                <span className="text-text-default">{m.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted">{m.quantity} {m.unit}</span>
                  <div className={`h-2 w-2 rounded-full ${m.available ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {wo.notes && (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Notes</p>
            <p className="text-xs text-text-default italic">{wo.notes}</p>
          </div>
        )}

        {/* Timeline */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Timeline</p>
          <div className="space-y-1 text-xs text-text-muted">
            <p>Created: {new Date(wo.createdAt).toLocaleString()}</p>
            {wo.startedAt && <p>Started: {new Date(wo.startedAt).toLocaleString()}</p>}
            {wo.completedAt && <p>Completed: {new Date(wo.completedAt).toLocaleString()}</p>}
            <p>Due: {new Date(wo.dueDate).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
